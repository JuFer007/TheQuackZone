import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth.service'
import { profileService } from '../services/profile.service'
import { STORAGE_KEYS } from '../config/constants'
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage'

export function useAuth() {
  const router = useRouter()
  const user = ref(getStorageItem(STORAGE_KEYS.USER))
  const token = ref(localStorage.getItem(STORAGE_KEYS.TOKEN))

  const isLoggedIn = computed(() => !!user.value && !!token.value)

  async function login(correo, contraseña) {
    const { data } = await authService.login(correo, contraseña)
    user.value = data.usuario
    token.value = data.token
    setStorageItem(STORAGE_KEYS.USER, data.usuario)
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
    return data
  }

  async function register(userData) {
    const { data } = await authService.register(userData)
    return data
  }

  async function loadProfile() {
    if (!user.value?.id) return
    const { data } = await authService.getProfile(user.value.id)
    user.value = data
    setStorageItem(STORAGE_KEYS.USER, data)
    return data
  }

  function logout() {
    user.value = null
    token.value = null
    removeStorageItem(STORAGE_KEYS.USER)
    removeStorageItem(STORAGE_KEYS.TOKEN)
    router.push('/')
  }

  return { user, token, isLoggedIn, login, register, loadProfile, logout }
}
