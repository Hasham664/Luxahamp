import express from 'express';
import {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
  getAllApprovedReviews, // For homepage
} from '../controllers/reviewController.js';
import upload from '../middlewere/multer.js';
import { adminAuth } from '../middlewere/adminAuth.js';
import isAuthenticated from '../middlewere/isAuthenticated.js';

const router = express.Router();

// Create review (authenticated users only)
router.post('/', isAuthenticated, upload.array('images', 5), createReview);
router.post('/admin', adminAuth, upload.array('images', 5), createReview);


// Get all reviews (admin only)
router.get('/all', adminAuth, getAllReviews);

// Get all approved reviews for homepage (public)
router.get('/homepage', getAllApprovedReviews);

// Get all approved reviews for a specific product (public)
router.get('/product/:productId', getProductReviews);

// Admin: approve/reject review
router.put('/:id/status', isAuthenticated, adminAuth, updateReviewStatus);

// Admin: delete review
router.delete('/:id', adminAuth, deleteReview);

export default router;