import Phaser from 'phaser';
import { InputManager } from '../../features/controls/InputManager';
import { CONTRIBUTORS, displayName } from '../../shared/Contributors';
import { CameraManager } from '../camera/CameraManager';
import { SceneKeys } from '../config/SceneKeys';
import { SceneManager } from './SceneManager';

const ROW_HEIGHT = 58;
const BACKDROP = 0x0b1d26;

/**
 * Credits scene: lists everyone in contributors/CONTRIBUTORS.txt.
 *
 * Opened from MenuScene via SceneManager.openCredits() and returns to the
 * menu with BACK or Escape. The list scrolls with the mouse wheel or by
 * dragging (touch included).
 */
export class CreditsScene extends Phaser.Scene {
    private controls!: InputManager;

    /** Scroll offset of the list: 0 at the top, negative when scrolled. */
    private offset = 0;

    /** Total scrollable distance in world units (0 when everything fits). */
    private maxScroll = 0;

    /** Height of the whole list content in world units. */
    private contentHeight = 0;

    /** List container; its y-position tracks the scroll offset. */
    private list!: Phaser.GameObjects.Container;

    /** Scrollbar thumb, only created when the list overflows. */
    private thumb?: Phaser.GameObjects.Rectangle;

    /** List area in world coordinates (used for the edge strips and hit tests). */
    private listLeft = 0;
    private listTop = 0;
    private listWidth = 0;
    private listHeight = 0;

    /** Set while the pointer is dragging the list. */
    private dragging = false;
    private dragStartY = 0;
    private dragStartOffset = 0;

    constructor() {
        super(SceneKeys.Credits);
    }

    /**
     * Lays out the backdrop, title, scrollable contributor list and
     * BACK button, and wires up scroll input.
     */
    create(): void {
        this.controls = new InputManager(this);

        const camera = new CameraManager(this.cameras.main);
        const CENTER_X = camera.viewportCenterX();
        const CENTER_Y = camera.viewportCenterY();

        // Visible world area at the current zoom. CameraManager centers on
        // width/2, height/2 regardless of zoom (same as MenuScene).
        const visibleW = camera.width() / this.cameras.main.zoom;
        const visibleH = camera.height() / this.cameras.main.zoom;
        const top = CENTER_Y - visibleH / 2;
        const bottom = CENTER_Y + visibleH / 2;

        this.listWidth = Math.min(visibleW * 0.8, 760);
        this.listLeft = CENTER_X - this.listWidth / 2;
        this.listTop = top + 140;
        this.listHeight = Math.max(bottom - 100 - this.listTop, ROW_HEIGHT);

        // Solid backdrop (first, so everything else draws on top of it).
        this.add.rectangle(
            CENTER_X,
            CENTER_Y,
            visibleW + 40,
            visibleH + 40,
            BACKDROP,
        );

        // Rows are added next, then the strips clip them (see class doc).
        this.buildList();
        this.drawListEdges(CENTER_X, visibleW, top, bottom);

        // Title and BACK come after the strips so they always stay on top.
        this.add
            .text(CENTER_X, top + 56, 'Credits', {
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'bold',
                fontSize: '56px',
                color: '#ffffff',
                stroke: '#0b1d26',
            })
            .setOrigin(0.5)
            .setShadow(0, 4, '#00000066', 6, false, true);

        this.add
            .text(CENTER_X, top + 104, 'First-time contributors to WebSight', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '20px',
                color: '#cbd5e1',
            })
            .setOrigin(0.5);

        this.createBackButton(CENTER_X, bottom - 50);

        // Hide mobile controls while credits are on screen (same as MenuScene).
        document.body.classList.add('menu-active');
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            document.body.classList.remove('menu-active');
        });

        this.bindScrollInput();
    }

    /**
     * Runs every frame; Escape returns to the menu (like MenuScene's
     * Escape-to-resume).
     */
    update(): void {
        if (this.controls.escape) {
            SceneManager.returnToMenu(this);
        }
    }

    /**
     * Builds the contributor rows inside the scrollable container,
     * or an empty-state message when no one has contributed yet.
     */
    private buildList(): void {
        this.list = this.add.container(this.listLeft, this.listTop);

        if (CONTRIBUTORS.length === 0) {
            this.list.add(
                this.add
                    .text(
                        this.listWidth / 2,
                        this.listHeight / 2,
                        'No contributors yet.\n' +
                            'Be the first — add your line to\n' +
                            'contributors/CONTRIBUTORS.txt',
                        {
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '24px',
                            color: '#cbd5e1',
                            align: 'center',
                            lineSpacing: 8,
                        },
                    )
                    .setOrigin(0.5),
            );
            return;
        }

        CONTRIBUTORS.forEach((entry, index) => {
            const rowY = index * ROW_HEIGHT;

            const name = this.add
                .text(this.listWidth / 2, rowY + 14, displayName(entry), {
                    fontFamily: 'Arial, sans-serif',
                    fontStyle: 'bold',
                    fontSize: '25px',
                    color: '#ffffff',
                })
                .setOrigin(0.5, 0);

            const detail = this.add
                .text(this.listWidth / 2, rowY + 42, entry.program, {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '17px',
                    color: '#93c5fd',
                })
                .setOrigin(0.5, 0);

            this.list.add(name);
            this.list.add(detail);
        });

        this.contentHeight = CONTRIBUTORS.length * ROW_HEIGHT;
        this.maxScroll = Math.max(0, this.contentHeight - this.listHeight);

        if (this.maxScroll > 0) {
            // Scrollbar thumb showing how far through the list we are.
            const thumbHeight = Math.max(
                28,
                (this.listHeight * this.listHeight) / this.contentHeight,
            );
            this.thumb = this.add.rectangle(
                this.listLeft + this.listWidth - 4,
                this.listTop + thumbHeight / 2,
                6,
                thumbHeight,
                0xffffff,
                0.5,
            );
            this.updateThumb();
        }
    }

    /**
     * Paints opaque strips above and below the list area so rows are
     * visually clipped at the list boundary on every renderer. Drawn after
     * the rows and before the title/BACK button, which stay on top.
     * @param centerX The x coordinate of the viewport center.
     * @param visibleW Visible world width at the current zoom.
     * @param top The top edge of the visible world area.
     * @param bottom The bottom edge of the visible world area.
     */
    private drawListEdges(
        centerX: number,
        visibleW: number,
        top: number,
        bottom: number,
    ): void {
        const OVER = 40; // extend past the screen edge so nothing peeks
        const listBottom = this.listTop + this.listHeight;

        this.add.rectangle(
            centerX,
            (top - OVER + this.listTop) / 2,
            visibleW + 40,
            this.listTop - top + OVER,
            BACKDROP,
        );
        this.add.rectangle(
            centerX,
            (listBottom + bottom + OVER) / 2,
            visibleW + 40,
            bottom - listBottom + OVER,
            BACKDROP,
        );
    }

    /**
     * Binds wheel and pointer drag input to the list scroll position.
     */
    private bindScrollInput(): void {
        this.input.on(
            'wheel',
            (
                _pointer: Phaser.Input.Pointer,
                _currentlyOver: Phaser.GameObjects.GameObject[],
                _deltaX: number,
                deltaY: number,
            ) => {
                // Wheel down (positive deltaY) scrolls the list up.
                this.scrollBy(-deltaY * 0.5);
            },
        );

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this.isOverList(pointer)) return;
            const world = pointer.positionToCamera(
                this.cameras.main,
            ) as Phaser.Math.Vector2;

            this.dragging = true;
            this.dragStartY = world.y;
            this.dragStartOffset = this.offset;
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.dragging) return;
            const world = pointer.positionToCamera(
                this.cameras.main,
            ) as Phaser.Math.Vector2;

            this.setOffset(this.dragStartOffset + (world.y - this.dragStartY));
        });

        this.input.on('pointerup', () => {
            this.dragging = false;
        });
    }

    /**
     * Whether the given pointer is inside the list area (world coordinates).
     * @param pointer the pointer to test
     */
    private isOverList(pointer: Phaser.Input.Pointer): boolean {
        const world = pointer.positionToCamera(
            this.cameras.main,
        ) as Phaser.Math.Vector2;

        return (
            world.x >= this.listLeft &&
            world.x <= this.listLeft + this.listWidth &&
            world.y >= this.listTop &&
            world.y <= this.listTop + this.listHeight
        );
    }

    /**
     * Scrolls the list by the given amount in world units.
     * Positive values scroll down; the position is clamped to the content.
     * @param delta how far to scroll
     */
    private scrollBy(delta: number): void {
        this.setOffset(this.offset + delta);
    }

    /**
     * Moves the list to the given offset (0 = top, clamped to the content)
     * and updates the scrollbar thumb.
     * @param offset the new scroll offset
     */
    private setOffset(offset: number): void {
        this.offset = Phaser.Math.Clamp(offset, -this.maxScroll, 0);
        this.list.y = this.listTop + this.offset;
        this.updateThumb();
    }

    /**
     * Repositions the scrollbar thumb for the current offset.
     */
    private updateThumb(): void {
        if (!this.thumb || this.maxScroll <= 0) return;

        const thumbHeight = this.thumb.height;
        const travel = this.listHeight - thumbHeight;
        const progress = -this.offset / this.maxScroll;

        this.thumb.y = this.listTop + thumbHeight / 2 + progress * travel;
    }

    /**
     * Creates the BACK button, styled like the menu's buttons.
     * @param x The x coordinate for the button center.
     * @param y The y coordinate for the button center.
     */
    private createBackButton(x: number, y: number): void {
        const button = this.add
            .text(x, y, 'BACK', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '44px',
                color: '#ffffff',
                backgroundColor: '#1d4ed8',
                padding: { x: 20, y: 8 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(0, 4, '#00000066', 4, false, true);

        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#2563eb' });
            this.tweens.add({ targets: button, scale: 1.05, duration: 100 });
        });
        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#1d4ed8' });
            this.tweens.add({ targets: button, scale: 1, duration: 100 });
        });
        button.on('pointerdown', () => {
            this.tweens.add({ targets: button, scale: 0.95, duration: 60 });
        });
        button.on('pointerup', () => {
            this.tweens.add({ targets: button, scale: 1.05, duration: 60 });
            SceneManager.returnToMenu(this);
        });
    }
}
