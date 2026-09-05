import { Interactable } from '../Interactable.ts';
import { InteractableConfig } from '../../../core/config/InteractableConfig.ts';
import { Player } from '../../player/Player.ts';
import { Depth } from '../../../core/config/GameConfig.ts';
import Phaser from 'phaser';

/**
 * An interactable that displays a dialogue box when the player interacts with it.
 * Useful for signs, NPCs, or any object that conveys text.
 */
export class DialogueInteractable extends Interactable {
    private dialogueText: Phaser.GameObjects.Text | null = null;
    private dialogueBg: Phaser.GameObjects.Graphics | null = null;
    private readonly message: string;
    private isOpen: boolean = false;

    /**
     * @param scene the game scene
     * @param player the player object
     * @param asset the texture key for this object
     * @param message the text to show in the dialogue
     * @param x spawn X
     * @param y spawn Y
     */
    constructor(
        scene: Phaser.Scene,
        player: Player,
        asset: string,
        message: string,
        x: number,
        y: number,
    ) {
        super(scene, player, x, y, asset);
        this.message = message;
        this.setDepth(Depth.ABOVE_PLAYER);

        this.on(Phaser.Input.Events.POINTER_DOWN, () => this.onInteract());
    }

    /**
     * Opens (or closes) the dialogue bubble above this object.
     */
    onInteract(): void {
        if (this.isOpen) {
            this.hideDialogue();
        } else {
            this.showDialogue();
        }
    }

    /**
     * Automatically hides the dialogue when the player walks away.
     */
    onOutOfRange(): void {
        this.hideDialogue();
    }

    /**
     * Renders a speech-bubble style dialogue above the object.
     */
    private showDialogue(): void {
        if (this.isOpen) return;
        this.isOpen = true;

        const cam = this.scene.cameras.main;
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#000000',
            wordWrap: {
                width: InteractableConfig.DIALOGUE_MAX_WIDTH,
            },
            align: 'center',
        };

        // Background graphics
        this.dialogueBg = this.scene.add.graphics();
        this.drawDialogueBubble();
        this.dialogueBg.setDepth(Depth.ABOVE_PLAYER);

        // Text
        this.dialogueText = this.scene.add.text(0, 0, this.message, style);
        this.positionDialogue(cam.scrollX, cam.scrollY);
        this.dialogueText.setDepth(Depth.ABOVE_PLAYER);
    }

    /**
     * Positions the dialogue bubble relative to the camera so it stays
     * on-screen regardless of world position.
     */
    private positionDialogue(_camX: number, _camY: number): void {
        if (!this.dialogueText || !this.dialogueBg) return;

        const bubblePadding = 10;
        const bounds = this.dialogueText.getBounds();
        const bubbleW = bounds.width + bubblePadding * 2;
        const bubbleH = bounds.height + bubblePadding * 2;

        // Center above the sprite
        const bx = this.x - bubbleW / 2;
        const by = this.y - this.displayHeight / 2 - bubbleH - 8;

        this.dialogueText.setPosition(bx + bubblePadding, by + bubblePadding);
        this.drawDialogueBubble();
    }

    private drawDialogueBubble(): void {
        if (!this.dialogueBg || !this.dialogueText) return;

        this.dialogueBg.clear();

        const bounds = this.dialogueText.getBounds();
        const pad = 10;
        const bx = bounds.x - pad;
        const by = bounds.y - pad;
        const bw = bounds.width + pad * 2;
        const bh = bounds.height + pad * 2;
        const radius = 8;

        // Rounded-rect background
        this.dialogueBg.fillStyle(0xffffff, 0.92);
        this.dialogueBg.fillRoundedRect(bx, by, bw, bh, radius);
        this.dialogueBg.lineStyle(2, 0x333333, 1);
        this.dialogueBg.strokeRoundedRect(bx, by, bw, bh, radius);

        // Small pointer triangle pointing down at the object
        const tipX = this.x;
        const tipY = by + bh;
        this.dialogueBg.fillStyle(0xffffff, 0.92);
        this.dialogueBg.fillTriangle(
            tipX - 6,
            tipY,
            tipX + 6,
            tipY,
            tipX,
            tipY + 8,
        );
        this.dialogueBg.lineStyle(2, 0x333333, 1);
        this.dialogueBg.lineBetween(tipX - 6, tipY, tipX, tipY + 8);
        this.dialogueBg.lineBetween(tipX + 6, tipY, tipX, tipY + 8);
    }

    private hideDialogue(): void {
        if (!this.isOpen) return;
        this.isOpen = false;

        this.dialogueText?.destroy();
        this.dialogueText = null;
        this.dialogueBg?.destroy();
        this.dialogueBg = null;
    }
}
