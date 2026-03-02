import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './Workouts.css';


export default function Workouts() {
  
    const [workouts, setWorkouts] = useState([])
    const [expandedId, setExpandedId] = useState(null)
    const [expanded, setExpanded] = useState(null)

    function toggleWorkout(id) {
        setExpandedId(expandedId === id ? null : id)
        setExpanded(prev => prev === id ? null : id)
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


  if (error) {
    console.error(error)
    return
  }


  // group sets by exercise
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

    return new Date(dateStr)
      .toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

  }
  
  console.log(workouts)
    
return (
  <div className="workouts">

    <h1 className="page-title">Workouts</h1>

    <div className="workout-list">
      {workouts.map(workout => (

        <div key={workout.id} className="workout-card">

          {/* HEADER */}
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

          {/* EXPANDED */}
          {expandedId === workout.id && (
            <div className="workout-details">

              {/* SINGLE EXERCISE → Notes Only */}
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

  </div>
)}
