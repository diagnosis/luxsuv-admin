interface Notification {
  id: string;
  type: 'new_booking' | 'status_change';
  bookingId: string;
  booking: any;
  read: boolean;
  created_at: string;
}

class NotificationStore {
  private readNotifications: Set<string>;
  private listeners: Array<() => void> = [];

  constructor() {
    // Load read notifications from localStorage
    const stored = localStorage.getItem('readNotifications');
    this.readNotifications = new Set(stored ? JSON.parse(stored) : []);
  }

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(callback => callback());
  }

  private saveToStorage() {
    localStorage.setItem('readNotifications', JSON.stringify([...this.readNotifications]));
  }

  markAsRead(notificationId: string) {
    this.readNotifications.add(notificationId);
    this.saveToStorage();
    this.notify();
  }

  markAllAsRead(notificationIds: string[]) {
    notificationIds.forEach(id => this.readNotifications.add(id));
    this.saveToStorage();
    this.notify();
  }

  isRead(notificationId: string): boolean {
    return this.readNotifications.has(notificationId);
  }

  createNotificationsFromBookings(bookings: any[]): Notification[] {
    const now = new Date();
    const recentBookings = bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.created_at);
      const hoursDiff = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24; // Show bookings from last 24 hours
    });

    return recentBookings.map((booking: any) => {
      const id = `booking-${booking.id}`;
      return {
        id,
        type: 'new_booking' as const,
        bookingId: booking.id,
        booking,
        read: this.isRead(id),
        created_at: booking.created_at,
      };
    });
  }

  getUnreadCount(notifications: Notification[]): number {
    return notifications.filter(n => !n.read).length;
  }
}

export const notificationStore = new NotificationStore();