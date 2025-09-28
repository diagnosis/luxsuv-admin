import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { FiX, FiCheck, FiCreditCard } from 'react-icons/fi';
import { formatDateTime } from '../../lib/utils';

interface PaymentChargeModalProps {
  booking: any;
  onClose: () => void;
  onComplete: () => void;
}

export function PaymentChargeModal({ booking, onClose, onComplete }: PaymentChargeModalProps) {
  const [baseAmount, setBaseAmount] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [notes, setNotes] = useState('');
  const [chargeResult, setChargeResult] = useState<any>(null);

  const queryClient = useQueryClient();

  // Initialize amounts from booking data
  useEffect(() => {
    if (booking.base_amount) {
      setBaseAmount((booking.base_amount / 100).toFixed(2));
    }
    if (booking.service_fee) {
      setServiceFee((booking.service_fee / 100).toFixed(2));
    }
  }, [booking]);

  const chargeMutation = useMutation({
    mutationFn: (chargeData: { amount: number; base_amount?: number; service_fee?: number; currency?: string; notes?: string }) => 
      api.chargeCustomer(booking.id, chargeData),
    onSuccess: (result) => {
      if (result.requires_action) {
        // Handle 3D Secure authentication
        throw new Error('Payment requires additional authentication. Please contact customer or try again later.');
      } else if (result.status === 'succeeded') {
        setChargeResult(result);
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        // Auto-close after success
        setTimeout(() => {
          onComplete();
        }, 3000);
      } else {
        throw new Error(`Payment failed: ${result.status}`);
      }
    },
  });

  const handleCharge = () => {
    const baseAmountValue = parseFloat(baseAmount) || 0;
    const serviceFeeValue = parseFloat(serviceFee) || 0;
    const chargeAmount = baseAmountValue + serviceFeeValue;
    
    if (isNaN(chargeAmount) || chargeAmount <= 0) {
      return;
    }

    chargeMutation.mutate({
      amount: chargeAmount,
      base_amount: baseAmountValue,
      service_fee: serviceFeeValue,
      currency: 'usd',
      notes: notes,
    });
  };

  const baseAmountValue = parseFloat(baseAmount) || 0;
  const serviceFeeValue = parseFloat(serviceFee) || 0;
  const totalAmount = baseAmountValue + serviceFeeValue;

  // Success state
  if (chargeResult && chargeResult.status === 'succeeded') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-green-800 mb-3">
              Payment Successful! 🎉
            </h3>
            
            <p className="text-gray-600 mb-6">
              Customer charged ${(chargeResult.amount / 100).toFixed(2)}
            </p>
            
            <div className="text-sm text-gray-500 space-y-2 mb-8">
              <p className="font-mono text-xs bg-gray-50 p-2 rounded">
                Payment ID: {chargeResult.payment_intent_id}
              </p>
              <div className="space-y-1">
                <p>📧 Invoices sent to both rider and driver</p>
                <p>💳 Payment completed successfully</p>
              </div>
            </div>
            
            <button
              onClick={onComplete}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiCreditCard className="h-6 w-6 mr-2" />
            Charge Customer
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trip Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🚗 Trip Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Customer:</span>
                  <p className="font-medium text-gray-900">{booking.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium text-blue-600">{booking.email}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Route:</span>
                <p className="font-medium text-gray-900">{booking.pickup} → {booking.dropoff}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <p className="font-medium">{formatDateTime(booking.scheduled_at)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Passengers:</span>
                  <p className="font-medium">{booking.passenger_count}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Luggage:</span>
                  <p className="font-medium">{booking.luggage_count} pieces</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Trip Type:</span>
                  <p className="font-medium capitalize">
                    {booking.trip_type === 'hourly' ? 'Hourly Service' : 'Per Ride'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current Total:</span>
                  <p className="font-medium text-green-600">
                    {booking.base_amount || booking.service_fee 
                      ? `$${(((booking.base_amount || 0) + (booking.service_fee || 0)) / 100).toFixed(2)}`
                      : 'Not set'
                    }
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Payment Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  booking.payment_status === 'validated' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.payment_status || 'pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Payment Amount</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="baseAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Base Amount
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xl text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    id="baseAmount"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={baseAmount}
                    onChange={(e) => setBaseAmount(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Base ride cost
                </p>
              </div>

              <div>
                <label htmlFor="serviceFee" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Fee
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xl text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    id="serviceFee"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Additional service charges
                </p>
              </div>
            </div>

            {/* Total Display */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-800">Total Amount:</span>
                <span className="text-2xl font-bold text-green-900">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="text-xs text-green-700 space-y-1">
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span>${baseAmountValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>${serviceFeeValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              📝 Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add any notes about this payment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{notes.length}/500 characters</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">💡 Payment Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Total amount to charge:</span>
                <span className="font-bold text-blue-900 text-lg">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="text-sm text-blue-700 pl-4 space-y-1">
                <div className="flex justify-between">
                  <span>• Base amount:</span>
                  <span>${baseAmountValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>• Service fee:</span>
                  <span>${serviceFeeValue.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-xs text-blue-600 space-y-1">
                <p>• Customer's card will be charged immediately</p>
                <p>• Both you and the customer will receive email invoices</p>
                <p>• Payment cannot be undone once processed</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {chargeMutation.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <div className="font-medium">Payment Error</div>
                  <div className="text-sm">{chargeMutation.error?.message}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              disabled={chargeMutation.isPending}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCharge}
              disabled={chargeMutation.isPending || totalAmount <= 0}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center justify-center transition-colors"
            >
              {chargeMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                `💳 Charge $${totalAmount.toFixed(2)}`
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center pt-2">
            🔒 Secure payment processing powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}