import { RivalPlayer, SelfPlayer } from 'Components'

export default class Game {
  #activePlayer

  constructor() {
    this.self = new SelfPlayer(prompt('Enter your name', 'John'))
    this.rival = new RivalPlayer()
    this.#activePlayer = this.self
    this.winner = null
    this.ended = false
  }

  get activePlayer() {
    return this.#activePlayer
  }

  switchTurn() {
    this.#activePlayer = this.#activePlayer === this.self ? this.rival : this.self
  }

  start() {
    this.self.board.populate()
    this.rival.board.populate()
  }

  endWithWinner(player) {
    this.winner = player
    this.ended = true
    // disable everything
    // display notification popup with a 'play again' button
    // attach click event to btn
    // onClick() : resets everything and restart the game
  }
}
