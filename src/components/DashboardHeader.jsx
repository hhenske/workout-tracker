import { Link } from 'react-router-dom'
import './DashboardHeader.css'

export default function DashboardHeader() {
  return (
    <div className="dashboard-header">

      <div className="dashboard-header-text">
        <h1>Workout Tracker</h1>
        <p>
          Track workouts, monitor progress, and analyze strength over time.
        </p>
      </div>

      <div className="dashboard-header-actions">
        <Link to="/log" className="primary-btn">
          Log Workout
        </Link>

        <Link to="/progress" className="secondary-btn">
          View Progress
        </Link>
      </div>

    </div>
  )
}
