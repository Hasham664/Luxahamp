// routes/categoryRoutes.js
import express from 'express';
import upload from '../middlewere/multer.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { adminAuth } from '../middlewere/adminAuth.js';

const router = express.Router();

// Collection routes
router
  .route('/')
  .get(getAllCategories)
  .post(adminAuth,upload.single('image'), createCategory);

// Single category routes
router
  .route('/:id')
  .get(getCategoryById)
  .put(adminAuth, upload.single('image'), updateCategory)
  .delete(adminAuth,deleteCategory);

export default router;
