const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Disease Detection API
router.post('/disease-detection', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Mock AI model integration for disease detection
    // In production, this would call an actual AI model API
    const imagePath = req.file.path;
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response data
    const diseaseData = {
      disease: 'Leaf Blight',
      confidence: 0.92,
      description: 'Leaf blight is a common disease affecting various crops, characterized by rapid browning and death of leaf tissues.',
      causes: [
        'Fungal pathogens (Alternaria, Helminthosporium)',
        'Bacterial infections',
        'Environmental stress'
      ],
      treatments: [
        'Apply fungicides containing chlorothalonil or mancozeb',
        'Ensure proper spacing between plants for air circulation',
        'Remove and destroy infected plant parts',
        'Rotate crops to prevent disease buildup in soil'
      ],
      preventiveMeasures: [
        'Use disease-resistant varieties',
        'Apply balanced fertilization',
        'Avoid overhead irrigation',
        'Maintain field sanitation'
      ],
      products: [
        {
          id: 1,
          name: 'Blight Shield Fungicide',
          price: 24.99,
          image: '/images/products/blight-shield.jpg'
        },
        {
          id: 2,
          name: 'Crop Guardian Spray',
          price: 19.95,
          image: '/images/products/crop-guardian.jpg'
        }
      ]
    };
    
    res.json(diseaseData);
  } catch (error) {
    console.error('Disease detection error:', error);
    res.status(500).json({ message: 'Error processing image. Please try again.' });
  }
});

// Soil Analysis API
router.post('/soil-analysis', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Mock AI model integration for soil analysis
    const imagePath = req.file.path;
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response data
    const soilData = {
      soilType: 'Loamy Soil',
      texture: 'Medium',
      color: 'Dark Brown',
      organicMatter: 'High',
      pH: 6.8,
      nutrients: {
        nitrogen: 'Medium (45 ppm)',
        phosphorus: 'High (32 ppm)',
        potassium: 'Medium (180 ppm)',
        calcium: 'High (1200 ppm)',
        magnesium: 'Medium (150 ppm)',
        sulfur: 'Low (8 ppm)'
      },
      suitableCrops: [
        'Wheat', 'Corn', 'Soybeans', 'Vegetables', 'Fruit trees'
      ],
      recommendations: [
        'Add sulfur-containing fertilizers to address sulfur deficiency',
        'Maintain organic matter through cover cropping or compost application',
        'Consider crop rotation to maximize soil fertility',
        'Monitor soil moisture as loamy soils have good water retention'
      ],
      products: [
        {
          id: 5,
          name: 'Balanced NPK Fertilizer',
          price: 29.99,
          image: '/images/products/npk-fertilizer.jpg'
        },
        {
          id: 6,
          name: 'Soil pH Balancer',
          price: 15.95,
          image: '/images/products/ph-balancer.jpg'
        }
      ]
    };
    
    res.json(soilData);
  } catch (error) {
    console.error('Soil analysis error:', error);
    res.status(500).json({ message: 'Error analyzing soil image. Please try again.' });
  }
});

// Smart Recommendations API
router.post('/recommendations', async (req, res) => {
  try {
    const { cropType, farmSize, location, concerns } = req.body;
    
    if (!cropType) {
      return res.status(400).json({ message: 'Please provide crop type' });
    }
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response data based on input parameters
    const recommendations = {
      products: [
        {
          id: 10,
          name: 'Premium Crop Seeds',
          price: 12.99,
          image: '/images/products/crop-seeds.jpg',
          rating: 4.8,
          description: 'High-yield, disease-resistant seeds perfect for your crop type.',
          category: 'Seeds',
          relevanceScore: 98
        },
        {
          id: 11,
          name: 'Organic Fertilizer Blend',
          price: 34.95,
          image: '/images/products/organic-fertilizer.jpg',
          rating: 4.6,
          description: 'Specially formulated for optimal growth and yield.',
          category: 'Fertilizers',
          relevanceScore: 95
        },
        {
          id: 12,
          name: 'Advanced Pest Control Kit',
          price: 45.99,
          image: '/images/products/pest-control.jpg',
          rating: 4.7,
          description: 'Comprehensive solution for common pests affecting your crops.',
          category: 'Pest Control',
          relevanceScore: 92
        },
        {
          id: 13,
          name: 'Smart Irrigation Controller',
          price: 89.99,
          image: '/images/products/irrigation-controller.jpg',
          rating: 4.5,
          description: 'Save water and optimize irrigation for your farm size.',
          category: 'Equipment',
          relevanceScore: 90
        }
      ],
      practices: [
        'Implement crop rotation to improve soil health and reduce pest pressure',
        'Consider contour farming to prevent soil erosion if your land has slopes',
        'Apply mulch to conserve soil moisture and suppress weeds',
        'Monitor soil moisture regularly to optimize irrigation scheduling'
      ],
      insights: [
        'Based on your location, early planting may increase yields by 15%',
        'Your crop type typically requires 25-30 inches of water throughout the growing season',
        'Consider soil testing every 2-3 years to optimize fertilizer application',
        'Integrated pest management can reduce pesticide costs by up to 30%'
      ]
    };
    
    res.json(recommendations);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Error generating recommendations. Please try again.' });
  }
});

// Price Prediction API
router.post('/price-prediction', async (req, res) => {
  try {
    const { crop, location, timeframe } = req.body;
    
    if (!crop || !timeframe) {
      return res.status(400).json({ message: 'Please provide crop type and timeframe' });
    }
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock price prediction data
    const currentPrice = (Math.random() * 50 + 50).toFixed(2);
    const predictions = [];
    let price = parseFloat(currentPrice);
    
    // Generate future price points with some randomness
    for (let i = 1; i <= 12; i++) {
      // Add some random variation to the price
      const change = (Math.random() - 0.45) * 10;
      price = Math.max(price + change, 10); // Ensure price doesn't go too low
      
      predictions.push({
        month: i,
        price: price.toFixed(2),
        change: change.toFixed(2)
      });
    }
    
    const response = {
      crop,
      currentPrice,
      currency: 'USD',
      unit: 'per quintal',
      predictions,
      factors: [
        'Seasonal demand fluctuations',
        'Expected weather patterns',
        'Historical price trends',
        'Market supply projections',
        'Global trade dynamics'
      ],
      recommendations: [
        'Consider forward contracts to lock in prices above $' + (price * 0.9).toFixed(2),
        'Monitor market trends closely in months 3-4 when prices are expected to peak',
        'Diversify crop portfolio to mitigate price volatility risks',
        'Explore value-added processing to increase profit margins'
      ]
    };
    
    res.json(response);
  } catch (error) {
    console.error('Price prediction error:', error);
    res.status(500).json({ message: 'Error generating price predictions. Please try again.' });
  }
});

// Weather Recommendations API
router.post('/weather', async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ message: 'Please provide a location' });
    }
    
    // Simulate API call to weather service
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock weather data
    const weatherData = {
      location: location,
      current: {
        temp_c: 28,
        humidity: 65,
        wind_kph: 12,
        condition: 'Partly Cloudy'
      },
      forecast: [
        {
          date: 'Tomorrow',
          min_temp_c: 22,
          max_temp_c: 30,
          condition: 'Sunny'
        },
        {
          date: 'Day after tomorrow',
          min_temp_c: 24,
          max_temp_c: 32,
          condition: 'Chance of Rain'
        },
        {
          date: 'In 3 days',
          min_temp_c: 20,
          max_temp_c: 27,
          condition: 'Rain'
        }
      ]
    };
    
    // Generate farming recommendations based on weather
    const recommendations = {
      alerts: [],
      cropManagement: [
        'Current partly cloudy conditions are ideal for field operations',
        'Plan harvesting activities for tomorrow when conditions will be sunny',
        'Consider applying foliar fertilizers in the morning hours',
        'Monitor soil moisture as temperatures are expected to rise'
      ],
      irrigation: [
        'Moderate irrigation recommended due to current humidity levels',
        'Prepare irrigation systems for day 3 when rainfall is expected',
        'Consider drip irrigation to conserve water during warmer days',
        'Adjust irrigation schedule based on wind conditions to minimize drift'
      ],
      seasonalPlanning: [
        'Prepare for potential heavy rain in 3 days - ensure proper drainage',
        'Consider row covers for sensitive crops if temperatures drop',
        'Plan pest monitoring as changing weather conditions may increase pest activity',
        'Evaluate crop growth stage against upcoming weather for optimal management'
      ]
    };
    
    // Add weather alerts if applicable
    if (weatherData.forecast.some(day => day.condition.toLowerCase().includes('rain'))) {
      recommendations.alerts.push(
        'Prepare for rainfall in the coming days - ensure proper drainage',
        'Consider postponing chemical applications before expected rain'
      );
    }
    
    if (weatherData.current.temp_c > 30) {
      recommendations.alerts.push(
        'High temperature alert - monitor for heat stress in crops',
        'Ensure adequate irrigation to prevent water stress'
      );
    }
    
    res.json({ weatherData, recommendations });
  } catch (error) {
    console.error('Weather recommendations error:', error);
    res.status(500).json({ message: 'Error fetching weather data. Please try again.' });
  }
});

// Planting Calendar Crops API
router.get('/planting-calendar/crops', async (req, res) => {
  try {
    // Mock crop types data
    const cropTypes = [
      { value: 'tomato', label: 'Tomato' },
      { value: 'corn', label: 'Corn' },
      { value: 'wheat', label: 'Wheat' },
      { value: 'rice', label: 'Rice' },
      { value: 'potato', label: 'Potato' },
      { value: 'soybean', label: 'Soybean' },
      { value: 'cotton', label: 'Cotton' },
      { value: 'sugarcane', label: 'Sugarcane' },
      { value: 'coffee', label: 'Coffee' },
      { value: 'onion', label: 'Onion' },
      { value: 'carrot', label: 'Carrot' },
      { value: 'lettuce', label: 'Lettuce' },
      { value: 'cucumber', label: 'Cucumber' },
      { value: 'pepper', label: 'Pepper' },
      { value: 'eggplant', label: 'Eggplant' }
    ];
    
    res.json(cropTypes);
  } catch (error) {
    console.error('Crop types error:', error);
    res.status(500).json({ message: 'Error fetching crop types. Please try again.' });
  }
});

// Planting Calendar API
router.post('/planting-calendar', async (req, res) => {
  try {
    const { location, crops } = req.body;
    
    if (!location || !crops || !crops.length) {
      return res.status(400).json({ message: 'Please provide location and crops' });
    }
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock planting calendar events
    const events = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Helper function to add days to a date
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };
    
    // Generate events for each crop
    crops.forEach(crop => {
      const cropName = crop.charAt(0).toUpperCase() + crop.slice(1);
      
      // Planting event
      const plantingDate = addDays(currentDate, Math.floor(Math.random() * 30));
      events.push({
        crop: cropName,
        date: plantingDate.toISOString(),
        type: 'planting',
        title: `Plant ${cropName}`,
        activity: `Planting ${cropName}`,
        instructions: `Plant ${cropName} seeds at a depth of 1-2 inches with 12-18 inches between plants.`,
        notes: 'Ensure soil is well-drained and has been properly prepared with organic matter.'
      });
      
      // Irrigation events
      for (let i = 1; i <= 3; i++) {
        const irrigationDate = addDays(plantingDate, i * 10 + Math.floor(Math.random() * 5));
        events.push({
          crop: cropName,
          date: irrigationDate.toISOString(),
          type: 'irrigation',
          title: `Irrigate ${cropName}`,
          activity: `Irrigation for ${cropName}`,
          instructions: `Water thoroughly, ensuring soil is moist to a depth of 6 inches.`,
          notes: 'Adjust irrigation based on rainfall and temperature conditions.'
        });
      }
      
      // Fertilizing event
      const fertilizingDate = addDays(plantingDate, 20 + Math.floor(Math.random() * 10));
      events.push({
        crop: cropName,
        date: fertilizingDate.toISOString(),
        type: 'fertilizing',
        title: `Fertilize ${cropName}`,
        activity: `Apply fertilizer to ${cropName}`,
        instructions: `Apply balanced NPK fertilizer according to soil test recommendations.`,
        notes: 'Avoid fertilizer contact with plant stems and leaves to prevent burning.'
      });
      
      // Flowering event
      const floweringDate = addDays(plantingDate, 45 + Math.floor(Math.random() * 15));
      events.push({
        crop: cropName,
        date: floweringDate.toISOString(),
        type: 'flowering',
        title: `${cropName} Flowering`,
        activity: `${cropName} flowering stage`,
        instructions: `Monitor for pests and diseases. Ensure adequate water during this critical stage.`,
        notes: 'Consider foliar feeding with micronutrients to support flower development.'
      });
      
      // Harvesting event
      const harvestingDate = addDays(plantingDate, 90 + Math.floor(Math.random() * 20));
      events.push({
        crop: cropName,
        date: harvestingDate.toISOString(),
        type: 'harvesting',
        title: `Harvest ${cropName}`,
        activity: `Harvesting ${cropName}`,
        instructions: `Harvest when fruits are firm and fully colored. Use clean, sharp tools.`,
        notes: 'Morning harvesting is recommended for better quality and shelf life.'
      });
    });
    
    res.json({ events });
  } catch (error) {
    console.error('Planting calendar error:', error);
    res.status(500).json({ message: 'Error generating planting calendar. Please try again.' });
  }
});

// Chatbot API
router.post('/chatbot', upload.single('image'), async (req, res) => {
  try {
    const { message } = req.body;
    const hasImage = req.file !== undefined;
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = '';
    
    if (hasImage) {
      // Handle image-based query
      response = "I've analyzed the image you sent. This appears to be a healthy crop with good leaf development. The slight yellowing on some leaves might indicate a minor nutrient deficiency, possibly nitrogen. Consider applying a balanced fertilizer with higher nitrogen content. Continue monitoring for any pest activity, though I don't see any significant issues in this image.";
    } else if (message) {
      // Simple rule-based responses for text queries
      if (message.toLowerCase().includes('disease') || message.toLowerCase().includes('pest')) {
        response = "For effective pest and disease management, I recommend an integrated approach. Start with prevention through crop rotation and resistant varieties. Monitor regularly for early detection. For biological control, consider beneficial insects like ladybugs for aphids. If chemical control is necessary, choose targeted pesticides and follow label instructions carefully. Remember that proper timing is crucial for effective treatment.";
      } else if (message.toLowerCase().includes('fertilizer') || message.toLowerCase().includes('nutrient')) {
        response = "For optimal fertilization, I recommend soil testing first to determine exact nutrient needs. For most crops, a balanced NPK fertilizer (like 10-10-10) works well as a base. Apply nitrogen in split applications to prevent leaching. Consider slow-release fertilizers for longer-term feeding. Don't forget micronutrients like zinc and boron, which are essential in small amounts. Organic options include compost, manure, and cover crops to build soil health over time.";
      } else if (message.toLowerCase().includes('water') || message.toLowerCase().includes('irrigation')) {
        response = "For efficient irrigation, I recommend monitoring soil moisture regularly. Most crops need 1-1.5 inches of water per week, either from rainfall or irrigation. Morning watering is best to reduce evaporation and fungal issues. Consider drip irrigation for water conservation and targeted application. Mulching around plants helps retain moisture and reduce watering frequency. Adjust your schedule based on weather conditions and crop growth stage.";
      } else {
        response = "Thank you for your question about farming. For more specific advice, please provide details about your crop type, growing conditions, or specific challenges you're facing. I'm here to help with personalized recommendations for your farming needs.";
      }
    } else {
      response = "I'm your CropMate AI assistant. How can I help with your farming questions today?";
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Error processing your request. Please try again.' });
  }
});

// Geocoding API
router.get('/geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Please provide latitude and longitude' });
    }
    
    // In a real implementation, this would call a geocoding service like Google Maps API
    // For now, we'll return a mock location based on coordinates
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    const location = "Bangalore, Karnataka, India";
    
    res.json({ location });
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ message: 'Error fetching location data. Please try again.' });
  }
});

module.exports = router;