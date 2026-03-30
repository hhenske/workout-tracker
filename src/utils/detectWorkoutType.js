export function detectWorkoutType(exercises) {
  if (!exercises || exercises.length === 0) return 'strength';

  const hasCardio = exercises.some(ex =>
    ex.type === 'cardio' ||
    ex.name?.toLowerCase().includes('run') ||
    ex.name?.toLowerCase().includes('cycle') ||
    ex.name?.toLowerCase().includes('walk')
  );

  return hasCardio ? 'cardio' : 'strength';
}
