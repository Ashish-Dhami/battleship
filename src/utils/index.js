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
