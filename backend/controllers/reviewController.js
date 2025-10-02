import asyncHandler from '../middlewere/asyncHandler.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create review (user or admin)
export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  // Validate required fields
  if (!productId || !rating || !comment) {
    return res.status(400).json({
      success: false,
      message: 'Product ID, rating, and comment are required',
    });
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  // Check if user already reviewed this product (unless admin)
  if (req.user.role !== 'admin') {
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }
  }

  // Handle image uploads
  let images = [];
  if (req.files && req.files.length > 0) {
    try {
      const uploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path)
      );
      const uploaded = await Promise.all(uploadPromises);
      images = uploaded.filter((u) => u && u.url).map((u) => u.url);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error uploading images',
      });
    }
  }

  // Create review
  const reviewData = {
    product: productId,
    user: req.user._id,
    rating: Number(rating),
    comment,
    images,
    isAdminReview: req.user.role === 'admin',
    // Admin reviews are auto-approved, user reviews need approval
    status: req.user.role === 'admin' ? 'approved' : 'pending',
  };

  const review = await Review.create(reviewData);

  // add review id to product
  await Product.findByIdAndUpdate(productId, {
    $push: { reviews: review._id },
  });
  // Populate user and product info for response
  await review.populate('user', 'name email');
  await review.populate('product', 'name slug');

  res.status(201).json({
    success: true,
    message:
      req.user.role === 'admin'
        ? 'Review created and approved'
        : 'Review submitted for approval',
    review,
  });
});

// Get all reviews (admin only)
export const getAllReviews = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let query = {};
  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    query.status = status;
  }

  const reviews = await Review.find(query)
    .populate('product', 'name slug images')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// Get approved reviews for a specific product (public)
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const reviews = await Review.find({
    product: productId,
    status: 'approved',
  })
    .populate('user', 'name')
    .populate('product', 'name slug images') // 🔥 add this

    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalReviews = await Review.countDocuments({
    product: productId,
    status: 'approved',
  });

  // Calculate average rating
  const ratingStats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: 'approved',
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating',
        },
      },
    },
  ]);

  res.json({
    success: true,
    count: reviews.length,
    totalReviews,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalReviews / limit),
    avgRating:
      ratingStats.length > 0
        ? Math.round(ratingStats[0].avgRating * 10) / 10
        : 0,
    reviews,
  });
});

// Get all approved reviews for homepage (public)
export const getAllApprovedReviews = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const reviews = await Review.find({ status: 'approved' })
    .populate('user', 'name')
    .populate('product', 'name slug images')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// Update review status (admin only)
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be approved or rejected',
    });
  }

  const review = await Review.findById(req.params.id)
    .populate('user', 'name email')
    .populate('product', 'name');

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  review.status = status;
  await review.save();

  res.json({
    success: true,
    message: `Review ${status} successfully`,
    review,
  });
});

// Delete review (admin only)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  await review.deleteOne();

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});
