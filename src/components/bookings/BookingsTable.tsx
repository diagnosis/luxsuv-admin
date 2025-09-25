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
}

export function BookingsTable({ 
  bookings, 
  isLoading, 
  error, 
  pagination,
  onPageChange,
  onEdit,
  onDelete
}: BookingsTableProps) {
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.passenger_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
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
              <BookingStatusBadge status={booking.status} />
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{booking.pickup}</div>
                <div className="text-gray-500">↓ {booking.dropoff}</div>
              </div>
              <div className="text-xs text-gray-500">
                {formatDateTime(booking.scheduled_at)} • {booking.passenger_count} passengers • {booking.luggage_count} bags
              </div>
            </div>

            <div className="flex justify-end space-x-2">
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