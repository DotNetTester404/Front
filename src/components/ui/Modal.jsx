import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { clsx } from '../../utils/helpers';

export default function Modal({ isOpen, onClose, title, children, size = 'lg', className = '' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <div
      ref={overlayRef}
      className="modal-overlay animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={clsx('modal-content w-full', sizes[size], className)}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary-100">
            <h2 className="text-lg font-semibold text-primary-900">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary-100 transition-colors">
              <X className="w-5 h-5 text-primary-500" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-white/80 hover:bg-primary-100 transition-colors shadow-soft"
          >
            <X className="w-5 h-5 text-primary-700" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
