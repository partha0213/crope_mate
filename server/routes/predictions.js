const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { Configuration, OpenAIApi } = require('openai');

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// @route   POST /api/predictions/analyze
// @desc    Analyze crop data and generate predictions
// @access  Private
router.post('/analyze', protect, async (req, res) => {
  try {
    const { productId, category, subCategory, region, currentPrice } = req.body;

    // If productId is provided, get product data
    let product;
    if (productId) {
      product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    }

    // Prepare data for AI analysis
    const cropData = {
      category: category || (product ? product.category : ''),
      subCategory: subCategory || (product ? product.subCategory : ''),
      region: region || (product && product.location ? product.location.state : ''),
      currentPrice: currentPrice || (product ? product.price : 0),
      harvestDate: product ? product.harvestDate : null,
    };

    // Generate prediction using OpenAI
    const prompt = `
      Analyze the following crop data and provide market predictions:
      Crop Category: ${cropData.category}
      Crop Type: ${cropData.subCategory}
      Region: ${cropData.region}
      Current Price: $${cropData.currentPrice}
      ${cropData.harvestDate ? `Harvest Date: ${cropData.harvestDate}` : ''}
      
      Please provide the following in JSON format:
      1. Predicted price in 30 days
      2. Price change percentage
      3. Market trend (rising, falling, or stable)
      4. Confidence level (0-1)
      5. Best time to sell
      6. Factors affecting the price
    `;

    // For demo purposes, we'll generate a mock prediction
    // In production, you would use the OpenAI API
    /*
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
    });
    
    const aiResponse = JSON.parse(completion.data.choices[0].text.trim());
    */

    // Mock AI response for demo
    const mockAiResponse = {
      predictedPrice: cropData.currentPrice * (1 + (Math.random() * 0.2 - 0.1)),
      priceChange: Math.random() * 20 - 10,
      marketTrend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)],
      confidence: 0.7 + Math.random() * 0.3,
      bestTimeToSell: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      factors: [
        {
          name: 'Weather Conditions',
          impact: Math.random() * 0.5,
          description: 'Favorable weather conditions expected in the coming weeks.'
        },
        {
          name: 'Market Demand',
          impact: Math.random() * 0.5,
          description: 'Increasing demand due to seasonal factors.'
        },
        {
          name: 'Supply Chain',
          impact: Math.random() * 0.3,
          description: 'Stable supply chain with no major disruptions expected.'
        }
      ]
    };

    // Create prediction record
    const prediction = await Prediction.create({
      product: productId || null,
      category: cropData.category,
      subCategory: cropData.subCategory,
      region: cropData.region,
      currentPrice: cropData.currentPrice,
      predictedPrice: mockAiResponse.predictedPrice,
      priceChange: mockAiResponse.priceChange,
      confidence: mockAiResponse.confidence,
      bestTimeToSell: mockAiResponse.bestTimeToSell,
      marketTrend: mockAiResponse.marketTrend,
      factors: mockAiResponse.factors,
      aiModel: 'OpenAI GPT-3.5',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Valid for 30 days
    });

    // If product exists, update its AI predictions
    if (product) {
      await Product.findByIdAndUpdate(productId, {
        aiPredictions: {
          bestTimeToSell: mockAiResponse.bestTimeToSell,
          predictedPrice: mockAiResponse.predictedPrice,
          marketTrend: mockAiResponse.marketTrend,
          confidence: mockAiResponse.confidence
        },
        updatedAt: Date.now()
      });
    }

    res.status(201).json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('AI prediction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/predictions
// @desc    Get all predictions for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let predictions;
    
    if (req.user.role === 'admin') {
      // Admins can see all predictions
      predictions = await Prediction.find()
        .sort({ createdAt: -1 })
        .populate('product', 'name images price');
    } else if (req.user.role === 'farmer') {
      // Farmers can see predictions for their products
      const farmerProducts = await Product.find({ farmer: req.user._id }).select('_id');
      const productIds = farmerProducts.map(product => product._id);
      
      predictions = await Prediction.find({
        $or: [
          { product: { $in: productIds } },
          { product: null, category: { $exists: true } } // General predictions
        ]
      })
        .sort({ createdAt: -1 })
        .populate('product', 'name images price');
    } else {
      // Buyers can see general predictions
      predictions = await Prediction.find({ product: null })
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: predictions.length,
      predictions
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/predictions/:id
// @desc    Get prediction by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id)
      .populate('product', 'name description images price category subCategory');

    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Prediction not found' });
    }

    res.status(200).json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;