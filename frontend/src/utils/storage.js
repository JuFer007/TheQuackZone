export function getStorageItem(key) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return localStorage.getItem(key)
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    localStorage.setItem(key, value)
  }
}

export function removeStorageItem(key) {
  localStorage.removeItem(key)
}
