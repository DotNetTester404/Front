import { delay } from '../utils/helpers';

export const cartService = {
  async saveCart(items) {
    await delay(700);
    localStorage.setItem('cart_backup', JSON.stringify({ items, savedAt: new Date().toISOString() }));
    return { success: true, message: 'Cart saved successfully.' };
  },

  async loadCart() {
    await delay(400);
    const saved = localStorage.getItem('cart_backup');
    if (!saved) return { items: [] };
    return JSON.parse(saved);
  },
};
