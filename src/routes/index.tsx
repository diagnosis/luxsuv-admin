import { createFileRoute, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createFileRoute('/')({
  getParentRoute: () => rootRoute,
  beforeLoad: ({ context, location }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    } else {
      throw redirect({ to: '/dashboard' });
    }
  },
});