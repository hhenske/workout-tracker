import { supabase } from './supabaseClient';

export async function getDashboardStats() {

  const demoMode = localStorage.getItem('demoMode') === 'true';

  if (demoMode) {
    return {
      totalWorkouts: 12,
      totalVolume: 150000,
      mostTrained: 'Bench Press',
      weeklyData: [
        { day: 'Mon', volume: 1200 },
        { day: 'Tue', volume: 1800 },
        { day: 'Wed', volume: 0 },
        { day: 'Thu', volume: 2200 },
        { day: 'Fri', volume: 2000 },
        { day: 'Sat', volume: 1500 },
        { day: 'Sun', volume: 900 }
      ]
    };
  }

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


    let workouts;

    if (demoMode) {
      workouts = [
        {
          id: 1,
          name: 'Push Day',
          date: '2026-03-20'
        },
        {
          id: 2,
          name: 'Pull Day',
          date: '2026-03-21'
        },
        {
          id: 3,
          name: 'Leg Day',
          date: '2026-03-22'
        }
      ];
    } else {
      const { data, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id);

      if (workoutError) {
        console.error(workoutError);
        return null;
      }

      workouts = data;
    }

  // -------------------------
// 2. Get sets (for volume + most trained)
// -------------------------
const { data: sets, error: setsError } = await supabase
  .from('sets')
  .select(`
    weight,
    reps,
    exercises(name, type),
    workouts!inner(user_id, date)
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
// 7. Weekly summary
// -------------------------

// ✅ DEFINE FIRST (global to this section)
const startOfWeek = new Date();
startOfWeek.setHours(0, 0, 0, 0);

// move to Sunday
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

// ✅ counters
let weeklyWorkouts = 0;
let weeklyVolume = 0;
let weeklyMinutes = 0;
let strengthVolume = 0;
let cardioSessions = 0;

  // -------------------------
  // 6. Weekly data
  // -------------------------
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
 
  const weeklyData = days.map(day => ({
    day,
    hours: 0
  }))

  workouts.forEach(workout => {

    
    const workoutDate = new Date(workout.date)
    const dayIndex = workoutDate.getDay()
    
    const minutes = workout.duration || 0

    weeklyData[dayIndex].hours += minutes / 60

    
  })


// -------------------------
// workouts loop
// -------------------------
workouts.forEach(workout => {

  const workoutDate = new Date(workout.date);

  if (workoutDate >= startOfWeek) {
    weeklyWorkouts++;
    weeklyMinutes += workout.duration || 0;

    if (workout.type === 'cardio') {
      cardioSessions++;
    }
  }

});


// -------------------------
// sets loop
// -------------------------
sets?.forEach(set => {

  const workoutDate = new Date(set.workouts?.date);

  if (workoutDate >= startOfWeek) {
    const volume = (set.weight || 0) * (set.reps || 0);

    weeklyVolume += volume;

    if (set.exercises?.type === 'strength') {
      strengthVolume += volume;
    }
  }

});
// ---------- Calculate workout streak ----------

let streak = 0;

if (workouts && workouts.length > 0) {

  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  let currentDate = new Date(sorted[0].date);
  currentDate.setHours(0,0,0,0);

  for (let workout of sorted) {

    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0,0,0,0);

    const diff =
      (currentDate - workoutDate) / (1000 * 60 * 60 * 24);

    if (diff === 0) {
      streak++;
    } else if (diff === 1) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
}



  // -------------------------
  // Return everything
  // -------------------------
  return {
    totalWorkouts,
    totalVolume,
    mostTrained,
    weeklyData,
    streak,
    weeklySummary: {
      workouts: weeklyWorkouts,
      volume: weeklyVolume,
      duration: weeklyMinutes,
      strengthVolume,
      cardioSessions
    }
  }

}