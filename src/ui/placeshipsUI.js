import * as styles from 'Styles/placeshipsUI.module.css'

export default function renderPlaceships(container, onRandomise, onReset) {
  container.textContent = ''
  const randomise = document.createElement('li')
  const reset = document.createElement('li')
  const randomiseLink = document.createElement('span')
  const resetLink = document.createElement('span')

  randomise.classList.add(styles.placeships_variant, styles.placeships_variant__randomly)
  reset.classList.add(styles.placeships_variant, styles.placeships_variant__hands)
  randomiseLink.classList.add(styles.placeships_variant__link)
  resetLink.classList.add(styles.placeships_variant__link)

  randomiseLink.textContent = 'Randomise'
  resetLink.textContent = 'Reset'

  randomiseLink.onclick = onRandomise
  resetLink.onclick = onReset

  randomise.appendChild(randomiseLink)
  reset.appendChild(resetLink)

  container.append(randomise, reset)
}
