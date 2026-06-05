import api from './api'

export const gameService = {
  getAll() {
    return api.get('/juegos')
  },

  getBySection(section) {
    return api.get(`/juegos/seccion/${section}`)
  },

  getById(id) {
    return api.get(`/juegos/${id}`)
  },

  search(query) {
    return api.get('/juegos/buscar', { params: { q: query } })
  },

  checkRawgExists(rawgId) {
    return api.get(`/juegos/rawg-exists/${rawgId}`)
  },

  checkRawgExistsBatch(rawgIds) {
    return api.post('/juegos/rawg-exists/batch', rawgIds)
  },
}
