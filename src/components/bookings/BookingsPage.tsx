import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { api } from '../../lib/api';
import { toaster } from '../ui/Toaster';
import { Layout } from '../layout/Layout';
import { BookingsTable } from './BookingsTable';
import { BookingsFilters } from './BookingsFilters';
import { BookingModal } from './BookingModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { PaymentChargeModal } from './PaymentChargeModal';
import { CancelConfirmModal } from './CancelConfirmModal';

export function BookingsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/bookings' });
  const { page = 1, status = '', q = '' } = search;
  
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState<{ id: string; name: string } | null>(null);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
  const [cancelBooking, setCancelBooking] = useState<{ id: string; name: string } | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', { page, status, q }],
    queryFn: () => api.getBookings({
      page,
      page_size: 25,
      ...(status && { status }),
      ...(q && { q })
    }),
  });

  const handleFilterChange = (newFilters: any) => {
    navigate({
      to: '/bookings',
      search: { ...search, ...newFilters, page: 1 },
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/bookings',
      search: { ...search, page: newPage },
    });
  };

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleDeleteBooking = (booking: any, type: 'soft' | 'hard') => {
    setDeleteBooking({ id: booking.id, name: booking.name });
    setDeleteType(type);
  };

  const handleChargeCustomer = (booking: any) => {
    setSelectedBooking(booking);
    setShowChargeModal(true);
  };

  const statusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      api.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toaster.toast({
        type: 'success',
        title: 'Status updated',
        description: 'Booking status has been updated successfully',
      });
    },
    onError: (error: any) => {
      toaster.toast({
        type: 'error',
        title: 'Update failed',
        description: error.message || 'Failed to update booking status',
      });
    },
  });

  const handleStatusChange = (bookingId: string, status: string, bookingName?: string) => {
    if (status === 'cancelled' && bookingName) {
      setCancelBooking({ id: bookingId, name: bookingName });
    } else {
      statusMutation.mutate({ bookingId, status });
    }
  };

  const confirmCancel = () => {
    if (!cancelBooking) return;
    statusMutation.mutate({ bookingId: cancelBooking.id, status: 'cancelled' });
    setCancelBooking(null);
  };
  const confirmDelete = async () => {
    if (!deleteBooking) return;

    try {
      if (deleteType === 'soft') {
        await api.softDeleteBooking(deleteBooking.id);
      } else {
        await api.hardDeleteBooking(deleteBooking.id);
      }
      
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setDeleteBooking(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all customer bookings
          </p>
        </div>

        <BookingsFilters
          currentFilters={{ status, q }}
          onFilterChange={handleFilterChange}
        />

        <BookingsTable
          bookings={data?.bookings || []}
          isLoading={isLoading}
          error={error}
          pagination={{
            currentPage: page,
            totalPages: data?.total_pages || 1,
            total: data?.total || 0,
            pageSize: 25,
          }}
          onPageChange={handlePageChange}
          onEdit={handleEditBooking}
          onDelete={handleDeleteBooking}
          onChargeCustomer={handleChargeCustomer}
          onStatusChange={handleStatusChange}
        />

        {showModal && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => {
              setShowModal(false);
              setSelectedBooking(null);
            }}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['bookings'] });
              setShowModal(false);
              setSelectedBooking(null);
            }}
          />
        )}

        {showChargeModal && selectedBooking && (
          <PaymentChargeModal
            booking={selectedBooking}
            onClose={() => {
              setShowChargeModal(false);
              setSelectedBooking(null);
            }}
            onComplete={() => {
              setShowChargeModal(false);
              setSelectedBooking(null);
            }}
          />
        )}

        {deleteBooking && (
          <DeleteConfirmModal
            bookingName={deleteBooking.name}
            deleteType={deleteType}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteBooking(null)}
          />
        )}

        {cancelBooking && (
          <CancelConfirmModal
            bookingName={cancelBooking.name}
            onConfirm={confirmCancel}
            onCancel={() => setCancelBooking(null)}
          />
        )}
      </div>
    </Layout>
  );
}