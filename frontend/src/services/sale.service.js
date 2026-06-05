import api from './api'

export const saleService = {
  checkout(usuarioId) {
    return api.post('/venta/comprar', null, { params: { usuarioId } })
  },

  getHistory(usuarioId) {
    return api.get(`/venta/historial/${usuarioId}`)
  },

  getStats(usuarioId) {
    return api.get(`/venta/estadisticas/${usuarioId}`)
  },
}
