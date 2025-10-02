'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Package2, Eye, Search, LogIn } from 'lucide-react';
import api from '@/lib/api';

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.keyWords?.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products?type=product');
      const data = response.data.items || response.data || [];
      console.log(data, 'data');

      setProducts(data);
      console.log(products, 'products');
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
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
          <h1 className='text-2xl font-bold text-gray-900'>Products</h1>
          <p className='text-gray-600 mt-1'>Manage your product catalog</p>
        </div>
        <Link
          href='/products'
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        >
          <Plus className='w-4 h-4' />
          Add Product
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
            placeholder='Search products by name, description, or keywords...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Products List */}
      <div className='bg-white rounded-lg shadow-sm'>
        {loading ? (
          <div className='p-12 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='text-gray-600 mt-2'>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='p-12 text-center'>
            <Package2 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {products.length === 0
                ? 'No products found'
                : 'No matching products'}
            </h3>
            <p className='text-gray-600 mb-6'>
              {products.length === 0
                ? 'Get started by creating your first product'
                : 'Try adjusting your search terms'}
            </p>
            {products.length === 0 && (
              <Link
                href='/admin/products/new'
                className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Create Product
              </Link>
            )}
          </div>
        ) : (
          <div className='overflow-y-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Variants & Pricing
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Stock
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Categories
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <div className='h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center'>
                            <Package2 className='h-5 w-5 text-blue-600' />
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {product.name}
                          </div>
                          {product.description && (
                            <div className='text-sm text-gray-500 max-w-xs truncate'>
                              {product.description}
                            </div>
                          )}
                          {product.keyWords && (
                            <div className='flex gap-1 mt-1'>
                              <span className='inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded'>
                                {product.keyWords}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {getVariantSummary(product.variants)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {getTotalStock(product.variants)} units
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {product.categories && product.categories.length > 0 ? (
                        <div className='flex gap-1'>
                          {product.categories.slice(0, 2).map((category) => (
                            <span
                              key={
                                typeof category === 'string'
                                  ? category
                                  : category._id
                              }
                              className='inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'
                            >
                              {typeof category === 'string'
                                ? category
                                : category.name}
                            </span>
                          ))}
                          {product.categories.length > 2 && (
                            <span className='text-xs text-gray-500'>
                              +{product.categories.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className='text-sm text-gray-400'>
                          No categories
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/products/${product._id}`}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          <Edit className='w-4 h-4' />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
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
