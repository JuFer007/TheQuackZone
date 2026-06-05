import api from './api'

export const reviewService = {
  getByJuego(juegoId) {
    return api.get(`/resenas/juego/${juegoId}`)
  },

  getPromedio(juegoId) {
    return api.get(`/resenas/juego/${juegoId}/promedio`)
  },

  crear(resena) {
    return api.post('/resenas', resena)
  }
}
