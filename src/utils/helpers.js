export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateStr));

export const truncate = (str, maxLen) =>
  str && str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;

export const clsx = (...classes) => classes.filter(Boolean).join(' ');

export const calcCartTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const calcCartCount = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const getStatusColor = (status) => {
  const map = {
    Pending: 'bg-warning-50 text-warning-600',
    Confirmed: 'bg-accent-100 text-accent-700',
    Processing: 'bg-blue-50 text-blue-700',
    Shipped: 'bg-purple-50 text-purple-700',
    Delivered: 'bg-success-50 text-success-700',
    Cancelled: 'bg-error-50 text-error-600',
  };
  return map[status] || 'bg-primary-100 text-primary-600';
};

export const getStatusStep = (status) => {
  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  return steps.indexOf(status);
};
