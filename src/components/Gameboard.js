import { Ship } from 'Components'
import { rand } from 'Utils'
import { renderBoard } from 'UI'

export default class Gameboard {
  #size

  #SHIPS_META = [
    { length: 4, count: 1 },
    { length: 3, count: 2 },
    { length: 2, count: 3 },
    { length: 1, count: 4 },
  ]

  #MAX_ATTEMPTS = 1000

  constructor(size = 10) {
    this.#size = size
    this.value = this.#createBoard()
    this.ships = []
  }

  #createBoard() {
    return Array.from({ length: this.#size }, () =>
      Array.from({ length: this.#size }, () => ({
        ship: null,
        hit: false,
      }))
    )
  }

  #isPlacementValid(align, ship, { row, col }) {
    for (let i = 0; i < ship.len; i++) {
      const r = align === 'v' ? row + i : row
      const c = align === 'h' ? col + i : col
      if (
        this.value[r]?.[c]?.ship ||
        this.value[r + 1]?.[c]?.ship ||
        this.value[r - 1]?.[c]?.ship ||
        this.value[r]?.[c + 1]?.ship ||
        this.value[r]?.[c - 1]?.ship ||
        this.value[r - 1]?.[c - 1]?.ship ||
        this.value[r + 1]?.[c + 1]?.ship ||
        this.value[r + 1]?.[c - 1]?.ship ||
        this.value[r - 1]?.[c + 1]?.ship
      )
        return false
    }
    return true
  }

  #placeShip(align, ship, { row, col }) {
    for (let i = 0; i < ship.len; i++) {
      const r = align === 'v' ? row + i : row
      const c = align === 'h' ? col + i : col
      this.value[r][c].ship = ship
    }
    this.ships.push(ship)
  }

  populate() {
    for (const { length, count } of this.#SHIPS_META) {
      for (let i = 0; i < count; i++) {
        let placed = false
        let attempts = 0
        const ship = new Ship(length)
        while (!placed && attempts < this.#MAX_ATTEMPTS) {
          attempts++
          const align = Math.random() > 0.5 ? 'v' : 'h'
          const maxRow = align === 'v' ? this.#size - length : this.#size - 1
          const maxCol = align === 'h' ? this.#size - length : this.#size - 1
          const coordinates = { row: rand(maxRow + 1), col: rand(maxCol + 1) }
          if (this.#isPlacementValid(align, ship, coordinates)) {
            this.#placeShip(align, ship, coordinates)
            placed = true
          }
        }
        if (!placed) {
          throw new Error(`Failed to place ship of length ${length}`)
        }
      }
    }
  }

  render({ container, showShips = true }) {
    renderBoard(container, this.value, showShips)
  }

  receiveAttack({ row, col }) {
    if (!this.value[row]?.[col]) return
    this.value[row][col].hit = true
    if (this.value[row][col].ship) {
      this.value[row][col].ship.hit()
    }
  }

  allSunk() {
    return this.ships.every((ship) => ship.isSunk())
  }
}
