const mongoose = require('mongoose');

const AgreementSchema = new mongoose.Schema({
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
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  terms: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  paymentTerms: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'completed', 'cancelled', 'disputed'],
    default: 'draft'
  },
  buyerSignature: {
    signed: {
      type: Boolean,
      default: false
    },
    timestamp: Date,
    walletAddress: String,
    transactionHash: String
  },
  sellerSignature: {
    signed: {
      type: Boolean,
      default: false
    },
    timestamp: Date,
    walletAddress: String,
    transactionHash: String
  },
  blockchainData: {
    contractAddress: String,
    transactionHash: String,
    blockNumber: Number,
    timestamp: Date
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

module.exports = mongoose.model('Agreement', AgreementSchema);