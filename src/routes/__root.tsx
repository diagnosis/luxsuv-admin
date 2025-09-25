import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from '../components/ui/Toaster';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
        <Toaster />
      </div>
    </AuthProvider>
  ),
});