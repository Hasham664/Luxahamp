'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import api from '@/lib/api';

export default function BoxesList() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBoxes, setFilteredBoxes] = useState([]);

  useEffect(() => {
    fetchBoxes();
  }, []);

  useEffect(() => {
    const filtered = boxes.filter(
      (box) =>
        box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBoxes(filtered);
  }, [boxes, searchTerm]);

  const fetchBoxes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products?type=box');
      const data = response.data.items || response.data || [];
      setBoxes(data);
    } catch (error) {
      console.error('Error fetching boxes:', error);
      alert('Failed to fetch boxes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (boxId) => {
    if (!window.confirm('Are you sure you want to delete this box?')) {
      return;
    }

    try {
      await api.delete(`/products/${boxId}`);
      setBoxes(boxes.filter((b) => b._id !== boxId));
      alert('Box deleted successfully!');
    } catch (error) {
      console.error('Error deleting box:', error);
      alert('Failed to delete box');
    }
  };

  const getVariantSummary = (variants) => {
    if (!variants || variants.length === 0) return 'No variants';

    const prices = variants.map((v) => v.price).filter((p) => p > 0);
    if (prices.length === 0) return `${variants.length} variant(s)`;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `${variants.length} variant(s) - $${minPrice.toFixed(2)}`;
    }

    return `${variants.length} variant(s) - $${minPrice.toFixed(
      2
    )} - $${maxPrice.toFixed(2)}`;
  };

  const getDimensions = (variants) => {
    if (!variants || variants.length === 0) return 'No dimensions';

    const firstVariant = variants[0];
    const dims = firstVariant.boxDetails?.dimensions;

    if (!dims || (!dims.width && !dims.height && !dims.depth)) {
      return 'Not specified';
    }

    return `${dims.width || 0} × ${dims.height || 0} × ${dims.depth || 0} cm`;
  };

  const getTotalStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce(
      (total, variant) => total + (variant.stock_count || 0),
      0
    );
  };

  return (
    <div className='max-w-7xl mx-auto pt-12'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Boxes</h1>
          <p className='text-gray-600 mt-1'>Manage your box products</p>
        </div>
        <Link
          href='/createBox'
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        >
          <Plus className='w-4 h-4' />
          Add Box
        </Link>
      </div>

      {/* Search */}
      <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
        <div className='relative'>
          <Search className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search boxes by name or description...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Boxes List */}
      <div className='bg-white rounded-lg shadow-sm'>
        {loading ? (
          <div className='p-12 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='text-gray-600 mt-2'>Loading boxes...</p>
          </div>
        ) : filteredBoxes.length === 0 ? (
          <div className='p-12 text-center'>
            <Package className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {boxes.length === 0 ? 'No boxes found' : 'No matching boxes'}
            </h3>
            <p className='text-gray-600 mb-6'>
              {boxes.length === 0
                ? 'Get started by creating your first box'
                : 'Try adjusting your search terms'}
            </p>
            {boxes.length === 0 && (
              <Link
                href='/createBox'
                className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Create Box
              </Link>
            )}
          </div>
        ) : (
          <div className='overflow-y-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Box
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Variants & Pricing
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Dimensions
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Capacity
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Stock
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredBoxes.map((box) => (
                  <tr key={box._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <div className='h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center'>
                            <Package className='h-5 w-5 text-blue-600' />
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {box.name}
                          </div>
                          {box.description && (
                            <div className='text-sm text-gray-500 max-w-xs truncate'>
                              {box.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {getVariantSummary(box.variants)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {getDimensions(box.variants)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {box.variants?.[0]?.boxDetails?.max_capacity || 0} items
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {getTotalStock(box.variants)} units
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/boxes/${box._id}`}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          <Edit className='w-4 h-4' />
                        </Link>
                        <button
                          onClick={() => handleDelete(box._id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
