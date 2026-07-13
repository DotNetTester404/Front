import { delay } from '../utils/helpers';

const MOCK_USER = {
  id: 'usr_001',
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex@example.com',
  address: '123 Main Street, New York, NY 10001',
  avatar: null,
  createdAt: '2024-01-15T00:00:00.000Z',
};

export const authService = {
  async login(email, password) {
    await delay(900);
    if (!email || !password) throw new Error('Email and password are required.');
    if (password.length < 6) throw new Error('Invalid credentials.');
    const token = `jwt_mock_${btoa(email)}_${Date.now()}`;
    const user = { ...MOCK_USER, email };
    return { token, user };
  },

  async register(data) {
    await delay(1100);
    const { firstName, lastName, email, password } = data;
    if (!firstName || !lastName || !email || !password) {
      throw new Error('All fields are required.');
    }
    const token = `jwt_mock_${btoa(email)}_${Date.now()}`;
    const user = { ...MOCK_USER, firstName, lastName, email, id: `usr_${Date.now()}` };
    return { token, user };
  },

  async logout() {
    await delay(300);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  },

  async refreshToken() {
    await delay(500);
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found.');
    return { token: `${token}_refreshed` };
  },
};
