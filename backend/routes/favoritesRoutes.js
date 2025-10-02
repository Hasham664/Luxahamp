// routes/favoriteRoutes.js
import express from 'express';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  mergeFavorites,
} from '../controllers/favoriteController.js';
import isAuthenticated from '../middlewere/isAuthenticated.js';
const router = express.Router();

router.post('/', isAuthenticated, addFavorite); // add product/variant to favorites
router.get('/', isAuthenticated, getFavorites); // get favorites
router.delete('/:id', isAuthenticated, removeFavorite); // remove favorite
router.delete('/', isAuthenticated, removeFavorite);

router.post('/merge', isAuthenticated, mergeFavorites); // merge guest favorites on login

export default router;
