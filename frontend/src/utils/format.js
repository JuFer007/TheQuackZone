export function formatCurrency(amount) {
  if (amount == null) return 'S/. 0.00'
  return `S/. ${Number(amount).toFixed(2)}`
}

export function formatDate(date) {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeDate(date) {
  if (!date) return 'Sin compras'
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`
  return formatDate(date)
}
