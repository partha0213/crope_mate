const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/products';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

// Initialize upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 } // 5MB
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Farmers only)
router.post('/', protect, authorize('farmer', 'admin'), upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      price,
      quantity,
      unit,
      quality,
      location,
      harvestDate,
      expiryDate,
      isOrganic
    } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => file.path) : [];

    // Create new product
    const product = await Product.create({
      farmer: req.user._id,
      name,
      description,
      category,
      subCategory,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      unit,
      images,
      quality: quality ? JSON.parse(quality) : { grade: 'B', aiVerified: false },
      location: location ? JSON.parse(location) : {},
      harvestDate,
      expiryDate,
      isOrganic: isOrganic === 'true',
      isActive: true
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      subCategory,
      minPrice,
      maxPrice,
      quality,
      isOrganic,
      sortBy,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (quality) filter['quality.grade'] = quality;
    if (isOrganic) filter.isOrganic = isOrganic === 'true';
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sort[field] = order === 'desc' ? -1 : 1;
    } else {
      sort = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('farmer', 'name profileImage');

    // Get total count
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name email phone profileImage');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Product owner only)
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user is the product owner or admin
    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const {
      name,
      description,
      category,
      subCategory,
      price,
      quantity,
      unit,
      quality,
      location,
      harvestDate,
      expiryDate,
      isOrganic,
      isActive
    } = req.body;

    // Process uploaded images
    let images = product.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      images = [...images, ...newImages];
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        description: description || product.description,
        category: category || product.category,
        subCategory: subCategory || product.subCategory,
        price: price ? parseFloat(price) : product.price,
        quantity: quantity ? parseInt(quantity) : product.quantity,
        unit: unit || product.unit,
        images,
        quality: quality ? JSON.parse(quality) : product.quality,
        location: location ? JSON.parse(location) : product.location,
        harvestDate: harvestDate || product.harvestDate,
        expiryDate: expiryDate || product.expiryDate,
        isOrganic: isOrganic !== undefined ? isOrganic === 'true' : product.isOrganic,
        isActive: isActive !== undefined ? isActive === 'true' : product.isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Product owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user is the product owner or admin
    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    // Delete product
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/farmer/:farmerId
// @desc    Get products by farmer ID
// @access  Public
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const products = await Product.find({ 
      farmer: req.params.farmerId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/products/:id/quality
// @desc    Update product quality using AI
// @access  Private (Admin only)
router.post('/:id/quality', protect, authorize('admin'), async (req, res) => {
  try {
    const { grade, aiVerified } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        'quality.grade': grade,
        'quality.aiVerified': aiVerified || true,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Update product quality error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;