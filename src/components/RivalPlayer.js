import Player from 'Components/Player'
import Gameboard from 'Components/Gameboard'

export default class RivalPlayer extends Player {
  constructor() {
    super('Computer')
    this.board = new Gameboard()
  }
}
