import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { notificationStore } from '../../lib/notificationStore';

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className = '' }: NotificationBadgeProps) {
  const [, forceUpdate] = useState({});

  const { data: bookingsData } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: () => api.getBookings({ page: 1, page_size: 50, status: 'pending' }),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Subscribe to notification store changes
  useEffect(() => {
    return notificationStore.subscribe(() => {
      forceUpdate({});
    });
  }, []);

  const notifications = notificationStore.createNotificationsFromBookings(bookingsData?.bookings || []);
  const unreadCount = notificationStore.getUnreadCount(notifications);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full ${className}`}>
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}