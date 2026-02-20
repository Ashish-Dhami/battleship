export default class Ship {
  constructor(len, align, origin) {
    this.id = crypto.randomUUID()
    this.len = len
    this.align = align
    this.origin = origin
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
