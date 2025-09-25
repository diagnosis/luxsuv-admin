import { createFileRoute, redirect } from '@tanstack/react-router';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Route as rootRoute } from './__root';

export const Route = createFileRoute('/dashboard')({
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: Dashboard,
});