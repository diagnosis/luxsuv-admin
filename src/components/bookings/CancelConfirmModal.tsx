import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface CancelConfirmModalProps {
  bookingName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CancelConfirmModal({ bookingName, onConfirm, onCancel }: CancelConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Cancel Booking?</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to cancel the booking for{' '}
            <span className="font-semibold">{bookingName}</span>?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> This action will notify the customer that their booking has been cancelled.
              Make sure this is intentional as cancelled bookings may affect customer satisfaction.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}
