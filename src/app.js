import 'Styles/global.css'
import * as bfStyles from 'Styles/battlefieldUI.module.css'
import { RivalPlayer, SelfPlayer, Game } from 'Components'
import { delay } from 'Utils'

function createPlayers() {
  // const self = new SelfPlayer(prompt('Enter your name', 'John'))
  const self = new SelfPlayer('John')
  const rival = new RivalPlayer()
  return { self, rival }
}

const selfTable = document.querySelector('.battlefield_self .battlefield_table')
const rivalTable = document.querySelector('.battlefield_rival .battlefield_table')

const { self, rival } = createPlayers()
const game = new Game(self, rival)
self.board.populate()
rival.board.populate()
self.board.render({ container: selfTable })
rival.board.render({ container: rivalTable, showShips: false })

function playComputer() {
  if (game.activePlayer !== rival) return 'stop'
  const [row, col] = rival.chooseMove()
  const result = self.board.receiveAttack({ row, col })
  if (!result) return 'retry'
  self.board.render({ container: selfTable })
  // check winner (after min 20 moves to optimize)
  if (self.board.allSunk()) {
    game.declareWinner()
    game.end()
    return 'end'
  }
  if (result.status === 'hit') return 'hit'
  game.switchTurn()
  selfTable.classList.add('battlefield_table__disabled')
  rivalTable.classList.remove('battlefield_table__disabled')
  return 'miss'
}

async function computerTurn() {
  while (game.activePlayer === rival) {
    await delay(1000)
    const outcome = playComputer()
    if (['stop', 'end', 'miss'].includes(outcome)) break
  }
}

rivalTable.addEventListener('click', (e) => {
  if (game.activePlayer !== self) return
  const cellEl = e.target.closest(`.${bfStyles.battlefield_cell__content}`)
  if (!cellEl) return
  const row = Number(cellEl.dataset.row)
  const col = Number(cellEl.dataset.col)
  const result = rival.board.receiveAttack({ row, col })
  if (!result) return
  rival.board.render({ container: rivalTable, showShips: false })
  // check winner (after min 20 moves to optimize)
  if (rival.board.allSunk()) {
    game.declareWinner()
    game.end()
  }
  if (result.status === 'hit') return
  game.switchTurn()
  rivalTable.classList.add('battlefield_table__disabled')
  selfTable.classList.remove('battlefield_table__disabled')

  computerTurn()
})
