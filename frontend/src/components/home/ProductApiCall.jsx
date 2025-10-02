'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { fetchProducts } from '@/store/product/productSlice';

export default function ProductApiCall() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='Mycontainer py-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-12'>
        {list?.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className='text-center mt-12'>
        <button className='bg-black text-white w-50 px-6 py-2 cursor-pointer '>
          View All
        </button>
      </div>
    </div>
  );
}
