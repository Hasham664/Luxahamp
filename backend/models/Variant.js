// models/Variant.js
import mongoose from 'mongoose';

export const VariantSchema = new mongoose.Schema(
  {
    color: [{ type: String }],
    name: { type: String, required: true }, // e.g. '5 ml', '10 ml' or '10x10 Box'
    price: { type: Number, required: true, min: 0 },
    stock_count: { type: Number, required: true, min: 0 },
    stock_unit: { type: String }, // e.g. 'ml', 'unit'
    discount_type: {
      type: String,
      enum: ['percent', 'fixed', 'sale', ''],
      default: '',
    },
    tags: {
      type: String,
      enum: ['New', 'Hot', 'Sale', 'Bestseller', ''],
      default: '',
    },
    low_stock_threshold: { type: Number, default: 10 },
    discount_value: { type: Number, default: 0, min: 0 },
    taxIncluded: { type: Boolean, default: true },
    taxPercent: { type: Number, default: 0, min: 0 },
    sku: { type: String }, // uniqueness handled at app level or use separate Variant collection
    images: [{ type: String }],
    boxDetails: {
      dimensions: {
        height: Number,
        width: Number,
        depth: Number,
      },
      max_capacity: { type: Number },
    },
    // optional variant-specific images
  },
  { timestamps: true }
);
