import DurationChart from '../components/charts/DurationChart';
import FrequencyChart from '../components/charts/FrequencyChart';
import TotalVolumeChart from '../components/charts/TotalVolumeChart';
import VolumeChart from '../components/charts/VolumeChart';

import './Progress.css';


export default function Progress() {
  

  
    return (
    <div className="progress">
      <h1>Progress</h1>
      
      <div className="progress-grid">
        <DurationChart />
        <FrequencyChart />
        <VolumeChart />
        <TotalVolumeChart />
      </div>
    </div>
  );
}
