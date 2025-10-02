'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import VariantManager from '@/component/mainComponents/variantProduct';

export default function EditBoxPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
//   const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    type: 'box',
    name: '',
    description: '',
    keyWords: [],
    categories: [],
    variants: [],
  });

  useEffect(() => {
    if (id) {
      fetchBox();
    //   fetchCategories();
    }
  }, [id]);

  const fetchBox = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const box = response.data.product || response.data;

      setForm({
        type: box.type || 'box',
        name: box.name || '',
        description: box.description || '',
        keyWords: box.keyWords || [],
        categories: (box.categories || []).map((cat) =>
          typeof cat === 'string' ? cat : cat._id
        ),
        variants: box.variants || [],
      });
    } catch (error) {
      console.error('Error fetching box:', error);
      alert('Failed to load box');
      router.push('/boxes');
    } finally {
      setInitialLoading(false);
    }
  };

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

      console.log('Updating box with payload:', payload);

      const response = await api.put(`/products/${id}`, payload);
      console.log('Box updated successfully:', response.data);

      router.push('/boxes');
    } catch (error) {
      console.error('Error updating box:', error);
      alert(error.response?.data?.message || 'Failed to update box');
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

  if (initialLoading) {
    return (
      <div className='max-w-5xl mx-auto pt-12'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-2 text-gray-600'>Loading box...</span>
        </div>
      </div>
    );
  }

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
        <h1 className='text-2xl font-bold text-gray-900'>Edit Box</h1>
        <p className='text-gray-600 mt-1'>
          Update box information and settings
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
            {loading ? 'Updating...' : 'Update Box'}
          </button>
        </div>
      </form>
    </div>
  );
}
