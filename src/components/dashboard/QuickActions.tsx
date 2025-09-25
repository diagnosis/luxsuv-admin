import { Link } from '@tanstack/react-router';
import { FiPlus, FiSearch, FiMail, FiBarChart } from 'react-icons/fi';

export function QuickActions() {
  const actions = [
    {
      name: 'View Pending',
      description: 'Review bookings awaiting approval',
      href: '/bookings',
      search: { status: 'pending' },
      icon: FiSearch,
      color: 'amber',
    },
    {
      name: 'Check Emails',
      description: 'Monitor email notifications',
      href: '/emails',
      icon: FiMail,
      color: 'blue',
    },
    {
      name: 'All Bookings',
      description: 'Browse complete booking list',
      href: '/bookings',
      icon: FiBarChart,
      color: 'green',
    },
  ];

  const colorClasses = {
    amber: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      </div>

      <div className="p-6 space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Link
              key={action.name}
              to={action.href}
              search={action.search}
              className={`block p-4 border rounded-lg transition-colors ${colorClasses[action.color]}`}
            >
              <div className="flex items-center">
                <Icon className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">{action.name}</p>
                  <p className="text-sm opacity-80 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}