const express = require('express')
const path = require('path')
const cors = require('cors')
const config = require('./config')
const igdbRoutes = require('./routes/igdb.routes')
const cheapsharkRoutes = require('./routes/cheapshark.routes')
const rawgRoutes = require('./routes/rawg.routes')
const emailRoutes = require('./routes/email.routes')
const paymentRoutes = require('./routes/payment.routes')

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use('/recursos', express.static(path.resolve(__dirname, '../../frontend/public/recursos')))

app.use('/api/igdb', igdbRoutes)
app.use('/api/cheapshark', cheapsharkRoutes)
app.use('/api/rawg', rawgRoutes)
app.use('/api/email', emailRoutes)
app.use('/api/payment', paymentRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'thequackzone-api-service' })
})

app.listen(config.port, () => {
  console.log(`[TheQuackZone API Service] corriendo en http://localhost:${config.port}`)
})
