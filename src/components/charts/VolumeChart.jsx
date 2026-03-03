import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'



export default function VolumeChart() {

  const [exerciseData, setExerciseData] = useState({})
  const [selectedExercise, setSelectedExercise] = useState('')

  useEffect(() => {
    fetchVolumeData()
  }, [])

  async function fetchVolumeData() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('workouts')
      .select(`
        date,
        sets (
          weight,
          reps,
          exercises (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (error) {
      console.error(error)
      return
    }

    const volumeMap = {}

    data.forEach(workout => {

      const dateLabel = new Date(workout.date)
        .toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric'
        })

      workout.sets.forEach(set => {

        const name = set.exercises.name
        const volume = (set.weight || 0) * (set.reps || 0)

        if (!volumeMap[name]) {
          volumeMap[name] = {}
        }

        if (!volumeMap[name][dateLabel]) {
          volumeMap[name][dateLabel] = 0
        }

        volumeMap[name][dateLabel] += volume

      })

    })

    // Convert nested structure into chart-ready arrays
    const formatted = {}

    Object.keys(volumeMap).forEach(exercise => {

      formatted[exercise] = Object.entries(volumeMap[exercise])
        .map(([date, volume]) => ({
          date,
          volume
        }))

    })

    setExerciseData(formatted)

    // Auto-select first exercise
    const firstExercise = Object.keys(formatted)[0]
    if (firstExercise) {
      setSelectedExercise(firstExercise)
    }
  }

  const chartData = exerciseData[selectedExercise] || []

  return (
    <div className="chart-card">
      <h2 className="chart-title">Volume Per Exercise</h2>

      {Object.keys(exerciseData).length > 0 && (
        <select
          className="chart-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          {Object.keys(exerciseData).map(exercise => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="volume"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
