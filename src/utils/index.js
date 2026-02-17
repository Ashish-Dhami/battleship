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
