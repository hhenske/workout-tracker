import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

import StatCards from './StatCards'
import ExerciseVolumeChart from '../charts/ExerciseVolumeChart'
import OneRMChart from './OneRMChart'
import ExerciseHistory from './ExerciseHistory'
import ExerciseHeader from './ExerciseHeader'


import './ExerciseAnalytics.css'

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

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!sets.length) {
    return (
      <div className="exercise-empty">
        No data yet for this exercise.
      </div>
    )
  }

  return (
  <div className="exercise-analytics">

    <ExerciseHeader
      exerciseName={exerciseName}
      sets={sets}
    />

    <StatCards sets={sets} />

    <ExerciseVolumeChart sets={sets} />

    <OneRMChart sets={sets} />

    <ExerciseHistory sets={sets} />

  </div>
)

}