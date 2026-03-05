import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

export default function OneRMChart({ sets }) {

  function calculate1RM(weight, reps) {
    return weight * (1 + reps / 30)
  }

  const dataMap = {}

  sets.forEach(set => {

    const date = new Date(set.workouts.date)
      .toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })

    const weight = set.weight || 0
    const reps = set.reps || 0

    const estimated = calculate1RM(weight, reps)

    if (!dataMap[date] || estimated > dataMap[date]) {
      dataMap[date] = estimated
    }

  })

  const chartData = Object.entries(dataMap).map(([date, value]) => ({
    date,
    oneRM: Math.round(value)
  }))

  return (
    <div className="exercise-chart">

      <h3>Estimated 1RM Progress</h3>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="oneRM"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}
