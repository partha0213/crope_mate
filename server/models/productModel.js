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
    user: {
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
    harvestDate: {
      type: Date,
      required: true,
    },
    quality: {
      grade: {
        type: String,
        enum: ['A+', 'A', 'B', 'C'],
        default: 'B',
      },
      verifiedBy: {
        type: String,
        default: 'AI Analysis',
      },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    aiInsights: {
      bestTimeToSell: Date,
      predictedPriceRange: {
        min: Number,
        max: Number,
      },
      marketTrends: String,
      recommendations: String,
    },
    blockchainInfo: {
      contractAddress: String,
      tokenId: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
productSchema.index({ location: '2dsphere' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;