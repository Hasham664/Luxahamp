import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middlewere/multer.js'; // temp storage for Cloudinary
import { adminAuth } from '../middlewere/adminAuth.js';
const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post( adminAuth, upload.any(), createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put( adminAuth, upload.any(), updateProduct)
  .delete( adminAuth, deleteProduct);

export default router;