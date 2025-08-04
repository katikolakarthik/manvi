const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['clothing', 'accessories', 'footwear'],
    default: 'clothing'
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
subcategorySchema.index({ category: 1, isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Subcategory', subcategorySchema); 