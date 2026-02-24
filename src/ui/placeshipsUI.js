import * as styles from 'Styles/placeshipsUI.module.css'

export default function renderPlaceships(container, onRandomise) {
  container.textContent = ''
  const randomise = document.createElement('li')
  const randomiseLink = document.createElement('span')

  randomise.classList.add(styles.placeships_variant, styles.placeships_variant__randomly)
  randomiseLink.classList.add(styles.placeships_variant__link)

  randomiseLink.textContent = 'Randomise'

  randomiseLink.onclick = onRandomise

  randomise.appendChild(randomiseLink)

  container.appendChild(randomise)
}
