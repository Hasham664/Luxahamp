export const calculatePrice = (variant) => {
  let finalPrice = variant.price;
  if (variant.discount_type === 'percent') {
    finalPrice = variant.price - (variant.price * variant.discount_value) / 100;
  } else if (variant.discount_type === 'fixed') {
    finalPrice = variant.price - variant.discount_value;
  }
  return Math.max(finalPrice, 0);
};

export const getDiscountLabel = (variant) => {
  if (variant.discount_type === 'percent') {
    return `${variant.discount_value}%`;
  } else if (variant.discount_type === 'fixed') {
    return `${variant.discount_value}₹`;
  }
  return null;
};
