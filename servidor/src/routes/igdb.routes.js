const { Router } = require('express')
const igdb = require('../services/igdb.service')

const router = Router()

router.get('/games', async (req, res) => {
  try {
    const { search, limit } = req.query
    if (!search) {
      return res.status(400).json({ error: 'El parámetro "search" es requerido' })
    }
    const games = await igdb.searchGames(search, parseInt(limit, 10) || 10)
    res.json(games)
  } catch (err) {
    console.error('[IGDB] Error en GET /games:', err.message)
    res.status(500).json({ error: 'Error al buscar juegos en IGDB' })
  }
})

router.get('/games/:id', async (req, res) => {
  try {
    const game = await igdb.getGameById(parseInt(req.params.id, 10))
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' })
    }
    res.json(game)
  } catch (err) {
    console.error('[IGDB] Error en GET /games/:id:', err.message)
    res.status(500).json({ error: 'Error al obtener detalle del juego' })
  }
})

router.get('/games/:id/screenshots', async (req, res) => {
  try {
    const screenshots = await igdb.getGameScreenshots(parseInt(req.params.id, 10))
    res.json(screenshots)
  } catch (err) {
    console.error('[IGDB] Error en GET /games/:id/screenshots:', err.message)
    res.status(500).json({ error: 'Error al obtener screenshots' })
  }
})

router.get('/games/:id/videos', async (req, res) => {
  try {
    const videos = await igdb.getGameVideos(parseInt(req.params.id, 10))
    res.json(videos)
  } catch (err) {
    console.error('[IGDB] Error en GET /games/:id/videos:', err.message)
    res.status(500).json({ error: 'Error al obtener videos' })
  }
})

router.get('/genres', async (_req, res) => {
  try {
    const genres = await igdb.getGenres()
    res.json(genres)
  } catch (err) {
    console.error('[IGDB] Error en GET /genres:', err.message)
    res.status(500).json({ error: 'Error al obtener géneros' })
  }
})

router.get('/platforms', async (_req, res) => {
  try {
    const platforms = await igdb.getPlatforms()
    res.json(platforms)
  } catch (err) {
    console.error('[IGDB] Error en GET /platforms:', err.message)
    res.status(500).json({ error: 'Error al obtener plataformas' })
  }
})

module.exports = router
