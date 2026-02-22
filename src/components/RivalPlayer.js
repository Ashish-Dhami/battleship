import Player from 'Components/Player'
import { rand } from 'Utils'

export default class RivalPlayer extends Player {
  constructor() {
    super('Computer')
    this.availableMoves = new Set()
    this.#seedMoves()
    this.#initCandidateGenerators()
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
    if (!this.#targetHits.length) {
      key = this.#chooseRandomMove()
    } else {
      key = this.#chooseTargetedMove()
    }
    this.availableMoves.delete(key)
    return key.split(',').map(Number)
  }

  #invalidateMovesAroundShip({ row, col }, ship) {
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
    this.#clearTarget()
  }

  #targetHits = []

  #candidateGenerators

  #initCandidateGenerators() {
    this.#candidateGenerators = {
      row: [
        () => ({ row: this.#targetHits[0].row, col: this.#targetHits[0].col - 1 }),
        () => ({ row: this.#targetHits.at(-1).row, col: this.#targetHits.at(-1).col + 1 }),
      ],
      col: [
        () => ({ row: this.#targetHits[0].row - 1, col: this.#targetHits[0].col }),
        () => ({ row: this.#targetHits.at(-1).row + 1, col: this.#targetHits.at(-1).col }),
      ],
    }
  }

  #addHitToTarget({ row, col }) {
    this.#targetHits.push({ row, col })
    if (this.#targetHits.length > 1) {
      const crossAxis = row === this.#targetHits[0].row ? 'col' : 'row'
      this.#targetHits.sort((a, b) => a[crossAxis] - b[crossAxis])

      delete this.#candidateGenerators[crossAxis]
    }
  }

  #clearTarget() {
    this.#targetHits.length = 0
    this.#initCandidateGenerators()
  }

  #chooseTargetedMove() {
    while (true) {
      const axes = Object.keys(this.#candidateGenerators)
      if (!axes.length) break

      const axis = axes[rand(axes.length)]
      const gens = this.#candidateGenerators[axis]
      const idx = rand(gens.length)

      const { row, col } = gens[idx].call(this)

      const key = this.#key(row, col)
      if (!this.availableMoves.has(key)) {
        gens.splice(idx, 1)
        if (!gens.length) delete this.#candidateGenerators[axis]
        continue
      }
      return key
    }
    return this.#chooseRandomMove()
  }

  #chooseRandomMove() {
    let key
    do {
      const index = rand(this.#movePool.length)
      key = this.#movePool[index]
      this.#movePool[index] = this.#movePool.at(-1)
      this.#movePool.pop()
    } while (!this.availableMoves.has(key))
    return key
  }

  registerHit({ row, col }, ship, { shootHint }) {
    if (ship.isSunk()) {
      this.#clearTarget()
    } else {
      this.#addHitToTarget({ row, col })
    }

    if (shootHint) {
      this.#invalidateMovesAroundShip({ row, col }, ship)
    }
  }
}
