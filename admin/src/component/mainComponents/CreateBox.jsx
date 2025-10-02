'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import VariantManager from './variantProduct';

export default function CreateBoxPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    type: 'box',
    name: '',
    description: '',
    keyWords: [],
    categories: [],
    variants: [
      {
        name: 'Default',
        color: [],
        price: 0,
        stock_count: 0,
        stock_unit: 'pcs',
        discount_type: null,
        tags: null,
        low_stock_threshold: 10,
        discount_value: 0,
        taxIncluded: true,
        taxPercent: 0,
        sku: '',
        images: [],
        boxDetails: {
          dimensions: { height: 0, width: 0, depth: 0 },
          max_capacity: 1,
        },
      },
    ],
  });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await api.get('/categories');
//       setCategories(response.data.categories || response.data || []);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        keyWords: Array.isArray(form.keyWords)
          ? form.keyWords
          : form.keyWords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean),
      };

      console.log('Creating box with payload:', payload);

      const response = await api.post('/products', payload);
      console.log('Box created successfully:', response.data);

      router.push('/boxes');
    } catch (error) {
      console.error('Error creating box:', error);
      alert(error.response?.data?.message || 'Failed to create box');
    } finally {
      setLoading(false);
    }
  };

//   const handleCategoryToggle = (categoryId) => {
//     setForm((prev) => ({
//       ...prev,
//       categories: prev.categories.includes(categoryId)
//         ? prev.categories.filter((id) => id !== categoryId)
//         : [...prev.categories, categoryId],
//     }));
//   };

  const handleKeyWordsChange = (value) => {
    setForm((prev) => ({ ...prev, keyWords: value }));
  };

  return (
    <div className='max-w-5xl mx-auto pt-12'>
      <div className='mb-6'>
        <Link
          href='/boxes'
          className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Boxes
        </Link>
        <h1 className='text-2xl font-bold text-gray-900'>Create New Box</h1>
        <p className='text-gray-600 mt-1'>
          Add a new box product to your catalog
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Basic Information */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Basic Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Box Name *
              </label>
              <input
                type='text'
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='e.g. Small Gift Box, Medium Storage Box'
                required
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Describe the box features, materials, and uses...'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Keywords (comma separated)
              </label>
              <input
                type='text'
                value={
                  Array.isArray(form.keyWords)
                    ? form.keyWords.join(', ')
                    : form.keyWords
                }
                onChange={(e) => handleKeyWordsChange(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='gift box, storage, packaging, container'
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        {/* <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Categories
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {categories.map((category) => (
              <label
                key={category._id}
                className='flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={form.categories.includes(category._id)}
                  onChange={() => handleCategoryToggle(category._id)}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5'
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900'>
                    {category.name}
                  </p>
                  <p className='text-xs text-gray-500'>{category.mainTitle}</p>
                </div>
              </label>
            ))}
          </div>
        </div> */}

        {/* Variants with Box Details */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <VariantManager
            variants={form.variants}
            onChange={(variants) => setForm((prev) => ({ ...prev, variants }))}
            type='box'
          />
        </div>

        {/* Actions */}
        <div className='flex items-center justify-end gap-4 bg-white rounded-lg shadow-sm p-6'>
          <Link
            href='/boxes'
            className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Cancel
          </Link>
          <button
            type='submit'
            disabled={loading}
            className='flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Save className='w-4 h-4' />
            )}
            {loading ? 'Creating...' : 'Create Box'}
          </button>
        </div>
      </form>
    </div>
  );
}
