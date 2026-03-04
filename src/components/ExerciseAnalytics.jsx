import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import ExerciseVolumeChart from './charts/ExerciseVolumeChart'


export default function ExerciseAnalytics({ exerciseName }) {

  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSets()
  }, [exerciseName])

  async function fetchSets() {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
        .from('sets')
        .select(`
            weight,
            reps,
            exercises(name),
            workouts!inner(user_id, date)
        `)
        .eq('workouts.user_id', user.id)
        .eq('exercises.name', exerciseName)
        .order('date', { foreignTable: 'workouts', ascending: true })


    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setSets(data || [])
    setLoading(false)
  }

  function calculate1RM(weight, reps) {
    return weight * (1 + reps / 30)
  }

  function getStats() {
    if (!sets.length) {
      return {
        totalVolume: 0,
        bestWeight: 0,
        totalSets: 0,
        best1RM: 0
      }
    }

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

  if (loading) {
    return <div>Loading analytics...</div>
  }

  const stats = getStats()

  return (
    <>
      {/* Summary Stats */}
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

      {/* Charts */}
      <ExerciseVolumeChart sets={sets} />

    </>
  )
}
