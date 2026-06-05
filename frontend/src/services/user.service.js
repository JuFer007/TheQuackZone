import api from './api'

export const userService = {
  get(usuarioId) {
    return api.get(`/usuario/${usuarioId}`)
  },

  update(usuarioId, data) {
    return api.post(`/usuario/actualizar/${usuarioId}`, data)
  },
}
