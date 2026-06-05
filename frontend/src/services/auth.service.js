import api from './api'

export const authService = {
  login(correo, contraseña) {
    return api.post('/usuario/login', { correo, contraseña })
  },

  register(userData) {
    return api.post('/usuario/registrar', userData)
  },

  getProfile(userId) {
    return api.get(`/usuario/${userId}`)
  },

  update(userId, data) {
    return api.post(`/usuario/actualizar/${userId}`, data)
  },
}
