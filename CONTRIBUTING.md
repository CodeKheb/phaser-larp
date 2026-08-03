# Contributing Guide

## The Stack 


| Tool | What it actually is |
|---|---|
| **Node.js** | A program that lets JavaScript run outside a browser, on your computer. It's what powers the tools below. | | **npm** | "Node Package Manager." It comes bundled with Node.js. It downloads and manages all the external code libraries (called "packages" or "dependencies") that this project needs to run. | | **Vite** | The "bundler." It takes all our JavaScript/asset files, bundles them together, and runs a local development server so you can see live changes in your browser as you code. |
| **Phaser** | The game framework itself. It's a JavaScript library specifically built for making 2D browser games — it handles things like rendering sprites, physics, input (keyboard/mouse), sound, and scenes for us so we don't build a game engine from scratch. |

### Setting up your computer

1. **Install Node.js.** Download the LTS version from [nodejs.org](https://nodejs.org/).
   This installs both `node` and `npm` for you.
2. **Confirm it worked.** Open a terminal (Command Prompt, PowerShell, or Terminal
   on Mac) and run:
   ```
   node -v
   npm -v
   ```
   If you see version numbers, you're good.
3. **Install Git** if you don't have it: [git-scm.com](https://git-scm.com/downloads).
   This is separate from npm — Git manages your code history and lets you push
   changes to GitHub.
4. **Update npm to the latest version** (recommended once, not required every time):
   ```
   npm install -g npm@latest
   ```

### Getting the project running

1. **Clone the repository**   
```
   git clone https://github.com/org/repo
   ```
2. **Move into the app folder.** The actual game lives inside the `websight/` folder,
   not the repo root:
   ```
   cd websight
   ```
3. **Install dependencies.** This reads `package.json` and downloads everything
   the project needs into `node_modules/`:
   ```
   npm install
   ```
   You only need to re-run this when `package.json` changes (e.g. someone added
   a new package).
4. **Start the dev server:**
   ```
   npm run dev
   ```
   This opens a local URL or similar, check your terminal output with the game running. Edit a file, save it, and the
   browser will auto-refresh.
5. **Building for production**
   ```
   npm run build
   ```
   This outputs an optimized version into a `dist/` folder.

If any of these commands fail, the most common cause is an out-of-date Node.js
version — reinstall the LTS version and try again.

---

## Contribution Rules

### Branching

Never commit directly to `main`. Always create a new branch first.

**Branch naming format:**
Use lowercase, hyphen-separated, and describe the actual change. Examples:
```
feature/add-player-jump
feature/inventory-ui
feature/fix-collision-bug
```

Create your branch like this:
```
git checkout main
git pull
git checkout -b feature/add-player-jump
```

### Submitting changes

When your change is ready, push your branch and open a **Pull Request (PR)
into `main`**. 

- Give the PR a clear title describing what changed.
- Link the issue or poll it relates to, if there is one.
- Keep PRs focused — one feature or fix per PR is easier to review than five
  unrelated changes bundled together.
- Wait for at least one review/approval before merging, even if you're able
  to merge it yourself.

### Naming conventions

- **Folders:** all lowercase, no camelCase, no spaces. Use hyphens if you need
  to separate words.
  - ✅ `player-controller`, `enemy-ai`, `ui-elements`
  - ❌ `PlayerController`, `enemyAI`, `UI Elements`
- **Files:** use PascalCase, no spaces.  
  - ✅ `MainScene.ts`, `KeyboardInput.ts`, `GameConfig.ts`
  - ❌ `playerController.ts`, `main-scene.ts`, `Enemy Movement.ts`


### Project structure

New gameplay functionality goes inside `features/`. Each feature should live
in its own subfolder so it's self-contained and easy for someone else to find,
review, or remove later.

```
websight/
├── src/
│   ├── features/
│   │   ├── player-movement/
│   │   ├── enemy-ai/
│   │   └── inventory-system/
│   ├── scenes/
│   └── main.js
├── public/
├── package.json
└── ...
```

If you're adding something that doesn't cleanly fit an existing feature
folder, create a new one rather than dropping files into a shared/generic
folder. If you're not sure where something belongs, ask in your PR description
— that's a completely normal question, not a sign you're doing something wrong.

---

## 3. Questions?

Open an issue with the `question` label, or ask in the community channel
if one is linked in the README. No question is too basic — this project is
built for people to learn while contributing.
