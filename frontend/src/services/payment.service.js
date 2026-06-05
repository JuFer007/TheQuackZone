import { API_SERVICE_URL } from '../config'

export const paymentService = {
  async simulate({ cardNumber, expiry, cvv, amount, cardHolder }) {
    const res = await fetch(`${API_SERVICE_URL}/api/payment/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardNumber, expiry, cvv, amount, cardHolder }),
    })
    return res.json()
  },
}
