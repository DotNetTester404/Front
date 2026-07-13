import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, MapPin, Save, Package, ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import { Spinner, SkeletonBox } from '../components/ui/Loaders';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function CartSummary({ items, total }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-primary-500">
        <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Your cart is empty</p>
        <Link to="/" className="link text-sm mt-1 inline-block">Start shopping</Link>
      </div>
    );
  }
  return (
    <div>
      <div className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-900 truncate">{item.name}</p>
              <p className="text-xs text-primary-400">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-primary-900">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-primary-400 text-center">+{items.length - 3} more items</p>
        )}
      </div>
      <div className="flex justify-between font-bold text-primary-900 text-sm pt-3 mt-3 border-t border-primary-100">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="flex gap-2 mt-3">
        <Link to="/cart" className="flex-1 btn-secondary btn btn-sm justify-center">View Cart</Link>
        <Link to="/checkout" className="flex-1 btn-primary btn btn-sm justify-center">Checkout</Link>
      </div>
    </div>
  );
}

function RecentOrders({ orders, loading }) {
  if (loading) return <div className="space-y-2">{[1,2,3].map(i => <SkeletonBox key={i} className="h-14" />)}</div>;
  if (orders.length === 0) return (
    <div className="text-center py-8 text-primary-500">
      <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
      <p className="text-sm">No orders yet</p>
    </div>
  );
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-primary-900">{order.id}</p>
            <p className="text-xs text-primary-400">{formatDate(order.date)}</p>
          </div>
          <div className="text-right">
            <span className={`badge text-[10px] ${getStatusColor(order.status)}`}>{order.status}</span>
            <p className="text-xs font-semibold text-primary-900 mt-0.5">{formatPrice(order.total)}</p>
          </div>
        </div>
      ))}
      <Link to="/orders" className="btn-ghost btn btn-sm w-full justify-center flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5" /> View All Orders
      </Link>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { items, total } = useCart();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      address: user?.address || '',
    },
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      address: user?.address || '',
    });
  }, [user, reset]);

  useEffect(() => {
    orderService.getOrders({ page: 1, limit: 3 })
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile(data);
      updateUser(updated);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-primary-50 py-8">
      <div className="page-container">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
            {user?.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">{user?.firstName} {user?.lastName}</h1>
            <p className="text-primary-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-primary-500" />
                <h2 className="font-semibold text-primary-900">Personal Information</h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input
                      type="text"
                      className={`input ${errors.firstName ? 'input-error' : ''}`}
                      {...register('firstName', { required: 'Required' })}
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-error-500">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input
                      type="text"
                      className={`input ${errors.lastName ? 'input-error' : ''}`}
                      {...register('lastName', { required: 'Required' })}
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-error-500">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    {...register('email', {
                      required: 'Required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                    })}
                  />
                  {errors.email && <p className="mt-1 text-xs text-error-500">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Shipping Address
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter your full shipping address…"
                    className={`input resize-none ${errors.address ? 'input-error' : ''}`}
                    {...register('address')}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving || !isDirty}
                    className="btn-primary btn flex items-center gap-2"
                  >
                    {saving ? <Spinner size="sm" className="text-white" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => reset()}
                      className="btn-ghost btn"
                    >
                      Discard
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-primary-500" />
                <h2 className="font-semibold text-primary-900">Current Cart</h2>
                {items.length > 0 && (
                  <span className="badge badge-neutral ml-auto">{items.length} items</span>
                )}
              </div>
              <CartSummary items={items} total={total} />
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary-500" />
                <h2 className="font-semibold text-primary-900">Recent Orders</h2>
              </div>
              <RecentOrders orders={orders} loading={loadingOrders} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
