const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['grains', 'vegetables', 'fruits', 'dairy', 'other']
  },
  subCategory: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'ton', 'piece', 'dozen', 'liter']
  },
  images: [{
    type: String
  }],
  quality: {
    grade: {
      type: String,
      enum: ['A+', 'A', 'B', 'C'],
      default: 'B'
    },
    aiVerified: {
      type: Boolean,
      default: false
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: String,
    city: String,
    state: String,
    country: String
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isSold: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  aiPredictions: {
    bestTimeToSell: Date,
    predictedPrice: Number,
    marketTrend: String,
    confidence: Number
  },
  blockchainData: {
    contractAddress: String,
    tokenId: String,
    transactionHash: String
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

// Index for geospatial queries
ProductSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', ProductSchema);