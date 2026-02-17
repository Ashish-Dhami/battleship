import Player from 'Components/Player'

export default class RivalPlayer extends Player {
  constructor() {
    super('Computer')
    this.moves = []
    this.#initMoves()
  }

  #initMoves() {
    for (let r = 0; r < this.board.size; r++) {
      for (let c = 0; c < this.board.size; c++) {
        this.moves.push(`${r},${c}`)
      }
    }
  }

  chooseMove() {
    const index = Math.floor(Math.random() * this.moves.length)
    const key = this.moves[index]

    this.moves[index] = this.moves.at(-1)
    this.moves.pop()

    return key.split(',').map(Number)
  }
}
