export default class Gameboard {
  constructor() {
    this.value = this.#createBoard()
    this.ships = []
  }

  #row = 10

  #col = 10

  #createBoard() {
    return Array(this.#row).fill(Array(this.#col).fill({ ship: false, hit: false }))
  }

  placeShip(align, ship, coordinates) {
    const { row, col } = coordinates
    if (align === 'vertical') {
      for (let i = 0; i < ship.len; i++) {
        this.value[row + i][col] = { ...this.value[row + i][col], ship }
      }
    }
    if (align === 'horizontal') {
      for (let i = 0; i < ship.len; i++) {
        this.value[row][col + i] = { ...this.value[row][col + i], ship }
      }
    }
    this.ships = [...this.ships, ship]
  }

  receiveAttack(coordinates) {
    const { row, col } = coordinates
    this.value[row][col].hit = true
    if (this.value[row][col].ship) {
      this.value[row][col].ship.hit()
    }
  }

  allSunk() {
    return this.ships.every((ship) => ship.isSunk())
  }
}
