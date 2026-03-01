import Ship from 'Components/Ship'

describe('Ship', () => {
  test('creates a ship with given length', () => {
    const ship = new Ship(3, 'h', { row: 0, col: 0 })

    expect(typeof ship.id).toBe('string')
    expect(ship.len).toBe(3)
    expect(ship.align).toBe('h')
    expect(ship.origin).toEqual({ row: 0, col: 0 })
    expect(ship.hits).toBe(0)
    expect(ship.isSunk()).toBeFalsy()
  })
})

describe('hit()', () => {
  test('increments hits when ship is hit', () => {
    const ship = new Ship(2, 'v', { row: 0, col: 0 })
    ship.hit()
    expect(ship.hits).toBe(1)
  })

  test('does not increment hits if ship is already sunk', () => {
    const ship = new Ship(2, 'v', { row: 0, col: 0 })
    ship.hit().hit().hit().hit()
    expect(ship.hits).toBe(2)
    expect(ship.isSunk()).toBeTruthy()
  })
})

describe('isSunk()', () => {
  test('returns false when hits are less than length', () => {
    const ship = new Ship(3, 'h', { row: 0, col: 0 })
    ship.hit()
    expect(ship.isSunk()).toBeFalsy()
  })
  test('returns true when hits equal length', () => {
    const ship = new Ship(2, 'h', { row: 0, col: 0 })
    ship.hit().hit()
    expect(ship.isSunk()).toBeTruthy()
  })
})
