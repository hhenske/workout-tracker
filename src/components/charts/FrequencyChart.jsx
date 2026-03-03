import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'


function getWeekStart(dateStr) {
  const date = new Date(dateStr)
  const day = date.getDay()
  const diff = date.getDate() - day
  const weekStart = new Date(date.setDate(diff))

  return weekStart.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}

export default function FrequencyChart() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetchFrequencyData()
  }, [])

  async function fetchFrequencyData() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('workouts')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (error) {
      console.error(error)
      return
    }

    const weekMap = {}

    data.forEach(workout => {
      const week = getWeekStart(workout.date)

      if (!weekMap[week]) {
        weekMap[week] = 0
      }

      weekMap[week] += 1
    })

    const formatted = Object.entries(weekMap).map(([week, count]) => ({
      week,
      count
    }))

    setData(formatted)
  }

  return (
    <div className="chart-card">
      <h2 className="chart-title">Workouts Per Week</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="week" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="var(--color-primary)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
