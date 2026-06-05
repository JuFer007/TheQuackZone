const axios = require('axios')
const config = require('../config')

let accessToken = null
let tokenExpiresAt = 0

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken
  }

  const params = new URLSearchParams({
    client_id: config.igdb.clientId,
    client_secret: config.igdb.clientSecret,
    grant_type: 'client_credentials',
  })

  const { data } = await axios.post(config.igdb.authUrl, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  accessToken = data.access_token
  tokenExpiresAt = Date.now() + data.expires_in * 1000

  console.log('[IGDB] Token renovado, expira en', data.expires_in, 'segundos')

  return accessToken
}

async function queryIGDB(endpoint, body = '') {
  const token = await getAccessToken()

  const { data } = await axios.post(`${config.igdb.baseUrl}/${endpoint}`, body, {
    headers: {
      'Client-ID': config.igdb.clientId,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  return data
}

async function searchGames(query, limit = 10) {
  const body = `
    search "${query}";
    fields name,slug,cover.*,first_release_date,genres.*,platforms.*,rating,summary,storyline,total_rating,total_rating_count;
    limit ${limit};
  `
  return queryIGDB('games', body)
}

async function getGameById(id) {
  const body = `
    where id = ${id};
    fields name,slug,cover.*,screenshots.*,videos.*,first_release_date,genres.*,platforms.*,rating,rating_count,summary,storyline,total_rating,total_rating_count,age_ratings.*,involved_companies.*.company.*;
    limit 1;
  `
  const results = await queryIGDB('games', body)
  return results[0] || null
}

async function getGameScreenshots(gameId) {
  const body = `
    where game = ${gameId};
    fields url,width,height,image_id;
    limit 20;
  `
  return queryIGDB('screenshots', body)
}

async function getGameVideos(gameId) {
  const body = `
    where game = ${gameId};
    fields name,video_id;
    limit 10;
  `
  return queryIGDB('game_videos', body)
}

async function getGenres() {
  return queryIGDB('genres', 'fields name,slug; limit 50;')
}

async function getPlatforms() {
  return queryIGDB('platforms', 'fields name,slug,abbreviation; limit 50;')
}

async function getCovers(gameIds) {
  const body = `
    where game = (${gameIds.join(',')});
    fields url,width,height,image_id,game;
    limit 50;
  `
  return queryIGDB('covers', body)
}

module.exports = {
  searchGames,
  getGameById,
  getGameScreenshots,
  getGameVideos,
  getGenres,
  getPlatforms,
  getCovers,
}
