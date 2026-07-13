import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import ProductModal from '../components/product/ProductModal';
import Pagination from '../components/ui/Pagination';
import { ProductCardSkeleton } from '../components/ui/Loaders';
import { EmptySearch, ErrorState } from '../components/ui/EmptyStates';
import { productService } from '../services/productService';
import { CATEGORIES } from '../data/mockData';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

function HeroBanner({ onShopNow }) {
  return (
    <section className="relative min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden bg-primary-950">
      <img
        src="https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1400"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/40 to-transparent" />
      <div className="relative z-10 page-container py-16 md:py-24">
        <div className="max-w-xl animate-fade-up">
          <span className="inline-block badge bg-white/10 text-white border border-white/20 mb-5 text-xs tracking-widest uppercase">New Collection 2025</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1]">
            Discover Products<br />
            <span className="text-primary-300">You'll Love</span>
          </h1>
          <p className="text-primary-300 text-lg mb-8 leading-relaxed max-w-md">
            Shop thousands of curated products across electronics, fashion, home, and more — all with fast delivery.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onShopNow} className="btn btn-xl bg-white text-primary-900 hover:bg-primary-100 focus:ring-white">
              Shop Now
            </button>
            <a href="#categories" className="btn btn-xl border border-white/30 text-white hover:bg-white/10">
              Browse Categories
            </a>
          </div>
          <div className="flex items-center gap-6 mt-10">
            {[['30+', 'Products'], ['6', 'Categories'], ['Fast', 'Delivery']].map(([val, label]) => (
              <div key={label}>
                <div className="text-xl font-bold text-white">{val}</div>
                <div className="text-xs text-primary-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-large ${
        active ? 'ring-2 ring-primary-900 ring-offset-2' : ''
      }`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className={`absolute inset-0 transition-colors duration-300 ${active ? 'bg-primary-950/60' : 'bg-primary-950/40 group-hover:bg-primary-950/55'}`} />
      <div className="relative z-10 text-white">
        <div className="text-3xl mb-2">{category.icon}</div>
        <div className="font-semibold text-sm">{category.name}</div>
        <div className="text-xs text-white/70 mt-0.5">{category.count} items</div>
      </div>
      {active && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
      )}
    </button>
  );
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const productsSectionRef = useRef(null);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'default';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const inStockOnly = searchParams.get('inStock') === 'true';

  const [searchInput, setSearchInput] = useState(search);
  const [priceMin, setPriceMin] = useState(searchParams.get('minPrice') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('maxPrice') || '');

  const updateParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === 'all' || value === 'default') next.delete(key);
      else next.set(key, value);
      next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const setPage = useCallback((p) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(p));
      return next;
    });
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [setSearchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== search) updateParam('search', searchInput);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    productService
      .getProducts({ page, limit: 12, category: category === 'all' ? undefined : category, search, minPrice, maxPrice, inStock: inStockOnly || undefined, sortBy: sortBy === 'default' ? undefined : sortBy })
      .then((res) => {
        setProducts(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, [page, category, search, sortBy, minPrice, maxPrice, inStockOnly]);

  const applyPriceFilter = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (priceMin) next.set('minPrice', priceMin); else next.delete('minPrice');
      if (priceMax) next.set('maxPrice', priceMax); else next.delete('maxPrice');
      next.delete('page');
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setPriceMin('');
    setPriceMax('');
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'all' || search || minPrice || maxPrice || inStockOnly || sortBy !== 'default';

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <HeroBanner onShopNow={scrollToProducts} />

      {/* Categories */}
      <section id="categories" className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-primary-500 mt-2">Choose from our wide range of product categories</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                active={category === cat.id}
                onClick={() => updateParam('category', category === cat.id ? 'all' : cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products section */}
      <section ref={productsSectionRef} className="py-8 pb-20 bg-primary-50">
        <div className="page-container">
          {/* Search + controls bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input
                type="text"
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input pl-9"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-700">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="input appearance-none pr-8 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
              </div>

              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`btn btn-secondary flex items-center gap-2 ${filtersOpen ? 'bg-primary-100' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent-500" />}
              </button>
            </div>
          </div>

          {/* Filters panel */}
          {filtersOpen && (
            <div className="bg-white rounded-2xl border border-primary-200 p-5 mb-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className="label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => updateParam('category', e.target.value)}
                    className="input"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Min Price</label>
                  <input
                    type="number"
                    placeholder="$0"
                    min="0"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Max Price</label>
                  <input
                    type="number"
                    placeholder="Any"
                    min="0"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Availability</label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2.5">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                      className="w-4 h-4 rounded border-primary-300 text-primary-900"
                    />
                    <span className="text-sm text-primary-700">In stock only</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-primary-100">
                <button onClick={applyPriceFilter} className="btn-primary btn btn-sm">Apply Price</button>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="btn-ghost btn btn-sm text-error-500">
                    <X className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Active filters chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category !== 'all' && (
                <span className="badge badge-neutral flex items-center gap-1">
                  {CATEGORIES.find((c) => c.id === category)?.name}
                  <button onClick={() => updateParam('category', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="badge badge-neutral flex items-center gap-1">
                  "{search}"
                  <button onClick={() => { setSearchInput(''); updateParam('search', ''); }}><X className="w-3 h-3" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="badge badge-neutral flex items-center gap-1">
                  {minPrice ? formatPrice(minPrice) : '$0'} – {maxPrice ? formatPrice(maxPrice) : '∞'}
                  <button onClick={() => { setPriceMin(''); setPriceMax(''); setSearchParams((p) => { const n = new URLSearchParams(p); n.delete('minPrice'); n.delete('maxPrice'); return n; }); }}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="badge badge-neutral flex items-center gap-1">
                  In Stock
                  <button onClick={() => updateParam('inStock', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Results count */}
          {!loading && !error && (
            <p className="text-sm text-primary-500 mb-4">
              {total === 0 ? 'No products found' : `Showing ${products.length} of ${total} products`}
            </p>
          )}

          {/* Product grid */}
          {error ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptySearch query={search} />
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onViewDetails={setSelectedProduct} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </section>

      {/* Product modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
