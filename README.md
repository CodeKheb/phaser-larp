# WebSight

**WebSight** is a 2D platformer built with [Phaser](https://phaser.io/), TypeScript, and Vite that teaches students to collaborate on GitHub.

> This project is built for people to learn while contributing. No question is too basic.

## The WebSight Series

WebSight is a hands-on way to learn how real open-source projects work:

- **Updates on social media.** We post about it on our social media platforms.
- **Anyone can shape the game.** Everyone who sees the post can suggest a change through **polls**, **comments**, or by opening a **GitHub issue**.
- **Community ideas become features.** Popular suggestions get turned into tasks that contributors implement.
- **Real GitHub collaboration.** Every change follows the same flow as real projects: create a branch, open a pull request, get it reviewed, and merge into `main`.

Students are encouraged to contribute directly on GitHub — read the **[Contributing Guide](CONTRIBUTING.md)** to get started.

## The Game

A 2D side-scrolling platformer. The player explores a wide world filled with interactable objects.

### Controls

| Action | Keyboard | Mobile |
| --- | --- | --- |
| Move left / right | `A` / `D` | ◀ / ▶ buttons |
| Jump | `Space` | A button |
| Interact (pick up objects) | `Q` | B button |

### Features

- Side-scrolling world with a camera that follows the player
- Arcade physics: gravity, jumping, and platform collision
- Pick-up-and-hold interaction with objects
- Keyboard and touch/mobile controls
- Config-driven tuning (`WorldConfig`, `Attributes`, `InteractableConfig`)

## Getting Started

1. **Install Node.js** (LTS) from [nodejs.org](https://nodejs.org/) and [Git](https://git-scm.com/downloads) if you don't have them.
2. **Clone the repository:**
   ```bash
   git clone https://github.com/ - not sure yet
   cd  -- not sure yet
   ```
3. **Install dependencies** (the game lives in `websight/`):
   ```bash
   cd websight
   npm install
   ```
4. **Run the dev server:**
   ```bash
   npm run dev
   ```
   Open the local URL shown in your terminal — save a file and the browser auto-refreshes.
5. **Build for production:**
   ```bash
   npm run build
   ```
   Outputs an optimized version into `dist/`.

For detailed setup steps and project rules (branching, naming conventions, project structure), see the **[Contributing Guide](CONTRIBUTING.md)**.

## Tech Stack

| Tool | What it actually is |
| --- | --- |
| **Node.js** | Runs JavaScript outside the browser; powers the tools below. |
| **npm** | Installs and manages the project's dependencies. |
| **Vite** | Bundler and dev server with live reload. |
| **Phaser** | 2D game framework — rendering, sprites, physics, input, and scenes. |
| **TypeScript** | Typed JavaScript used throughout the game code. |

## Community & Updates

Follow the WebSight series on our social media platforms to see what's new and vote on what comes next — polls, comments, and GitHub issues are all ways to suggest a change.

- _Add your social media links here_

<!-- Have an idea? Open a [GitHub issue](<repository-url>/issues). -->

## Documentation

- [Phaser: Making your first Phaser 3 game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
- [How to Contribute](CONTRIBUTING.md)
