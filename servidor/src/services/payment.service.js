function luhnCheck(numero) {
  const limpio = (numero || '').replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(limpio)) return false
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
  return suma % 10 === 0
}

function generarTransactionId() {
  return 'sim-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

const BANCO_RECHAZADOS = ['4000000000000002', '4111111111111112']

function simularPago({ cardNumber, expiry, cvv, amount, cardHolder }) {
  if (!cardNumber || !expiry || !cvv || !cardHolder) {
    return { success: false, status: 'error', message: 'Datos de pago incompletos', transactionId: null }
  }

  if (!luhnCheck(cardNumber)) {
    return { success: false, status: 'declined', message: 'Número de tarjeta inválido', transactionId: null }
  }

  const limpio = cardNumber.replace(/\s/g, '')

  if (BANCO_RECHAZADOS.includes(limpio)) {
    return {
      success: false,
      status: 'declined',
      message: 'Fondos insuficientes',
      transactionId: generarTransactionId(),
    }
  }

  const random = Math.random()
  if (random < 0.85) {
    return {
      success: true,
      status: 'approved',
      message: 'Pago aprobado',
      transactionId: generarTransactionId(),
      amount,
      lastDigits: limpio.slice(-4),
    }
  }

  if (random < 0.95) {
    return {
      success: false,
      status: 'declined',
      message: 'Transacción rechazada por el banco emisor',
      transactionId: generarTransactionId(),
    }
  }

  return {
    success: false,
    status: 'error',
    message: 'Error de procesamiento. Intenta nuevamente.',
    transactionId: generarTransactionId(),
  }
}

module.exports = { simularPago }
