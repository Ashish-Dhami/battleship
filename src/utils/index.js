export function rand(max) {
  return Math.floor(Math.random() * max)
}

export function isOrigin(board, row, col) {
  const { ship } = board[row][col]
  if (!ship) return false
  const top = board[row - 1]?.[col]?.ship === ship
  const left = board[row]?.[col - 1]?.ship === ship
  return !top && !left
}

export function calcAlign(board, row, col) {
  const { ship } = board[row][col]
  const bottom = board[row + 1]?.[col]?.ship === ship
  if (bottom) return 'v'
  return 'h'
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
