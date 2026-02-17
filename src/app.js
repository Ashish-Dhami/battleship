import 'Styles/global.css'
import { RivalPlayer, SelfPlayer, Game } from 'Components'

function createPlayers() {
  // const self = new SelfPlayer(prompt('Enter your name', 'John'))
  const self = new SelfPlayer('John')
  const rival = new RivalPlayer()
  return { self, rival }
}

const selfTable = document.querySelector('.battlefield_self tbody')
const rivalTable = document.querySelector('.battlefield_rival tbody')
// const battlefieldWrapper = document.querySelector('.battlefield_wrapper')

const { self, rival } = createPlayers()
const game = new Game(self, rival)
self.board.populate()
rival.board.populate()
self.board.render({ container: selfTable })
rival.board.render({ container: rivalTable, showShips: false })

rivalTable.addEventListener('click', (e) => {
  if (game.activePlayer !== self) return
  const { row, col } = e.target.dataset
  // if self turn :
  rival.board.receiveAttack({ row, col })
  // render rival board
  rival.board.render({ container: rivalTable, showShips: false })
  // check winner (after min 20 moves to optimize)
  if (rival.board.allSunk()) {
    game.declareWinner()
    game.end()
  }
  // toggle turn
  game.switchTurn()
  // disable rival board
  rivalTable.classList.add('battlefield_table__disabled')
  selfTable.classList.remove('battlefield_table__disabled')
})

selfTable.addEventListener('click', (e) => {
  if (game.activePlayer !== rival) return
  const { row, col } = e.target.dataset
  // if rival turn :
  self.board.receiveAttack({ row, col })
  // render self board
  self.board.render({ container: selfTable })
  // check winner (after min 20 moves to optimize)
  if (self.board.allSunk()) {
    game.declareWinner()
    game.end()
  }
  // toggle turn
  game.switchTurn()
  // disable self board
  selfTable.classList.add('battlefield_table__disabled')
  rivalTable.classList.remove('battlefield_table__disabled')
})
