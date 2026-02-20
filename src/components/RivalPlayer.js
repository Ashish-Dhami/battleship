import Player from 'Components/Player'
import { rand } from 'Utils'

export default class RivalPlayer extends Player {
  constructor() {
    super('Computer')
    this.availableMoves = new Set()
    this.#seedMoves()
  }

  #movePool = []

  #key(row, col) {
    return `${row},${col}`
  }

  #seedMoves() {
    for (let r = 0; r < this.board.size; r++) {
      for (let c = 0; c < this.board.size; c++) {
        this.availableMoves.add(this.#key(r, c))
        this.#movePool.push(this.#key(r, c))
      }
    }
  }

  chooseMove() {
    let key
    do {
      const index = rand(this.#movePool.length)
      key = this.#movePool[index]
      this.#movePool[index] = this.#movePool.at(-1)
      this.#movePool.pop()
    } while (!this.availableMoves.has(key))
    this.availableMoves.delete(key)
    return key.split(',').map(Number)
  }

  invalidateMovesAroundShip({ row, col }, ship) {
    this.availableMoves.delete(this.#key(row - 1, col - 1))
    this.availableMoves.delete(this.#key(row + 1, col + 1))
    this.availableMoves.delete(this.#key(row + 1, col - 1))
    this.availableMoves.delete(this.#key(row - 1, col + 1))
    if (ship.align === 'h' || ship.len === 1) {
      this.availableMoves.delete(this.#key(row, ship.origin.col - 1))
      this.availableMoves.delete(this.#key(row, ship.origin.col + ship.len))
    }
    if (ship.align === 'v' || ship.len === 1) {
      this.availableMoves.delete(this.#key(ship.origin.row - 1, col))
      this.availableMoves.delete(this.#key(ship.origin.row + ship.len, col))
    }
  }

  reset() {
    super.reset()
    this.availableMoves.clear()
    this.#movePool.length = 0
    this.#seedMoves()
  }
}
