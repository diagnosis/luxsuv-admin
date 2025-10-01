import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { api } from '../../lib/api';
import { FiBell, FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi';
import { BookingStatusBadge } from '../bookings/BookingStatusBadge';
import { formatRelativeTime } from '../../lib/utils';
import { notificationStore } from '../../lib/notificationStore';

interface Notification {
  id: string;
  type: 'new_booking' | 'ready_to_charge' | 'status_change';
  bookingId: string;
  booking: any;
  read: boolean;
  created_at: string;
}

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Get recent bookings to create notifications
  const { data: bookingsData } = useQuery({
    queryKey: ['recent-bookings-notifications'],
    queryFn: () => api.getBookings({ page: 1, page_size: 20, status: 'pending' }),
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  // Create notifications from bookings data
  useEffect(() => {
    if (bookingsData?.bookings) {
      const newNotifications = notificationStore.createNotificationsFromBookings(bookingsData.bookings);
      setNotifications(newNotifications.slice(0, 10)); // Limit to 10 notifications
    }
  }, [bookingsData]);

  // Subscribe to notification store changes
  useEffect(() => {
    return notificationStore.subscribe(() => {
      // Refresh notifications when store changes
      if (bookingsData?.bookings) {
        const updatedNotifications = notificationStore.createNotificationsFromBookings(bookingsData.bookings);
        setNotifications(updatedNotifications.slice(0, 10));
      }
    });
  }, [bookingsData]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    notificationStore.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    const notificationIds = notifications.map(n => n.id);
    notificationStore.markAllAsRead(notificationIds);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    onClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-notification-dropdown]')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      data-notification-dropdown
      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiBell className="h-5 w-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <FiBell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No new notifications</p>
            <p className="text-xs text-gray-400 mt-1">New bookings will appear here</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Link
              key={notification.id}
              to="/bookings"
              search={{ q: notification.booking.email }}
              onClick={() => handleNotificationClick(notification)}
              className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${
                notification.read
                  ? 'border-transparent'
                  : 'border-blue-500 bg-blue-50/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notification.type === 'new_booking' ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.read ? 'bg-gray-100' : 'bg-blue-100'
                    }`}>
                      <FiClock className={`h-4 w-4 ${
                        notification.read ? 'text-gray-600' : 'text-blue-600'
                      }`} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiCheck className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-medium ${
                      notification.read ? 'text-gray-700' : 'text-gray-900'
                    }`}>
                      New Booking Request
                    </p>
                    <BookingStatusBadge status={notification.booking.status} />
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {notification.booking.name} • {notification.booking.pickup} → {notification.booking.dropoff}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <Link
            to="/bookings"
            search={{ status: '' }}
            onClick={onClose}
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View all bookings
          </Link>
        </div>
      )}
    </div>
  );
}