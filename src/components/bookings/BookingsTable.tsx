import { FiEdit2, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FiCalendar } from 'react-icons/fi';
import { BookingStatusBadge } from './BookingStatusBadge';
import { formatDateTime } from '../../lib/utils';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  scheduled_at: string;
  luggage_count: number;
  passenger_count: number;
  trip_type: 'per_ride' | 'hourly';
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  payment_status?: 'pending' | 'validated' | 'paid' | 'failed';
  base_amount?: number;
  service_fee?: number;
  paid_at?: string;
  created_at: string;
}

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  error: any;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking, type: 'soft' | 'hard') => void;
  onChargeCustomer?: (booking: Booking) => void;
}

export function BookingsTable({ 
  bookings, 
  isLoading, 
  error, 
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onChargeCustomer
}: BookingsTableProps) {
  const canCharge = (booking: Booking) => {
    return booking.status === 'completed' && 
           (booking.payment_status === 'validated' || booking.payment_status === 'pending');
  };

  const formatAmount = (amountCents?: number) => {
    if (!amountCents) return 'N/A';
    return `$${(amountCents / 100).toFixed(2)}`;
  };

  const formatAmountBreakdown = (booking: Booking) => {
    const baseAmount = booking.base_amount || 0;
    const serviceFee = booking.service_fee || 0;
    const total = baseAmount + serviceFee;
    
    if (total === 0) return 'N/A';
    
    return (
      <div>
        <div className="font-medium">${(total / 100).toFixed(2)}</div>
        {(baseAmount > 0 || serviceFee > 0) && (
          <div className="text-xs text-gray-500">
            Base: ${(baseAmount / 100).toFixed(2)} + Fee: ${(serviceFee / 100).toFixed(2)}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="animate-pulse p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          Error loading bookings: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trip Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheduled
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Passengers
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                    <div className="text-xs text-gray-400">{booking.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    <div className="font-medium">{booking.pickup}</div>
                    <div className="text-gray-500">↓ {booking.dropoff}</div>
                    <div className="text-xs text-gray-400 capitalize mt-1">
                      {booking.trip_type.replace('_', ' ')} • {booking.luggage_count} bags
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDateTime(booking.scheduled_at)}
                  </div>
                </td>
                <div className="flex items-center gap-2 flex-wrap">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.payment_status === 'validated' ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Validated
                      </span>
                      <div className="text-xs text-blue-600 font-medium">
                        💳 Card Ready to Charge
                      </div>
                    </div>
                  ) : booking.payment_status === 'paid' ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Paid
                      </span>
                      {booking.paid_at && (
                        <div className="text-xs text-gray-500">
                          {formatDateTime(booking.paid_at)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      {booking.payment_status || 'Pending'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatAmountBreakdown(booking)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.passenger_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-1 flex-wrap gap-1">
                    {canCharge(booking) && onChargeCustomer && (
                      <button
                        onClick={() => onChargeCustomer(booking)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                      >
                        💳 Charge
                      </button>
                    )}
                    {booking.payment_status === 'paid' && (
                      <span className="inline-flex items-center px-3 py-1.5 text-xs text-green-600 font-medium bg-green-50 rounded-md">
                        ✅ Paid
                      </span>
                    )}
                    <button
                      onClick={() => onEdit(booking)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                      title="Edit booking"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(booking, 'soft')}
                      className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50 transition-colors"
                      title="Hide booking"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(booking, 'hard')}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete permanently"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{booking.name}</h3>
                <p className="text-sm text-gray-600">{booking.email}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{booking.pickup}</div>
                <div className="text-gray-500">↓ {booking.dropoff}</div>
              </div>
              <div className="flex items-center gap-2">
                <BookingStatusBadge status={booking.status} />
                <BookingStatusBadge 
                  status={booking.payment_status || 'pending'} 
                  type="payment"
                />
              </div>
              {booking.payment_status === 'validated' && (
                <div className="text-xs text-blue-600 font-medium">
                  💳 Card Validated - Ready to Charge After Completion
                </div>
              )}
              <div className="text-xs text-gray-500">
                {formatDateTime(booking.scheduled_at)} • {booking.passenger_count} passengers • {booking.luggage_count} bags
                  {booking.payment_status === 'validated' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      💳 Validated
                    </span>
                  )}
                  {booking.payment_status === 'paid' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      ✅ Paid
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-1 flex-wrap gap-1">
              {canCharge(booking) && onChargeCustomer && (
                <button
                  onClick={() => onChargeCustomer(booking)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  💳 Charge Customer
                </button>
              )}
              {booking.payment_status === 'paid' && (
                <span className="inline-flex items-center px-3 py-2 text-sm text-green-600 font-medium bg-green-50 rounded-lg">
                  ✅ Paid
                </span>
              )}
              <button
                onClick={() => onEdit(booking)}
                className="text-purple-600 hover:text-purple-900 p-2 rounded hover:bg-purple-50 transition-colors"
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(booking, 'soft')}
                className="text-amber-600 hover:text-amber-900 p-2 rounded hover:bg-amber-50 transition-colors"
              >
                <FiEye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(booking, 'hard')}
                className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <FiCalendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="px-3 py-1 text-sm">
                {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}