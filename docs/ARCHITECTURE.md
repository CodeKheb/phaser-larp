# Architecture

How the WebSight codebase is organized, and where your change belongs.

## Folder layout

```
websight/
├── index.html                 # Page shell: game container + mobile control buttons
├── src/
│   ├── Main.ts                 # Entry point: Phaser config + scene registration
│   ├── style.css               # Page styling + mobile control buttons
│   ├── core/
│   │   ├── camera/
│   │   │   └── CameraManager.ts #  mobile/desktop zoom + follow offsets in one place
│   │   ├── config/              # Tuning values and shared constants
│   │   │   ├── GameConfig.ts    #   world size, camera zoom, depths, gravity
│   │   │   ├── PlayerConfig.ts  #   player speed, jump, bounce
│   │   │   ├── InteractableConfig.ts # interaction radius, glow, dialogue width
│   │   │   └── SceneKeys.ts     #   every scene key in one place
│   │   └── scenes/              # Phaser scenes
│   │       ├── PreloaderScene.ts #   loads every texture once, then starts the menu
│   │       ├── GameScene.ts     #   abstract base for playable scenes (shared controls)
│   │       ├── MainScene.ts     #   the main demo world
│   │       ├── HouseScene.ts    #   the house interior
│   │       ├── MenuScene.ts     #   title + play button
│   │       ├── CreditsScene.ts  #   scrolling list of everyone in CONTRIBUTORS.txt
│   │       └── SceneManager.ts  #   the only code allowed to switch scenes
│   ├── features/
│   │   ├── controls/            # Input (keyboard, mobile, and the combined InputManager)
│   │   │   ├── InputManager.ts  #   one input source for gameplay code, device-agnostic
│   │   │   ├── keyboard/        #   KeyboardInput (A/D, Space, Q, Esc)
│   │   │   └── mobile/          #   MobileInput flags + MobileControls (on-screen buttons)
│   │   ├── objects/             # Interactable base class, interaction + physics wiring
│   │   │   ├── Interactable.ts           # base class; behaviors override onInteract()
│   │   │   ├── InteractionController.ts  # dispatches interaction, tracks held objects
│   │   │   ├── ColliderHandler.ts        # the single place physics colliders are made
│   │   │   └── behaviors/        #   one file per interactable type
│   │   ├── player/              # The Player sprite and its movement
│   │   └── world/               # World layout: ground, clouds, logo, camera bounds
│   └── shared/
│       ├── Assets.ts            # Asset keys (Assets) and file paths (AssetPaths)
│       └── Contributors.ts      # Parses contributors/CONTRIBUTORS.txt for the credits
└── public/                      # Static files served as-is (images live in subfolders here)
```

## How a gameplay scene is put together

`Main.ts` registers the scenes; `PreloaderScene` runs first and loads **all**
textures into Phaser's global TextureManager, so no other scene ever needs a
loading phase. Every playable scene extends `GameScene`, which gives you the
player, the input manager, movement/jump/interaction controls, and the Esc
pause menu for free — subclasses only build their own world in `create()`.

Objects never wire themselves into physics or find the player on their own:
spawn factories go through `ColliderHandler` for collisions, and
`InteractionController` (owned by the player) dispatches `onInteract()` to the
nearest interactable. Scene switches always go through `SceneManager`.

## "Where do I add X?"

| I want to add... | Do this |
|---|---|
| A new interactable type (NPC, door, chest...) | Create `features/objects/behaviors/MyThingInteractable.ts` extending `Interactable`. Implement `onInteract()`. Add its key to `Assets` and its path to `AssetPaths` (both in `shared/Assets.ts`), load it in `PreloaderScene`, and spawn it through a factory that uses `ColliderHandler`. |
| A new scene | Create `core/scenes/MyScene.ts` (extend `GameScene` if the player walks around in it). Add a key to `core/config/SceneKeys.ts`, register the scene class in `Main.ts`, and switch to it via `SceneManager` — never `scene.start()` directly. |
| A new asset (image) | Drop the file in `public/` (use the matching subfolder like `player/`, `objects/`, `world/`, or `scenes/`), add a key in `Assets` and a path in `AssetPaths` in `shared/Assets.ts`, then load it in `PreloaderScene.preload()`. |
| A new tuning value (speeds, sizes, colors) | Put it in the matching file in `core/config/` — never hardcode numbers in gameplay code. |
| A new mobile button | Add a flag (e.g. `myButton = false`) in `MobileInput.ts`, add a `<button id="myButton">` in `index.html`, and add a `this.bindButton('myButton')` call in `MobileControls.ts`. The flag name must match the button id exactly. |
| A new playable level/area | Create a scene extending `GameScene`; `setupPlayer()` gives you movement, jump, interact, and the Esc menu for free. Use `CameraManager` for the mobile/desktop zoom differences. |
| A new entry in the game credits | The credits scene reads `contributors/CONTRIBUTORS.txt` through `shared/Contributors.ts` at build time — the file is append-only and validated by CI. |
