import './dashboard.css';
import { useEffect, useState } from 'react';
import {getDashboardStats } from '../services/workoutService';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import WorkoutGeneratorModal from '../features/workoutGenerator/WorkoutGeneratorModal';
import { supabase } from '../services/supabaseClient';





const quote = {
  text: "The only bad workout is the one that didn't happen.",
  author: "Unknown",
};

// --- Greeting ---
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

// --- Helpers ---
function formatVolume(lbs) {
  if (lbs >= 1000) return `${(lbs / 1000).toFixed(1)}k`;
  return lbs.toString();
}

function formatHours(hours) {
  if (hours === 0) return '0m';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// --- Bar Chart Component ---
function WeeklyBarChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.hours || 0), 0.1);

  return (
    <div className="chart">
      <div className="chart__bars">
        {data.map((d, i) => (
          <div className="chart__col" key={d.day}>
            <div className="chart__bar-wrap">
              <div
                className="chart__bar"
                style={{
                  height: `${(d.hours / max) * 100}%`,
                  animationDelay: `${i * 60}ms`,
                }}
                data-empty={d.hours === 0}
                title={formatHours(d.hours)}
              />
            </div>
            <span className="chart__label">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Dashboard Page ---
export default function Dashboard() {

  const [showGenerator, setShowGenerator] = useState(false);
  const [workouts, setWorkouts] = useState([]);


  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    mostTrained: '—',
    weeklyData: []  
  })
  const [loading, setLoading] = useState(true);

  // console.log(stats);

  function formatDuration(minutes) {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hrs === 0) return `${mins}m`
    return `${hrs}h ${mins}m`
  }

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('workouts')
      .select('id, date, duration, type') // keep it LIGHT
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      return;
    }

    setWorkouts(data || []);
}


  useEffect(() => {
    async function loadStats() {
      const data = await getDashboardStats()
      setStats(data);
      setLoading(false);
    }

    loadStats();
  }, []);

    if (loading) {
    return <div className="page">Loading dashboard...</div>
    }

  console.log(workouts);

  return (
    <div className="dashboard">

      <DashboardHeader />
      
      {/* Mobile Quote Banner */}
      <div className="quote-banner">
        <span className="quote-banner__mark">"</span>
        <p className="quote-banner__text">{quote.text}</p>
        <span className="quote-banner__author">— {quote.author}</span>
      </div>

      {/* Mobile Page Header */}
      <header className="dashboard__header">
        
        <h1 className="dashboard__title">{getGreeting()} 👋</h1>
      </header>
       <p className="dashboard__greeting">Your Progress</p>

       <div className="dashboard-week">
      <span className="dashboard-week__label">This Week</span>

      <div className="dashboard-week__stats">

        <span>
          <strong>{stats?.weeklySummary?.workouts ?? 0}</strong> workouts
        </span>

        <span>
          <strong>{formatVolume(stats?.weeklySummary?.volume ?? 0)}</strong> lbs
        </span>

        <span>
          <strong>{formatDuration(stats?.weeklySummary?.minutes ?? 0)}</strong> training
        </span>

        <p>💪 Strength Volume: {stats.weeklySummary.strengthVolume}</p>
        <p>🏃 Cardio Sessions: {stats.weeklySummary.cardioSessions}</p>

      </div>

      <div className="dashboard-week___action">
        <button 
          className="modal-btn generate-btn" 
          onClick={() => setShowGenerator(true)}>
          Generate a Workout
        </button>
      </div>
      

      <WorkoutGeneratorModal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        workouts={workouts}
      />


    </div>

      {/* Bento grid (desktop) / normal stacked flow (mobile) */}
      <div className="bento">

        <section className="stats">

          {/* Hero Stat — Total Workouts */}
          <div className="stat-card stat-card--hero bento__hero">
            <span className="stat-card__label label-caps">Total Workouts</span>
            <div className="stat-card__value tabular-nums">{stats?.totalWorkouts ?? 0}</div>
            <p className="stat-card__sub">sessions logged</p>
            <div className="stat-card__accent" />
          </div>

          <div className="stats__grid">

            <div className="stat-card stat-card--secondary bento__volume">
              <span className="stat-card__label label-caps">Volume</span>
              <div className="stat-card__value stat-card__value--md tabular-nums">
                {formatVolume(stats?.totalVolume ?? 0)}
                <span className="stat-card__unit">lbs</span>
              </div>
              <p className="stat-card__sub">total lifted</p>
            </div>

            <div className="stat-card stat-card--secondary stat-card--green bento__exercise">
              <span className="stat-card__label label-caps">Top Exercise</span>
              <div className="stat-card__value stat-card__value--exercise">
                {stats.mostTrained}
              </div>
              <p className="stat-card__sub">most trained</p>
            </div>

            <div className="stat-card stat-card--secondary bento__extra">
              <span className="stat-card__label label-caps">Streak</span>
              <div className="stat-card__value stat-card__value--md tabular-nums">—</div>
              <p className="stat-card__sub">coming soon</p>
            </div>

              {/* Log Workout CTA */}
            <div
              className="stat-card stat-card--cta bento__extra"
              onClick={() => navigate('/log')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/log')}
            >
              <svg
                className="stat-card__cta-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <p className="stat-card__cta-label">Log Workout</p>
              <p className="stat-card__sub">tap to add</p>
            </div>

          </div>
        </section>

        {/* Weekly Bar Chart */}
        <section className="chart-section bento__chart">
          <div className="chart-section__header">
            <h2 className="chart-section__title">This Week</h2>
            <span className="chart-section__sub label-caps">Hours per day</span>
          </div>
          <div className="stat-card stat-card--chart">
            <WeeklyBarChart data={stats.weeklyData || []} />
          </div>
        </section>

        <div className="stat-card stat-card--secondary stat-card--streak">

        <span className="stat-card__label label-caps">
          Current Streak
        </span>

        <div className="stat-card__value tabular-nums">
          🔥 {stats?.streak ?? 0}
        </div>

        <p className="stat-card__sub">
          consecutive days
        </p>

      </div>


      </div>{/* /bento */}
    </div>
  );
}