'use client';
import Image from 'next/image';
import { calculatePrice, getDiscountLabel } from '@/utils/priceUtils';
import { Star, StarHalf } from 'lucide-react';

export default function VariantPopup({ product, onClose }) {
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white  w-[85%]  max-w-4xl m p-5 relative max-sm:overflow-y-auto max-sm:h-96'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute cursor-pointer top-3 right-6 text-gray-600 hover:text-black text-xl'
        >
          ✕
        </button>

        {/* Popup Title */}
        <h2 className='text-xl font-semibold mb-6  uppercase'>
          Choose Options
        </h2>

        {/* Variants Grid (same like product cards) */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 '>
          {product.variants.map((variant, idx) => {
            const discountLabel = getDiscountLabel(variant);
            const finalPrice = calculatePrice(variant);

            return (
              <div
                key={idx}
                className='group/variant overflow-hidden transition '
              >
                {/* Variant Image */}
                <div className='relative overflow-hidden'>
                  <Image
                    src={variant.images?.[0] || '/placeholder.png'}
                    alt={variant.name}
                    width={300}
                    height={300}
                    className='object-cover w-full transition-transform duration-300 group-hover/variant:scale-105'
                  />

                  {/* Discount + Tag */}
                  {discountLabel && (
                    <div className='absolute top-2 left-2 flex flex-col text-xs'>
                      <span className='bg-[#D50061] text-white px-2 py-1 rounded'>
                        {discountLabel}
                      </span>
                      {variant.tags && (
                        <span className='bg-[#002073] text-white px-2 py-1 mt-2 rounded'>
                          {variant.tags}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Hover Button (same as ProductCard) */}
                  <div className='absolute inset-0 opacity-0 group-hover/variant:opacity-100 transition-opacity flex items-end justify-center gap-2 pb-3'>
                    <button
                      onClick={() => alert(`Added ${variant.name} to cart`)}
                      className='bg-black text-white w-full cursor-pointer uppercase mx-4 py-2 text-sm font-medium'
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Variant Info */}
                <div className='pt-3'>
                  <h3 className='text-sm font-medium uppercase truncate'>
                    {variant.name}
                  </h3>

                  <div className='flex items-center gap-2 mt-1'>
                    {discountLabel && (
                      <span className='line-through text-gray-400 text-sm'>
                        ₹{variant.price}
                      </span>
                    )}
                    <span className='text-[#D50061] font-bold'>
                      ₹{finalPrice}
                    </span>
                  </div>

                  {/* Stars (reuse same rating as product) */}
                  <div className='flex gap-1 items-center text-yellow-400 text-xs mt-2'>
                    {Array.from({ length: 5 }, (_, i) => {
                      const rounded = Math.round(product.avgRating * 2) / 2;
                      if (rounded >= i + 1) {
                        return (
                          <Star key={i} size={14} className='fill-current' />
                        );
                      } else if (rounded >= i + 0.5) {
                        return (
                          <StarHalf
                            key={i}
                            size={14}
                            className='fill-current'
                          />
                        );
                      } else {
                        return (
                          <Star key={i} size={14} className='text-gray-300' />
                        );
                      }
                    })}
                    <span className='ml-1 text-gray-500'>
                      ({product.totalReviews})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
