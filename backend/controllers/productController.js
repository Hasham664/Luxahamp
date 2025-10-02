import mongoose from 'mongoose';
import Product from '../models/Product.js';
import asyncHandler from '../middlewere/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';

/**
 * Utility: check if a SKU is already used in any product’s variants.
 * Optionally ignores a product ID during updates.
 */
async function isSkuTaken(sku, ignoreProductId = null) {
  if (!sku) return false;
  const query = { 'variants.sku': sku };
  if (ignoreProductId) query._id = { $ne: ignoreProductId };
  const existing = await Product.findOne(query).select('_id');
  return Boolean(existing);
}


// export const createProduct = asyncHandler(async (req, res) => {
//   const { name, variants } = req.body;

//   if (!name || !Array.isArray(variants) || variants.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Name and at least one variant are required.',
//     });
//   }

//   // Check SKU uniqueness for each variant
//   for (const v of variants) {
//     if (v.sku && (await isSkuTaken(v.sku))) {
//       return res
//         .status(400)
//         .json({ success: false, message: `SKU already exists: ${v.sku}` });
//     }
//   }

//   // Handle multiple images upload (if files exist)
//   let images = [];
//   if (req.files && req.files.length > 0) {
//     const uploadResults = await Promise.all(
//       req.files.map((file) =>
//         uploadOnCloudinary(file.path, { folder: 'products' })
//       )
//     );
//     images = uploadResults.filter((res) => res).map((res) => res.secure_url);
//   }

//   const product = await Product.create({ ...req.body, images });
//   res.status(201).json({ success: true, product });
// });


export const createProduct = asyncHandler(async (req, res) => {
  const { name, variants } = req.body;

  if (!name || !Array.isArray(variants) || variants.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Name and at least one variant are required.',
    });
  }

  // Check SKU uniqueness
  for (const v of variants) {
    if (v.sku && (await isSkuTaken(v.sku))) {
      return res
        .status(400)
        .json({ success: false, message: `SKU already exists: ${v.sku}` });
    }
  }

  // Handle variant images
  let processedVariants = [...variants];

  if (req.files && req.files.length > 0) {
    const variantFiles = {};

    req.files.forEach((file) => {
      const match = file.fieldname.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (!variantFiles[index]) variantFiles[index] = [];
        variantFiles[index].push(file);
      }
    });

    for (const [index, files] of Object.entries(variantFiles)) {
      const uploadResults = await Promise.all(
        files.map((file) =>
          uploadOnCloudinary(file.path, { folder: 'variants' })
        )
      );
      processedVariants[index].images = uploadResults
        .filter((r) => r)
        .map((r) => r.secure_url);
    }
  }

  const product = await Product.create({
    ...req.body,
    variants: processedVariants,
  });
  res.status(201).json({ success: true, product });
});



// export const getAllProducts = asyncHandler(async (req, res) => {
//   const { type, category, categorySlug, tag, q } = req.query;

//   const filter = {};

//   if (type) filter.type = type;
//   if (category) filter.categories = category; // still support id filtering

//   // ✅ allow filtering by category slug
//   if (categorySlug) {
//     const cat = await Category.findOne({ slug: categorySlug }).select('_id');
//     if (cat) {
//       filter.categories = cat._id;
//     } else {
//       // if no category found, return empty list
//       return res.json({ success: true, total: 0, items: [] });
//     }
//   }

//   if (tag) filter.tags = tag;
//   if (q) filter.$text = { $search: q };

//   const products = await Product.find(filter)
//     .populate('categories')
//     .populate('compatibleBoxes')
//     .lean();

//   // ⭐ fetch ratings only for approved reviews
//   const ratings = await Review.aggregate([
//     { $match: { status: 'approved' } },
//     {
//       $group: {
//         _id: '$product',
//         avgRating: { $avg: '$rating' },
//         totalReviews: { $sum: 1 },
//       },
//     },
//   ]);

//   const ratingsMap = {};
//   ratings.forEach((r) => {
//     ratingsMap[r._id.toString()] = {
//       avgRating: Math.round(r.avgRating * 10) / 10,
//       totalReviews: r.totalReviews,
//     };
//   });

//   const items = products.map((p) => ({
//     ...p,
//     avgRating: ratingsMap[p._id.toString()]?.avgRating || 0,
//     totalReviews: ratingsMap[p._id.toString()]?.totalReviews || 0,
//   }));

//   res.json({ success: true, total: items.length, items });
// });


export const getAllProducts = asyncHandler(async (req, res) => {
  const { type, category, categorySlug, tag, q } = req.query;

  const filter = {};

  if (type) filter.type = type;
  if (category) filter.categories = category;

  if (categorySlug) {
    const cat = await Category.findOne({ slug: categorySlug }).select('_id');
    if (cat) {
      filter.categories = cat._id;
    } else {
      return res.json({ success: true, total: 0, items: [] });
    }
  }

  if (tag) filter.tags = tag;
  if (q) filter.$text = { $search: q };

  let products = await Product.find(filter)
    .populate('categories')
    .populate('compatibleBoxes')
    .select('-reviews') // 🚀 exclude reviews field completely
    .lean();

  // ⭐ fetch ratings only for approved reviews
  const ratings = await Review.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const ratingsMap = {};
  ratings.forEach((r) => {
    ratingsMap[r._id.toString()] = {
      avgRating: Math.round(r.avgRating * 10) / 10,
      totalReviews: r.totalReviews,
    };
  });

  // attach ratings but no review IDs
  const items = products.map((p) => ({
    ...p,
    avgRating: ratingsMap[p._id.toString()]?.avgRating || 0,
    totalReviews: ratingsMap[p._id.toString()]?.totalReviews || 0,
  }));

  res.json({ success: true, total: items.length, items });
});



export const getProductById = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.id;
  let product = null;

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    product = await Product.findById(idOrSlug)
      .populate('categories')
      .populate('compatibleBoxes')
      .populate({
        path: 'reviews',
        match: { status: 'approved' },
        populate: { path: 'user' },
      })
      .lean();
  }
  if (!product) {
    product = await Product.findOne({ slug: idOrSlug })
      .populate('categories')
      .populate('compatibleBoxes')
      .populate({
        path: 'reviews',
        match: { status: 'approved' },
        populate: { path: 'user' },
      })
      .lean();
  }

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: 'Product not found' });
  }

   const reviews = await Review.find({
     product: product._id,
     status: 'approved',
   })
     .populate('user', 'email')
     .sort({ createdAt: -1 });

  res.json({ success: true, product: { ...product, reviews } });
});




export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: 'Product not found' });
  }

  // ✅ SKU validation
  if (req.body.variants) {
    for (const v of req.body.variants) {
      if (v.sku && (await isSkuTaken(v.sku, product._id))) {
        return res
          .status(400)
          .json({ success: false, message: `SKU already exists: ${v.sku}` });
      }
    }
  }

  let updatedVariants = req.body.variants || product.variants;

  // ✅ Parse variants if JSON string
  if (typeof updatedVariants === 'string') {
    try {
      updatedVariants = JSON.parse(updatedVariants);
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid variants format' });
    }
  }

  // ✅ Merge existing images with new body
  updatedVariants = updatedVariants.map((variant, index) => {
    // frontend sends old URLs under existingImages
    const existingImages =
      req.body[`variants[${index}][existingImages][]`] ||
      req.body[`variants[${index}][existingImages]`] ||
      [];

    const normalized = Array.isArray(existingImages)
      ? existingImages
      : [existingImages];

    // 🟢 If frontend sent old images → use those
    // 🔴 If frontend didn’t → fallback to product’s already saved images
    const baseImages =
      normalized.length > 0
        ? normalized
        : product.variants[index]?.images || [];

    return {
      ...product.variants[index]?.toObject?.(), // keep other old fields
      ...variant, // override with new values
      images: baseImages,
    };
  });

  // ✅ Handle uploaded files (new images)
  if (req.files && req.files.length > 0) {
    const variantFiles = {};

    req.files.forEach((file) => {
      const match = file.fieldname.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (!variantFiles[index]) variantFiles[index] = [];
        variantFiles[index].push(file);
      }
    });

    for (const [index, files] of Object.entries(variantFiles)) {
      const uploadResults = await Promise.all(
        files.map((file) =>
          uploadOnCloudinary(file.path, { folder: 'variants' })
        )
      );

      const urls = uploadResults.filter((r) => r).map((r) => r.secure_url);

      if (updatedVariants[index]) {
        updatedVariants[index].images = [
          ...(updatedVariants[index].images || []),
          ...urls,
        ];
      }
    }
  }

  // ✅ Update product-level fields
  const allowedFields = [
    'name',
    'slug',
    'description',
    'tags',
    'categories',
    'compatibleBoxes',
    'low_stock_threshold',
    'boxDetails',
    'type',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  // ✅ Save new variants
  product.variants = updatedVariants;

  await product.save();
  res.json({ success: true, product });
});



export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: 'Product not found' });
  }

  // If deleting a box, remove it from other products’ compatibleBoxes
  if (product.type === 'box') {
    await Product.updateMany(
      { compatibleBoxes: product._id },
      { $pull: { compatibleBoxes: product._id } }
    );
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});
