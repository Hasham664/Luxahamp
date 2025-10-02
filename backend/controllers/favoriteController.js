// import Product from '../models/Product.js';
import asyncHandler from '../middlewere/asyncHandler.js'
import Favorite from '../models/Favorites.js';
/**
 * Add favorite (logged-in user only)
 */
export const addFavorite = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.body;
  const userId = req.user._id;
  
  const exists = await Favorite.findOne({
    user: userId,
    product: productId,
    variant: variantId || null,
  });

  if (exists) {
    return res.status(200).json({ message: 'Already in favorites' });
  }

  const fav = await Favorite.create({
    user: userId,
    product: productId,
    variant: variantId || null,
  });

  res.status(201).json(fav);
});

/**
 * Get user favorites (with product + variant details)
 */
export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).populate(
    'product'
  );

  // attach variant details if present
  const withVariants = favorites.map((fav) => {
    let favObj = fav.toObject();
    if (fav.variant && fav.product?.variants) {
      const variantDetail = fav.product.variants.find((v) =>
        v._id.equals(fav.variant)
      );
      favObj.variantDetail = variantDetail || null;
    } else {
      favObj.variantDetail = null;
    }
    return favObj;
  });

  res.json(withVariants);
});

/**
 * Remove from favorites
 * Supports either by favoriteId OR productId+variantId
 */
export const removeFavorite = asyncHandler(async (req, res) => {
  const { id } = req.params; // favorite _id if provided
  const { productId, variantId } = req.body; // alternative way

  let filter = { user: req.user._id };

  if (id) {
    filter._id = id;
  } else if (productId) {
    filter.product = productId;
    filter.variant = variantId || null;
  } else {
    return res.status(400).json({ message: 'Provide either id or productId' });
  }

  const fav = await Favorite.findOneAndDelete(filter);

  if (!fav) return res.status(404).json({ message: 'Favorite not found' });
  res.json({ message: 'Removed from favorites' });
});


export const mergeFavorites = asyncHandler(async (req, res) => {
  const { favorites } = req.body; // array of { productId, variantId }
  const userId = req.user._id;

  if (!favorites || !Array.isArray(favorites) || favorites.length === 0) {
    return res.json({ message: 'No favorites to merge' });
  }

  const ops = favorites.map((fav) => ({
    updateOne: {
      filter: {
        user: userId,
        product: fav.productId,
        variant: fav.variantId || null,
      },
      update: {
        user: userId,
        product: fav.productId,
        variant: fav.variantId || null,
      },
      upsert: true,
    },
  }));

  await Favorite.bulkWrite(ops);

  res.json({ message: 'Favorites merged successfully' });
});
