const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ['vegetables', 'fruits', 'grains', 'pulses', 'dairy', 'spices', 'other'],
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'l', 'ml', 'piece', 'dozen', 'packet'],
      default: 'kg',
    },
    tags: [
      {
        type: String,
      },
    ],
    aiData: {
      qualityGrade: {
        type: String,
        enum: ['A+', 'A', 'B', 'C', 'Ungraded'],
        default: 'Ungraded',
      },
      predictedPrice: {
        type: Number,
        default: 0,
      },
      bestTimeToSell: {
        type: String,
        default: '',
      },
      marketTrend: {
        type: String,
        enum: ['rising', 'falling', 'stable', 'unknown'],
        default: 'unknown',
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
    blockchainData: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      contractAddress: {
        type: String,
        default: '',
      },
      transactionHash: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;