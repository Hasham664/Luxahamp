import express from 'express';
import {
  createHero,
  getHeroes,
  // getHeroById,
  updateHero,
  deleteHero,
} from '../controllers/heroController.js';
import upload from '../middlewere/multer.js';
import { adminAuth } from '../middlewere/adminAuth.js';

const router = express.Router();

// Create a new hero component with image uploads
router.post('/', adminAuth, upload.array('images', 5), createHero);

// Get all hero components
router.get('/', getHeroes);

// // Get a single hero component by ID
// router.get('/:id', getHeroById);

// Update a hero component by ID
router.put('/:id', adminAuth, upload.array('images', 5), updateHero);

// Delete a hero component by ID
router.delete('/:id', adminAuth, deleteHero);

export default router;
