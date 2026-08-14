# Contributing Guide

Welcome to **WebSight**! This guide walks you through everything you need to start
contributing — from setting up your computer to merging your first change.

It's written for **everyone**. If you've never opened a terminal or
used GitHub before, you're in the right place. No question is too basic.

## Getting Started

### Terms you'll see a lot

- **Terminal** — a program where you type text commands instead of clicking buttons.
  On Windows it's *Command Prompt* or *PowerShell*, on Mac it's *Terminal*.
- **Command** — a line of text you type into the terminal, then press `Enter` to run.
- **Folder** — same thing as a directory. `cd` stands for "change directory" (move into a folder).
- **Clone** — downloading a copy of the repository to your computer.
- **Dependencies** — the external code packages the project needs. `npm install` downloads them for you.
- **Dev server** — a program that runs the game on your computer and updates it live as you edit code.

### Step 1: Install Node.js

Node.js is a program that lets JavaScript run outside a browser — it powers the
tools we use to build the game. Download the **LTS** version from
[nodejs.org](https://nodejs.org/) and install it like any other program.
This installs both `node` and `npm` for you.

### Step 2: Check that it worked

Open a terminal (Command Prompt, PowerShell, or Terminal) and run:

```
node -v
npm -v
```

If you see version numbers (like `v22.0.0`), you're good to go. If you see
"not recognized" or "command not found", Node.js didn't install correctly —
try installing it again.

### Step 3: Install Git

Git is the tool that tracks your code history and lets you push changes to
GitHub. It's separate from npm. Install it from
[git-scm.com](https://git-scm.com/downloads) — just click through the installer.

### Step 4: Update npm (optional, recommended once)

npm updates itself along with Node.js, but updating it separately once keeps
things fresh:

```
npm install -g npm@latest
```

### Step 5: Get a copy of the project (clone)

In your terminal, run:

```
git clone https://github.com/org/repo
```

This downloads the whole project into a new folder on your computer. Move into
that folder (Git names it after the repository):

```
cd repo
```

### Step 6: Move into the game folder

The actual game lives inside the `websight/` folder, not the repo root:

```
cd websight
```

### Step 7: Install dependencies

This reads `package.json` and downloads everything the project needs into
`node_modules/`:

```
npm install
```

You only need to re-run this when `package.json` changes (e.g. someone added
a new package).

### Step 8: Run the game (dev server)

```
npm run dev
```

This starts the dev server. It prints a local URL (something like
`http://localhost:5173`) — open it in your browser and the game should appear.
Edit a file, save it, and the browser auto-refreshes with your changes. This is
how you'll see your contributions live.

### Step 9: Build for production (optional)

```
npm run build
```

This creates an optimized version of the game in a `dist/` folder. You don't
need this to contribute — it's mainly used for publishing.

### Troubleshooting

If any command fails, the most common cause is an out-of-date Node.js version —
reinstall the LTS version and try again. Still stuck? Ask in our community
channels (see [Questions?](#questions)) — no question is too basic.

---

## The Stack

What you're actually working with:

| Tool | What it actually is |
|---|---|
| **Node.js** | A program that lets JavaScript run outside a browser, on your computer. It's what powers the tools below. |
| **npm** | "Node Package Manager." It comes bundled with Node.js. It downloads and manages all the external code libraries (called "packages" or "dependencies") that this project needs to run. |
| **Vite** | The "bundler." It takes all our JavaScript/asset files, bundles them together, and runs a local development server so you can see live changes in your browser as you code. |
| **Phaser** | The game framework itself. It's a JavaScript library specifically built for making 2D browser games — it handles things like rendering sprites, physics, input (keyboard/mouse), sound, and scenes for us so we don't build a game engine from scratch. |

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
and that's a completely normal question, not a sign you're doing something wrong.

---

## Questions?

Open an issue with the `question` label, or ask in our community channels —
we communicate on **Discord** and **Facebook Messenger**. No question is too
basic — this project is built for people to learn while contributing.
