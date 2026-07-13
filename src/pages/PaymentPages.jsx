import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Package, Home, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

export function PaymentSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-primary-50 flex items-center justify-center py-12">
      <div className="card max-w-lg w-full mx-4 p-8 text-center animate-fade-up">
        <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success-600" />
        </div>

        <h1 className="text-2xl font-bold text-primary-900 mb-2">Payment Successful!</h1>
        <p className="text-primary-500 mb-6">Your order has been placed and will be processed shortly.</p>

        {state?.sessionId && (
          <div className="bg-primary-50 rounded-xl p-4 mb-6 text-sm">
            <p className="text-primary-500 mb-1">Order Reference</p>
            <p className="font-mono font-semibold text-primary-900 text-xs break-all">{state.sessionId}</p>
          </div>
        )}

        {state?.items && state.items.length > 0 && (
          <div className="bg-white rounded-xl border border-primary-200 p-4 mb-6 text-left">
            <h3 className="font-semibold text-primary-900 text-sm mb-3">Order Summary</h3>
            <div className="space-y-2">
              {state.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-900 truncate">{item.name}</p>
                    <p className="text-xs text-primary-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            {state.total && (
              <div className="flex justify-between font-bold text-primary-900 text-sm pt-3 mt-3 border-t border-primary-100">
                <span>Total Paid</span>
                <span>{formatPrice(state.total)}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/orders')} className="flex-1 btn-primary btn flex items-center gap-2 justify-center">
            <Package className="w-4 h-4" /> Track Order
          </button>
          <button onClick={() => navigate('/')} className="flex-1 btn-secondary btn flex items-center gap-2 justify-center">
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentFailedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-primary-50 flex items-center justify-center py-12">
      <div className="card max-w-lg w-full mx-4 p-8 text-center animate-fade-up">
        <div className="w-20 h-20 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-error-500" />
        </div>

        <h1 className="text-2xl font-bold text-primary-900 mb-2">Payment Failed</h1>
        <p className="text-primary-500 mb-6">
          Your payment could not be processed. No charges have been made. Please try again or contact support.
        </p>

        <div className="bg-error-50 rounded-xl p-4 mb-6 text-sm text-error-600">
          <p>Common reasons for failure:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-left">
            <li>Insufficient funds</li>
            <li>Card declined by issuer</li>
            <li>Incorrect payment details</li>
            <li>Session expired</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/checkout')} className="flex-1 btn-primary btn flex items-center gap-2 justify-center">
            Try Again <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/cart')} className="flex-1 btn-secondary btn flex items-center gap-2 justify-center">
            <Home className="w-4 h-4" /> Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
