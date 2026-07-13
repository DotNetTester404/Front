import { useState } from 'react';
import { ShoppingCart, Eye, Tag } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import StarRating from '../ui/StarRating';
import toast from 'react-hot-toast';

export default function ProductCard({ product, onViewDetails }) {
  const { addItem, isInCart } = useCart();
  const [adding, setAdding] = useState(false);
  const inCart = isInCart(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    setAdding(true);
    await new Promise((r) => setTimeout(r, 400));
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
    setAdding(false);
  };

  return (
    <div className="card group overflow-hidden flex flex-col hover:shadow-medium transition-all duration-300 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative overflow-hidden bg-primary-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {!product.inStock && (
            <span className="badge bg-primary-700/90 text-white text-[10px]">Out of Stock</span>
          )}
          {discount && product.inStock && (
            <span className="badge bg-error-500 text-white text-[10px]">-{discount}%</span>
          )}
          {product.featured && product.inStock && (
            <span className="badge bg-amber-500 text-white text-[10px]">Featured</span>
          )}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
            className="px-4 py-2 bg-white/95 text-primary-900 text-sm font-medium rounded-lg shadow-medium hover:bg-white transition-all -translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[11px] font-medium text-primary-400 uppercase tracking-wide flex items-center gap-1">
            <Tag className="w-3 h-3" /> {product.category}
          </span>
          {product.inStock ? (
            <span className="text-[11px] text-success-600 font-medium">In Stock</span>
          ) : (
            <span className="text-[11px] text-error-500 font-medium">Unavailable</span>
          )}
        </div>

        <h3 className="font-semibold text-primary-900 text-sm leading-snug mb-1 group-hover:text-accent-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-primary-500 line-clamp-2 mb-3 leading-relaxed flex-1">
          {product.shortDescription}
        </p>

        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-primary-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-primary-400 line-through ml-1.5">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || adding}
            className={`flex-1 btn btn-sm flex items-center justify-center gap-1.5 ${
              inCart ? 'btn-secondary' : 'btn-primary'
            }`}
          >
            {adding ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
            {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
            className="btn btn-secondary btn-sm px-3"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
