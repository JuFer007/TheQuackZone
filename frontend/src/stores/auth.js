import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth.service'
import { saleService } from '../services/sale.service'
import { STORAGE_KEYS } from '../config/constants'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(loadUser())
  const token = ref(localStorage.getItem(STORAGE_KEYS.TOKEN))
  const ownedGameIds = ref(new Set())

  const isLoggedIn = computed(() => !!user.value && !!token.value)

  function loadUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function persist(userData, jwtToken) {
    user.value = userData
    token.value = jwtToken
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    localStorage.setItem(STORAGE_KEYS.TOKEN, jwtToken)
  }

  async function login(correo, contraseña) {
    const { data } = await authService.login(correo, contraseña)
    persist(data.usuario, data.token)
    await cargarJuegosComprados(data.usuario.id)
    return data
  }

  async function register(userData) {
    const { data } = await authService.register(userData)
    return data
  }

  function setUser(userData) {
    user.value = userData
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
  }

  async function cargarJuegosComprados(usuarioId) {
    if (!usuarioId) return
    try {
      const { data } = await saleService.getHistory(usuarioId)
      const ids = new Set()
      for (const venta of data) {
        for (const juego of venta.videojuegos || []) {
          if (juego.id) ids.add(Number(juego.id))
        }
      }
      ownedGameIds.value = ids
    } catch {
      ownedGameIds.value = new Set()
    }
  }

  function esJuegoComprado(juegoId) {
    return ownedGameIds.value.has(Number(juegoId))
  }

  function logout() {
    user.value = null
    token.value = null
    ownedGameIds.value = new Set()
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }

  return { user, token, isLoggedIn, login, register, setUser, logout, ownedGameIds, cargarJuegosComprados, esJuegoComprado }
})
