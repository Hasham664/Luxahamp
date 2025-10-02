// models/Category.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new mongoose.Schema(
  {
    mainTitle: {
      type: String,
      enum: [
        'SHOP BY RECIPIENT',
        'SHOP BY OCCASION',
        'SHOP BY INTEREST',
        'BY PRICE',
      ],
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

CategorySchema.pre('validate', function (next) {
  if (!this.slug && this.name)
    this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Category =
  mongoose.models.Category || mongoose.model('Category', CategorySchema);
export default Category;
