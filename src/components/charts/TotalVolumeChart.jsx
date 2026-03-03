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

export default function TotalVolumeChart() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetchTotalVolume()
  }, [])

  async function fetchTotalVolume() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: workouts, error } = await supabase
      .from('workouts')
      .select(`
        id,
        date,
        sets (
          weight,
          reps
        )
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (error) {
      console.error(error)
      return
    }

    const formatted = workouts.map(workout => {

      const totalVolume = workout.sets.reduce((sum, set) => {
        return sum + (set.weight || 0) * (set.reps || 0)
      }, 0)

      return {
        date: new Date(workout.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric'
        }),
        volume: totalVolume
      }
    })

    setData(formatted)
  }

  return (
    <div className="chart-card">
      <h2 className="chart-title">Total Workout Volume</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
