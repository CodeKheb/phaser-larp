import Phaser from 'phaser';
import { SceneKeys, type SceneKey } from '../config/SceneKeys';
import { Interactable } from '../../features/objects/Interactable';

/**
 * The only code allowed to start/stop/pause/resume/launch scenes.
 */
export class SceneManager {
    /** Registry key storing which gameplay scene opened the pause menu. */
    private static readonly PAUSED_BY_KEY = 'pausedBy';

    /** Registry key marking a transition already scheduled but not yet run. */
    private static readonly TRANSITION_KEY = 'sceneTransitionPending';

    /**
     * The ONE way to switch gameplay scenes.
     * Safe to call from input handlers mid-update: the actual `start` is
     * deferred to the next tick so it never runs inside a physics or input
     * callback, and concurrent transitions are ignored.
     * Also clears the interactable registry, so scenes never do it manually.
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

        Interactable.clearRegistry();

        // Defer out of the current update/input tick (fixes the once-only bug).
        from.time.delayedCall(0, () => {
            registry.set(SceneManager.TRANSITION_KEY, false);
            from.scene.start(key);
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
     * Replaces MenuScene's hardcoded isPaused(House)/isPaused(Main) guessing.
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
     * Safe restart of the given scene with the same transition guards as go().
     * Useful later for reset/respawn flows.
     */
    static restart(scene: Phaser.Scene): void {
        SceneManager.go(scene, scene.scene.key as SceneKey);
    }
}
