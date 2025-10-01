import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { FiX, FiSave } from 'react-icons/fi';
import { BookingStatusBadge } from './BookingStatusBadge';

interface BookingModalProps {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ booking, onClose, onSuccess }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: booking.name || '',
    email: booking.email || '',
    phone: booking.phone || '',
    pickup: booking.pickup || '',
    dropoff: booking.dropoff || '',
    scheduled_at: booking.scheduled_at ? new Date(booking.scheduled_at).toISOString().slice(0, 16) : '',
    luggage_count: booking.luggage_count || 0,
    passenger_count: booking.passenger_count || 1,
    trip_type: booking.trip_type || 'per_ride',
    status: booking.status || 'pending',
    base_amount: booking.base_amount ? (booking.base_amount / 100).toFixed(2) : '',
    service_fee: booking.service_fee ? (booking.service_fee / 100).toFixed(2) : '',
  });

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateBooking(booking.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onSuccess();
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.updateBookingStatus(booking.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert scheduled_at to ISO string
    const submitData = {
      ...formData,
      scheduled_at: new Date(formData.scheduled_at).toISOString(),
      luggage_count: Number(formData.luggage_count),
      passenger_count: Number(formData.passenger_count),
      base_amount: formData.base_amount ? Math.round(parseFloat(formData.base_amount) * 100) : 0,
      service_fee: formData.service_fee ? Math.round(parseFloat(formData.service_fee) * 100) : 0,
    };

    updateMutation.mutate(submitData);
  };

  const handleStatusChange = (status: string) => {
    statusMutation.mutate(status);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isWithinTimeRestriction = () => {
    const scheduledTime = new Date(booking.scheduled_at);
    const now = new Date();
    const timeDiff = scheduledTime.getTime() - now.getTime();
    const hoursUntilRide = timeDiff / (1000 * 60 * 60);
    return hoursUntilRide <= 1; // Within 1 hour restriction for admin
  };

  const timeRestricted = isWithinTimeRestriction();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {timeRestricted && (
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <div className="flex">
              <div className="text-amber-600 text-sm">
                <strong>Time Restriction:</strong> Full updates are not allowed within 1 hour of the scheduled ride. 
                You can still change the status using the quick actions below.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quick Status Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking Status
            </label>
            <div className="space-y-3">
              {/* Payment Status Warning */}
              {booking.payment_status !== 'validated' && formData.status === 'approved' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="text-amber-600 text-sm">
                      <strong>⚠️ Payment Not Validated:</strong> Cannot approve booking without validated payment method. Customer needs to complete card validation first.
                    </div>
                  </div>
                </div>
              )}
              
              {/* Current Payment Status Display */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-700 mb-2">Payment Status:</div>
                {booking.payment_status === 'validated' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    💳 Card Validated - Ready for Approval
                  </span>
                ) : booking.payment_status === 'paid' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✅ Payment Complete
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    ⏳ Payment Validation Pending
                  </span>
                )}
              </div>
              
              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-2">
                {['pending', 'approved', 'completed', 'cancelled'].map((status) => {
                  const canApprove = status !== 'approved' || booking.payment_status === 'validated';
                  return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  disabled={statusMutation.isPending || !canApprove}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                    booking.status === status
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : canApprove
                        ? 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                  } ${!canApprove ? 'opacity-50' : ''}`}
                  title={!canApprove ? 'Payment must be validated before approval' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={timeRestricted}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={timeRestricted}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={timeRestricted}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Time
              </label>
              <input
                type="datetime-local"
                id="scheduled_at"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                disabled={timeRestricted}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                id="pickup"
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                disabled={timeRestricted}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">
                Dropoff Location
              </label>
              <input
                type="text"
                id="dropoff"
                name="dropoff"
                value={formData.dropoff}
                onChange={handleChange}
                disabled={timeRestricted}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="passenger_count" className="block text-sm font-medium text-gray-700 mb-1">
                Passengers
              </label>
              <input
                type="number"
                id="passenger_count"
                name="passenger_count"
                min="1"
                max="8"
                value={formData.passenger_count}
                onChange={handleChange}
                disabled={timeRestricted}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="luggage_count" className="block text-sm font-medium text-gray-700 mb-1">
                Luggage
              </label>
              <input
                type="number"
                id="luggage_count"
                name="luggage_count"
                min="0"
                max="20"
                value={formData.luggage_count}
                onChange={handleChange}
                disabled={timeRestricted}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="trip_type" className="block text-sm font-medium text-gray-700 mb-1">
                Trip Type
              </label>
              <select
                id="trip_type"
                name="trip_type"
                value={formData.trip_type}
                onChange={handleChange}
                disabled={timeRestricted}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="per_ride">Per Ride</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="base_amount" className="block text-sm font-medium text-gray-700 mb-1">
                Base Amount ($)
              </label>
              <input
                type="number"
                id="base_amount"
                name="base_amount"
                min="0"
                step="0.01"
                value={formData.base_amount || ''}
                onChange={handleChange}
                disabled={timeRestricted}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="service_fee" className="block text-sm font-medium text-gray-700 mb-1">
                Service Fee ($)
              </label>
              <input
                type="number"
                id="service_fee"
                name="service_fee"
                min="0"
                step="0.01"
                value={formData.service_fee || ''}
                onChange={handleChange}
                disabled={timeRestricted}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Total Amount Display */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">Total Amount:</span>
              <span className="text-lg font-bold text-blue-900">
                ${((parseFloat(formData.base_amount) || 0) + (parseFloat(formData.service_fee) || 0)).toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Base: ${(parseFloat(formData.base_amount) || 0).toFixed(2)} + Service Fee: ${(parseFloat(formData.service_fee) || 0).toFixed(2)}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending || timeRestricted}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSave className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}