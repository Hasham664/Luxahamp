// controllers/categoryController.js
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import asyncHandler from '../middlewere/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


export const createCategory = asyncHandler(async (req, res) => {
  const { mainTitle, name, slug } = req.body;

  if (!mainTitle || !name) {
    return res.status(400).json({
      success: false,
      message: 'mainTitle and name are required.',
    });
  }

  // Check duplicate
  const existing = await Category.findOne({ mainTitle, name });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: `Category "${name}" already exists under "${mainTitle}"`,
    });
  }

  let imageUrl = null;
  if (req.file) {
    const upload = await uploadOnCloudinary(req.file.path, {
      folder: 'categories',
    });
    if (!upload) {
      return res
        .status(500)
        .json({ success: false, message: 'Image upload failed.' });
    }
    imageUrl = upload.secure_url;
  }

  const category = await Category.create({
    mainTitle,
    name,
    slug,
    image: imageUrl,
  });

  res.status(201).json({ success: true, category });
});

/**
 * @desc    Get all categories (optionally filter by mainTitle)
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const { mainTitle } = req.query;

  const filter = {};
  if (mainTitle) filter.mainTitle = mainTitle;

  const categories = await Category.find(filter).sort({
    mainTitle: 1,
    name: 1,
  });

  res.json({ success: true, total: categories.length, categories });
});

/**
 * @desc    Get single category by ID or slug
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.id;
  let category = null;

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    category = await Category.findById(idOrSlug);
  }
  if (!category) {
    category = await Category.findOne({ slug: idOrSlug });
  }

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: 'Category not found' });
  }

  res.json({ success: true, category });
});


export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: 'Category not found' });
  }

  const allowedFields = ['mainTitle', 'name', 'slug'];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      category[field] = req.body[field];
    }
  });

  if (req.file) {
    const upload = await uploadOnCloudinary(req.file.path, {
      folder: 'categories',
    });
    if (upload) {
      category.image = upload.secure_url;
    }
  }

  await category.save();
  res.json({ success: true, category });
});

/**
 * @desc    Delete category (check linked products first)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: 'Category not found' });
  }

  const productCount = await Product.countDocuments({
    categories: category._id,
  });

  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete. ${productCount} product(s) are linked to this category.`,
    });
  }

  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});
