import api from './api';

const KEY = 'ta_user';

const authService = {
  register: async (email, password, nombre, apellido = '') => {
    const { data } = await api.post('/auth/register', { email, password, nombre, apellido });
    localStorage.setItem(KEY, JSON.stringify(data.user));
    return data;
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem(KEY, JSON.stringify(data.user));
    return data;
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem(KEY);
  },

  getMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      return data.user;
    } catch (_) { return null; }
  },

  getLocal: () => {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  }
};

export default authService;