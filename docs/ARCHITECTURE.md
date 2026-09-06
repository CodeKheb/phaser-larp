# Architecture

How the WebSight codebase is organized, and where your change belongs.

## Folder layout

```
websight/
├── src/
│   ├── Main.ts                  # Entry point: Phaser config + scene registration
│   ├── style.css                # Page styling + mobile control buttons
│   ├── core/
│   │   ├── config/              # Tuning values and shared constants
│   │   │   ├── GameConfig.ts    #   world size, camera zoom, depths
│   │   │   ├── PlayerConfig.ts  #   player speed, jump, bounce
│   │   │   ├── InteractableConfig.ts # interaction radius, glow, dialogue width
│   │   │   └── SceneKeys.ts     #   every scene key in one place
│   │   └── scenes/              # Phaser scenes
│   │       ├── GameScene.ts     #   base class for playable scenes (shared controls)
│   │       ├── MainScene.ts     #   the main demo world
│   │       ├── HouseScene.ts    #   the house interior
│   │       └── MenuScene.ts     #   title + play button
│   ├── features/
│   │   ├── controls/            # Input (keyboard, mobile, and the combined InputManager)
│   │   ├── objects/             # Interactable base class + behaviors/ for each type
│   │   ├── player/              # The Player sprite and its movement
│   │   └── world/               # World layout: ground, clouds, logo, camera bounds
│   └── shared/
│       └── Assets.ts            # Asset keys + file paths (single source of truth)
└── public/                      # Static files served as-is (images live in subfolders here)
```

## "Where do I add X?"

| I want to add... | Do this |
|---|---|
| A new interactable type (NPC, door, chest...) | Create `features/objects/behaviors/MyThingInteractable.ts` extending `Interactable`. Implement `onInteract()`. Add its texture to `Assets.ts` and load it in the scene's `preload()`. |
| A new scene | Create `core/scenes/MyScene.ts` (extend `GameScene` if the player walks around in it). Add a key to `core/config/SceneKeys.ts` and register the class in `Main.ts`. |
| A new asset (image) | Drop the file in `public/` (use the matching subfolder), add a key + path in `shared/Assets.ts`, and load it in the scene that uses it. |
| A new tuning value (speeds, sizes, colors) | Put it in the matching file in `core/config/` — never hardcode numbers in gameplay code. |
| A new mobile button | Add a flag in `features/controls/mobile/MobileInput.ts`, a `<button>` with the same id in `index.html`, and a `bindButton(...)` call in `MobileControls.ts`. |
| A new playable level/area | Create a scene extending `GameScene`; `setupPlayer()` gives you movement, jump, interact, and the Esc menu for free. |
