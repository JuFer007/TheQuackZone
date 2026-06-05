import { useToast } from './useToast'

export function useCart() {
  const { show } = useToast()

  function requireAuth() {
    const token = localStorage.getItem('quackzone_token')
    if (!token) {
      show('Debes iniciar sesión para esta acción')
      return false
    }
    return true
  }

  return { requireAuth }
}
