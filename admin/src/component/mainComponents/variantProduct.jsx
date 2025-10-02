'use client';
import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

export default function VariantManager({ variants, onChange, type = 'product', setForm  }) {
  const addVariant = () => {
    const newVariant = {
      name: '',
      color: [],
      price: 0,
      stock_count: 0,
      stock_unit: type === 'box' ? 'pcs' : 'ml',
      discount_type: null,
      tags: null,
      low_stock_threshold: 10,
      discount_value: 0,
      taxIncluded: true,
      taxPercent: 0,
      sku: '',
      images: [],
    };

    // Add box-specific fields if type is box
    if (type === 'box') {
      newVariant.boxDetails = {
        dimensions: { height: 0, width: 0, depth: 0 },
        max_capacity: 1,
      };
    }

    onChange([...variants, newVariant]);
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = variants.map((variant, i) => {
      if (i === index) {
        if (field.includes('.')) {
          // Handle nested fields like boxDetails.max_capacity
          const [parent, child, grandchild] = field.split('.');
          if (grandchild) {
            return {
              ...variant,
              [parent]: {
                ...variant[parent],
                [child]: {
                  ...variant[parent][child],
                  [grandchild]: value,
                },
              },
            };
          }
          return {
            ...variant,
            [parent]: {
              ...variant[parent],
              [child]: value,
            },
          };
        }
        return { ...variant, [field]: value };
      }
      return variant;
    });
    onChange(updatedVariants);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      alert('At least one variant is required');
      return;
    }
    onChange(variants.filter((_, i) => i !== index));
  };

  // Keep temporary string input for colors
  const handleColorChange = (index, value) => {
    updateVariant(index, 'colorInput', value); // store as temp string
  };

  // When user presses Enter or leaves input, convert to array
  const handleColorBlur = (index, value) => {
    const colors = value
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    updateVariant(index, 'color', colors);
    updateVariant(index, 'colorInput', colors.join(', ')); // reset clean
  };
  const handleImageUpload = (index, files) => {
    const newFiles = Array.from(files);
    const updatedImages = [...(variants[index].images || []), ...newFiles];
    updateVariant(index, 'images', updatedImages);
  };

  const handleRemoveImage = (variantIndex, imgIndex) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex].images = updatedVariants[
        variantIndex
      ].images.filter((_, i) => i !== imgIndex);
      return { ...prev, variants: updatedVariants };
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>Variants</h3>
        <button
          type='button'
          onClick={addVariant}
          className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
        >
          <Plus className='w-4 h-4' />
          Add Variant
        </button>
      </div>

      {variants.map((variant, index) => (
        <div
          key={index}
          className='bg-white border border-gray-200 rounded-lg p-6'
        >
          <div className='flex items-center justify-between mb-4'>
            <h4 className='text-md font-medium text-gray-900'>
              Variant {index + 1}
            </h4>
            {variants.length > 1 && (
              <button
                type='button'
                onClick={() => removeVariant(index)}
                className='text-red-600 hover:text-red-800'
              >
                <Trash2 className='w-5 h-5' />
              </button>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* Basic Fields */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Variant Name *
              </label>
              <input
                type='text'
                value={variant.name || ''}
                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='e.g. 5ml, 10ml, Small Box'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Colors (comma separated)
              </label>
              <input
                type='text'
                value={
                  variant.colorInput ??
                  (Array.isArray(variant.color) ? variant.color.join(', ') : '')
                }
                onChange={(e) => handleColorChange(index, e.target.value)}
                onBlur={(e) => handleColorBlur(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleColorBlur(index, e.target.value);
                  }
                }}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Red, Blue, Green'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Price *
              </label>
              <input
                type='number'
                step='0.01'
                value={variant.price || 0}
                onChange={(e) =>
                  updateVariant(index, 'price', parseFloat(e.target.value) || 0)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Stock Count
              </label>
              <input
                type='number'
                value={variant.stock_count || 0}
                onChange={(e) =>
                  updateVariant(
                    index,
                    'stock_count',
                    parseInt(e.target.value) || 0
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Stock Unit
              </label>
              <input
                type='text'
                value={variant.stock_unit || ''}
                onChange={(e) =>
                  updateVariant(index, 'stock_unit', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='ml, pcs, units'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                SKU
              </label>
              <input
                type='text'
                value={variant.sku || ''}
                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Discount Type
              </label>
              <select
                value={variant.discount_type || ''}
                onChange={(e) =>
                  updateVariant(index, 'discount_type', e.target.value || '')
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>No Discount</option>
                <option value='percent'>Percentage</option>
                <option value='fixed'>Fixed Amount</option>
                <option value='sale'>Sale Price</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Discount Value
              </label>
              <input
                type='number'
                step='0.01'
                value={variant.discount_value || 0}
                onChange={(e) =>
                  updateVariant(
                    index,
                    'discount_value',
                    parseFloat(e.target.value) || 0
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tags
              </label>
              <select
                value={variant.tags || ''}
                onChange={(e) =>
                  updateVariant(index, 'tags', e.target.value || '')
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>No Tag</option>
                <option value='New'>New</option>
                <option value='Hot'>Hot</option>
                <option value='Sale'>Sale</option>
                <option value='Bestseller'>Bestseller</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Low Stock Threshold
              </label>
              <input
                type='number'
                value={variant.low_stock_threshold || 10}
                onChange={(e) =>
                  updateVariant(
                    index,
                    'low_stock_threshold',
                    parseInt(e.target.value) || 10
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tax Percentage
              </label>
              <input
                type='number'
                step='0.01'
                value={variant.taxPercent || 0}
                onChange={(e) =>
                  updateVariant(
                    index,
                    'taxPercent',
                    parseFloat(e.target.value) || 0
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                id={`taxIncluded-${index}`}
                checked={variant.taxIncluded || false}
                onChange={(e) =>
                  updateVariant(index, 'taxIncluded', e.target.checked)
                }
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label
                htmlFor={`taxIncluded-${index}`}
                className='ml-2 block text-sm text-gray-900'
              >
                Tax Included
              </label>
            </div>
          </div>

          {/* Box-specific fields */}
          {type === 'box' && (
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <h5 className='text-sm font-medium text-gray-900 mb-3'>
                Box Details
              </h5>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Width (cm)
                  </label>
                  <input
                    type='number'
                    value={variant.boxDetails?.dimensions?.width || 0}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        'boxDetails.dimensions.width',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Height (cm)
                  </label>
                  <input
                    type='number'
                    value={variant.boxDetails?.dimensions?.height || 0}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        'boxDetails.dimensions.height',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Depth (cm)
                  </label>
                  <input
                    type='number'
                    value={variant.boxDetails?.dimensions?.depth || 0}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        'boxDetails.dimensions.depth',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Max Capacity
                  </label>
                  <input
                    type='number'
                    value={variant.boxDetails?.max_capacity || 1}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        'boxDetails.max_capacity',
                        parseInt(e.target.value) || 1
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Images */}
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Variant Images
            </label>
            <div className='flex items-center gap-3'>
              <input
                type='file'
                multiple
                accept='image/*'
                onChange={(e) => handleImageUpload(index, e.target.files)}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <Upload className='w-5 h-5 text-gray-400' />
            </div>

            {/* ✅ Preview section */}
            {variant.images && variant.images.length > 0 && (
              <div className='mt-3 grid grid-cols-4 gap-5'>
                {variant.images.map((img, imgIndex) => (
                  <div key={imgIndex} className='relative'>
                    <img
                      src={img instanceof File ? URL.createObjectURL(img) : img}
                      alt='Variant'
                      className=' object-cover rounded-md border'
                    />
                    {/* Remove button */}
                    <button
                      type='button'
                      onClick={() => handleRemoveImage(index, imgIndex)}
                      className='absolute top-0 -right-2 bg-red-600 text-white text-xs px-1 rounded'
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}