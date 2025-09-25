import { createFileRoute, redirect } from '@tanstack/react-router';
import { BookingsPage } from '../components/bookings/BookingsPage';
import { Route as rootRoute } from './__root';

export const Route = createFileRoute('/bookings')({
  getParentRoute: () => rootRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
    status: (search.status as string) || '',
    q: (search.q as string) || '',
  }),
  beforeLoad: () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: BookingsPage,
});