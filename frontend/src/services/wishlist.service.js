import api from './api'

export const wishlistService = {
  get(usuarioId) {
    return api.get(`/listaDeseos/${usuarioId}`)
  },

  add(usuarioId, juegoId) {
    return api.post(`/listaDeseos/agregar/${usuarioId}/${juegoId}`)
  },

  remove(usuarioId, juegoId) {
    return api.delete(`/listaDeseos/quitar/${usuarioId}/${juegoId}`)
  },
}
