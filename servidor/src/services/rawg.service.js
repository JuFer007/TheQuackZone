const axios = require('axios')
const config = require('../config')

const api = axios.create({
  baseURL: config.rawg.baseUrl,
  params: { key: config.rawg.apiKey },
})

function parseGenres(rawGenres) {
  if (!rawGenres) return []
  if (Array.isArray(rawGenres)) return rawGenres.map(g => ({ id: g.id, name: g.name, slug: g.slug }))
  return []
}

function parsePlatforms(rawPlatforms) {
  if (!rawPlatforms) return []
  return rawPlatforms.map(p => ({
    id: p.platform?.id,
    name: p.platform?.name,
    slug: p.platform?.slug,
    released_at: p.released_at,
  }))
}

function parseParentPlatforms(raw) {
  if (!raw) return []
  return raw.map(p => ({
    id: p.platform?.id,
    name: p.platform?.name,
    slug: p.platform?.slug,
  }))
}

function parseTags(raw) {
  if (!raw) return []
  return raw.map(t => ({ id: t.id, name: t.name, slug: t.slug }))
}

function parseScreenshots(raw) {
  if (!raw) return []
  return raw.map(s => ({ id: s.id, image: s.image, hidden: s.hidden }))
}

function mapGame(raw) {
  const game = {
    id: raw.id,
    name: raw.name,
    released: raw.released,
    slug: raw.slug,
    background_image: raw.background_image,
    rating: raw.rating,
    rating_top: raw.rating_top,
    ratings_count: raw.ratings_count,
    reviews_count: raw.reviews_count,
    metacritic: raw.metacritic,
    playtime: raw.playtime,
    updated: raw.updated,
    description_raw: raw.description_raw,
    genres: parseGenres(raw.genres),
    platforms: parsePlatforms(raw.platforms),
    parent_platforms: parseParentPlatforms(raw.parent_platforms),
    tags: parseTags(raw.tags),
    short_screenshots: parseScreenshots(raw.short_screenshots),
  }
  if (raw.esrb_rating) {
    game.esrb_rating = { id: raw.esrb_rating.id, name: raw.esrb_rating.name, slug: raw.esrb_rating.slug }
  }
  if (raw.clip) {
    game.clip = raw.clip.clips?.full || raw.clip.clips?.medium || null
  }
  return game
}

async function buscarJuegos({ query, pageSize = 20, page, genres, tags, ordering, platforms, searchExact, metacritic } = {}) {
  const params = { page_size: pageSize }
  if (page) params.page = page
  if (query) params.search = query
  if (searchExact) params.search_exact = 'true'
  if (genres) params.genres = genres
  if (tags) params.tags = tags
  if (ordering) params.ordering = ordering
  if (platforms) params.platforms = platforms
  if (metacritic) params.metacritic = metacritic

  const { data } = await api.get('/games', { params })
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: (data.results || []).map(mapGame),
  }
}

async function obtenerJuego(id) {
  const { data } = await api.get(`/games/${id}`)
  return mapGame(data)
}

async function listarGeneros() {
  const { data } = await api.get('/genres')
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: (data.results || []).map(g => ({ id: g.id, name: g.name, slug: g.slug })),
  }
}

async function obtenerScreenshots(gameId) {
  const { data } = await api.get(`/games/${gameId}/screenshots`)
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: parseScreenshots(data.results),
  }
}

module.exports = { buscarJuegos, obtenerJuego, listarGeneros, obtenerScreenshots }
