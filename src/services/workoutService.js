import { supabase } from './supabaseClient';

export async function getDashboardStats() {

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      totalWorkouts: 0,
      totalVolume: 0,
      mostTrained: '—',
      weeklyData: []
    }
  }

  // -------------------------
  // 1. Get workouts
  // -------------------------
  const { data: workouts, error: workoutError } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)

  if (workoutError) {
    console.error(workoutError)
    return null
  }

  // -------------------------
// 2. Get sets (for volume + most trained)
// -------------------------
const { data: sets, error: setsError } = await supabase
  .from('sets')
  .select('*, exercises(name)')  // join to get exercise name
  .eq('user_id', user.id)

if (setsError) {
  console.error(setsError)
}

// -------------------------
// 3. Total workouts
// -------------------------
const totalWorkouts = workouts.length

// -------------------------
// 4. Total volume
// -------------------------
let totalVolume = 0

sets?.forEach(set => {
  totalVolume += (set.weight || 0) * (set.reps || 0)
})

// -------------------------
// 5. Most trained exercise
// -------------------------
const exerciseCount = {}

sets?.forEach(set => {
  const name = set.exercises?.name  // from the join
  if (name) {
    exerciseCount[name] = (exerciseCount[name] || 0) + 1
  }
})

let mostTrained = '—'
let maxCount = 0

for (const name in exerciseCount) {
  if (exerciseCount[name] > maxCount) {
    mostTrained = name
    maxCount = exerciseCount[name]
  }
}

  // -------------------------
  // 6. Weekly data
  // -------------------------
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const weeklyData = days.map(day => ({
    day,
    hours: 0
  }))

  workouts.forEach(workout => {

    const date = new Date(workout.date)
    const dayIndex = date.getDay()

    const minutes = workout.duration || 0

    weeklyData[dayIndex].hours += minutes / 60
  })


  // -------------------------
  // Return everything
  // -------------------------
  return {
    totalWorkouts,
    totalVolume,
    mostTrained,
    weeklyData
  }

}