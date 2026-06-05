const { Router } = require('express')
const email = require('../services/email.service')

const router = Router()

router.post('/send', async (req, res) => {
  try {
    const { to, subject, html } = req.body

    if (!to || !subject || !html) {
      return res.status(400).json({
        error: 'Los campos to, subject y html son requeridos',
      })
    }

    const result = await email.sendEmail({ to, subject, html })
    res.json({ success: true, messageId: result.messageId })
  } catch (err) {
    console.error('[Email] Error al enviar email:', err.message)
    res.status(500).json({ error: 'Error al enviar el email' })
  }
})

module.exports = router
