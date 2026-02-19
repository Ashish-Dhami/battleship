export default class Game {
  #activePlayer

  constructor(self, rival) {
    this.self = self
    this.rival = rival
    this.#activePlayer = this.self
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

  end(gameBody) {
    this.ended = true
    gameBody.classList.add('body__game_over')
  }

  restart(gameBody) {
    this.self.reset()
    this.rival.reset()
    this.#activePlayer = this.self
    this.ended = false
    gameBody.classList.remove('body__game_over')
  }
}
