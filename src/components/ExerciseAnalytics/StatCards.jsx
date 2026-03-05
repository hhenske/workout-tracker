export default function StatCards({ sets }) {

  function calculate1RM(weight, reps) {
    return weight * (1 + reps / 30)
  }

  function getStats() {

    let totalVolume = 0
    let bestWeight = 0
    let best1RM = 0

    for (const set of sets) {

      const { weight, reps } = set

      totalVolume += weight * reps

      if (weight > bestWeight) {
        bestWeight = weight
      }

      if (reps > 0 && reps <= 12) {
        const estimated = calculate1RM(weight, reps)
        if (estimated > best1RM) {
          best1RM = estimated
        }
      }

    }

    return {
      totalVolume: Math.round(totalVolume),
      bestWeight: Math.round(bestWeight),
      totalSets: sets.length,
      best1RM: Math.round(best1RM)
    }
  }

  const stats = getStats()

  return (
    <div className="exercise-stats">

      <div className="stat-card">
        <div className="stat-label">Total Volume</div>
        <div className="stat-value tabular-nums">
          {stats.totalVolume} lbs
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Best Weight</div>
        <div className="stat-value tabular-nums">
          {stats.bestWeight} lbs
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Total Sets</div>
        <div className="stat-value tabular-nums">
          {stats.totalSets}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Est. 1RM</div>
        <div className="stat-value tabular-nums">
          {stats.best1RM} lbs
        </div>
      </div>

    </div>
  )
}
