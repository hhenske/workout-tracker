export default function ExerciseHeader({ exerciseName, sets }) {

  const workoutDates = new Set(
    sets.map(set => set.workouts.date)
  )

  const workoutCount = workoutDates.size

  return (
    <div className="exercise-header">

      <h2 className="exercise-title">
        {exerciseName}
      </h2>

      <div className="exercise-meta">
        {workoutCount} workout{workoutCount !== 1 ? 's' : ''} logged
      </div>

    </div>
  )
}
