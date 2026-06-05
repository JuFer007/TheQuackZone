const axios = require('axios')
const fs = require('fs')
const path = require('path')

const BASE_URL = 'https://www.cheapshark.com/api/1.0'
const CACHE_FILE = path.join(__dirname, '..', '..', 'data', 'cheapshark-cache.json')

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'User-Agent': 'TheQuackZone/1.0 (contacto@thequackzone.com)' },
})

/* ── Caché en memoria + archivo ── */
const cache = new Map()
const CACHE_TTL = 10 * 60 * 1000
const FAIL_TTL = 60 * 1000

fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true })

function loadDiskCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8')
      const data = JSON.parse(raw)
      for (const [k, v] of Object.entries(data)) {
        cache.set(k, v)
      }
    }
  } catch { /* ignore */ }
}

function saveDiskCache() {
  try {
    const obj = {}
    for (const [k, v] of cache) {
      if (v.data !== null) obj[k] = v
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj), 'utf-8')
  } catch { /* ignore */ }
}

loadDiskCache()

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return undefined
  const ttl = entry.data === null ? FAIL_TTL : CACHE_TTL
  if (Date.now() - entry.ts > ttl) {
    cache.delete(key)
    return undefined
  }
  return entry.data
}

function setCache(key, data) {
  cache.set(key, { ts: Date.now(), data })
  if (data !== null) saveDiskCache()
}

/* ── Cola de requests ── */
const requestQueue = []
let processing = false
let lastRequestTime = 0
let consecutive429s = 0

async function processQueue() {
  if (processing) return
  processing = true
  while (requestQueue.length > 0) {
    const elapsed = Date.now() - lastRequestTime
    const baseDelay = 1200 + Math.min(consecutive429s * 500, 10000)
    if (elapsed < baseDelay) {
      await new Promise((r) => setTimeout(r, baseDelay - elapsed))
    }

    const { fn, resolve, reject, retries = 0 } = requestQueue.shift()
    try {
      const result = await fn()
      consecutive429s = Math.max(0, consecutive429s - 1)
      lastRequestTime = Date.now()
      resolve(result)
    } catch (e) {
      if (e.response?.status === 429) {
        consecutive429s++
        const backoff = Math.min(5000 * Math.pow(2, consecutive429s), 60000)
        console.warn(`[CheapShark] 429 (${consecutive429s}x), backoff ${backoff}ms`)
        await new Promise((r) => setTimeout(r, backoff))
        requestQueue.unshift({ fn, resolve, reject, retries: retries + 1 })
      } else {
        console.error(`[CheapShark] Error:`, e.message)
        reject(e)
      }
      lastRequestTime = Date.now()
    }
  }
  processing = false
}

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ fn, resolve, reject })
    processQueue()
  })
}

/* ── Funciones ── */

async function getDeals(opts = {}) {
  const { title, storeID, pageSize, sortBy, onSale, lowerPrice, upperPrice, metacritic, steamRating } = opts
  const cacheKey = `deals:${title || ''}:${storeID || ''}:${pageSize || 20}`
  const cached = getCached(cacheKey)
  if (cached !== undefined) return cached

  const params = { pageSize: pageSize || 20 }
  if (title) params.title = title
  if (storeID) params.storeID = storeID
  if (onSale) params.onSale = '1'
  if (sortBy) params.sortBy = sortBy
  if (lowerPrice) params.lowerPrice = lowerPrice
  if (upperPrice) params.upperPrice = upperPrice
  if (metacritic) params.metacritic = metacritic
  if (steamRating) params.steamRating = steamRating

  const data = await enqueue(() => api.get('/deals', { params }).then((r) => r.data))
  setCache(cacheKey, data)
  return data
}

async function getAllDeals() {
  const cached = getCached('__all_deals__')
  if (cached !== undefined) return cached

  try {
    const data = await enqueue(() =>
      api.get('/deals', { params: { pageSize: 5000 } }).then((r) => r.data)
    )
    setCache('__all_deals__', data)
    return data
  } catch (e) {
    if (e.response?.status === 429) {
      const cachedFail = cache.get('__all_deals__')
      if (cachedFail && cachedFail.data === null) {
        const age = Date.now() - cachedFail.ts
        if (age < 30000) return null
      }
    }
    setCache('__all_deals__', null)
    return null
  }
}

function normalizeTitle(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
}

function fuzzyMatch(a, b) {
  const na = normalizeTitle(a)
  const nb = normalizeTitle(b)
  return na === nb || nb.startsWith(na) || na.startsWith(nb) || nb.includes(na) || na.includes(nb)
}

async function getDealByTitle(title) {
  if (!title) return null
  const key = `deal:${title.toLowerCase()}`
  const cached = getCached(key)
  if (cached !== undefined) return cached

  try {
    const allDeals = await getAllDeals()
    if (!allDeals) {
      const r = await getDeals({ title, pageSize: 5 })
      const match = r.find((d) => fuzzyMatch(title, d.title))
      setCache(key, match || null)
      return match || null
    }
    const match = allDeals.find((d) => fuzzyMatch(title, d.title))
    setCache(key, match || null)
    return match || null
  } catch (e) {
    console.error(`[CheapShark] getDealByTitle("${title}"):`, e.message)
    setCache(key, null)
    return null
  }
}

async function getBatchDeals(titles) {
  const allDeals = await getAllDeals().catch(() => null)
  const results = {}
  for (const title of titles) {
    const key = `deal:${title.toLowerCase()}`
    const cached = getCached(key)
    if (cached !== undefined) {
      results[title] = cached
      continue
    }
    if (allDeals) {
      const match = allDeals.find((d) => fuzzyMatch(title, d.title))
      setCache(key, match || null)
      results[title] = match || null
    } else {
      try {
        const r = await getDeals({ title, pageSize: 5 })
        const match = r.find((d) => fuzzyMatch(title, d.title))
        setCache(key, match || null)
        results[title] = match || null
      } catch {
        setCache(key, null)
        results[title] = null
      }
    }
  }
  return results
}

async function getGameInfo(title, exact = false) {
  const key = `games:${title}:${exact}`
  const cached = getCached(key)
  if (cached !== undefined) return cached

  const data = await enqueue(() =>
    api.get('/games', { params: { title, exact: exact ? '1' : '0' } }).then((r) => r.data)
  )
  setCache(key, data)
  return data
}

async function getStores() {
  const cached = getCached('stores')
  if (cached !== undefined) return cached

  const data = await enqueue(() => api.get('/stores').then((r) => r.data))
  setCache('stores', data)
  return data
}

module.exports = { getDeals, getDealByTitle, getBatchDeals, getGameInfo, getStores }
