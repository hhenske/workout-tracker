import DurationChart from '../components/charts/DurationChart';
import './Progress.css';


export default function Progress() {
  
  
  
    return (
    <div className="progress">
      <h1>Progress</h1>
      
      <div className="progress-grid">
        <DurationChart />
        {/* <WorkoutFrequencyChart />
        <VolumeByExerciseChart /> */}
      </div>
    </div>
  );
}
