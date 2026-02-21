# Battleship Game (Vanilla JavaScript)

A browser-based Battleship game built using **modern vanilla JavaScript**, focused on clean architecture, solid game
logic, and maintainable code—without frameworks.

---

## Features

- Player vs Computer gameplay
- Intelligent computer moves with hit-based logic
- Modular, object-oriented design
- Persistent user preferences (sound, hints)
- Sound effects with toggle control
- Error-safe event handling
- No external libraries or frameworks

---

## Tech Stack

- JavaScript (ES6+)
- HTML5, CSS3 (CSS Modules)
- Browser APIs (DOM, Audio, localStorage)

---

## Project Structure

```
src/
├── Components/        # Core game logic (Game, Gameboard, Players, AI)
├── UI/                # Rendering and UI helpers
├── Utils/             # Utilities (delay, error handling, persistence)
├── Styles/            # Global styles and CSS modules
├── app.js             # Application bootstrap & event wiring
└── index.html
```

---

## What I Learned

- Structuring a medium-sized app without frameworks
- Managing turn-based game state cleanly
- Writing basic AI logic with performance considerations
- Using browser APIs for persistence and sound
- Separating game logic from UI code

---

## Run Locally

```bash
git clone https://github.com/Ashish-Dhami/battleship.git
cd battleship
npm install
npm run dev
```
