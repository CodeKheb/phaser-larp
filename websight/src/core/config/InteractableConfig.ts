/**
 * Configuration values for interactable objects.
 *
 * Controls interaction radius, dialogue max width, outline glow color,
 * and outline glow strength.
 */
export const InteractableConfig = {
    RADIUS: 120,           // Interaction range radius in pixels
    DIALOGUE_MAX_WIDTH: 300, // Maximum width for dialogue text wrapping
    OUTLINE_COLOR: 0xffff00, // Outline glow color (yellow)
    OUTLINE_STRENGTH: 5,     // Outline glow intensity/strength
} as const;
