import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, ExternalLink } from 'lucide-react';

function SocialIcon({ href, label }) {
  return (
    <a href={href} className="p-2 rounded-lg bg-primary-800 hover:bg-primary-700 transition-colors text-xs font-semibold text-primary-300 hover:text-white">
      {label}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-primary-300 mt-auto">
      <div className="page-container py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary-950" />
              </div>
              <span className="font-bold text-xl text-white">ShopLux</span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-400">
              Modern ecommerce for modern shoppers. Quality products, seamless experience.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <SocialIcon href="#" label="FB" />
              <SocialIcon href="#" label="IG" />
              <SocialIcon href="#" label="X" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {['Home', 'Electronics', 'Clothing', 'Books', 'Accessories', 'Sports'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Profile', to: '/profile' },
                { label: 'My Orders', to: '/orders' },
                { label: 'Cart', to: '/cart' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
                { label: 'Contact Us', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary-500" />
                support@shoplux.com
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary-500" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <ExternalLink className="w-4 h-4 flex-shrink-0 text-primary-500" />
                facebook.com/ShopLux
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <ExternalLink className="w-4 h-4 flex-shrink-0 text-primary-500" />
                instagram.com/shoplux
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <ExternalLink className="w-4 h-4 flex-shrink-0 text-primary-500" />
                x.com/shoplux
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-500">&copy; {year} ShopLux. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-primary-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
