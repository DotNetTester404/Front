import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Minus, Plus, Tag, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../ui/Modal';
import StarRating from '../ui/StarRating';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductModal({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const images = product.images || [product.image];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    setAdding(true);
    await new Promise((r) => setTimeout(r, 500));
    addItem(product, qty);
    toast.success(`${product.name} added to cart!`);
    setAdding(false);
  };

  const handleOrderNow = () => {
    onClose();
    navigate('/checkout', { state: { directOrder: [{ ...product, quantity: qty }] } });
  };

  const prevImage = () => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image section */}
        <div className="relative bg-primary-50 rounded-tl-3xl rounded-bl-none md:rounded-bl-3xl rounded-tr-3xl md:rounded-tr-none overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedImage ? 'border-primary-900 scale-110' : 'border-transparent hover:border-primary-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {!product.inStock && <span className="badge bg-primary-700 text-white">Out of Stock</span>}
            {discount && product.inStock && <span className="badge bg-error-500 text-white">-{discount}% OFF</span>}
            {product.featured && product.inStock && <span className="badge bg-amber-500 text-white">Featured</span>}
          </div>
        </div>

        {/* Info section */}
        <div className="p-6 md:p-8 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-neutral flex items-center gap-1">
                <Tag className="w-3 h-3" /> {product.category}
              </span>
              {product.inStock ? (
                <span className="badge badge-success flex items-center gap-1">
                  <Package className="w-3 h-3" /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="badge badge-error">Out of Stock</span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-primary-900 mb-2 leading-tight">{product.name}</h2>

            <StarRating rating={product.rating} reviews={product.reviews} size="md" />

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-primary-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-primary-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-sm text-primary-600 leading-relaxed mt-4">{product.description}</p>

            {/* Quantity selector */}
            {product.inStock && (
              <div className="mt-6">
                <label className="label">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-primary-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="p-2.5 hover:bg-primary-50 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-primary-600" />
                    </button>
                    <span className="w-12 text-center text-sm font-semibold text-primary-900">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="p-2.5 hover:bg-primary-50 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-primary-600" />
                    </button>
                  </div>
                  <span className="text-sm text-primary-500">
                    Subtotal: <strong className="text-primary-900">{formatPrice(product.price * qty)}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-primary-100">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || adding}
              className="flex-1 btn btn-primary btn-lg"
            >
              {adding ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              Add to Cart
            </button>
            {product.inStock && (
              <button onClick={handleOrderNow} className="flex-1 btn btn-secondary btn-lg">
                <Zap className="w-4 h-4" /> Order Now
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
