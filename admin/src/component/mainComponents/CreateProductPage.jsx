'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import VariantManager from './variantProduct';

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [boxDropdownOpen, setBoxDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const boxDropdownRef = useRef(null);

  const [slugEdited, setSlugEdited] = useState(false); // track manual edits

  const [boxes, setBoxes] = useState([]);
  const [form, setForm] = useState({
    type: 'product',
    name: '',
    slug: '',
    description: '',
    keyWords: '',
    categories: [],
    compatibleBoxes: [],
    variants: [
      {
        name: 'Default',
        color: [],
        price: 0,
        stock_count: 0,
        stock_unit: 'ml',
        discount_type: '',
        tags: '',
        low_stock_threshold: 10,
        discount_value: 0,
        taxIncluded: true,
        taxPercent: 0,
        sku: '',
        images: [],
      },
    ],
  });

  const toSlug = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse spaces to -
      .replace(/-+/g, '-');
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        boxDropdownRef.current &&
        !boxDropdownRef.current.contains(event.target)
      ) {
        setBoxDropdownOpen(false);
      }

      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setCategoryDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBoxes();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBoxes = async () => {
    try {
      const response = await api.get('/products?type=box');
      setBoxes(response.data.items || response.data || []);
    } catch (error) {
      console.error('Error fetching boxes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Add normal product fields
      formData.append('name', form.name);
      formData.append('slug', form.slug);
      formData.append('keyWords', form.keyWords);

      formData.append('description', form.description);
      formData.append('type', form.type);

      // Categories, boxes
      form.categories.forEach((c) => formData.append('categories[]', c));
      form.compatibleBoxes.forEach((b) =>
        formData.append('compatibleBoxes[]', b)
      );

      // Variants
      form.variants.forEach((variant, i) => {
        formData.append(`variants[${i}][name]`, variant.name);
        formData.append(`variants[${i}][price]`, variant.price);
        formData.append(`variants[${i}][sku]`, variant.sku);
        formData.append(`variants[${i}][stock_count]`, variant.stock_count);
        formData.append(`variants[${i}][stock_unit]`, variant.stock_unit);
        formData.append(`variants[${i}][discount_type]`, variant.discount_type);
        formData.append(`variants[${i}][tags]`, variant.tags);
        formData.append(
          `variants[${i}][low_stock_threshold]`,
          variant.low_stock_threshold
        );
        formData.append(`variants[${i}][discount_value]`, variant.discount_value);
        formData.append(`variants[${i}][taxIncluded]`, variant.taxIncluded);
        formData.append(`variants[${i}][taxPercent]`, variant.taxPercent);
        formData.append(`variants[${i}][color]`, variant.color);

        // Variant images (real files)
        if (variant.images && variant.images.length > 0) {
          Array.from(variant.images).forEach((file) => {
            formData.append(`variants[${i}][images]`, file);
          });
        }
      });

      // Send as multipart/form-data
      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Product created successfully!');
      console.log('Product:', response.data);
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };


  const handleCategoryToggle = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleBoxToggle = (boxId) => {
    setForm((prev) => ({
      ...prev,
      compatibleBoxes: prev.compatibleBoxes.includes(boxId)
        ? prev.compatibleBoxes.filter((id) => id !== boxId)
        : [...prev.compatibleBoxes, boxId],
    }));
  };

  const handleKeyWordsChange = (value) => {
    setForm((prev) => ({ ...prev, keyWords: value }));
  };


  return (
    <div className='max-w-5xl mx-auto'>
      <div className='mb-6'>
        <Link
          href='/allProducts'
          className='inline-flex items-center pt-12 gap-2 text-gray-600 hover:text-gray-900 mb-4'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Products
        </Link>
        <h1 className='text-2xl font-bold text-gray-900'>Create New Product</h1>
        <p className='text-gray-600 mt-1'>Add a new product to your catalog</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Basic Information */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Basic Information
          </h2>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Name *
              </label>
              <input
                type='text'
                value={form.name}
                placeholder='Enter product name'
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name,
                    // auto-update slug only if user hasn’t edited slug field
                    slug: slugEdited ? prev.slug : toSlug(name),
                  }));
                }}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Slug Name *
              </label>
              <input
                type='text'
                value={form.slug}
                placeholder='Slug Auto Generated from product name'
                onChange={(e) => {
                  setSlugEdited(true);
                  setForm((prev) => ({
                    ...prev,
                    slug: toSlug(e.target.value),
                  }));
                }}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                value={form.keyWords}
                onChange={(e) => handleKeyWordsChange(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='perfume, fragrance, scent'
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Categories
          </h2>

          {categories.length === 0 ? (
            <p className='text-gray-500 text-sm'>No categories available.</p>
          ) : (
            <div className='relative' ref={categoryDropdownRef}>
              <button
                type='button'
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className='w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              >
                {form.categories.length > 0
                  ? `${form.categories.length} selected`
                  : 'Select categories'}
              </button>

              {categoryDropdownOpen && (
                <div className='absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg border max-h-60 overflow-auto'>
                  {categories.map((category) => (
                    <label
                      key={category._id}
                      className='flex items-start space-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer'
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
                        <p className='text-xs text-gray-500'>
                          {category.mainTitle}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compatible Boxes */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Compatible Boxes
          </h2>

          {boxes.length === 0 ? (
            <p className='text-gray-500 text-sm'>
              No boxes available.{' '}
              <Link href='/boxes' className='text-blue-600 hover:text-blue-800'>
                Create a box first
              </Link>
            </p>
          ) : (
            <div className='relative ' ref={boxDropdownRef}>
              <button
                type='button'
                className='w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                onClick={() => setBoxDropdownOpen(!boxDropdownOpen)}
              >
                {form.compatibleBoxes.length > 0
                  ? `${form.compatibleBoxes.length} box(es) selected`
                  : 'Select compatible boxes'}
              </button>

              {boxDropdownOpen && (
                <div className='absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg border max-h-60 overflow-auto'>
                  {boxes.map((box) => (
                    <label
                      key={box._id}
                      className='flex items-start space-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        checked={form.compatibleBoxes.includes(box._id)}
                        onChange={() => handleBoxToggle(box._id)}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5'
                      />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900'>
                          {box.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Capacity:{' '}
                          {box.variants?.[0]?.boxDetails?.max_capacity || 0}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <VariantManager
            variants={form.variants}
            onChange={(variants) => setForm((prev) => ({ ...prev, variants }))}
            type='product'
          />
        </div>

        {/* Product Actions */}
        <div className='flex items-center justify-end gap-4 bg-white rounded-lg shadow-sm p-6'>
          <Link
            href='/allProducts'
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
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
