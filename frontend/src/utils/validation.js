const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^9\d{8}$/
const NAME_REGEX = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/
const PASSWORD_MIN = 8
const REVIEW_MIN = 10
const SEARCH_MIN = 2

export function validarEmail(valor) {
  if (!valor || !valor.trim()) return 'El correo es obligatorio'
  if (!EMAIL_REGEX.test(valor.trim())) return 'Correo electrónico inválido'
  return ''
}

export function validarNombre(valor) {
  if (!valor || !valor.trim()) return 'El nombre es obligatorio'
  if (valor.trim().length < 3) return 'Debe tener al menos 3 caracteres'
  if (!NAME_REGEX.test(valor.trim())) return 'Solo se permiten letras'
  return ''
}

export function validarTelefono(valor) {
  if (!valor || !valor.trim()) return 'El teléfono es obligatorio'
  if (!PHONE_REGEX.test(valor.trim().replace(/\s/g, ''))) return 'Debe ser un número peruano válido (9 dígitos, empieza con 9)'
  return ''
}

export function validarPassword(valor) {
  if (!valor) return 'La contraseña es obligatoria'
  if (valor.length < PASSWORD_MIN) return `Debe tener al menos ${PASSWORD_MIN} caracteres`
  if (!/\d/.test(valor)) return 'Debe contener al menos un número'
  return ''
}

export function validarConfirmarPassword(password, confirmacion) {
  if (!confirmacion) return 'Confirma tu contraseña'
  if (password !== confirmacion) return 'Las contraseñas no coinciden'
  return ''
}

export function validarComentario(valor) {
  if (valor && valor.trim() && valor.trim().length < REVIEW_MIN) return `Debe tener al menos ${REVIEW_MIN} caracteres`
  return ''
}

export function validarBusqueda(valor) {
  if (!valor || !valor.trim()) return ''
  if (valor.trim().length < SEARCH_MIN) return `Mínimo ${SEARCH_MIN} caracteres`
  return ''
}

export function validarRequerido(valor, campo) {
  if (!valor || (typeof valor === 'string' && !valor.trim())) return `${campo || 'Este campo'} es obligatorio`
  return ''
}

export function validarTarjeta(numero) {
  const limpio = (numero || '').replace(/\s/g, '')
  if (!limpio) return 'Número de tarjeta obligatorio'
  if (!/^\d{13,19}$/.test(limpio)) return 'Número de tarjeta inválido'
  let suma = 0
  let alternar = false
  for (let i = limpio.length - 1; i >= 0; i--) {
    let n = parseInt(limpio[i], 10)
    if (alternar) {
      n *= 2
      if (n > 9) n -= 9
    }
    suma += n
    alternar = !alternar
  }
  if (suma % 10 !== 0) return 'Número de tarjeta inválido'
  return ''
}

export function validarExpiracion(valor) {
  if (!valor || !valor.trim()) return 'Fecha de expiración obligatoria'
  const match = valor.trim().match(/^(\d{2})\/(\d{2,4})$/)
  if (!match) return 'Formato MM/AA'
  const mes = parseInt(match[1], 10)
  const anio = parseInt(match[2], 10) + 2000
  if (mes < 1 || mes > 12) return 'Mes inválido'
  const ahora = new Date()
  const exp = new Date(anio, mes, 0)
  if (exp < ahora) return 'La tarjeta está vencida'
  return ''
}

export function validarCVV(valor) {
  if (!valor || !valor.trim()) return 'CVV obligatorio'
  if (!/^\d{3,4}$/.test(valor.trim())) return 'CVV inválido (3-4 dígitos)'
  return ''
}

export function validarTitular(valor) {
  if (!valor || !valor.trim()) return 'Titular obligatorio'
  if (valor.trim().length < 3) return 'Nombre del titular muy corto'
  return ''
}
