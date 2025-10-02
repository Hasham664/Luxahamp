import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variant: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: String,
      price: Number,
      discount_type: String,
      discount_value: Number,
      taxIncluded: Boolean,
      taxPercent: Number,
      images: [String], // for product thumbnails
    },
    productName: String,
    productDescription: String,
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, required: true }, // final single-item price
    lineTotal: { type: Number, required: true }, // unitPrice * quantity
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // set after login
    guestId: { type: String }, // cookie/session id
    items: [CartItemSchema],
    shipping: { type: Number, default: 250 },
    discount: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;