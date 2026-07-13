import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Save } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, calcCartTotal } from '../utils/helpers';
import { cartService } from '../services/cartService';
import { EmptyCart } from '../components/ui/EmptyStates';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Spinner } from '../components/ui/Loaders';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const subtotal = calcCartTotal(items);
  const shipping = subtotal >= 100 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleSaveCart = async () => {
    setSaving(true);
    try {
      await cartService.saveCart(items);
      toast.success('Cart saved successfully!');
    } catch {
      toast.error('Failed to save cart.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = (id) => setRemovingId(id);
  const confirmRemove = () => {
    removeItem(removingId);
    toast.success('Item removed from cart');
    setRemovingId(null);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-primary-50 py-8">
      <div className="page-container">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <EmptyCart onShop={() => navigate('/')} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="card p-4 flex gap-4 animate-fade-in">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-primary-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-primary-400 mb-0.5">{item.category}</p>
                        <h3 className="font-semibold text-primary-900 text-sm leading-snug line-clamp-2">{item.name}</h3>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 rounded-lg hover:bg-error-50 hover:text-error-500 text-primary-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-primary-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 hover:bg-primary-50 disabled:opacity-40 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock || 99)}
                          className="p-1.5 hover:bg-primary-50 disabled:opacity-40 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary-900">{formatPrice(item.price * item.quantity)}</div>
                        <div className="text-xs text-primary-400">{formatPrice(item.price)} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={() => navigate('/')} className="btn-secondary btn flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Continue Shopping
                </button>
                <button
                  onClick={handleSaveCart}
                  disabled={saving}
                  className="btn-ghost btn flex items-center gap-2"
                >
                  {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : 'Save Cart'}
                </button>
                <button
                  onClick={() => setConfirmClear(true)}
                  className="btn-ghost btn text-error-500 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Clear Cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <h2 className="font-bold text-lg text-primary-900 mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-primary-600">
                      <span className="truncate pr-4">{item.name} × {item.quantity}</span>
                      <span className="font-medium text-primary-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="divider pt-1" />
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
                  {shipping > 0 && (
                    <p className="text-xs text-primary-400">Add {formatPrice(100 - subtotal)} more for free shipping</p>
                  )}
                  <div className="divider pt-1" />
                  <div className="flex justify-between font-bold text-primary-900 text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary btn w-full btn-lg mt-6"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!removingId}
        onConfirm={confirmRemove}
        onCancel={() => setRemovingId(null)}
        title="Remove item?"
        message="This product will be removed from your cart."
        confirmLabel="Remove"
        cancelLabel="Keep"
        danger
      />
      <ConfirmDialog
        isOpen={confirmClear}
        onConfirm={() => { clearCart(); setConfirmClear(false); toast.success('Cart cleared'); }}
        onCancel={() => setConfirmClear(false)}
        title="Clear cart?"
        message="All items will be removed from your cart."
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        danger
      />
    </div>
  );
}
