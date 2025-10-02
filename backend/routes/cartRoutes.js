import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from '../controllers/cartController.js';
import isAuthenticated from '../middlewere/isAuthenticated.js';
const router = express.Router();

router.get('/', isAuthenticated, getCart);
router.post('/add', isAuthenticated, addItem);
router.put('/update', isAuthenticated, updateItem);
router.delete('/remove/:itemId', isAuthenticated, removeItem);
router.delete('/clear', isAuthenticated, clearCart);

export default router;
