export function calculateWorkoutVolume(sets) {
  if (!sets || sets.length === 0) return 0

  return sets.reduce((total, set) => {
    const weight = set.weight || 0
    const reps = set.reps || 0
    return total + (weight * reps)
  }, 0)
}
