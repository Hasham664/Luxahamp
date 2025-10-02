'use client';
import { useState, useEffect } from 'react';
import {
  Star,
  Loader2,
  Eye,
  Check,
  X,
  Trash2,
  Filter,
  Calendar,
  User,
  Package,
  AlertCircle,
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = filterStatus === 'all' ? {} : { status: filterStatus };
      const { data } = await api.get('/review/all', { params });
      console.log(data,'data');
      
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      alert('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, status) => {
    setActionLoading(reviewId);
    try {
      await api.put(`/review/${reviewId}/status`, { status });
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, status } : r))
      );
      alert(`Review ${status} successfully`);
    } catch (err) {
      console.error('Error updating review status:', err);
      alert('Failed to update review status');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setActionLoading(reviewId);
    try {
      await api.delete(`/review/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setSelectedReview(null);
      alert('Review deleted successfully');
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (s) =>
    s === 'approved'
      ? 'bg-green-100 text-green-800'
      : s === 'rejected'
      ? 'bg-red-100 text-red-800'
      : s === 'pending'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800';

  const getStatusIcon = (s) =>
    s === 'approved' ? (
      <Check className='w-4 h-4' />
    ) : s === 'rejected' ? (
      <X className='w-4 h-4' />
    ) : s === 'pending' ? (
      <AlertCircle className='w-4 h-4' />
    ) : null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const renderStars = (rating) => (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
      <span className='ml-1 text-sm text-gray-600'>({rating}/5)</span>
    </div>
  );

  // ---------- JSX ----------
  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Review Management</h1>
        <p className='text-gray-600 mt-1'>
          Manage and moderate product reviews
        </p>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Filter className='w-4 h-4 text-gray-500' />
            <span className='text-sm font-medium text-gray-700'>
              Filter by status:
            </span>
          </div>
          <div className='flex gap-2'>
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <div className='ml-auto'>
            <button
              onClick={fetchReviews}
              disabled={loading}
              className='flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
            >
              {loading && <Loader2 className='w-3 h-3 animate-spin' />}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className='bg-white rounded-lg shadow-sm'>
        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='w-6 h-6 animate-spin text-blue-600' />
            <span className='ml-2 text-gray-600'>Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No reviews found</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {reviews.map((review) => (
              <div key={review._id} className='p-6 hover:bg-gray-50'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    {/* Header */}
                    <div className='flex items-center gap-4 mb-3'>
                      <div className='flex items-center gap-2'>
                        <User className='w-4 h-4 text-gray-400' />
                        <span className='text-sm font-medium text-gray-900'>
                          {review.user?.name || 'Anonymous'}
                        </span>
                        {review.isAdminReview && (
                          <span className='px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full'>
                            Admin
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <Package className='w-4 h-4 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          {review.product?.name || 'Product'}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-gray-400' />
                        <span className='text-sm text-gray-500'>
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Rating & Status */}
                    <div className='flex items-center gap-4 mb-3'>
                      {renderStars(review.rating)}
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          review.status
                        )}`}
                      >
                        {getStatusIcon(review.status)}
                        {review.status.charAt(0).toUpperCase() +
                          review.status.slice(1)}
                      </div>
                    </div>

                    <p className='text-gray-700 mb-3 line-clamp-3'>
                      {review.comment}
                    </p>

                    {review.images?.length > 0 && (
                      <div className='flex gap-2 mb-3'>
                        {review.images.slice(0, 3).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`Review ${i + 1}`}
                            className='w-16 h-16 object-cover rounded-lg border'
                          />
                        ))}
                        {review.images.length > 3 && (
                          <div className='w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center text-xs text-gray-500'>
                            +{review.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2 ml-4'>
                    <button
                      onClick={() => setSelectedReview(review)}
                      className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg'
                      title='View Details'
                    >
                      <Eye className='w-4 h-4' />
                    </button>

                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() =>
                            updateReviewStatus(review._id, 'approved')
                          }
                          disabled={actionLoading === review._id}
                          className='p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-50'
                          title='Approve'
                        >
                          {actionLoading === review._id ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                          ) : (
                            <Check className='w-4 h-4' />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            updateReviewStatus(review._id, 'rejected')
                          }
                          disabled={actionLoading === review._id}
                          className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50'
                          title='Reject'
                        >
                          {actionLoading === review._id ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                          ) : (
                            <X className='w-4 h-4' />
                          )}
                        </button>
                      </>
                    )}

                    {review.status !== 'pending' && (
                      <button
                        onClick={() =>
                          updateReviewStatus(review._id, 'pending')
                        }
                        disabled={actionLoading === review._id}
                        className='p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg disabled:opacity-50'
                        title='Mark as Pending'
                      >
                        {actionLoading === review._id ? (
                          <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                          <AlertCircle className='w-4 h-4' />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => deleteReview(review._id)}
                      disabled={actionLoading === review._id}
                      className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50'
                      title='Delete'
                    >
                      {actionLoading === review._id ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Trash2 className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Review Details
                </h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className='p-2 text-gray-400 hover:text-gray-600 rounded-lg'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {selectedReview.user?.name || 'Anonymous'}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {selectedReview.user?.email}
                    </p>
                  </div>
                  {selectedReview.isAdminReview && (
                    <span className='px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full'>
                      Admin Review
                    </span>
                  )}
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-700 mb-1'>
                    Product
                  </p>
                  <p className='text-gray-900'>
                    {selectedReview.product?.name}
                  </p>
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-700 mb-2'>
                    Rating
                  </p>
                  {renderStars(selectedReview.rating)}
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-700 mb-1'>
                    Status
                  </p>
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedReview.status
                    )}`}
                  >
                    {getStatusIcon(selectedReview.status)}
                    {selectedReview.status.charAt(0).toUpperCase() +
                      selectedReview.status.slice(1)}
                  </div>
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-700 mb-2'>
                    Comment
                  </p>
                  <p className='text-gray-900 whitespace-pre-wrap'>
                    {selectedReview.comment}
                  </p>
                </div>

                {selectedReview.images?.length > 0 && (
                  <div>
                    <p className='text-sm font-medium text-gray-700 mb-2'>
                      Images
                    </p>
                    <div className='grid grid-cols-3 gap-3'>
                      {selectedReview.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Review ${i + 1}`}
                          className='w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80'
                          onClick={() => window.open(img, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className='text-sm font-medium text-gray-700 mb-1'>
                    Created
                  </p>
                  <p className='text-sm text-gray-500'>
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-end gap-3 mt-6 pt-4 border-t'>
                {selectedReview.status === 'pending' && (
                  <>
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview._id, 'approved')
                      }
                      disabled={actionLoading === selectedReview._id}
                      className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50'
                    >
                      {actionLoading === selectedReview._id ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Check className='w-4 h-4' />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview._id, 'rejected')
                      }
                      disabled={actionLoading === selectedReview._id}
                      className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50'
                    >
                      {actionLoading === selectedReview._id ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <X className='w-4 h-4' />
                      )}
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteReview(selectedReview._id)}
                  disabled={actionLoading === selectedReview._id}
                  className='flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50'
                >
                  {actionLoading === selectedReview._id ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Trash2 className='w-4 h-4' />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
