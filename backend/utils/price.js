// utils/price.js
export function calculateFinalPriceForVariant(variant) {
  let price = Number(variant.price || 0);
  const dt = variant.discount_type;
  const dv = Number(variant.discount_value || 0);

  if (dt === 'percent') {
    price = price * (1 - dv / 100);
  } else if (dt === 'fixed') {
    price = price - dv;
  } else if (dt === 'sale') {
    price = dv; // sale value is the final price
  }

  // ensure not negative
  if (price < 0) price = 0;

  // tax
  if (!variant.taxIncluded) {
    price = price + price * (Number(variant.taxPercent || 0) / 100);
  }

  // round to 2 decimals
  return Math.round(price * 100) / 100;
}
