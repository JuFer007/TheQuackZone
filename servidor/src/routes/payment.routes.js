const { Router } = require('express')
const payment = require('../services/payment.service')

const router = Router()

router.post('/simulate', (req, res) => {
  try {
    const { cardNumber, expiry, cvv, amount, cardHolder } = req.body

    if (!cardNumber || !expiry || !cvv || amount == null || !cardHolder) {
      return res.status(400).json({ error: 'Todos los campos son requeridos: cardNumber, expiry, cvv, amount, cardHolder' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser un número positivo' })
    }

    const result = payment.simularPago({ cardNumber, expiry, cvv, amount, cardHolder })
    res.json(result)
  } catch (err) {
    console.error('[Payment] Error:', err.message)
    res.status(500).json({ error: 'Error al procesar el pago' })
  }
})

module.exports = router
