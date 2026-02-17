import Player from 'Components/Player'
import Gameboard from 'Components/Gameboard'

export default class SelfPlayer extends Player {
  constructor(name) {
    super(name)
    this.board = new Gameboard()
  }
}
