import Gameboard from 'Components/Gameboard'

jest.mock('UI', () => ({ renderBoard: jest.fn(), renderStats: jest.fn() }))

describe('Gameboard', () => {
  describe('initialization', () => {
    test('creates a board of given size', () => {
      const board = new Gameboard(5)
      expect(board.size).toBe(5)
      expect(board.value.length).toBe(5)
      expect(board.ships.length).toBe(0)
    })
  })

  describe('gameplay', () => {
    let board

    beforeEach(() => {
      board = new Gameboard()
      board.populate()
    })

    test('can populate ships', () => {
      expect(board.ships.length).toBeGreaterThan(0)
    })

    test('registers a miss or hit', () => {
      const result = board.receiveAttack({ row: 0, col: 0 })
      expect(result).toBeDefined()
      expect(['hit', 'miss']).toContain(result.status)
    })

    test('repeat attack does nothing', () => {
      board.receiveAttack({ row: 0, col: 0 })
      const result = board.receiveAttack({ row: 0, col: 0 })
      expect(result).toBeUndefined()
    })

    test('hit increments ship hits', () => {
      const firstShip = board.ships[0]
      board.receiveAttack(firstShip.origin)
      expect(firstShip.hits).toBe(1)
    })

    test('check if all ships sank', () => {
      board.ships.forEach((ship) => {
        while (!ship.isSunk()) ship.hit()
      })

      expect(board.allSunk()).toBe(true)
    })
  })
})
