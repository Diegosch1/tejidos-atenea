import api from './api';

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export const productService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.precio_min)  params.append('precio_min',  filters.precio_min);
    if (filters.precio_max)  params.append('precio_max',  filters.precio_max);
    params.append('page',  filters.page  || 1);
    params.append('limit', filters.limit || 12);
    const { data } = await api.get(`/products?${params}`);
    return data;
  },

  getAllAdmin: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.precio_min)  params.append('precio_min',  filters.precio_min);
    if (filters.precio_max)  params.append('precio_max',  filters.precio_max);
    params.append('page',  filters.page  || 1);
    params.append('limit', filters.limit || 100);
    const { data } = await api.get(`/products/admin/all?${params}`);
    return data;
  },

  getById: async (id) => (await api.get(`/products/${id}`)).data,

  create: async (formData) =>
    (await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,

  update: async (id, formData) =>
    (await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,

  remove: async (id) => (await api.delete(`/products/${id}`)).data,

  reactivate: async (id) => (await api.patch(`/products/${id}/reactivate`)).data,    

  imgUrl: (path) => path ? `${BASE}/uploads/${path}` : null,
};