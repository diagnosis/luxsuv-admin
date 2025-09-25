import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className = '' }: NotificationBadgeProps) {
  const { data: bookingsData } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: () => api.getBookings({ page: 1, page_size: 50, status: 'pending' }),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const recentBookings = bookingsData?.bookings?.filter((booking: any) => {
    const now = new Date();
    const bookingDate = new Date(booking.created_at);
    const hoursDiff = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24; // Count bookings from last 24 hours
  }) || [];

  if (recentBookings.length === 0) {
    return null;
  }

  return (
    <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full ${className}`}>
      {recentBookings.length > 9 ? '9+' : recentBookings.length}
    </span>
  );
}