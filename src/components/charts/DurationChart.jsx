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

export default function DurationChart() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetchDurationData()
  }, [])

  async function fetchDurationData() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('workouts')
      .select('date, duration')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (error) {
      console.error(error)
      return
    }

    const formatted = data.map(workout => ({
      date: new Date(workout.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      }),
      duration: workout.duration
    }))

    setData(formatted)
  }

  return (
    <div className="chart-card">
      <h2 className="chart-title">Workout Duration Over Time</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="duration"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
