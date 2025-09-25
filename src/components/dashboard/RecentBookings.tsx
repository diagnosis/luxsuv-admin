import { Link } from '@tanstack/react-router';
import { BookingStatusBadge } from '../bookings/BookingStatusBadge';
import { formatDateTime } from '../../lib/utils';

interface Booking {
  id: string;
  name: string;
  email: string;
  pickup: string;
  dropoff: string;
  scheduled_at: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  created_at: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          <Link
            to="/bookings"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {bookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No bookings found
          </div>
        ) : (
          bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {booking.name}
                    </p>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {booking.pickup} → {booking.dropoff}
                  </p>
                  <p className="text-xs text-gray-500">
                    Scheduled: {formatDateTime(booking.scheduled_at)}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Link
                    to="/bookings"
                    search={{ q: booking.email }}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}