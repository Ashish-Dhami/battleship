import Gameboard from 'Components/Gameboard'

export default class Player {
  constructor(name) {
    this.name = name
    this.board = new Gameboard()
    this.moveCount = 0
  }

  reset() {
    this.board.randomise()
    this.moveCount = 0
  }
}
