import { FiTrash2, FiEye } from 'react-icons/fi';

interface DeleteConfirmModalProps {
  bookingName: string;
  deleteType: 'soft' | 'hard';
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ bookingName, deleteType, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const isSoftDelete = deleteType === 'soft';
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            {isSoftDelete ? (
              <FiEye className="h-6 w-6 text-amber-600" />
            ) : (
              <FiTrash2 className="h-6 w-6 text-red-600" />
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            {isSoftDelete ? 'Hide Booking' : 'Delete Booking Permanently'}
          </h3>
          
          <p className="text-sm text-gray-500 text-center mb-6">
            {isSoftDelete ? (
              <>
                Are you sure you want to hide the booking for <strong>{bookingName}</strong>? 
                This will remove it from the listing but preserve the data.
              </>
            ) : (
              <>
                Are you sure you want to permanently delete the booking for <strong>{bookingName}</strong>? 
                This action cannot be undone and all data will be lost.
              </>
            )}
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                isSoftDelete 
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSoftDelete ? 'Hide' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}