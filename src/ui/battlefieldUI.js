import * as styles from 'Styles/battlefieldUI.module.css'
import { isOrigin, calcAlign } from 'Utils'

export function renderBoard(container, board, showShips) {
  container.textContent = ''
  const frag = document.createDocumentFragment()
  for (let i = 0; i < board.length; i++) {
    const tr = document.createElement('tr')
    tr.classList.add('battlefield_row')
    for (let j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      const td = document.createElement('td')
      const div = document.createElement('div')
      const span = document.createElement('span')
      td.classList.add(styles.battlefield_cell)
      div.classList.add(styles.battlefield_cell__content)
      span.classList.add(styles.z)
      div.dataset.row = i
      div.dataset.col = j
      div.appendChild(span)

      if (!cell.ship) {
        if (!cell.hit) td.classList.add(styles.battlefield_cell__empty)
        else td.classList.add(styles.battlefield_cell__miss)
      } else {
        if (showShips && isOrigin(board, i, j)) {
          const shipBox = document.createElement('div')
          shipBox.classList.add(styles.shipBox)
          shipBox.dataset.id = cell.ship.id
          shipBox.dataset.length = cell.ship.len
          const align = calcAlign(board, i, j)
          shipBox.dataset.align = align
          shipBox.style.width = align === 'h' ? `${cell.ship.len * 2.125}rem` : '2.125rem'
          shipBox.style.height = align === 'v' ? `${cell.ship.len * 2.125}rem` : '2.125rem'
          div.appendChild(shipBox)
        }
        if (showShips) td.classList.add(styles.battlefield_cell__busy)
        if (cell.hit) td.classList.add(styles.battlefield_cell__hit)
        if (cell.ship.isSunk()) td.classList.add(styles.battlefield_cell__done)
      }

      td.appendChild(div)
      tr.appendChild(td)
    }
    frag.appendChild(tr)
  }
  container.appendChild(frag)
}

export function showNotification() {}
