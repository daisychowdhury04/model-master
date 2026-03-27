export const createMirroredSequence = (sequence: readonly string[]) => 
  sequence.map(pose => pose.replace('RIGHT_', 'LEFT_'));