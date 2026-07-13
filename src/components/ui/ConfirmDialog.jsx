import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-scale-in p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${danger ? 'bg-error-50' : 'bg-warning-50'}`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-error-500' : 'text-warning-500'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-primary-900 mb-1">{title}</h3>
            <p className="text-sm text-primary-500">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button className="btn-secondary btn-sm btn" onClick={onCancel}>{cancelLabel}</button>
          <button
            className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
