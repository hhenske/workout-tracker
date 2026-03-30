import { exercises } from './exerciseData';
import { cardioPatterns } from './cardioPatterns';

function getRandomItems(arr, count) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
}

export function generateStrengthWorkout({ muscle, equipment }) {
  let pool = exercises.filter(e => e.type === 'strength');

  if (muscle && muscle !== 'full') {
    pool = pool.filter(e => e.muscle === muscle);
  }

  if (equipment === 'none') {
    pool = pool.filter(e => e.equipment === 'none');
  }

  const selected = getRandomItems(pool, 4);

  return selected.map(ex => ({
    ...ex,
    sets: 3,
    reps: '10-12',
  }));
}

export function generateCardioWorkout() {
  const activity = exercises.filter(e => e.type === 'cardio')[
    Math.floor(Math.random() * 3)
  ];

  const pattern = cardioPatterns[
    Math.floor(Math.random() * cardioPatterns.length)
  ];

  return {
    activity: activity.name,
    ...pattern
  };
}

export function generateWorkout(options) {
  if (options.type === 'strength') {
    return generateStrengthWorkout(options);
  }

  if (options.type === 'cardio') {
    return generateCardioWorkout();
  }
}
