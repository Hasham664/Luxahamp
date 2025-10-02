'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Star, Upload, X } from 'lucide-react';
import api from '@/lib/api';
import VariantManager from '@/component/mainComponents/variantProduct';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [boxes, setBoxes] = useState([]);
    const [slugEdited, setSlugEdited] = useState(false); // track manual edits
  
  const [form, setForm] = useState({
    type: 'product',
    name: '',
    slug: '',
    description: '',
    keyWords: '',
    categories: [],
    compatibleBoxes: [],
    variants: [],
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

   const toSlug = (str) =>
     str
       .toLowerCase()
       .trim()
       .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
       .replace(/\s+/g, '-') // collapse spaces to -
       .replace(/-+/g, '-');

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchCategories();
      fetchBoxes();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      console.log(response, 'product id');
      const product = response.data.product || response.data;
      
      setForm({
        type: product.type || 'product',
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        keyWords: product.keyWords || '',
        categories: (product.categories || []).map((cat) =>
          typeof cat === 'string' ? cat : cat._id
        ),
        compatibleBoxes: (product.compatibleBoxes || []).map((box) =>
          typeof box === 'string' ? box : box._id
        ),
        variants: product.variants || [],
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      router.push('/AllProducts');
    } finally {
      setInitialLoading(false);
    }
  };

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

      // 🔹 Main product fields
      formData.append('type', form.type);
      formData.append('name', form.name);
      formData.append('slug', form.slug);
      formData.append('description', form.description);
      formData.append('keyWords', form.keyWords); // ✅ string, not array

      // 🔹 Categories & compatible boxes
      form.categories.forEach((cat) => formData.append('categories[]', cat));
      form.compatibleBoxes.forEach((box) =>
        formData.append('compatibleBoxes[]', box)
      );

      // 🔹 Variants (all fields + images)
      form.variants.forEach((variant, i) => {
        formData.append(`variants[${i}][name]`, variant.name || '');
        formData.append(`variants[${i}][price]`, variant.price || 0);
        formData.append(
          `variants[${i}][stock_count]`,
          variant.stock_count ?? 0
        );
        formData.append(`variants[${i}][stock_unit]`, variant.stock_unit || '');
        formData.append(`variants[${i}][taxIncluded]`, variant.taxIncluded);
        formData.append(`variants[${i}][taxPercent]`, variant.taxPercent || 0);
        formData.append(`variants[${i}][color]`, variant.color || '');
        formData.append(`variants[${i}][tags]`, variant.tags || '');

        if (variant.sku) {
          formData.append(`variants[${i}][sku]`, variant.sku);
        }

        if (variant.discount_type) {
          formData.append(
            `variants[${i}][discount_type]`,
            variant.discount_type
          );
        }

        if (variant.discount_value !== undefined) {
          formData.append(
            `variants[${i}][discount_value]`,
            variant.discount_value
          );
        }

        // ✅ Images: preserve existing + add new uploads
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((file) => {
            if (file instanceof File) {
              // New upload
              formData.append(`variants[${i}][images]`, file);
            } else if (typeof file === 'string') {
              // Existing Cloudinary URL (keep it)
              formData.append(`variants[${i}][existingImages][]`, file);
            }
          });
        }
      });

      // 🔥 API call
      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Product updated successfully:', response.data);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('❌ Error updating product:', error);
      alert(error.response?.data?.message || 'Failed to update product');
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

  // Review handlers
  const handleStarClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImageFiles(files);

    // Create preview URLs
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setReviewForm((prev) => ({ ...prev, images: imageUrls }));
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newUrls = reviewForm.images.filter((_, i) => i !== index);

    setImageFiles(newFiles);
    setReviewForm((prev) => ({ ...prev, images: newUrls }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (reviewForm.rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!reviewForm.comment.trim()) {
      alert('Please add a comment');
      return;
    }

    setReviewLoading(true);

    try {
      const formData = new FormData();
      formData.append('productId', id);
      formData.append('rating', reviewForm.rating);
      formData.append('comment', reviewForm.comment);

      // Append images
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post('/review/admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form
      setReviewForm({
        rating: 0,
        comment: '',
        images: [],
      });
      setImageFiles([]);
      setShowReviewForm(false);
      console.log('Review added successfully:', response.data);
      
      alert('Review added successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
      alert(error.response?.data?.message || 'Failed to add review');
    } finally {
      setReviewLoading(false);
    }
  };

  const resetReviewForm = () => {
    setReviewForm({
      rating: 0,
      comment: '',
      images: [],
    });
    setImageFiles([]);
    setShowReviewForm(false);
  };

  if (initialLoading) {
    return (
      <div className='max-w-5xl mx-auto'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-2 text-gray-600'>Loading product...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto pt-12'>
      <div className='mb-6'>
        <Link
          href='/allProducts'
          className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Products
        </Link>
        <h1 className='text-2xl font-bold text-gray-900'>Edit Product</h1>
        <p className='text-gray-600 mt-1'>
          Update product information and settings
        </p>
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
                value={
                  form.keyWords
                }
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
              {boxes.map((box) => (
                <label
                  key={box._id}
                  className='flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer'
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

        {/* Variants */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <VariantManager
            variants={form.variants}
            setForm={setForm}
            onChange={(variants) => setForm((prev) => ({ ...prev, variants }))}
            type='product'
          />
        </div>

        {/* Actions */}
        <div className='flex items-center justify-end gap-4 bg-white rounded-lg shadow-sm p-6'>
          <Link
            href='/products'
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
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>

      {/* Admin Review Section */}
      <div className='mt-8 bg-white rounded-lg shadow-sm p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Add Admin Review
          </h2>
          {!showReviewForm && (
            <button
              type='button'
              onClick={() => setShowReviewForm(true)}
              className='px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors'
            >
              Add Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className='space-y-4'>
            {/* Rating */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Rating *
              </label>
              <div className='flex items-center gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => handleStarClick(star)}
                    className='focus:outline-none'
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= reviewForm.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
                <span className='ml-2 text-sm text-gray-600'>
                  {reviewForm.rating > 0
                    ? `${reviewForm.rating}/5`
                    : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Review Comment *
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                rows={4}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Write your review about this product...'
                required
              />
            </div>

            {/* Images Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Review Images (Optional)
              </label>
              <div className='space-y-3'>
                <div className='flex items-center gap-4'>
                  <label className='cursor-pointer'>
                    <input
                      type='file'
                      multiple
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='hidden'
                    />
                    <div className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                      <Upload className='w-4 h-4' />
                      <span className='text-sm'>Upload Images</span>
                    </div>
                  </label>
                  <span className='text-xs text-gray-500'>Max 5 images</span>
                </div>

                {/* Image Previews */}
                {reviewForm.images.length > 0 && (
                  <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                    {reviewForm.images.map((image, index) => (
                      <div key={index} className='relative group'>
                        <img
                          src={image}
                          alt={`Review ${index + 1}`}
                          className='w-full h-20 object-cover rounded-lg border'
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <X className='w-3 h-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex items-center gap-3 pt-4'>
              <button
                type='submit'
                disabled={
                  reviewLoading ||
                  reviewForm.rating === 0 ||
                  !reviewForm.comment.trim()
                }
                className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {reviewLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : null}
                {reviewLoading ? 'Adding Review...' : 'Add Review'}
              </button>
              <button
                type='button'
                onClick={resetReviewForm}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
