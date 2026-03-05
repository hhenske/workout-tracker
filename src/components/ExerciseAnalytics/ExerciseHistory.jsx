export default function ExerciseHistory({ sets }) {

  const grouped = {}

  sets.forEach(set => {

    const date = new Date(set.workouts.date)
      .toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

    if (!grouped[date]) {
      grouped[date] = []
    }

    grouped[date].push(set)

  })

  const history = Object.entries(grouped).reverse()

  return (

    <div className="exercise-history">

      <h3>Workout History</h3>

      {history.map(([date, workoutSets]) => {

        const summary = workoutSets
          .map(s => `${s.weight}×${s.reps}`)
          .join(', ')

        return (
          <div key={date} className="history-item">

            <span>{date}</span>

            <span>{summary}</span>

          </div>
        )

      })}

    </div>
  )
}
