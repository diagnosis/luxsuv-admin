interface BookingStatusBadgeProps {
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  type?: 'booking' | 'payment';
}

const bookingStatusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-slate-50 text-slate-700 border-slate-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

const paymentStatusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  validated: {
    label: 'Validated',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  paid: {
    label: 'Paid',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

export function BookingStatusBadge({ status, type = 'booking' }: BookingStatusBadgeProps) {
  const config = type === 'payment' 
    ? paymentStatusConfig[status as keyof typeof paymentStatusConfig] 
    : bookingStatusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}