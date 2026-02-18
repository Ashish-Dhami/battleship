import { Ship } from 'Components'
import { rand } from 'Utils'
import { renderBoard, renderStats } from 'UI'

export default class Gameboard {
  #size

  static #SHIPS_META = [
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

  get size() {
    return this.#size
  }

  static get MIN_MOVES_TO_WIN() {
    return this.#SHIPS_META.reduce((moves, ship) => moves + ship.length * ship.count, 0)
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
    for (const { length, count } of Gameboard.#SHIPS_META) {
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

  randomise() {
    this.ships.length = 0
    this.value.length = 0
    this.value = this.#createBoard()
    this.populate()
  }

  render({ container, showShips = true, statContainer }) {
    renderBoard(container, this.value, showShips)
    if (statContainer) renderStats(statContainer, this.ships)
  }

  receiveAttack({ row, col }) {
    const cell = this.value[row]?.[col]
    if (!cell) return
    if (cell.hit) return
    cell.hit = true
    if (cell.ship) {
      cell.ship.hit()
      return { status: 'hit' }
    }
    return { status: 'miss' }
  }

  allSunk() {
    return this.ships.every((ship) => ship.isSunk())
  }
}
