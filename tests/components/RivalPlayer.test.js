import { rand } from 'Utils'
import RivalPlayer from 'Components/RivalPlayer'

jest.mock('Components/Gameboard', () =>
  jest.fn().mockImplementation(() => ({
    size: 3,
  }))
)

jest.mock('Utils', () => ({
  rand: jest.fn(),
}))

describe('RivalPlayer', () => {
  let r
  beforeEach(() => {
    r = new RivalPlayer()
    rand.mockReset()
    rand.mockReturnValue(0)
  })

  test('seeds moves based on board.size', () => {
    expect(r.availableMoves.size).toBe(3 * 3)
    expect(r.availableMoves.has('0,0')).toBe(true)
    expect(r.availableMoves.has('2,2')).toBe(true)
    expect(r.availableMoves.has('3,3')).toBe(false)
  })

  test('chooseMove picks a random move when no target', () => {
    const move = r.chooseMove()
    expect(move).toEqual([0, 0])
    expect(r.availableMoves.has('0,0')).toBe(false)
  })

  test('registerHit adds a target and chooseMove then prefers adjacent candidate', () => {
    const hitCell = { row: 1, col: 1 }
    const shipMock = {
      isSunk: () => false,
      align: 'h',
      len: 2,
      origin: { row: 1, col: 1 },
    }

    r.registerHit(hitCell, shipMock, { shootHint: false })

    const next = r.chooseMove()
    expect(next).toEqual([1, 0])
    expect(r.availableMoves.has('1,0')).toBe(false)
  })

  test('registerHit with sunk ship and shootHint invalidates edge cells', () => {
    expect(r.availableMoves.has('0,0')).toBe(true)

    const sunkShip = {
      isSunk: () => true,
      align: 'h',
      len: 2,
      origin: { row: 1, col: 1 },
    }

    r.registerHit({ row: 1, col: 1 }, sunkShip, { shootHint: true })

    expect(r.availableMoves.has('0,0')).toBe(false)
    expect(r.availableMoves.has('2,2')).toBe(false)
    expect(r.availableMoves.has('0,2')).toBe(false)
    expect(r.availableMoves.has('2,0')).toBe(false)
    expect(r.availableMoves.has('1,0')).toBe(false)
    expect(r.availableMoves.has('1,3')).toBe(false)
  })
})
