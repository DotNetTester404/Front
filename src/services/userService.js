import { delay } from '../utils/helpers';

export const userService = {
  async getProfile() {
    await delay(500);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  },

  async updateProfile(data) {
    await delay(800);
    const existing = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  },

  async changePassword(currentPassword, newPassword) {
    await delay(900);
    if (!currentPassword || !newPassword) throw new Error('Both passwords are required.');
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters.');
    return { success: true, message: 'Password changed successfully.' };
  },
};
