export function rand(max) {
  return Math.floor(Math.random() * max)
}

export function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

export function errorHandler(targetFn, n10n) {
  return async (...args) => {
    try {
      await targetFn(...args)
    } catch (err) {
      n10n?.notify('ERROR')
      console.error(err)
    }
  }
}

export function persistData(identifier, data) {
  localStorage.setItem(identifier, JSON.stringify(data))
}

export function getPersistedData(identifier) {
  return JSON.parse(localStorage.getItem(identifier))
}

export function getCells(r, c, len, align) {
  return Array.from({ length: len }, (_, i) => ({
    row: align === 'v' ? r + i : r,
    col: align === 'h' ? c + i : c,
  }))
}
