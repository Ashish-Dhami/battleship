import 'Styles/global.css'
import * as bfStyles from 'Styles/battlefieldUI.module.css'
import { Gameboard, Game, Notification, RivalPlayer, SelfPlayer } from 'Components'
import { renderPlayerLabel, renderPlaceships } from 'UI'
import { delay, errorHandler } from 'Utils'

function createPlayers() {
  return { self: new SelfPlayer(prompt('Enter your name', 'John')), rival: new RivalPlayer() }
}

function init() {
  const { self, rival } = createPlayers()
  const game = new Game(self, rival)
  const minMovesToWin = Gameboard.MIN_MOVES_TO_WIN

  const selfTable = document.querySelector('.battlefield_self .battlefield_table')
  const rivalTable = document.querySelector('.battlefield_rival .battlefield_table')
  const selfLabelComment = document.querySelector('.battlefield_self .battlefield_label__comment')
  const rivalLabelComment = document.querySelector('.battlefield_rival .battlefield_label__comment')
  const selfStat = document.querySelector('.battlefield_self .battlefield_stat')
  const rivalStat = document.querySelector('.battlefield_rival .battlefield_stat')
  const startBtn = document.querySelector('.battlefield_start__button')
  const leaveBtn = document.querySelector('.leave')
  const placeships = document.querySelector('.placeships')
  const n10ncontainer = document.querySelector('.notifications')
  const n10n = new Notification(n10ncontainer)

  rivalTable.classList.add('battlefield_table__disabled')

  const handleLeave = errorHandler((e) => {
    e.preventDefault()
    const confirmMsg = leaveBtn.dataset.confirm
    if (!confirm(confirmMsg)) return
    location.reload()
  }, n10n)

  const handleStart = errorHandler(() => {
    rivalTable.classList.remove('battlefield_table__disabled')
    selfTable.classList.add('battlefield_table__disabled')
    startBtn.parentElement.classList.add('none')
    placeships.classList.add('none')
    leaveBtn.classList.remove('none__visible')
    n10n.notify('FIRST_MOVE_ON')
  }, n10n)

  const handleRestart = errorHandler(({ autoStart }) => {
    game.restart(document.body)
    self.board.render({ container: selfTable, statContainer: selfStat })
    rival.board.render({ container: rivalTable, showShips: false, statContainer: rivalStat })
    rivalTable.classList.add('battlefield_table__disabled')
    selfTable.classList.remove('battlefield_table__disabled')
    startBtn.parentElement.classList.remove('none')
    placeships.classList.remove('none')
    leaveBtn.classList.add('none__visible')
    n10n.notify('INIT')
    if (autoStart) {
      handleStart()
    }
  }, n10n)

  leaveBtn.addEventListener('click', handleLeave)
  startBtn.addEventListener('click', handleStart)
  n10ncontainer.addEventListener('click', (e) => {
    e.preventDefault()
    const elem = e.target
    if (elem?.classList.contains('restart')) {
      handleRestart({ autoStart: elem.value !== 'Create new game' })
    }
  })

  const onRandomise = errorHandler(() => {
    self.board.randomise()
    self.board.render({ container: selfTable })
  }, n10n)
  const onReset = errorHandler(() => {
    alert('reset')
  }, n10n)

  game.start()

  self.board.render({ container: selfTable, statContainer: selfStat })
  rival.board.render({ container: rivalTable, showShips: false, statContainer: rivalStat })
  renderPlayerLabel(selfLabelComment, self)
  renderPlayerLabel(rivalLabelComment, rival)
  renderPlaceships(placeships, onRandomise, onReset)

  function playComputer() {
    if (game.ended || game.activePlayer !== rival) return 'stop'
    const [row, col] = rival.chooseMove()
    const result = self.board.receiveAttack({ row, col })
    if (!result) return 'retry'
    self.board.render({ container: selfTable, statContainer: result.status === 'hit' ? selfStat : null })
    // check winner (after min 20 moves to optimize)
    if (++rival.moveCount >= minMovesToWin && self.board.allSunk()) {
      game.end(document.body)
      n10n.notify('OVER_LOSE')
      return 'end'
    }
    if (result.status === 'hit') return 'hit'
    game.switchTurn()
    selfTable.classList.add('battlefield_table__disabled')
    rivalTable.classList.remove('battlefield_table__disabled')
    return 'miss'
  }

  const computerTurn = errorHandler(async () => {
    while (game.activePlayer === rival) {
      await delay(1000)
      const outcome = playComputer()
      if (['stop', 'end', 'miss'].includes(outcome)) break
    }
    n10n.notify('MOVE_ON')
  }, n10n)

  const playSelf = errorHandler((e) => {
    if (game.ended || game.activePlayer !== self) return
    const cellEl = e.target.closest(`.${bfStyles.battlefield_cell__content}`)
    if (!cellEl) return
    const row = Number(cellEl.dataset.row)
    const col = Number(cellEl.dataset.col)
    const result = rival.board.receiveAttack({ row, col })
    if (!result) return
    rival.board.render({
      container: rivalTable,
      showShips: false,
      statContainer: result.status === 'hit' ? rivalStat : null,
    })
    // check winner (after min 20 moves to optimize)
    if (++self.moveCount >= minMovesToWin && rival.board.allSunk()) {
      game.end(document.body)
      n10n.notify('OVER_WIN')
      return
    }
    if (result.status === 'hit') return
    game.switchTurn()
    rivalTable.classList.add('battlefield_table__disabled')
    selfTable.classList.remove('battlefield_table__disabled')

    n10n.notify('MOVE_OFF')
    computerTurn()
  }, n10n)

  rivalTable.addEventListener('click', playSelf)
}

window.addEventListener('error', (e) => {
  console.error(e.error)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error(e.reason)
})

errorHandler(init)()
