import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWorkout } from './generateWorkout';
import { useNavigate } from 'react-router-dom';




export default function WorkoutGeneratorModal({ isOpen, onClose, workouts }) {
  const [step, setStep] = useState('suggestion');
  const [type, setType] = useState(null);
  const [options, setOptions] = useState({});
  const [result, setResult] = useState(null);
  const [exercises, setExercises] = useState([]);

  const navigate = useNavigate();

  function getLeastTrained() {
    if (!Array.isArray(workouts)) return 'strength'; // safe fallback

    const last7 = workouts
      .filter(w => w?.date)
      .filter(w => new Date(w.date) > Date.now() - 7 * 24 * 60 * 60 * 1000);

    let strength = 0;
    let cardio = 0;

    last7.forEach(w => {
      if (w.type === 'strength') strength++;
      if (w.type === 'cardio') cardio++;
    });

  return strength <= cardio ? 'strength' : 'cardio';
}


  function handleAccept() {
    const suggested = getLeastTrained();
    const workout = generateWorkout({ type: suggested });
    setResult(workout);
    setType(suggested);
    setStep('result');
  }

  function handleReject() {
    setStep('choice');
  }

  function handleGenerate(finalOptions) {
    const workout = generateWorkout(finalOptions);
    setResult(workout);
    setType(finalOptions.type);
    setStep('result');
  }

  useEffect(() => {
    const saved = localStorage.getItem('generatedWorkout');

    if (!saved) return;

    const parsed = JSON.parse(saved);

    // 🧠 Transform into your form shape
    let formatted = [];

    // 🏋️ Strength workout
    if (Array.isArray(parsed)) {
      formatted = parsed.map(ex => ({
        name: ex.name,
        sets: Array.from({ length: ex.sets }).map(() => ({
          weight: '',
          reps: ex.reps || ''
        }))
      }));
    }

    // 🏃 Cardio workout
    else if (parsed?.activity) {
      formatted = [
        {
          name: parsed.activity,
          sets: [
            {
              weight: '',
              reps: parsed.description // use reps field for now
            }
          ]
        }
      ];
    }

    setExercises(formatted);
    setTimeout(() => {
      document.querySelector('input')?.focus();
    }, 100);

    // clean up so it doesn't reload every time
    localStorage.removeItem('generatedWorkout');

  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >

            {exercises.length > 0 && (
              <div className="prefill-banner">
                Workout generated for you - Adject as needed
              </div>
            )}

            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 'suggestion' && (
                <motion.div key="suggestion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2>We recommend a {getLeastTrained()} workout</h2>
                  <button onClick={handleAccept}>Accept</button>
                  <button onClick={handleReject}>Choose myself</button>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 'choice' && (
                <motion.div key="choice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2>What would you like?</h2>
                  <button onClick={() => { setType('strength'); setStep('strengthOptions'); }}>
                    Strength
                  </button>
                  <button onClick={() => handleGenerate({ type: 'cardio' })}>
                    Cardio
                  </button>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 'strengthOptions' && (
                <motion.div key="strength" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2>Customize your workout</h2>

                  <button onClick={() => handleGenerate({ type: 'strength', muscle: 'upper', equipment: 'none' })}>
                    Upper Body (No Equipment)
                  </button>

                  <button onClick={() => handleGenerate({ type: 'strength', muscle: 'lower', equipment: 'none' })}>
                    Lower Body (No Equipment)
                  </button>

                  <button onClick={() => handleGenerate({ type: 'strength', muscle: 'core', equipment: 'none' })}>
                    Core
                  </button>

                  <button onClick={() => handleGenerate({ type: 'strength', muscle: 'full' })}>
                    Full Body
                  </button>
                  <button onClick={() => handleGenerate({ type: 'cardio' }, 'cardio')}>
                    Cardio
                  </button>
                </motion.div>
              )}

                            {/* STEP 4 */}
              {step === 'result' && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2>Your Workout</h2>

                  {type === 'strength' && Array.isArray(result) && result.map((ex, i) => (
                    <div key={i}>
                      {ex.name} — {ex.sets} x {ex.reps}
                    </div>
                  ))}

                  {type === 'cardio' && result && (
                    <div>
                      <p>{result.activity}</p>
                      <p>{result.description}</p>
                    </div>
                  )}

                  <button onClick={() => {
                    localStorage.setItem('generatedWorkout', JSON.stringify(result));
                    navigate('/log');
                   
                  }}>
                    Start This Workout
                  </button>

                  <button onClick={() => setStep('choice')}>
                    Try Another
                  </button>
                </motion.div>
              )}

            </AnimatePresence>

            <button onClick={onClose}>Close</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
