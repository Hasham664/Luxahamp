// models/Favorite.js
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // logged-in user
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variant: { type: mongoose.Schema.Types.ObjectId }, 
  },
  { timestamps: true }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;