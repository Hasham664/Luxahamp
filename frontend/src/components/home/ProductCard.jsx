'use client';
import { useState } from 'react';
import Image from 'next/image';
import { calculatePrice, getDiscountLabel } from '@/utils/priceUtils';
import VariantPopup from './VariantPopup';
import { Star, StarHalf } from 'lucide-react';

export default function ProductCard({ product }) {
  const [showPopup, setShowPopup] = useState(false);

  // use first variant by default
  const variant = product.variants[0];
  console.log(variant, 'variant');
  
  const discountLabel = getDiscountLabel(variant);
  const finalPrice = calculatePrice(variant);

  return (
    <div className='group/product relative '>
      {/* Product Image */}
      <div className='relative overflow-hidden '>
        <Image
          src={variant.images?.[0] || '/placeholder.png'}
          alt={product.name}
          width={300}
          height={300}
          className='object-cover w-full transition-transform duration-300
            group-hover/product:scale-105'
        />

        {/* Discount Tag */}
        {discountLabel && (
          <div className='absolute top-2 left-2  text-xs  rounded-md flex flex-col'>
            <span className='bg-[#D50061] text-white w-fit px-3 py-1.5'>
              {discountLabel}
            </span>
            { variant.tags && (
              <span className='bg-[#002073] text-white px-3 py-1.5 mt-2'>
              {variant.tags}
            </span>
              )
            }
          </div>
        )}

        {/* Hover Buttons */}
        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover/product:opacity-100 transition-opacity flex items-end justify-center gap-2 pb-3'>
          {product.variants.length > 1 ? (
            <button
              onClick={() => setShowPopup(true)}
              className='bg-black text-white w-full cursor-pointer uppercase mx-4 py-2 text-sm  font-medium '
            >
              Choose Options
            </button>
          ) : (
            <button
              onClick={() => alert('Added to Cart')}
              className='bg-black text-white w-full uppercase mx-4 py-2.5 text-sm  font-medium cursor-pointer '
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className='mt-3'>
        <h3 className='text-base uppercase font-medium text-black truncate'>
          {product.name}
        </h3>
        <div className='flex items-center gap-2'>
          {discountLabel && (
            <span className='line-through text-[#333333] text-sm'>
              ₹{variant.price}
            </span>
          )}
          <span className='text-[#D50061] font-bold'>₹{finalPrice}</span>
        </div>
        <div className='flex gap-1 items-center text-yellow-400 text-xs mt-1'>
          {Array.from({ length: 5 }, (_, i) => {
            const rounded = Math.round(product.avgRating * 2) / 2; // round to half star
            if (rounded >= i + 1) {
              return <Star key={i} size={16} className='fill-current' />; // full star
            } else if (rounded >= i + 0.5) {
              return <StarHalf key={i} size={16} className='fill-current' />; // half star
            } else {
              return <Star key={i} size={16} className='text-gray-300' />; // empty star
            }
          })}
          <span className='ml-2 text-gray-500'>({product.totalReviews})</span>
        </div>
      </div>

      {/* Variant Popup */}
      {showPopup && (
        <VariantPopup product={product} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
