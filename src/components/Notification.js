export default class Notification {
  static TYPES = {
    INIT: 'init',
    FIRST_MOVE_ON: 'game-started-move-on',
    MOVE_ON: 'move-on',
    MOVE_OFF: 'move-off',
    OVER_WIN: 'game-over-win',
    OVER_LOSE: 'game-over-lose',
    ERROR: 'game-error',
  }

  #active = Notification.TYPES.INIT

  constructor(container) {
    this.container = container
  }

  notify(type) {
    const next = Notification.TYPES[type]
    if (!next || next === this.#active) return
    this.container.querySelector(`.notification__${this.#active}`)?.classList.add('none')
    this.container.querySelector(`.notification__${next}`)?.classList.remove('none')
    this.#active = next
  }
}
