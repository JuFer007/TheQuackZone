import api from './api'

export const cartService = {
  get(usuarioId) {
    return api.get(`/carrito/${usuarioId}`)
  },

  add(usuarioId, juegoId) {
    return api.post('/carrito/agregar', null, { params: { usuarioId, juegoId } })
  },

  clear(usuarioId) {
    return api.delete(`/carrito/vaciar/${usuarioId}`)
  },
}
