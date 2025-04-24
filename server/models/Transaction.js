const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'upi', 'crypto', 'other'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  shippingDetails: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    trackingNumber: String,
    estimatedDelivery: Date
  },
  blockchainData: {
    contractAddress: String,
    transactionHash: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);