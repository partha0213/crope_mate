const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private (Buyers only)
router.post('/', protect, authorize('buyer', 'admin'), async (req, res) => {
  try {
    const {
      productId,
      quantity,
      totalAmount,
      paymentMethod,
      paymentDetails,
      shippingDetails
    } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if product is available
    if (product.isSold || !product.isActive) {
      return res.status(400).json({ success: false, message: 'Product is not available for purchase' });
    }

    // Check if quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock' });
    }

    // Create transaction
    const transaction = await Transaction.create({
      buyer: req.user._id,
      seller: product.farmer,
      product: productId,
      quantity: parseInt(quantity),
      totalAmount: parseFloat(totalAmount),
      paymentMethod,
      paymentDetails: paymentDetails ? JSON.parse(paymentDetails) : { status: 'pending' },
      shippingDetails: shippingDetails ? JSON.parse(shippingDetails) : { status: 'pending' },
      status: 'pending'
    });

    // Update product quantity and status
    await Product.findByIdAndUpdate(productId, {
      quantity: product.quantity - parseInt(quantity),
      isSold: product.quantity - parseInt(quantity) <= 0,
      updatedAt: Date.now()
    });

    res.status(201).json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/transactions
// @desc    Get all transactions for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let transactions;
    
    // Get transactions based on user role
    if (req.user.role === 'buyer') {
      transactions = await Transaction.find({ buyer: req.user._id })
        .sort({ createdAt: -1 })
        .populate('product', 'name images price')
        .populate('seller', 'name email');
    } else if (req.user.role === 'farmer') {
      transactions = await Transaction.find({ seller: req.user._id })
        .sort({ createdAt: -1 })
        .populate('product', 'name images price')
        .populate('buyer', 'name email');
    } else if (req.user.role === 'admin') {
      transactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .populate('product', 'name images price')
        .populate('buyer', 'name email')
        .populate('seller', 'name email');
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get transaction by ID
// @access  Private (Transaction participants only)
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product', 'name description images price category subCategory')
      .populate('buyer', 'name email phone address')
      .populate('seller', 'name email phone address');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if user is transaction participant or admin
    if (
      transaction.buyer.toString() !== req.user._id.toString() &&
      transaction.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this transaction' });
    }

    res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction status
// @access  Private (Seller or Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, paymentDetails, shippingDetails } = req.body;

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if user is seller or admin
    if (
      transaction.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this transaction' });
    }

    // Update transaction
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        status: status || transaction.status,
        paymentDetails: paymentDetails ? JSON.parse(paymentDetails) : transaction.paymentDetails,
        shippingDetails: shippingDetails ? JSON.parse(shippingDetails) : transaction.shippingDetails,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    )
      .populate('product', 'name images price')
      .populate('buyer', 'name email')
      .populate('seller', 'name email');

    res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;