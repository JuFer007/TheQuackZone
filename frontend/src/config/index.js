export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const API_SERVICE_URL = import.meta.env.VITE_API_SERVICE_URL || 'http://localhost:4000'

export const GATEWAYS = {
  juegos: `${API_BASE_URL}/juegos`,
  usuario: `${API_BASE_URL}/usuario`,
  carrito: `${API_BASE_URL}/carrito`,
  ventas: `${API_BASE_URL}/venta`,
  perfil: `${API_BASE_URL}/perfil`,
  listaDeseos: `${API_BASE_URL}/listaDeseos`,
}
