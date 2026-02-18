import * as styles from 'Styles/battlefieldUI.module.css'
import { isOrigin, calcAlign } from 'Utils'

function appendMarkers(container, row, col) {
  if (col === 0) {
    const markerRow = document.createElement('div')
    markerRow.classList.add(styles.marker, styles.marker__row)
    markerRow.textContent = row + 1
    container.appendChild(markerRow)
  }
  if (row === 0) {
    const markerCol = document.createElement('div')
    markerCol.classList.add(styles.marker, styles.marker__col)
    markerCol.textContent = String.fromCharCode(65 + col)
    container.appendChild(markerCol)
  }
}

export function renderBoard(container, board, showShips) {
  container.textContent = ''
  const tbody = document.createElement('tbody')
  for (let i = 0; i < board.length; i++) {
    const tr = document.createElement('tr')
    tr.classList.add('battlefield_row')
    for (let j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      let isEmpty = true
      const td = document.createElement('td')
      const div = document.createElement('div')
      const span = document.createElement('span')
      td.classList.add(styles.battlefield_cell, styles.battlefield_cell__empty)
      div.classList.add(styles.battlefield_cell__content)
      span.classList.add(styles.z)
      div.dataset.row = i
      div.dataset.col = j
      div.appendChild(span)

      if (i === 0 || j === 0) {
        appendMarkers(div, i, j)
      }

      if (!cell.ship && cell.hit) {
        td.classList.add(styles.battlefield_cell__miss)
        isEmpty = false
      }
      if (cell.ship) {
        if ((showShips || cell.ship.isSunk()) && isOrigin(board, i, j)) {
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
        if (showShips) {
          td.classList.add(styles.battlefield_cell__busy)
          isEmpty = false
        }
        if (cell.hit) {
          td.classList.add(styles.battlefield_cell__hit)
          isEmpty = false
        }
        if (cell.ship.isSunk()) {
          td.classList.add(styles.battlefield_cell__done)
          isEmpty = false
        }
      }
      if (!isEmpty) td.classList.remove(styles.battlefield_cell__empty)

      td.appendChild(div)
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  }
  container.appendChild(tbody)
}

export function renderPlayerLabel(labelEl, player) {
  labelEl.textContent = `(${player.name})`
}
