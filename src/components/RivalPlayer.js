import Player from 'Components/Player'
import { rand } from 'Utils'

export default class RivalPlayer extends Player {
  constructor() {
    super('Computer')
    this.availableMoves = []
    this.#initMoves()
  }

  #initMoves() {
    for (let r = 0; r < this.board.size; r++) {
      for (let c = 0; c < this.board.size; c++) {
        this.availableMoves.push(`${r},${c}`)
      }
    }
  }

  chooseMove() {
    const index = rand(this.availableMoves.length)
    const key = this.availableMoves[index]

    this.availableMoves[index] = this.availableMoves.at(-1)
    this.availableMoves.pop()

    return key.split(',').map(Number)
  }
}
