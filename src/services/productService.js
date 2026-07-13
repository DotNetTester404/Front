import { delay } from '../utils/helpers';
import { MOCK_PRODUCTS } from '../data/mockData';

export const productService = {
  async getProducts({ page = 1, limit = 12, category, search, minPrice, maxPrice, inStock, sortBy } = {}) {
    await delay(600);
    let products = [...MOCK_PRODUCTS];

    if (category && category !== 'all') {
      products = products.filter((p) => p.categoryId === category);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (minPrice !== undefined) products = products.filter((p) => p.price >= minPrice);
    if (maxPrice !== undefined) products = products.filter((p) => p.price <= maxPrice);
    if (inStock) products = products.filter((p) => p.inStock);

    if (sortBy === 'price_asc') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') products.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') products.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'newest') products.sort((a, b) => b.id - a.id);

    const total = products.length;
    const start = (page - 1) * limit;
    const data = products.slice(start, start + limit);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getProduct(id) {
    await delay(400);
    const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));
    if (!product) throw new Error('Product not found.');
    return product;
  },

  async getFeatured() {
    await delay(500);
    return MOCK_PRODUCTS.filter((p) => p.featured);
  },

  async getByCategory(categoryId, limit = 6) {
    await delay(400);
    return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId).slice(0, limit);
  },
};
