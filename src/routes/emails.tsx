import { createFileRoute, redirect } from '@tanstack/react-router';
import { EmailsPage } from '../components/emails/EmailsPage';
import { Route as rootRoute } from './__root';

export const Route = createFileRoute('/emails')({
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: EmailsPage,
});