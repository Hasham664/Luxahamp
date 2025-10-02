import Cart from "../models/Cart.js";
import asyncHandler from "../middlewere/asyncHandler.js";
import Product from "../models/Product.js";
import { calculateFinalPriceForVariant } from "../utils/price.js";
/** Helper to recalc totals */
function recalc(cart) {
  cart.subTotal = cart.items.reduce((sum, i) => sum + i.lineTotal, 0);
  cart.grandTotal = cart.subTotal + cart.shipping - cart.discount;
  return cart;
}

/** Get cart by user or guestId */
export const getCart = asyncHandler(async (req, res) => {
  const { user, cookies } = req;
  const query = user ? { user: user._id } : { guestId: cookies.guestId };
  const cart = await Cart.findOne(query);
  res.json(
    cart || {
      items: [],
      subTotal: 0,
      shipping: 250,
      discount: 0,
      grandTotal: 0,
    }
  );
});

/** Add item or increase quantity */
export const addItem = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;
  const { user, cookies } = req;

  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const variant = product.variants.id(variantId);
  if (!variant) throw new Error('Variant not found');

  const price = calculateFinalPriceForVariant(variant);
  const query = user ? { user: user._id } : { guestId: cookies.guestId };
  let cart = await Cart.findOne(query);
  if (!cart) cart = new Cart({ ...query, items: [] });

  const idx = cart.items.findIndex(
    (i) =>
      i.product.toString() === productId &&
      i.variant._id.toString() === variantId
  );

  if (idx > -1) {
    cart.items[idx].quantity += quantity;
    cart.items[idx].lineTotal =
      cart.items[idx].quantity * cart.items[idx].unitPrice;
  } else {
    cart.items.push({
      product: product._id,
      variant: {
        _id: variant._id,
        name: variant.name,
        price: variant.price,
        discount_type: variant.discount_type,
        discount_value: variant.discount_value,
        taxIncluded: variant.taxIncluded,
        taxPercent: variant.taxPercent,
        images: variant.images || [],
      },
      productName: product.name,
      productDescription: product.description,
      quantity,
      unitPrice: price,
      lineTotal: price * quantity,
    });
  }

  recalc(cart);
  await cart.save();
  res.json(cart);
});

/** Update quantity */
export const updateItem = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;
  const { user, cookies } = req;
  const query = user ? { user: user._id } : { guestId: cookies.guestId };

  const cart = await Cart.findOne(query);
  if (!cart) throw new Error('Cart not found');

  const item = cart.items.id(itemId);
  if (!item) throw new Error('Item not found');

  item.quantity = quantity;
  item.lineTotal = item.unitPrice * quantity;

  recalc(cart);
  await cart.save();
  res.json(cart);
});

/** Remove item */
export const removeItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { user, cookies } = req;
  const query = user ? { user: user._id } : { guestId: cookies.guestId };

  const cart = await Cart.findOne(query);
  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
  recalc(cart);
  await cart.save();
  res.json(cart);
});

/** Clear cart */
export const clearCart = asyncHandler(async (req, res) => {
  const { user, cookies } = req;
  const query = user ? { user: user._id } : { guestId: cookies.guestId };

  const cart = await Cart.findOne(query);
  if (cart) {
    cart.items = [];
    recalc(cart);
    await cart.save();
  }
  res.json(cart || {});
});
