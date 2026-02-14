import Player from 'Components/Player'
import Gameboard from 'Components/Gameboard'

export default class RealPlayer extends Player {
  constructor(name) {
    super(name)
    this.board = new Gameboard()
  }
}
