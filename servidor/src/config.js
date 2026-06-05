const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
})

module.exports = {
  port: parseInt(process.env.API_SERVICE_PORT, 10) || 4000,
  igdb: {
    clientId: process.env.IGDB_CLIENT_ID,
    clientSecret: process.env.IGDB_CLIENT_SECRET,
    baseUrl: 'https://api.igdb.com/v4',
    authUrl: 'https://id.twitch.tv/oauth2/token',
  },
  rawg: {
    apiKey: process.env.RAWG_API_KEY,
    baseUrl: process.env.RAWG_BASE_URL || 'https://api.rawg.io/api',
  },
  email: {
    user: process.env.GMAIL_USER,
    appPassword: process.env.GMAIL_APP_PASSWORD,
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
}
