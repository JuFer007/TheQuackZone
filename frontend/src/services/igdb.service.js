import { API_SERVICE_URL } from '../config'

async function request(path) {
  const res = await fetch(`${API_SERVICE_URL}/api/igdb${path}`)
  if (!res.ok) {
    throw new Error(`IGDB request failed: ${res.status}`)
  }
  return res.json()
}

export const igdbService = {
  searchGames(query, limit = 10) {
    return request(`/games?search=${encodeURIComponent(query)}&limit=${limit}`)
  },

  getGameById(id) {
    return request(`/games/${id}`)
  },

  getGameScreenshots(gameId) {
    return request(`/games/${gameId}/screenshots`)
  },

  getGameVideos(gameId) {
    return request(`/games/${gameId}/videos`)
  },

  getGenres() {
    return request('/genres')
  },

  getPlatforms() {
    return request('/platforms')
  },
}
