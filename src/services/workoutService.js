import { supabase } from './supabaseClient';

export async function getDashboardStats() {
  const { data: workouts, error: workoutsError  } = await supabase
    .from('workouts')
    .select('id, date, duration')

    const { data: sets, error: setsError } = await supabase
    .from('sets')
    .select('weight, reps')

    if (workoutsError || setsError) {
        console.error('Error fetching dashboard stats:', workoutsError || setsError);
        return null;
    }

    const totalWorkouts = workouts.length;
    const totalSets = sets.length;
    const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);

    return { totalWorkouts, totalSets, totalVolume };
}