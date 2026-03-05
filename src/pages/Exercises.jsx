import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import ExerciseAnalytics from '../components/ExerciseAnalytics/ExerciseAnalytics'
import './Exercises.css'

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
    setSelected(null)


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
                <h3>Deep Dive Into Your Training</h3>
                <p>
                    Select an exercise from the list to view detailed volume,
                    strength progression, and performance analytics.
                </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
