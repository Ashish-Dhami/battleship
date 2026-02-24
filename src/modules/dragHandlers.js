export default function createDragHandlers({ game, bfStyles, root, utils }) {
  let lastHoverCell = null

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setDragImage(e.target, 10, 10)
    setTimeout(() => {
      e.target.classList.add('none')
    })
  }

  function handleDragEnd(e) {
    lastHoverCell?.classList.remove(bfStyles.drag_over)
    lastHoverCell = null
    e.target.classList.remove('none')
  }

  function handleDragOver(e, cell) {
    if (!cell) return
    e.preventDefault()

    if (lastHoverCell && lastHoverCell !== cell) {
      lastHoverCell.classList.remove(bfStyles.drag_over)
    }

    cell.classList.add(bfStyles.drag_over)
    lastHoverCell = cell
  }

  function handleDrop(e, cell) {
    if (!cell) return
    e.preventDefault()

    lastHoverCell?.classList.remove(bfStyles.drag_over)
    lastHoverCell = null

    const { value: board, size: boardSize, ships } = game.self.board

    const id = e.dataTransfer.getData('text/plain')
    const draggedShip = ships.find((ship) => ship.id === id)
    if (!draggedShip) return
    const { len, align, origin } = draggedShip

    const targetRow = Number(cell.dataset.row)
    const targetCol = Number(cell.dataset.col)
    const maxRow = align === 'v' ? boardSize - len : boardSize - 1
    const maxCol = align === 'h' ? boardSize - len : boardSize - 1

    if (targetRow > maxRow || targetCol > maxCol) return
    if (targetRow === origin.row && targetCol === origin.col) return

    const newCells = utils.getCells(targetRow, targetCol, len, align)

    for (const { row, col } of newCells) {
      for (const [dr, dc] of utils.neighbors) {
        const r = row + dr
        const c = col + dc

        if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) continue

        const { ship } = board[r][c]
        if (ship && ship.id !== id) return
      }
    }

    const oldCells = utils.getCells(origin.row, origin.col, len, align)
    const newSet = new Set(newCells.map((c) => `${c.row},${c.col}`))

    draggedShip.origin.row = targetRow
    draggedShip.origin.col = targetCol

    oldCells.forEach(({ row, col }) => {
      if (newSet.has(`${row},${col}`)) return

      board[row][col].ship = null

      const cellEl = root.querySelector(`[data-row='${row}'][data-col='${col}']`)?.closest('td')

      cellEl?.classList.remove(bfStyles.battlefield_cell__busy)
      cellEl?.classList.add(bfStyles.battlefield_cell__empty)
    })

    newCells.forEach(({ row, col }) => {
      board[row][col].ship = draggedShip

      const cellEl = root.querySelector(`[data-row='${row}'][data-col='${col}']`)?.closest('td')

      cellEl?.classList.add(bfStyles.battlefield_cell__busy)
      cellEl?.classList.remove(bfStyles.battlefield_cell__empty)
    })

    const shipBox = root.querySelector(`[data-id='${id}']`)
    cell.appendChild(shipBox)
  }

  function handleDrag(e) {
    if (game.inProgress) return

    const cell = e.target.closest('[data-row][data-col]')

    switch (e.type) {
      case 'dragstart':
        handleDragStart(e)
        break
      case 'dragend':
        handleDragEnd(e)
        break
      case 'dragover':
        handleDragOver(e, cell)
        break
      case 'drop':
        handleDrop(e, cell)
        break
      default:
        break
    }
  }

  return { handleDrag }
}
