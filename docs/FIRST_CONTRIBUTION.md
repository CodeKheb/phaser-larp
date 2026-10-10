# First Contribution Guide

Your first contribution to **WebSight** is adding your name to the project's
contributors list. It takes about **5 minutes**, and **you don't need to
install anything** — everything happens in your web browser.

When your pull request (PR) is merged, your name becomes part of the project.

---

## What you need

1. A **GitHub account** — if you don't have one, sign up free at
   [github.com/signup](https://github.com/signup) (takes 2 minutes).
2. That's it.

---

## What a "first contribution" is

We have a special check (called a **CI check**) that watches first
contributions and makes sure they follow exactly one rule:

> **A first contribution may only add ONE line — your name — to the bottom of
> [`contributors/CONTRIBUTORS.txt`](../contributors/CONTRIBUTORS.txt).**

Nothing else in the project may change. The line must look exactly like this:

```
LAST NAME, FIRST NAME, M.I. PROGRAM - SECTION - YEAR LEVEL
```

For example:

```
Dela Cruz, Juan, M. BSIT - NW2A - 3rd Year
```

That's the entire contribution. WebSight checks it automatically and leaves a
comment on your PR telling you if everything is good or what to fix.

---

## Step-by-step (browser only)

### Step 1: Fork the project

A **fork** is your own personal copy of the project on your GitHub account —
you can change it freely without breaking anything.

1. Open [github.com/CodeKheb/phaser-larp](https://github.com/CodeKheb/phaser-larp)
   while logged in to GitHub.
2. Click the **Fork** button at the top right.
3. On the next screen, click **Create fork** (keep all the defaults).

### Step 2: Edit the contributors file on your fork

1. Go to the file you need to change:
   [contributors/CONTRIBUTORS.txt](https://github.com/CodeKheb/phaser-larp/blob/main/contributors/CONTRIBUTORS.txt)
2. Click the **pencil icon ✏️** (Edit this file) at the top right of the file.
   GitHub may ask you to **fork the repository** first — if so, click the
   button and it does it for you.
3. Click at the **very end of the last line**, press `Enter` to make a new
   line, and type **your line** in the format above. Example:

   ```
   Dela Cruz, Juan, M. BSIT - NW2A - 3rd Year
   ```

   ⚠️ Only **add** your line. Do **not** edit or delete anyone else's line,
   and do not touch the lines starting with `#` at the top.

### Step 3: Create your branch and propose the change

1. Below the file editor, GitHub shows two boxes: **"Commit directly to
   `main`"** and **"Create a new branch..."**. Choose the second one.
2. Name the branch exactly like this (replace the last part with your name):

   ```
   contribution/add-your-name
   ```

3. Click **Propose changes**.

### Step 4: Open the Pull Request

1. On the next screen, click **Create pull request**.
2. Give it a simple title like *"Add Juan Dela Cruz to contributors"* and
   click **Create pull request** again.

Done — that's your first contribution. Now the WebSight will take over.

---

## What happens next (the automatic checks)

When you open your PR, two automatic checks run:

### 🤖 First Contribution Check

WebSight reads your PR and checks that:

- ✅ **Only** `contributors/CONTRIBUTORS.txt` was changed (nothing else).
- ✅ You added **exactly one** new line — nobody else's line was removed or
  edited.
- ✅ Your line matches the format:
  `LAST NAME, FIRST NAME, M.I. PROGRAM - SECTION - YEAR LEVEL`.
- ✅ Your name isn't already in the list.

It leaves a comment right on your PR:

- **"✅ Welcome to WebSight, [your name]!"** — everything is perfect.
- **"Almost there!"** — something needs fixing, and the comment tells you
  exactly what and how.

### 🏗️ Checker

This one builds (compiles) the game to make sure the project still works.
Since a first contribution doesn't change any game code, this should pass on
its own — you don't need to do anything.

### What if a check fails?

Don't worry — nothing is broken and nobody is mad. Just:

1. Read the WebSight's comment on your PR — it says exactly what to fix.
2. Go back to your file on GitHub and fix it (the PR updates automatically —
   no need to open a new one).
3. The checks re-run by themselves.

**Common mistakes and how to fix them:**

| Mistake | How to fix it |
|---|---|
| Wrong format (missing dashes, wrong order) | Copy this shape exactly: `Dela Cruz, Juan, M. BSIT - NW2A - 3rd Year` |
| You edited or deleted someone's line | Undo your edit so only your one new line is added |
| You changed another file by accident | Revert that file — only `CONTRIBUTORS.txt` may change |
| Your name is already in the list | You already contributed once — one entry per person |

### Last step: merge

Once the checks are green ✅, a project maintainer will review your PR and
**merge** it. Your name is now officially part of WebSight. Welcome aboard! 🎉

---

## Curious how it works behind the scenes?

The CI lives in [`.github/workflows/first-contribution.yml`](../.github/workflows/first-contribution.yml).
It runs on every PR to `main` that comes from a fork or a branch starting with
`contribution/` (which is why we name the branch that way). It compares your
version of `contributors/CONTRIBUTORS.txt` with the official one and only lets
a single, correctly formatted, new line through.

Want to do more than add your name? Great — read the
[Contributing Guide](../CONTRIBUTING.md) to set up the game on your computer
and start contributing code, sprites, sounds, or animations.

---

## Where to go for help

Stuck? That's completely normal. Open an issue with the `question` label on the
repo, or ask in our **Discord** / **Facebook Messenger** community channels —
no question is too basic. This project is built for people to learn while
contributing.
