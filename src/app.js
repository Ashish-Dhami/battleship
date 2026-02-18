import 'Styles/global.css'
import * as bfStyles from 'Styles/battlefieldUI.module.css'
import { Gameboard, Game } from 'Components'
import { renderPlayerLabel } from 'UI'
import { delay } from 'Utils'

function init() {
  const selfTable = document.querySelector('.battlefield_self .battlefield_table')
  const rivalTable = document.querySelector('.battlefield_rival .battlefield_table')
  const selfLabelComment = document.querySelector('.battlefield_self .battlefield_label__comment')
  const rivalLabelComment = document.querySelector('.battlefield_rival .battlefield_label__comment')

  const game = new Game()
  const { self, rival } = game
  const minMovesToWin = Gameboard.MIN_MOVES_TO_WIN
  game.start()

  self.board.render({ container: selfTable })
  rival.board.render({ container: rivalTable, showShips: false })
  renderPlayerLabel(selfLabelComment, self)
  renderPlayerLabel(rivalLabelComment, rival)

  function playComputer() {
    if (game.activePlayer !== rival) return 'stop'
    const [row, col] = rival.chooseMove()
    const result = self.board.receiveAttack({ row, col })
    if (!result) return 'retry'
    self.board.render({ container: selfTable })
    // check winner (after min 20 moves to optimize)
    if (++rival.moveCount >= minMovesToWin && self.board.allSunk()) {
      game.endWithWinner(rival)
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
    if (++self.moveCount >= minMovesToWin && rival.board.allSunk()) {
      game.endWithWinner(self)
      return
    }
    if (result.status === 'hit') return
    game.switchTurn()
    rivalTable.classList.add('battlefield_table__disabled')
    selfTable.classList.remove('battlefield_table__disabled')

    computerTurn()
  })
}

init()
