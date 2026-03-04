import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function ExerciseVolumeChart({ sets }) {

  // Group sets by workout date
  const volumeByDate = {}

  sets.forEach(set => {
    const date = set.workouts?.date
    if (!date) return

    const volume = set.weight * set.reps

    if (!volumeByDate[date]) {
      volumeByDate[date] = 0
    }

    volumeByDate[date] += volume
  })

  const chartData = Object.entries(volumeByDate).map(([date, volume]) => ({
    date,
    volume
  }))

  return (
    <div className="exercise-chart">
      <h3>Volume Over Time</h3>

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
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
