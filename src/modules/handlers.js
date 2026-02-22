export default function createHandlers({ game, bfStyles, dom, utils, n10n }) {
  const { selfTable, rivalTable, selfStat, rivalStat, startBtn, leaveBtn, placeships } = dom

  function playComputer() {
    if (game.ended || game.activePlayer !== game.rival) return 'stop'

    const [row, col] = game.rival.chooseMove()
    const result = game.self.board.receiveAttack({ row, col }, game.PREFS.shootHint)
    if (!result) return 'retry'

    game.self.board.render({ container: selfTable, statContainer: result.status === 'hit' ? selfStat : null })

    if (++game.rival.moveCount >= utils.minMovesToWin && game.self.board.allSunk()) {
      game.playSound('OVER_LOSE')
      game.end(dom.root)
      return 'end'
    }

    if (result.status === 'hit') {
      game.playSound(result.ship.isSunk() ? 'SHOOT_KILLED' : 'SHOOT_WOUNDED')
      game.rival.registerHit({ row, col }, result.ship, { shootHint: game.PREFS.shootHint })
      return 'hit'
    }

    game.playSound('SHOOT_MISSED')
    game.switchTurn()
    selfTable.classList.add('battlefield_table__disabled')
    rivalTable.classList.remove('battlefield_table__disabled')

    return 'miss'
  }

  async function computerTurn() {
    let notifyType = 'MOVE_ON'

    while (game.activePlayer === game.rival) {
      await utils.delay(1000)
      const outcome = playComputer()
      if (['stop', 'end', 'miss'].includes(outcome)) {
        if (outcome === 'end') notifyType = 'OVER_LOSE'
        break
      }
    }

    n10n.notify(notifyType)
  }

  async function playSelf(e) {
    if (game.ended || game.activePlayer !== game.self) return

    const cellEl = e.target.closest(`.${bfStyles.battlefield_cell__content}`)
    if (!cellEl) return

    const row = Number(cellEl.dataset.row)
    const col = Number(cellEl.dataset.col)

    const result = game.rival.board.receiveAttack({ row, col }, game.PREFS.shootHint)
    if (!result) return

    game.rival.board.render({
      container: rivalTable,
      showShips: false,
      statContainer: result.status === 'hit' ? rivalStat : null,
    })

    if (++game.self.moveCount >= utils.minMovesToWin && game.rival.board.allSunk()) {
      game.playSound('OVER_WIN')
      game.end(dom.root)
      n10n.notify('OVER_WIN')
      return
    }

    if (result.status === 'hit') {
      game.playSound(result.ship.isSunk() ? 'SHOOT_KILLED' : 'SHOOT_WOUNDED')
      return
    }

    game.playSound('SHOOT_MISSED')
    game.switchTurn()
    rivalTable.classList.add('battlefield_table__disabled')
    selfTable.classList.remove('battlefield_table__disabled')

    n10n.notify('MOVE_OFF')
    await computerTurn()
  }

  function handleLeave(e) {
    e.preventDefault()
    const confirmMsg = leaveBtn.dataset.confirm
    if (!confirm(confirmMsg)) return
    location.reload()
  }

  function handleStart() {
    game.playSound('GAME_STARTED')
    rivalTable.classList.remove('battlefield_table__disabled')
    selfTable.classList.add('battlefield_table__disabled')
    startBtn.parentElement.classList.add('none')
    placeships.classList.add('none')
    leaveBtn.classList.remove('none__visible')
    n10n.notify('FIRST_MOVE_ON')
  }

  function handleRestart({ autoStart }) {
    game.restart(dom.root)
    game.self.board.render({ container: selfTable, statContainer: selfStat })
    game.rival.board.render({ container: rivalTable, showShips: false, statContainer: rivalStat })
    rivalTable.classList.add('battlefield_table__disabled')
    selfTable.classList.remove('battlefield_table__disabled')
    startBtn.parentElement.classList.remove('none')
    placeships.classList.remove('none')
    leaveBtn.classList.add('none__visible')
    n10n.notify('INIT')
    if (autoStart) {
      handleStart()
    }
  }

  function handleSettingsChange(e) {
    const input = e.target
    if (!input?.classList.contains('setting_input')) return
    const setting = input.closest('.setting')
    const pref = setting.dataset.name
    game.setPref(pref, input.checked)
  }

  function onRandomise() {
    game.self.board.randomise()
    game.self.board.render({ container: selfTable })
  }

  function onReset() {
    alert('reset')
  }

  function withClickSound(handler) {
    return (e) => {
      game.playSound('CLICK')
      return handler(e)
    }
  }

  return {
    playSelf,
    handleLeave,
    handleStart,
    handleRestart,
    handleSettingsChange,
    onRandomise,
    onReset,
    withClickSound,
  }
}
