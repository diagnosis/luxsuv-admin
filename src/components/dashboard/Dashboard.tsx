import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Layout } from '../layout/Layout';
import { StatsCards } from './StatsCards';
import { RecentBookings } from './RecentBookings';
import { QuickActions } from './QuickActions';

export function Dashboard() {
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', { page: 1, page_size: 10 }],
    queryFn: () => api.getBookings({ page: 1, page_size: 10 }),
  });

  const { data: allBookingsData } = useQuery({
    queryKey: ['bookings-stats'],
    queryFn: () => api.getBookings({ page_size: 200 }),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to LuxSUV Admin Portal. Manage your bookings and track performance.
          </p>
        </div>

        <StatsCards bookings={allBookingsData?.bookings || []} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentBookings bookings={bookingsData?.bookings || []} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </Layout>
  );
}