const { Router } = require('express')
const cheapshark = require('../services/cheapshark.service')

const router = Router()

router.get('/deals', async (req, res) => {
  try {
    const deals = await cheapshark.getDeals(req.query)
    res.json(deals)
  } catch (err) {
    console.error('[CheapShark] Error en /deals:', err.message)
    res.status(500).json({ error: 'Error al obtener ofertas' })
  }
})

router.post('/batch', async (req, res) => {
  try {
    const { titles } = req.body
    if (!titles || !Array.isArray(titles) || titles.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de titles' })
    }
    const results = await cheapshark.getBatchDeals(titles)
    res.json(results)
  } catch (err) {
    console.error('[CheapShark] Error en /batch:', err.message)
    res.status(500).json({ error: 'Error al obtener ofertas batch' })
  }
})

router.get('/games', async (req, res) => {
  try {
    if (!req.query.title) {
      return res.status(400).json({ error: 'El parámetro title es requerido' })
    }
    const games = await cheapshark.getGameInfo(req.query.title, req.query.exact === 'true')
    res.json(games)
  } catch (err) {
    console.error('[CheapShark] Error en /games:', err.message)
    res.status(500).json({ error: 'Error al buscar juego' })
  }
})

router.get('/stores', async (_req, res) => {
  try {
    const stores = await cheapshark.getStores()
    res.json(stores)
  } catch (err) {
    console.error('[CheapShark] Error en /stores:', err.message)
    res.status(500).json({ error: 'Error al obtener tiendas' })
  }
})

module.exports = router
