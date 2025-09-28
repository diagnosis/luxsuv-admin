import { FiCalendar, FiClock, FiCheck, FiX } from 'react-icons/fi';

interface Booking {
  id: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  payment_status?: 'pending' | 'validated' | 'paid' | 'failed';
  amount_cents?: number;
  paid_at?: string;
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
      name: 'Completed Rides',
      value: bookings.filter(b => b.status === 'completed').length,
      icon: FiCheck,
      color: 'emerald',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Revenue',
      value: `$${(bookings
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.amount_cents || 0), 0) / 100).toFixed(2)}`,
      icon: FiCheck,
      color: 'green',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      name: 'Pending Payments',
      value: bookings.filter(b => 
        b.status === 'completed' && 
        (b.payment_status === 'validated' || b.payment_status === 'pending')
      ).length,
      icon: FiClock,
      color: 'amber',
      change: 'urgent',
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
        const isUrgent = stat.name === 'Pending Payments' && stat.value > 0;
        
        return (
          <div key={stat.name} className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
            isUrgent ? 'border-red-300 animate-pulse' : 'border-gray-200'
          }`}>
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
              <span className={`font-medium ${
                isUrgent ? 'text-red-600' : 'text-green-600'
              }`}>
                {isUrgent ? '⚠️ Requires attention' : stat.change}
              </span>
              {!isUrgent && (
                <span className="text-gray-600 ml-2">from last month</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}