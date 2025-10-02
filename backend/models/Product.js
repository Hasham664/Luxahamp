// models/Product.js
import mongoose from 'mongoose';
import { VariantSchema } from './Variant.js';
import slugify from 'slugify';

const ProductSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['product', 'box', 'greeting_card'],
      required: true,
      default: 'product',
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    keyWords: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    compatibleBoxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    variants: {
      type: [VariantSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A product must have at least one variant.',
      },
    },
  },
  { timestamps: true }
);

// generate slug if missing
ProductSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// indexes
ProductSchema.index({ name: 'text', description: 'text' });

const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
