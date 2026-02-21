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
        missAuto: false,
      }))
    )
  }

  #isPlacementValid(length, align, { row, col }) {
    for (let i = 0; i < length; i++) {
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

  #placeShip(ship) {
    const {
      align,
      origin: { row, col },
    } = ship
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
        while (!placed && attempts < this.#MAX_ATTEMPTS) {
          attempts++
          const align = Math.random() > 0.5 ? 'v' : 'h'
          const maxRow = align === 'v' ? this.#size - length : this.#size - 1
          const maxCol = align === 'h' ? this.#size - length : this.#size - 1
          const coordinates = { row: rand(maxRow + 1), col: rand(maxCol + 1) }
          if (this.#isPlacementValid(length, align, coordinates)) {
            this.#placeShip(new Ship(length, align, coordinates))
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

  #getEdgeCells(ship, { row, col }) {
    const edgeCells = []
    if (ship.align === 'h' || ship.len === 1) {
      edgeCells.push(this.value[row]?.[ship.origin.col - 1])
      edgeCells.push(this.value[row]?.[ship.origin.col + ship.len])
    }
    if (ship.align === 'v' || ship.len === 1) {
      edgeCells.push(this.value[ship.origin.row - 1]?.[col])
      edgeCells.push(this.value[ship.origin.row + ship.len]?.[col])
    }
    return edgeCells
  }

  receiveAttack({ row, col }, shootHint) {
    const cell = this.value[row]?.[col]
    const verifiedEmptyCells = [
      this.value[row - 1]?.[col - 1],
      this.value[row + 1]?.[col + 1],
      this.value[row + 1]?.[col - 1],
      this.value[row - 1]?.[col + 1],
    ]
    if (!cell) return
    if (cell.hit) return
    cell.hit = true
    if (cell.ship) {
      cell.ship.hit()
      if (shootHint) {
        if (cell.ship.isSunk()) {
          verifiedEmptyCells.push(...this.#getEdgeCells(cell.ship, { row, col }))
        }
        verifiedEmptyCells.forEach((ec) => {
          if (ec && !ec.hit && !ec.ship) {
            ec.hit = true
            ec.missAuto = true
          }
        })
      }
      return { status: 'hit', ship: cell.ship }
    }
    return { status: 'miss' }
  }

  allSunk() {
    return this.ships.every((ship) => ship.isSunk())
  }
}
