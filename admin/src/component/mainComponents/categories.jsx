'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Save, X, Image } from 'lucide-react';
import api from '@/lib/api';

export default function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    mainTitle: 'SHOP BY RECIPIENT',
    name: '',
    slug: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      const data = res.data.categories || res.data;
      console.log('🏷️ Fetched categories:', data);
      setCategories(data);
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      mainTitle: 'SHOP BY RECIPIENT',
      name: '',
      slug: '',
    });
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('mainTitle', form.mainTitle);
      formData.append('name', form.name);
      if (form.slug) formData.append('slug', form.slug);
      if (imageFile) formData.append('image', imageFile);

      console.log('📤 Submitting category data:', {
        mainTitle: form.mainTitle,
        name: form.name,
        slug: form.slug,
        hasImage: !!imageFile,
      });

      if (editing) {
        const result = await api.put(`/categories/${editing._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('✅ Category updated:', result.data);
        alert('Category updated successfully!');
      } else {
        const result = await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('✅ Category created:', result.data);
        alert('Category created successfully!');
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('❌ Error saving category:', err);
      alert(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditing(category);
    setForm({
      mainTitle: category.mainTitle || 'SHOP BY RECIPIENT',
      name: category.name || '',
      slug: category.slug || '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      await api.delete(`/categories/${id}`);
      console.log('🗑️ Category deleted:', id);
      alert('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      console.error('❌ Error deleting category:', err);
      alert('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const mainTitleOptions = [
    'SHOP BY RECIPIENT',
    'SHOP BY OCCASION',
    'SHOP BY INTEREST',
    'BY PRICE',
  ];

  const getMainTitleColor = (mainTitle) => {
    const colors = {
      'SHOP BY RECIPIENT': 'bg-blue-100 text-blue-700',
      'SHOP BY OCCASION': 'bg-green-100 text-green-700',
      'SHOP BY INTEREST': 'bg-purple-100 text-purple-700',
      'BY PRICE': 'bg-orange-100 text-orange-700',
    };
    return colors[mainTitle] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-green-100 p-3 rounded-lg'>
                <Tag className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Category Management
                </h1>
                <p className='text-gray-600'>
                  Organize your products with categories
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
            >
              <Plus className='w-4 h-4' />
              Add New Category
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-xl shadow-xl max-w-md w-full'>
              <div className='p-6 border-b'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-semibold'>
                    {editing ? 'Edit Category' : 'Create New Category'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <X className='w-6 h-6' />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className='p-6'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Main Title *
                    </label>
                    <select
                      value={form.mainTitle}
                      onChange={(e) =>
                        setForm({ ...form, mainTitle: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      required
                    >
                      {mainTitleOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Category Name *
                    </label>
                    <input
                      type='text'
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      placeholder='e.g., Men, Women, Birthday...'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Slug (optional)
                    </label>
                    <input
                      type='text'
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      placeholder='auto-generated if empty'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Category Image
                    </label>
                    <div className='flex items-center gap-3'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                        className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      />
                      <div className='bg-gray-100 p-2 rounded-lg'>
                        <Image className='w-5 h-5 text-gray-600' />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex gap-3 mt-6'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex-1'
                  >
                    <Save className='w-4 h-4' />
                    {loading
                      ? 'Saving...'
                      : editing
                      ? 'Update Category'
                      : 'Create Category'}
                  </button>
                  <button
                    type='button'
                    onClick={resetForm}
                    className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className='bg-white rounded-xl shadow-sm'>
          <div className='p-6 border-b'>
            <h2 className='text-lg font-semibold text-gray-900'>
              All Categories
            </h2>
          </div>

          {loading ? (
            <div className='p-6 text-center'>Loading...</div>
          ) : (
            <div className='divide-y divide-gray-200'>
              {categories.length === 0 ? (
                <div className='p-6 text-center text-gray-500'>
                  No categories found
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category._id}
                    className='p-6 flex items-center justify-between hover:bg-gray-50'
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-green-100 p-2 rounded-lg'>
                          <Tag className='w-5 h-5 text-green-600' />
                        </div>
                        <div>
                          <h3 className='font-medium text-gray-900'>
                            {category.name}
                          </h3>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getMainTitleColor(
                              category.mainTitle
                            )}`}
                          >
                            {category.mainTitle}
                          </span>
                          {category.slug && (
                            <p className='text-sm text-gray-500 mt-1'>
                              /{category.slug}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleEdit(category)}
                        className='flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors'
                      >
                        <Edit className='w-4 h-4' />
                        Edit
                      </button>
                      {/* <button
                        onClick={() => handleDelete(category._id)}
                        className='flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
                      >
                        <Trash2 className='w-4 h-4' />
                        Delete
                      </button> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
