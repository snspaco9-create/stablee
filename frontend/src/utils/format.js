export const fmt = (n) => {
  const num = Number(n)
  if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}m`
  if (num >= 1000) return `₦${(num / 1000).toFixed(0)}k`
  return `₦${num.toLocaleString()}`
}

export const fmtDate = (dateStr) => {
  if (!dateStr) return 'Not set'
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export const fmtDateTime = (dateStr) => {
  if (!dateStr) return 'Not set'
  return new Date(dateStr).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}