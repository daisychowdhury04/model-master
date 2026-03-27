export type RotationValue = number | { [boneName: string]: number };

export interface Rotation {
    x: RotationValue;
    y: RotationValue;
    z: RotationValue;
}

export const createMirroredRotation = (rotation: Rotation): Rotation => {
    const mirror = (value: RotationValue) => {
        if (typeof value === 'number') {
            return -value;
        }
        return Object.fromEntries(
            Object.entries(value).map(([bone, val]) => [bone, -val])
        );
    };

    return {
        x: rotation.x,
        y: mirror(rotation.y),
        z: mirror(rotation.z)
    };
};

export const createPose = (
    duration: number,
    bones: string[],
    getRotation: (progress: number) => Rotation
) => ({
    duration,
    bones,
    getRotation
});