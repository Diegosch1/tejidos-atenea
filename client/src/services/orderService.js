import api from './api';

const orderService = {
  create:       async (metodo_pago, items)  => (await api.post('/orders', { metodo_pago, items })).data,
  getAll:       async (params = {})         => (await api.get('/orders', { params })).data,
  getById:      async (id)                  => (await api.get(`/orders/${id}`)).data,
  updateEstado: async (id, estado)          => (await api.patch(`/orders/${id}/estado`, { estado })).data,
  cancelOwn:    async (id)                  => (await api.patch(`/orders/${id}/cancelar`)).data,
};

export default orderService;