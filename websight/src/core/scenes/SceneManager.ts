import Phaser from 'phaser';
import { SceneKeys, type SceneKey } from '../config/SceneKeys';

/**
 * The only code allowed to start/stop/sleep/wake/pause/resume/launch scenes.
 */
export class SceneManager {
    /** Registry key storing which gameplay scene opened the pause menu. */
    private static readonly PAUSED_BY_KEY = 'pausedBy';

    /** Registry key marking a transition already scheduled but not yet run. */
    private static readonly TRANSITION_KEY = 'sceneTransitionPending';

    /**
     * The ONE way to switch gameplay scenes.
     * Safe to call from input handlers mid-update: the actual switch is
     * deferred to the next tick so it never runs inside a physics or input
     * callback, and concurrent transitions are ignored.
     * Uses sleep/wake under the hood, so the scene being left keeps its
     * state and the target only runs preload/create the first time it starts.
     * @param from the scene initiating the switch
     * @param key key of the scene to switch to
     */
    static go(from: Phaser.Scene, key: SceneKey): void {
        const registry = from.game.registry;
        if (registry.get(SceneManager.TRANSITION_KEY)) return; // already in flight

        registry.set(SceneManager.TRANSITION_KEY, true);

        // Close the menu overlay first, if it happens to be open.
        if (from.scene.isActive(SceneKeys.Menu)) {
            from.scene.stop(SceneKeys.Menu);
        }

        // Defer out of the current update/input tick.
        from.time.delayedCall(0, () => {
            registry.set(SceneManager.TRANSITION_KEY, false);
            // Sleeps this scene and wakes the target (or starts it the first
            // time), so the scene being left keeps its state.
            from.scene.switch(key);
        });
    }

    /**
     * Pauses the given gameplay scene and launches the menu overlay on top.
     * Records which scene paused so resume knows where to go back to.
     * @param scene the gameplay scene to pause
     */
    static pauseForMenu(scene: Phaser.Scene): void {
        scene.game.registry.set(SceneManager.PAUSED_BY_KEY, scene.scene.key);
        scene.scene.pause();
        scene.scene.launch(SceneKeys.Menu);
        scene.scene.bringToTop(SceneKeys.Menu);
    }

    /**
     * Stops the menu and resumes exactly the scene that paused for it.
     * Safe no-op when no scene is recorded (e.g. the menu was opened cold).
     */
    static resumeFromMenu(menu: Phaser.Scene): void {
        const pausedKey = menu.game.registry.get(
            SceneManager.PAUSED_BY_KEY,
        ) as SceneKey | null;

        if (!pausedKey) {
            // Menu opened without a paused gameplay scene behind it.
            menu.scene.start(SceneKeys.Main);
            return;
        }

        menu.scene.stop();
        menu.scene.resume(pausedKey);
    }

    /**
     * Whether the given gameplay scene is currently paused behind the menu.
     * @param scene the gameplay scene to check
     */
    static isPausedForMenu(scene: Phaser.Scene): boolean {
        return (
            scene.scene.isPaused(scene.scene.key) &&
            scene.game.registry.get(SceneManager.PAUSED_BY_KEY) ===
                scene.scene.key
        );
    }

    /**
     * Opens the credits screen from the menu overlay: stops the menu and
     * starts CreditsScene on the next tick, using the same transition guards
     * as go().
     * @param menu the menu scene opening the credits
     */
    static openCredits(menu: Phaser.Scene): void {
        const registry = menu.game.registry;
        if (registry.get(SceneManager.TRANSITION_KEY)) return; // in flight

        registry.set(SceneManager.TRANSITION_KEY, true);

        menu.time.delayedCall(0, () => {
            registry.set(SceneManager.TRANSITION_KEY, false);
            // Queues "stop credits' caller, start credits" — Phaser runs both
            // together next step, so no frame renders between them.
            menu.scene.start(SceneKeys.Credits);
        });
    }

    /**
     * Returns from the credits screen to the menu overlay, with the same
     * transition guards as go(). Any gameplay scene paused behind the menu
     * is untouched, so the menu's PLAY still resumes it.
     * @param credits the credits scene closing
     */
    static returnToMenu(credits: Phaser.Scene): void {
        const registry = credits.game.registry;
        if (registry.get(SceneManager.TRANSITION_KEY)) return; // in flight

        registry.set(SceneManager.TRANSITION_KEY, true);

        credits.time.delayedCall(0, () => {
            registry.set(SceneManager.TRANSITION_KEY, false);
            credits.scene.start(SceneKeys.Menu);
        });
    }

    /**
     * Safe restart of the given scene with the same transition guards as go().
     * The scene is stopped and started again, so create() re-runs and the
     * world is rebuilt from scratch. Useful for reset/respawn flows.
     */
    static restart(scene: Phaser.Scene): void {
        const registry = scene.game.registry;
        if (registry.get(SceneManager.TRANSITION_KEY)) return; // in flight

        registry.set(SceneManager.TRANSITION_KEY, true);

        scene.time.delayedCall(0, () => {
            registry.set(SceneManager.TRANSITION_KEY, false);
            // Full teardown: queues stop(self) + start(self).
            scene.scene.restart();
        });
    }
}
