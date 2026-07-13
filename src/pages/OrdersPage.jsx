import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate, getStatusColor, getStatusStep } from '../utils/helpers';
import Pagination from '../components/ui/Pagination';
import { OrderCardSkeleton } from '../components/ui/Loaders';
import { EmptyOrders, ErrorState } from '../components/ui/EmptyStates';
import { useNavigate } from 'react-router-dom';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

function OrderProgress({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 mt-3">
        <div className="w-2 h-2 rounded-full bg-error-400 flex-shrink-0" />
        <span className="text-xs text-error-500 font-medium">Order Cancelled</span>
      </div>
    );
  }
  const currentStep = getStatusStep(status);
  return (
    <div className="mt-4">
      <div className="flex items-center gap-0 relative">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold transition-colors z-10 ${
              i <= currentStep
                ? 'bg-primary-900 text-white'
                : 'bg-primary-200 text-primary-400'
            }`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-0.5 ${i < currentStep ? 'bg-primary-900' : 'bg-primary-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {STATUS_STEPS.map((step, i) => (
          <span key={step} className={`text-[9px] font-medium ${i <= currentStep ? 'text-primary-700' : 'text-primary-300'}`}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-primary-900">{order.id}</h3>
            <span className={`badge text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
          </div>
          <p className="text-sm text-primary-500 mt-0.5">{formatDate(order.date)}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-primary-900">{formatPrice(order.total)}</p>
            <p className="text-xs text-primary-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-primary-100 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4 text-primary-500" /> : <ChevronDown className="w-4 h-4 text-primary-500" />}
          </button>
        </div>
      </div>

      <OrderProgress status={order.status} />

      {expanded && (
        <div className="mt-4 pt-4 border-t border-primary-100 animate-fade-in">
          <h4 className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-3">Items</h4>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-primary-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span className="text-sm font-semibold text-primary-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-primary-100 flex justify-between text-sm">
            <span className="text-primary-500">Shipping: {order.shippingCost === 0 ? <span className="text-success-600">Free</span> : formatPrice(order.shippingCost)}</span>
            <span className="font-bold text-primary-900">Total: {formatPrice(order.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const loadOrders = (p) => {
    setLoading(true);
    setError(null);
    orderService.getOrders({ page: p, limit: 5 })
      .then((res) => {
        setOrders(res.data);
        setTotalPages(res.totalPages);
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(page); }, [page]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-primary-50 py-8">
      <div className="page-container max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-7 h-7 text-primary-700" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary-900">My Orders</h1>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={() => loadOrders(page)} />
        ) : loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map((i) => <OrderCardSkeleton key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders onShop={() => navigate('/')} />
        ) : (
          <>
            <div className="space-y-3">
              {orders.map((order) => <OrderCard key={order.id} order={order} />)}
            </div>
            <div className="flex justify-center mt-8">
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
