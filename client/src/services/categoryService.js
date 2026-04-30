import api from './api';

const categoryService = {
  getAll:  async ()                         => (await api.get('/categories')).data,
  getById: async (id)                       => (await api.get(`/categories/${id}`)).data,
  create:  async (nombre, descripcion)      => (await api.post('/categories', { nombre, descripcion })).data,
  update:  async (id, nombre, descripcion)  => (await api.put(`/categories/${id}`, { nombre, descripcion })).data,
  remove:  async (id)                       => (await api.delete(`/categories/${id}`)).data,
};

export default categoryService;