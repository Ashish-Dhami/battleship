import { persistData, getPersistedData } from 'Utils'

export default class Game {
  #activePlayer

  #PREFS

  static #DEFAULT_PREFS = { shootHint: true, sound: false }

  static #SOUNDS = {
    GAME_STARTED: 'game_started',
    SHOOT_MISSED: 'shoot_missed',
    SHOOT_WOUNDED: 'shoot_wounded',
    SHOOT_KILLED: 'shoot_killed',
    OVER_WIN: 'win',
    OVER_LOSE: 'lose',
    CLICK: 'click',
  }

  constructor(self, rival) {
    this.self = self
    this.rival = rival
    this.#activePlayer = this.self
    this.ended = false
    this.#initializePrefs()
  }

  #initializePrefs() {
    const persistedPrefs = getPersistedData('battleshipPrefs')
    if (persistedPrefs) {
      this.#PREFS = persistedPrefs
    } else {
      this.#PREFS = Game.#DEFAULT_PREFS
      persistData('battleshipPrefs', Game.#DEFAULT_PREFS)
    }
  }

  get PREFS() {
    return this.#PREFS
  }

  setPref(pref, value) {
    this.#PREFS[pref] = !!value
    persistData('battleshipPrefs', this.#PREFS)
  }

  get activePlayer() {
    return this.#activePlayer
  }

  switchTurn() {
    this.#activePlayer = this.#activePlayer === this.self ? this.rival : this.self
  }

  start() {
    this.self.board.populate()
    this.rival.board.populate()
  }

  end(gameBody) {
    this.ended = true
    gameBody.classList.add('body__game_over')
  }

  restart(gameBody) {
    this.self.reset()
    this.rival.reset()
    this.#activePlayer = this.self
    this.ended = false
    gameBody.classList.remove('body__game_over')
  }

  playSound(type) {
    if (!this.#PREFS.sound) return
    const soundType = Game.#SOUNDS[type]
    if (!soundType) return
    const audio = document.querySelector(`.sounds .sound__${soundType}`)
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    audio.play().catch(() => {})
  }
}
