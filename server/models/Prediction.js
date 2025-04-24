const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  predictedPrice: {
    type: Number,
    required: true
  },
  priceChange: {
    type: Number,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  bestTimeToSell: {
    type: Date
  },
  marketTrend: {
    type: String,
    enum: ['rising', 'falling', 'stable'],
    required: true
  },
  factors: [{
    name: String,
    impact: Number,
    description: String
  }],
  aiModel: {
    type: String,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
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

module.exports = mongoose.model('Prediction', PredictionSchema);