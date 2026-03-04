import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function calculate1RM(weight, reps) {
  return weight * (1 + reps / 30)
}

export default function Exercise1RMChart({ sets }) {

  const max1RMByDate = {}

  sets.forEach(set => {
    const date = set.workouts?.date
    if (!date) return

    if (set.reps <= 0 || set.reps > 12) return

    const estimated = calculate1RM(set.weight, set.reps)

    if (!max1RMByDate[date] || estimated > max1RMByDate[date]) {
      max1RMByDate[date] = estimated
    }
  })

  const chartData = Object.entries(max1RMByDate).map(([date, value]) => ({
    date,
    oneRM: Math.round(value)
  }))

  return (
    <div className="exercise-chart">
      <h3>Estimated 1RM Over Time</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="oneRM"
            stroke="var(--color-secondary)"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
