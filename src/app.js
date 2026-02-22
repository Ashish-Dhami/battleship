import 'Styles/global.css'
import * as bfStyles from 'Styles/battlefieldUI.module.css'
import { Gameboard, Game, Notification, RivalPlayer, SelfPlayer } from 'Components'
import { renderPlayerLabel, renderPlaceships, renderModal, updateGamePrefsUI } from 'UI'
import { delay, errorHandler } from 'Utils'
import { createHandlers } from 'Modules'

function createPlayers() {
  return new Promise((res, rej) => {
    renderModal(document.body, (name) => {
      try {
        res({
          self: new SelfPlayer(name ?? 'John'),
          rival: new RivalPlayer(),
        })
      } catch (err) {
        rej(err)
      }
    })
  })
}

async function init() {
  const { self, rival } = await createPlayers()
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
  const settings = document.querySelector('.settings')
  const n10ncontainer = document.querySelector('.notifications')

  const n10n = new Notification(n10ncontainer)

  rivalTable.classList.add('battlefield_table__disabled')

  const dom = { selfTable, rivalTable, selfStat, rivalStat, startBtn, leaveBtn, placeships, root: document.body }
  const deps = { game, bfStyles, dom, utils: { delay, minMovesToWin }, n10n }
  const {
    playSelf,
    handleLeave,
    handleStart,
    handleRestart,
    handleSettingsChange,
    onRandomise,
    onReset,
    withClickSound,
  } = createHandlers(deps)

  game.start()

  self.board.render({ container: selfTable, statContainer: selfStat })
  rival.board.render({ container: rivalTable, showShips: false, statContainer: rivalStat })
  renderPlayerLabel(selfLabelComment, self)
  renderPlayerLabel(rivalLabelComment, rival)
  renderPlaceships(
    placeships,
    errorHandler(withClickSound(onRandomise), n10n),
    errorHandler(withClickSound(onReset), n10n)
  )
  updateGamePrefsUI(settings, game.PREFS)

  rivalTable.addEventListener('click', errorHandler(playSelf, n10n))
  leaveBtn.addEventListener('click', errorHandler(withClickSound(handleLeave), n10n))
  startBtn.addEventListener('click', errorHandler(withClickSound(handleStart), n10n))
  settings.addEventListener('click', errorHandler(withClickSound(handleSettingsChange), n10n))
  n10ncontainer.addEventListener(
    'click',
    errorHandler(
      withClickSound((e) => {
        e.preventDefault()
        const elem = e.target
        if (elem?.classList.contains('restart')) {
          handleRestart({ autoStart: elem.value !== 'Create new game' })
        }
      }),
      n10n
    )
  )
}

window.addEventListener('error', (e) => {
  console.error(e.error)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error(e.reason)
})

errorHandler(init)()

// TODO: drag-n-drop
