import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService } from '../services/cart.service'
import { saleService } from '../services/sale.service'
import { STORAGE_KEYS } from '../config/constants'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const cartId = ref(null)

  const total = computed(() => items.value.reduce((sum, item) => sum + (item.precio || 0), 0))
  const count = computed(() => items.value.length)

  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CART)
      if (raw) {
        const parsed = JSON.parse(raw)
        items.value = parsed.items || []
        cartId.value = parsed.cartId || null
      }
    } catch {
      items.value = []
    }
  }

  function persistLocal() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify({ items: items.value, cartId: cartId.value }))
  }

  async function syncFromBackend(usuarioId) {
    try {
      const { data } = await cartService.get(usuarioId)
      if (data?.juegos) {
        items.value = data.juegos
        cartId.value = data.id
        persistLocal()
      }
    } catch {
      // El carrito puede no existir aún
    }
  }

  async function addGame(usuarioId, juegoId) {
    await cartService.add(usuarioId, juegoId)
    await syncFromBackend(usuarioId)
  }

  function removeGame(juegoId) {
    items.value = items.value.filter((j) => j.id !== juegoId)
    persistLocal()
  }

  function clearLocal() {
    items.value = []
    cartId.value = null
    localStorage.removeItem(STORAGE_KEYS.CART)
  }

  async function checkout(usuarioId) {
    const { data } = await saleService.checkout(usuarioId)
    clearLocal()
    return data
  }

  loadLocal()

  return { items, cartId, total, count, syncFromBackend, addGame, removeGame, clearLocal, checkout }
})
