import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import './Workouts.css'

export default function Workouts() {

  const [workouts, setWorkouts] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(7)

  function toggleWorkout(id) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  async function fetchWorkouts() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('workouts')
      .select(`
        id,
        date,
        duration,
        notes,
        sets (
          id,
          weight,
          reps,
          set_number,
          exercises (
            id,
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(40)

    if (error) {
      console.error(error)
      return
    }

    // Group sets by exercise
    const formatted = data.map(workout => {

      const exerciseMap = {}

      workout.sets.forEach(set => {

        const name = set.exercises.name

        if (!exerciseMap[name]) {
          exerciseMap[name] = {
            name,
            sets: [],
            volume: 0
          }
        }

        exerciseMap[name].sets.push(set)
        exerciseMap[name].volume +=
          (set.weight || 0) * (set.reps || 0)

      })

      return {
        ...workout,
        exercises: Object.values(exerciseMap)
      }

    })

    setWorkouts(formatted)
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  /* =========================
     FILTER + DISPLAY LOGIC
     ========================= */

  const filteredWorkouts = workouts.filter(workout => {

    const term = searchTerm.toLowerCase()

    const dateMatch = formatDate(workout.date)
      .toLowerCase()
      .includes(term)

    const exerciseMatch = workout.exercises.some(ex =>
      ex.name.toLowerCase().includes(term)
    )

    return dateMatch || exerciseMatch
  })

  const displayedWorkouts = searchTerm
    ? filteredWorkouts
    : filteredWorkouts.slice(0, visibleCount)

  /* ========================= */

  return (
    <div className="workouts">

      <h1 className="page-title">Workouts</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by date or exercise..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="workout-search"
      />

      <div className="workout-list">
        {displayedWorkouts.map(workout => (

          <div key={workout.id} className="workout-card">

            <div
              className="workout-summary"
              onClick={() => toggleWorkout(workout.id)}
            >

              <div className="workout-summary__left">

                <div className="workout-summary__title">
                  {workout.exercises.length === 0
                    ? 'Workout'
                    : workout.exercises.length === 1
                    ? workout.exercises[0].name
                    : `${workout.exercises[0].name}...`
                  }
                </div>

                <div className="workout-summary__meta">
                  <span>{formatDate(workout.date)}</span>
                  <span>{workout.duration} min</span>
                </div>

              </div>

              <ChevronDownIcon
                className={`workout-expand-icon ${
                  expandedId === workout.id ? 'is-open' : ''
                }`}
              />

            </div>

            {expandedId === workout.id && (
              <div className="workout-details">

                {workout.exercises.length === 1 ? (
                  workout.notes && (
                    <div className="workout-notes-block">
                      <span className="details-label">Notes</span>
                      <p className="workout-notes">{workout.notes}</p>
                    </div>
                  )
                ) : (

                  workout.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-block">

                      <span className="exercise-name-small">
                        {exercise.name}
                      </span>

                      <div className="exercise-meta">

                        <div>
                          <span className="details-label">Volume</span>
                          <span>{exercise.volume} lbs</span>
                        </div>

                        <div>
                          <span className="details-label">Sets</span>
                          <span>{exercise.sets.length}</span>
                        </div>

                      </div>

                    </div>
                  ))

                )}

              </div>
            )}

          </div>

        ))}
      </div>

      {/* LOAD MORE */}
      {!searchTerm && visibleCount < filteredWorkouts.length && (
        <button
          className="load-more"
          onClick={() => setVisibleCount(prev => prev + 7)}
        >
          Load More
        </button>
      )}

    </div>
  )
}
