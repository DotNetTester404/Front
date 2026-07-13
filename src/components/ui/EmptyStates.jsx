import { ShoppingCart, Package, Search, AlertCircle } from 'lucide-react';

export function EmptyCart({ onShop }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <ShoppingCart className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-primary-900 mb-2">Your cart is empty</h3>
      <p className="text-primary-500 mb-6 max-w-sm">Looks like you haven't added anything yet. Explore our products and find something you'll love.</p>
      {onShop && (
        <button onClick={onShop} className="btn-primary btn">Start Shopping</button>
      )}
    </div>
  );
}

export function EmptyOrders({ onShop }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <Package className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-primary-900 mb-2">No orders yet</h3>
      <p className="text-primary-500 mb-6 max-w-sm">You haven't placed any orders. Browse our catalog and make your first purchase.</p>
      {onShop && (
        <button onClick={onShop} className="btn-primary btn">Browse Products</button>
      )}
    </div>
  );
}

export function EmptySearch({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-primary-900 mb-2">No results found</h3>
      <p className="text-primary-500 max-w-sm">
        We couldn't find anything matching{query ? <strong className="text-primary-700"> "{query}"</strong> : ' your search'}. Try adjusting your filters.
      </p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
      <div className="w-24 h-24 rounded-full bg-error-50 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-error-500" />
      </div>
      <h3 className="text-xl font-semibold text-primary-900 mb-2">Something went wrong</h3>
      <p className="text-primary-500 mb-6 max-w-sm">{message || 'An unexpected error occurred. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary btn">Try Again</button>
      )}
    </div>
  );
}
