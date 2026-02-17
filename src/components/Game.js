export default class Game {
  #activePlayer

  constructor(self, rival) {
    this.self = self
    this.rival = rival
    this.#activePlayer = self
  }

  get activePlayer() {
    return this.#activePlayer
  }

  switchTurn() {
    this.#activePlayer = this.#activePlayer === this.self ? this.rival : this.self
  }

  declareWinner() {
    alert(`${this.#activePlayer.name} Won`)
  }

  end() {
    // disable everything
    document.body.style.userSelect = 'none'
    document.body.style.backgroundColor = 'lightred'
    // display notification popup with a 'play again' button
    confirm('game over !! Play again ?')
    // attach click event to btn
    // onClick() : resets everything and restart the game
  }
}
