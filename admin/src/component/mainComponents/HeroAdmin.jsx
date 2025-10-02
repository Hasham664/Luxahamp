'use client';
import api from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { XCircle, Loader2 } from 'lucide-react';

export default function HeroAdmin() {
  const [heroes, setHeroes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    button: '',
    images: [], // new files
    existingImages: [], // already on server
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/heroes');
      setHeroes(res.data);
    } catch {
      setError('Failed to fetch heroes');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add new local files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviewUrls((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeNewImage = (idx) => {
    setFormData((prev) => {
      const imgs = [...prev.images];
      imgs.splice(idx, 1);
      return { ...prev, images: imgs };
    });
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img !== url),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      button: '',
      images: [],
      existingImages: [],
    });
    setPreviewUrls([]);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('button', formData.button);
    formData.images.forEach((img) => data.append('images', img));
    formData.existingImages.forEach((url) =>
      data.append('existingImages[]', url)
    );

    try {
      let res;
      if (editId) {
        res = await api.put(`/heroes/${editId}`, data);
        setHeroes((prev) => prev.map((h) => (h._id === editId ? res.data : h)));
        setSuccess('Hero updated successfully');
      } else {
        res = await api.post('/heroes', data);
        setHeroes((prev) => [...prev, res.data]);
        setSuccess('Hero created successfully');
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save hero');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hero) => {
    setFormData({
      name: hero.name,
      title: hero.title,
      description: hero.description,
      button: hero.button,
      images: [],
      existingImages: hero.images || [],
    });
    setPreviewUrls([]);
    setEditId(hero._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/heroes/${id}`);
      setHeroes((prev) => prev.filter((h) => h._id !== id));
      setSuccess('Hero deleted successfully');
    } catch {
      setError('Failed to delete hero');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        Hero Component Admin
      </h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white shadow rounded-2xl p-6 mb-8 space-y-4'
      >
        <h2 className='text-xl font-semibold'>
          {editId ? 'Update Hero' : 'Create Hero'}
        </h2>
        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-600'>{success}</p>}

        {['name', 'title', 'description', 'button'].map((field) =>
          field !== 'description' ? (
            <input
              key={field}
              name={field}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleInputChange}
              className='w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500'
              required
            />
          ) : (
            <textarea
              key={field}
              name='description'
              placeholder='Description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500'
              required
            />
          )
        )}

        {/* Existing images with delete */}
        {editId && formData.existingImages.length > 0 && (
          <div className='flex flex-wrap gap-3'>
            {formData.existingImages.map((url, i) => (
              <div key={i} className='relative'>
                <img
                  src={url}
                  alt=''
                  className='w-24 h-24 object-cover rounded-lg shadow'
                />
                <button
                  type='button'
                  onClick={() => removeExistingImage(url)}
                  className='absolute -top-2 -right-2 bg-white rounded-full text-red-600 hover:scale-110 transition'
                >
                  <XCircle size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New file input */}
        <label className='block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition'>
          <span className='text-gray-600'>Click or drag new images here</span>
          <input
            type='file'
            className='hidden'
            multiple
            accept='image/*'
            onChange={handleFileChange}
          />
        </label>

        {previewUrls.length > 0 && (
          <div className='flex flex-wrap gap-3 mt-2'>
            {previewUrls.map((url, idx) => (
              <div key={idx} className='relative'>
                <img
                  src={url}
                  alt='preview'
                  className='w-24 h-24 object-cover rounded-lg shadow'
                />
                <button
                  type='button'
                  onClick={() => removeNewImage(idx)}
                  className='absolute -top-2 -right-2 bg-white rounded-full text-red-600 hover:scale-110 transition'
                >
                  <XCircle size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer flex items-center justify-center'
        >
          {loading ? (
            <Loader2 className='animate-spin' />
          ) : editId ? (
            'Update Hero'
          ) : (
            'Create Hero'
          )}
        </button>
      </form>

      {/* Hero list */}
      {loading && heroes.length === 0 ? (
        <p className='text-center'>Loading…</p>
      ) : (
        <div className=' gap-6'>
          {heroes.map((hero) => (
            <div
              key={hero._id}
              className='bg-white rounded-2xl shadow p-6 flex items-center  justify-between'
            >
              <div>
                <h3 className='text-lg font-bold mb-1'>{hero.name}</h3>
                <p className='text-gray-700'>
                  <strong>Title:</strong> {hero.title}
                </p>
                <p className='text-gray-700'>
                  <strong>Description:</strong> {hero.description}
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Button:</strong> {hero.button}
                </p>
                {hero.images?.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {hero.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className='w-20 h-20 object-cover rounded-lg shadow'
                        alt=''
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className='mt-4 flex gap-2'>
                <button
                  onClick={() => handleEdit(hero)}
                  className='flex-1 bg-yellow-500 text-white py-2 px-10 rounded-lg cursor-pointer hover:bg-yellow-600'
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(hero._id)}
                  className='flex-1 bg-red-500 text-white py-2 px-10 rounded-lg cursor-pointer hover:bg-red-600'
                >
                  Delete
                </button>
              </div>

              {confirmDelete === hero._id && (
                <div className='fixed inset-0  flex items-center justify-center bg-black/50 z-50'>
                  <div className='bg-white pt-9 rounded-xl shadow-xl text-center w-96 h-40'>
                    <p className='mb-4'>Are you sure you want to delete?</p>
                    <div className='flex justify-center gap-4'>
                      <button
                        onClick={() => handleDelete(hero._id)}
                        className='bg-red-500 text-white py-2 px-10 rounded-lg cursor-pointer hover:bg-red-700'
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className='bg-gray-300 py-2 px-8 rounded-lg cursor-pointer hover:bg-gray-400'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
