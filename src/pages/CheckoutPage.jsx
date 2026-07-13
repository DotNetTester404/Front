import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/helpers';
import { Spinner } from '../components/ui/Loaders';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const directOrder = location.state?.directOrder;
  const orderItems = directOrder || items;

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shipping + tax;

  if (orderItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      const session = await orderService.initiateStripeCheckout({
        items: orderItems,
        total: grandTotal,
      });
      // In production: window.location.href = session.url;
      // Simulate redirect to payment success
      await new Promise((r) => setTimeout(r, 800));
      if (!directOrder) clearCart();
      navigate('/payment/success', { state: { sessionId: session.sessionId, total: grandTotal, items: orderItems } });
    } catch {
      toast.error('Payment initialization failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-primary-50 py-8">
      <div className="page-container max-w-4xl">
        <button onClick={() => navigate(directOrder ? '/' : '/cart')} className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {directOrder ? 'Back to Shop' : 'Back to Cart'}
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">Checkout Summary</h1>
        <p className="text-primary-500 mb-8">Review your order before proceeding to payment</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <div className="card p-5">
              <h2 className="font-semibold text-primary-900 mb-4">Order Items ({orderItems.length})</h2>
              <div className="space-y-4">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-primary-100 last:border-0 last:pb-0">
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-primary-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-primary-900 text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-primary-400 mt-0.5">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-primary-500">Qty: {item.quantity}</span>
                        <div className="text-right">
                          <div className="font-semibold text-sm text-primary-900">{formatPrice(item.price * item.quantity)}</div>
                          <div className="text-xs text-primary-400">{formatPrice(item.price)} × {item.quantity}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping info */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-primary-500" />
                <h2 className="font-semibold text-primary-900">Shipping</h2>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-600">Estimated delivery: 3-5 business days</span>
                <span className={`font-medium ${shipping === 0 ? 'text-success-600' : 'text-primary-900'}`}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-success-600 mt-1">You qualify for free shipping!</p>
              )}
            </div>

            {/* Security badge */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-primary-200">
              <Lock className="w-4 h-4 text-success-600 flex-shrink-0" />
              <p className="text-xs text-primary-500">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption.
              </p>
            </div>
          </div>

          {/* Totals */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="font-bold text-lg text-primary-900 mb-5">Price Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-primary-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-primary-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-primary-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-success-600 font-medium' : 'font-medium text-primary-900'}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-primary-600">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-primary-900">{formatPrice(tax)}</span>
                </div>
                <div className="divider pt-1" />
                <div className="flex justify-between font-bold text-primary-900 text-base">
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={loading}
                className="btn-primary btn w-full btn-lg mt-6 flex items-center justify-center gap-2"
              >
                {loading ? <Spinner size="sm" className="text-white" /> : <CreditCard className="w-4 h-4" />}
                {loading ? 'Processing…' : 'Proceed to Payment'}
              </button>

              <div className="flex items-center justify-center gap-3 mt-4">
                {['Visa', 'MC', 'Amex', 'PayPal'].map((p) => (
                  <span key={p} className="text-[10px] font-semibold text-primary-400 bg-primary-100 px-2 py-1 rounded">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
