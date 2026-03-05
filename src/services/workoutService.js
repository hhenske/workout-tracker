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
  .select(`
    weight,
    reps,
    exercises(name),
    workouts!inner(user_id)
  `)
  .eq('workouts.user_id', user.id)

  if (setsError) {
    console.error(setsError)
   }

// console.log("SETS: ", sets)
// -------------------------
// 3. Total workouts
// -------------------------
const totalWorkouts = workouts.length

// -------------------------
// 4. Total volume
// -------------------------

let totalVolume = 0

sets?.forEach(set => {
  const weight = set.weight || 0
  const reps = set.reps || 0
  totalVolume += weight * reps
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
// 7. Weekly summary
// -------------------------

const startOfWeek = new Date()
startOfWeek.setHours(0, 0, 0, 0)

// move to Sunday
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

let weeklyWorkouts = 0
let weeklyVolume = 0
let weeklyMinutes = 0

workouts.forEach(workout => {
  const workoutDate = new Date(workout.date)

  if (workoutDate >= startOfWeek) {
    weeklyWorkouts++
    weeklyMinutes += workout.duration || 0
  }
})

  sets?.forEach(set => {
    const workoutDate = new Date(set.workouts?.date)

    if (workoutDate >= startOfWeek) {
      weeklyVolume += set.weight * set.reps
    }
})


  // -------------------------
  // Return everything
  // -------------------------
  return {
    totalWorkouts,
    totalVolume,
    mostTrained,
    weeklyData,

    weeklySummary: {
      workouts: weeklyWorkouts,
      volume: weeklyVolume,
      duration: weeklyMinutes
    }
  }

}