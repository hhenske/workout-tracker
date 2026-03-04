import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import ExerciseAnalytics from '../components/ExerciseAnalytics'

export default function Exercises() {
  const [exercises, setExercises] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchExercises()
  }, [])

  async function fetchExercises() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('sets')
      .select(`
        exercises(name),
        workouts!inner(user_id)
      `)
      .eq('workouts.user_id', user.id)

    if (error) {
      console.error(error)
      return
    }

    const unique = [
      ...new Set(
        data.map(item => item.exercises?.name).filter(Boolean)
      )
    ]

    setExercises(unique)

    if (unique.length > 0) {
      setSelected(unique[0])
    }
  }

  return (
    <div className="exercises-page">
      <div className="exercises-layout">

        {/* Exercise List */}
        <div className="exercise-list">
          {exercises.map(name => (
            <div
              key={name}
              className={`exercise-item ${selected === name ? 'active' : ''}`}
              onClick={() => setSelected(name)}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Analytics Panel */}
        <div className="exercise-panel">
          {selected ? (
            <ExerciseAnalytics exerciseName={selected} />
          ) : (
            <div className="exercise-empty">
              Select an exercise to view analytics
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
