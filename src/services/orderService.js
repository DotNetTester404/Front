import { delay } from '../utils/helpers';
import { MOCK_ORDERS } from '../data/mockData';

export const orderService = {
  async getOrders({ page = 1, limit = 5 } = {}) {
    await delay(700);
    const total = MOCK_ORDERS.length;
    const start = (page - 1) * limit;
    const data = MOCK_ORDERS.slice(start, start + limit);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getOrder(id) {
    await delay(400);
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (!order) throw new Error('Order not found.');
    return order;
  },

  async createOrder(orderData) {
    await delay(1200);
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      shippingCost: orderData.total >= 100 ? 0 : 5.99,
      address: orderData.address || '123 Main St',
      ...orderData,
    };
    return newOrder;
  },

  async cancelOrder(id) {
    await delay(600);
    return { success: true, message: `Order ${id} has been cancelled.` };
  },

  async initiateStripeCheckout(orderData) {
    await delay(1000);
    return {
      sessionId: `cs_test_mock_${Date.now()}`,
      url: null,
      success: true,
    };
  },
};
