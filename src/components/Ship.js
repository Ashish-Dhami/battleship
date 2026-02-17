export default class Ship {
  constructor(len) {
    this.len = len
    this.hits = 0
  }

  hit() {
    if (!this.isSunk()) this.hits++
    return this
  }

  isSunk() {
    return this.hits >= this.len
  }
}
