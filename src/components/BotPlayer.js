import Player from 'Components/Player'
import Gameboard from 'Components/Gameboard'

export default class BotPlayer extends Player {
  constructor() {
    super('Computer')
    this.board = new Gameboard()
  }
}
