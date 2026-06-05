import axios from 'axios'
import { API_SERVICE_URL } from '../config'

const rawgApi = axios.create({
  baseURL: `${API_SERVICE_URL}/api/rawg`,
})

export const rawgService = {
  listarJuegos({ pageSize = 20, page = null, genres = null, q = null, tags = null, platforms = null, ordering = null, searchExact = null, metacritic = null } = {}) {
    const params = { pageSize }
    if (page) params.page = page
    if (genres) params.genres = genres
    if (q) params.q = q
    if (tags) params.tags = tags
    if (platforms) params.platforms = platforms
    if (ordering) params.ordering = ordering
    if (searchExact) params.searchExact = true
    if (metacritic) params.metacritic = metacritic
    return rawgApi.get('/juegos', { params })
  },

  obtenerJuego(id) {
    return rawgApi.get(`/juegos/${id}`)
  },

  listarGeneros() {
    return rawgApi.get('/generos')
  },

  obtenerScreenshots(gameId) {
    return rawgApi.get(`/juegos/${gameId}/screenshots`)
  },
}
