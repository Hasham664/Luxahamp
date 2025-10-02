'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ query by category slug
        const { data } = await api.get(`/products?categorySlug=${slug}`);
        console.log(data, 'data');
        
        setProducts(data.items);
      } catch (err) {
          console.error('Error fetching products', err);
      }
    };
    if (slug) fetchProducts();
}, [slug]);

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4 capitalize'>{slug}</h1>
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {products.map((p) => (
            <div
              key={p._id}
              className='border rounded-lg p-4 shadow hover:shadow-lg'
            >
              <img
                src={p.images?.[0]}
                alt={p.name}
                className='w-full h-40 object-cover rounded'
              />
              <h2 className='mt-2 font-semibold'>{p.name}</h2>
              {p.price && <p className='text-gray-600'>₹{p.price}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
