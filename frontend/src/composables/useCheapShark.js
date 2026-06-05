import { ref } from 'vue'
import { cheapsharkService } from '../services/cheapshark.service'

const dealCache = new Map()
const storesPromise = cheapsharkService.getStores().then((stores) => {
  const map = new Map()
  for (const s of stores) map.set(String(s.storeID), s.storeName)
  return map
}).catch(() => new Map())

let batchTimeout = null
const batchQueue = new Set()
let batchResolvers = []

function resolveBatch() {
  if (batchQueue.size === 0) return
  const titles = [...batchQueue]
  const resolvers = [...batchResolvers]
  batchQueue.clear()
  batchResolvers = []
  batchTimeout = null

  cheapsharkService.getBatchDeals(titles).then(async (results) => {
    const storeMap = await storesPromise
    for (const rawTitle of titles) {
      const deal = results[rawTitle]
      let parsed = null
      if (deal && parseFloat(deal.savings) > 0) {
        parsed = {
          onSale: true,
          salePrice: parseFloat(deal.salePrice),
          normalPrice: parseFloat(deal.normalPrice),
          savings: Math.round(parseFloat(deal.savings)),
          storeID: String(deal.storeID),
          storeName: storeMap.get(String(deal.storeID)) || 'Desconocida',
          dealID: deal.dealID,
          steamRating: deal.steamRatingPercent,
          metacritic: deal.metacriticScore,
        }
      }
      dealCache.set(rawTitle.toLowerCase(), parsed)
    }
    for (const r of resolvers) r()
  }).catch(() => {
    for (const rawTitle of titles) dealCache.set(rawTitle.toLowerCase(), null)
    for (const r of resolvers) r()
  })
}

function enqueueTitle(title) {
  if (!title) return
  const key = title.toLowerCase()
  if (dealCache.has(key)) return
  batchQueue.add(title)
  if (!batchTimeout) {
    batchTimeout = setTimeout(resolveBatch, 150)
  }
}

export function useCheapShark() {
  const loading = ref(false)

  async function getDeal(title) {
    if (!title) return null
    const key = title.toLowerCase()
    if (dealCache.has(key)) return dealCache.get(key)

    loading.value = true
    return new Promise((resolve) => {
      batchResolvers.push(() => {
        loading.value = false
        resolve(dealCache.get(key))
      })
      enqueueTitle(title)
    })
  }

  function clearCache() {
    dealCache.clear()
  }

  return { getDeal, loading, clearCache }
}
