import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import './logWorkout.css';
// import exercisesList from '../data/exercises';


export default function LogWorkout() {

  const [workout, setWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
    exercises: []
  });

  const [exerciseInput, setExerciseInput] = useState('')
  const [exerciseList, setExerciseList] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  function addExercise() {
    setWorkout({
      ...workout,
      exercises: [
        ...workout.exercises,
        {
          name: '',
          sets: [{ weight: '', reps: '' }]
        }
      ]
    });
  }

  function updateExerciseName(index, value) {
    const updated = [...workout.exercises];
    updated[index].name = value;

    setWorkout({
      ...workout,
      exercises: updated
    });
  }

  function addSet(exerciseIndex) {
    const updated = [...workout.exercises];

    updated[exerciseIndex].sets.push({
      weight: '',
      reps: ''
    });

    setWorkout({
      ...workout,
      exercises: updated
    });
  }

  function updateSet(exerciseIndex, setIndex, field, value) {
    const updated = [...workout.exercises];

    updated[exerciseIndex].sets[setIndex][field] = value;

    setWorkout({
      ...workout,
      exercises: updated
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(workout);
  }

  async function handleSaveWorkout(e) {
    e.preventDefault()

    try {

        // 1. Insert workout
        const { data: workoutRow, error: workoutError } =
        await supabase
            .from('workouts')
            .insert({
            date: workout.date,
            duration: workout.duration,
            notes: workout.notes
            })
            .select()
            .single()

        if (workoutError) throw workoutError

        const workoutId = workoutRow.id


        // 2. Loop exercises
        for (const exercise of workout.exercises) {

        let exerciseId

        // Check if exercise exists
        const existing = exerciseList.find(
            ex => ex.name.toLowerCase() === exercise.name.toLowerCase()
        )

        if (existing) {

            exerciseId = existing.id

        } else {

            const { data: newExercise, error } =
            await supabase
                .from('exercises')
                .insert({ name: exercise.name })
                .select()
                .single()

            if (error) throw error

            exerciseId = newExercise.id

            setExerciseList(prev => [...prev, newExercise])
        }


        // 3. Insert sets
        for (let i = 0; i < exercise.sets.length; i++) {

            const set = exercise.sets[i]

            const { error } = await supabase
            .from('sets')
            .insert({
                workout_id: workoutId,
                exercise_id: exerciseId,
                weight: Number(set.weight),
                reps: Number(set.reps),
                set_number: i + 1
            })

            if (error) throw error

        }
        }

        alert('Workout saved successfully')

        // Reset form
        setWorkout({
        date: new Date().toISOString().split('T')[0],
        duration: '',
        notes: '',
        exercises: []
        })

    } catch (error) {

        console.error(error)
        alert('Error saving workout')

    }
    }



  useEffect(() => {
    fetchExercises()
    }, [])

    async function fetchExercises() {
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name')

    if (!error) {
        setExerciseList(data)
    }
  }

  useEffect(() => {
    function handleClickOutside() {
        setShowSuggestions(false)
    }

    document.addEventListener('click', handleClickOutside)

    return () =>
        document.removeEventListener('click', handleClickOutside)
    }, [])

    const filteredExercises = exerciseList.filter(ex =>
        ex.name.toLowerCase().includes(
            (exerciseInput || '').toLowerCase()
        )
    )




  return (
    <div className="log-workout">

      <h1 className="page-title">Log Workout</h1>

      <form onSubmit={handleSaveWorkout}>

        {/* Workout Details */}
        <section className="card">

          <label className="label-caps">Date</label>
          <input
            type="date"
            value={workout.date}
            onChange={(e) =>
              setWorkout({ ...workout, date: e.target.value })
            }
          />

          <label className="label-caps">Duration (minutes)</label>
          <input
            type="number"
            placeholder="45"
            value={workout.duration}
            onChange={(e) =>
              setWorkout({ ...workout, duration: e.target.value })
            }
          />

          <label className="label-caps">Notes</label>
          <textarea
            placeholder="How did it go?"
            value={workout.notes}
            onChange={(e) =>
              setWorkout({ ...workout, notes: e.target.value })
            }
          />

        </section>

        {/* Exercises */}
        {workout.exercises.map((exercise, exerciseIndex) => (

          <section key={exerciseIndex} className="card">

            <div className="autocomplete">

                <input
                    type="text"
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChange={(e) => {
                    updateExerciseName(exerciseIndex, e.target.value)
                    setExerciseInput(e.target.value)
                    setShowSuggestions(true)
                    }}
                />

                {showSuggestions && exercise.name && filteredExercises.length > 0 && (
                    <div className="autocomplete-list">

                    {filteredExercises.slice(0, 5).map(ex => (

                        <div
                        key={ex.id}
                        className="autocomplete-item"
                        onClick={() => {
                            updateExerciseName(exerciseIndex, ex.name)
                            setExerciseInput(ex.name)
                            setShowSuggestions(false)
                        }}
                        >
                        {ex.name}
                        </div>

                    ))}

                    </div>
                )}

            </div>




                {exercise.sets.map((set, setIndex) => (

                <div key={setIndex} className="set-row">

                    <input
                    type="number"
                    placeholder="Weight"
                    value={set.weight}
                    onChange={(e) =>
                        updateSet(
                        exerciseIndex,
                        setIndex,
                        'weight',
                        e.target.value
                        )
                    }
                    />

                    <input
                    type="number"
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) =>
                        updateSet(
                        exerciseIndex,
                        setIndex,
                        'reps',
                        e.target.value
                        )
                    }
                    />

                </div>

                ))}
            
            <button
              type="button"
              className="secondary-btn"
              onClick={() => addSet(exerciseIndex)}
            >
              + Add Set
            </button>

          </section>

        ))}

        <div className="form-actions">
            <button
            type="button"
            className="secondary-btn"
            onClick={addExercise}
            >
            + Add Exercise
            </button>

            <button
            type="submit"
            className="primary-btn"
            >
            Save Workout
            </button>
        </div>

      </form>

    </div>
  );
}
