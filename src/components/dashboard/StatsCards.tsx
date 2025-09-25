import { FiCalendar, FiClock, FiCheck, FiX } from 'react-icons/fi';

interface Booking {
  id: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  created_at: string;
}

interface StatsCardsProps {
  bookings: Booking[];
}

export function StatsCards({ bookings }: StatsCardsProps) {
  const stats = [
    {
      name: 'Total Bookings',
      value: bookings.length,
      icon: FiCalendar,
      color: 'blue',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Pending',
      value: bookings.filter(b => b.status === 'pending').length,
      icon: FiClock,
      color: 'amber',
      change: '+2',
      changeType: 'positive' as const,
    },
    {
      name: 'Approved',
      value: bookings.filter(b => b.status === 'approved').length,
      icon: FiCheck,
      color: 'emerald',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Completed',
      value: bookings.filter(b => b.status === 'completed').length,
      icon: FiCheck,
      color: 'green',
      change: '+15%',
      changeType: 'positive' as const,
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    green: 'bg-green-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stat.change}</span>
              <span className="text-gray-600 ml-2">from last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}