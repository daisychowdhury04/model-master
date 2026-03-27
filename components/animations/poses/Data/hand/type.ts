// This file contains all available hand position names for easy reference

// Right hand position names for reference

// Hand Movements
export const HandMovements = {
    HAND_TO_FOREHEAD: 'RIGHT_HAND_TO_FOREHEAD',
    HAND_TO_CHEST: 'RIGHT_HAND_TO_CHEST',
    HAND_TO_DISTANCE_FROM_FOREHEAD: 'RIGHT_HAND_TO_DISTANCE_FROM_FOREHEAD',
    HAND_NEUTRAL: 'RIGHT_HAND_NEUTRAL'
} as const;

// Palm Positions
export const PalmPositions = {
    PALM_NORTH_FACING: 'RIGHT_PALM_NORTH_FACING',
    PALM_NORTH_BACK_FACING: 'RIGHT_PALM_NORTH_BACK_FACING',
    PALM_EAST_FACING: 'RIGHT_PALM_EAST_FACING',
    PALM_EAST_BACK_FACING: 'RIGHT_PALM_EAST_BACK_FACING',
    PALM_SOUTH_FACING: 'RIGHT_PALM_SOUTH_FACING',
    PALM_SOUTH_BACK_FACING: 'RIGHT_PALM_SOUTH_BACK_FACING',
    PALM_WEST_FACING: 'RIGHT_PALM_WEST_FACING',
    PALM_WEST_BACK_FACING: 'RIGHT_PALM_WEST_BACK_FACING',
    PALM_RIGHT_FACING: 'RIGHT_PALM_RIGHT_FACING',
    PALM_RIGHT_BACK_FACING: 'RIGHT_PALM_RIGHT_BACK_FACING',
    PALM_LEFT_FACING: 'RIGHT_PALM_LEFT_FACING',
    PALM_LEFT_BACK_FACING: 'RIGHT_PALM_LEFT_BACK_FACING',

    PALM_WAVE_NORTH_FACING: 'RIGHT_PALM_WAVE_NORTH_FACING',
    PALM_WAVE_NORTH_BACK_FACING: 'RIGHT_PALM_WAVE_NORTH_BACK_FACING',
    PALM_WAVE_EAST_FACING: 'RIGHT_PALM_WAVE_EAST_FACING',
    PALM_WAVE_EAST_BACK_FACING: 'RIGHT_PALM_WAVE_EAST_BACK_FACING',
    PALM_WAVE_SOUTH_FACING: 'RIGHT_PALM_WAVE_SOUTH_FACING',
    PALM_WAVE_SOUTH_BACK_FACING: 'RIGHT_PALM_WAVE_SOUTH_BACK_FACING',
    PALM_WAVE_WEST_FACING: 'RIGHT_PALM_WAVE_WEST_FACING',
    PALM_WAVE_WEST_BACK_FACING: 'RIGHT_PALM_WAVE_WEST_BACK_FACING',
    PALM_WAVE_RIGHT_FACING: 'RIGHT_PALM_WAVE_RIGHT_FACING',
    PALM_WAVE_RIGHT_BACK_FACING: 'RIGHT_PALM_WAVE_RIGHT_BACK_FACING',
    PALM_WAVE_LEFT_FACING: 'RIGHT_PALM_WAVE_LEFT_FACING',
    PALM_WAVE_LEFT_BACK_FACING: 'RIGHT_PALM_WAVE_LEFT_BACK_FACING'
    
} as const;

// Finger Positions
export const FingerPositions = {
    FINGERS_SPREAD: 'RIGHT_FINGERS_SPREAD',
    FINGERS_CLOSED: 'RIGHT_FINGERS_CLOSED'
} as const;

// Note: All RIGHT_ positions have corresponding LEFT_ versions
// To use left hand positions, replace 'RIGHT_' with 'LEFT_' in the position name
// Example: 'RIGHT_PALM_UP' becomes 'LEFT_PALM_UP'

// Combined positions can be created using the '+' operator
// Example: 'RIGHT_NEUTRAL+LEFT_NEUTRAL'

export type HandMovementPosition = typeof HandMovements[keyof typeof HandMovements];
export type PalmPosition = typeof PalmPositions[keyof typeof PalmPositions];
export type FingerPosition = typeof FingerPositions[keyof typeof FingerPositions];
export type HandPosition = typeof HandMovements[keyof typeof HandMovements] | typeof PalmPositions[keyof typeof PalmPositions] | typeof FingerPositions[keyof typeof FingerPositions]; 