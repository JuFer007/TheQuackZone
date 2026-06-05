const { Router } = require('express')
const rawg = require('../services/rawg.service')

const router = Router()

router.get('/juegos', async (req, res) => {
  try {
    const { pageSize, page, q, genres, tags, platforms, ordering, searchExact, metacritic } = req.query
    const result = await rawg.buscarJuegos({
      query: q,
      pageSize: parseInt(pageSize, 10) || 20,
      page: parseInt(page, 10) || undefined,
      genres,
      tags,
      ordering,
      platforms,
      searchExact: searchExact === 'true',
      metacritic,
    })
    res.json(result)
  } catch (err) {
    console.error('[RAWG] Error en GET /juegos:', err.message)
    res.status(500).json({ error: 'Error al buscar juegos en RAWG' })
  }
})

router.get('/juegos/:id', async (req, res) => {
  try {
    const game = await rawg.obtenerJuego(parseInt(req.params.id, 10))
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' })
    }
    res.json(game)
  } catch (err) {
    console.error('[RAWG] Error en GET /juegos/:id:', err.message)
    res.status(500).json({ error: 'Error al obtener detalle del juego' })
  }
})

router.get('/generos', async (_req, res) => {
  try {
    const genres = await rawg.listarGeneros()
    res.json(genres)
  } catch (err) {
    console.error('[RAWG] Error en GET /generos:', err.message)
    res.status(500).json({ error: 'Error al obtener géneros' })
  }
})

router.get('/juegos/:id/screenshots', async (req, res) => {
  try {
    const screenshots = await rawg.obtenerScreenshots(parseInt(req.params.id, 10))
    res.json(screenshots)
  } catch (err) {
    console.error('[RAWG] Error en GET /juegos/:id/screenshots:', err.message)
    res.status(500).json({ error: 'Error al obtener screenshots' })
  }
})

module.exports = router
