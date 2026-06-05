import { API_SERVICE_URL } from '../config'

export const cheapsharkService = {
  async getDeals(params = {}) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.set(k, v)
    })
    const res = await fetch(`${API_SERVICE_URL}/api/cheapshark/deals?${query}`)
    if (!res.ok) throw new Error(`CheapShark deals error: ${res.status}`)
    return res.json()
  },

  async getBatchDeals(titles) {
    const res = await fetch(`${API_SERVICE_URL}/api/cheapshark/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titles }),
    })
    if (!res.ok) throw new Error(`CheapShark batch error: ${res.status}`)
    return res.json()
  },

  async getGameInfo(title, exact = false) {
    const res = await fetch(
      `${API_SERVICE_URL}/api/cheapshark/games?title=${encodeURIComponent(title)}&exact=${exact}`
    )
    if (!res.ok) throw new Error(`CheapShark games error: ${res.status}`)
    return res.json()
  },

  async getStores() {
    const res = await fetch(`${API_SERVICE_URL}/api/cheapshark/stores`)
    if (!res.ok) throw new Error(`CheapShark stores error: ${res.status}`)
    return res.json()
  },
}
