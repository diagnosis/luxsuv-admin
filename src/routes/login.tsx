import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '../components/auth/LoginForm';
import { Route as rootRoute } from './__root';

export const Route = createFileRoute('/login')({
  getParentRoute: () => rootRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/dashboard',
  }),
  beforeLoad: () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">L</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">LuxSUV Admin</h1>
              <p className="text-gray-600 mt-2">Sign in to manage bookings</p>
            </div>
            
            <LoginForm />
          </div>
          
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p>Default credentials:</p>
              <p className="font-mono mt-1">admin@luxsuv.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}