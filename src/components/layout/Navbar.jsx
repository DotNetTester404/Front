import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Package, LogOut, ChevronDown, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/?section=categories', label: 'Categories' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-white border-b border-primary-100'}`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center group-hover:bg-primary-800 transition-colors">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-primary-900 tracking-tight">ShopLux</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? 'text-primary-900 bg-primary-100' : 'text-primary-600 hover:text-primary-900 hover:bg-primary-50'
                }`}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/orders"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/orders') ? 'text-primary-900 bg-primary-100' : 'text-primary-600 hover:text-primary-900 hover:bg-primary-50'
                }`}
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-primary-600 hover:text-primary-900 hover:bg-primary-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-primary-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-900 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-primary-800">{user?.firstName}</span>
                  <ChevronDown className={`w-4 h-4 text-primary-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-large border border-primary-100 py-1 animate-scale-in">
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <div className="border-t border-primary-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost btn btn-sm">Login</Link>
                <Link to="/register" className="btn-primary btn btn-sm">Register</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-primary-600 hover:text-primary-900 hover:bg-primary-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-100 bg-white animate-fade-in">
          <div className="page-container py-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors"
              >
                {label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link to="/orders" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-error-600 hover:bg-error-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 btn-secondary btn btn-sm justify-center">Login</Link>
                <Link to="/register" className="flex-1 btn-primary btn btn-sm justify-center">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
