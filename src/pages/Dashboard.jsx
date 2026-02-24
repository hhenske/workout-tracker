
import './dashboard.css';

// --- Mock Data (To be replaced with user data) ---
const stats = {
  totalWorkouts: 47,
  totalVolume: 184320,   // in lbs
  mostTrained: 'Bench Press',
  weeklyData: [
    { day: 'Mon', count: 1 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 1 },
    { day: 'Fri', count: 1 },
    { day: 'Sat', count: 0 },
    { day: 'Sun', count: 1 },
  ],
};

// --- Mock Data (To be randomized from data file/api call) ---
const quote = {
  text: "The only bad workout is the one that didn't happen.",
  author: "Unknown",
};

// --- Helper ---
function formatVolume(lbs) {
  if (lbs >= 1000) return `${(lbs / 1000).toFixed(1)}k`;
  return lbs.toString();
}

// --- Bar Chart Component ---
function WeeklyBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="chart">
      <div className="chart__bars">
        {data.map((d, i) => (
          <div className="chart__col" key={d.day}>
            <div className="chart__bar-wrap">
              <div
                className="chart__bar"
                style={{
                  height: `${(d.count / max) * 100}%`,
                  animationDelay: `${i * 60}ms`,
                }}
                data-empty={d.count === 0}
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
  return (
    <div className="dashboard">

      {/* Motivational Quote Banner */}
      <div className="quote-banner">
        <span className="quote-banner__mark">"</span>
        <p className="quote-banner__text">{quote.text}</p>
        <span className="quote-banner__author">— {quote.author}</span>
      </div>

      {/* Page Header */}
      <header className="dashboard__header">
        <div>
          <p className="dashboard__greeting">Good morning 👋</p>
          <h1 className="dashboard__title">Your Progress</h1>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats">

        {/* Hero Stat — Total Workouts */}
        <div className="stat-card stat-card--hero">
          <span className="stat-card__label label-caps">Total Workouts</span>
          <div className="stat-card__value tabular-nums">{stats.totalWorkouts}</div>
          <p className="stat-card__sub">sessions logged</p>
          <div className="stat-card__accent" />
        </div>

        {/* Secondary Stats Grid */}
        <div className="stats__grid">

          {/* Total Volume */}
          <div className="stat-card stat-card--secondary">
            <span className="stat-card__label label-caps">Volume</span>
            <div className="stat-card__value stat-card__value--md tabular-nums">
              {formatVolume(stats.totalVolume)}
              <span className="stat-card__unit">lbs</span>
            </div>
            <p className="stat-card__sub">total lifted</p>
          </div>

          {/* Most Trained */}
          <div className="stat-card stat-card--secondary stat-card--green">
            <span className="stat-card__label label-caps">Top Exercise</span>
            <div className="stat-card__value stat-card__value--exercise">
              {stats.mostTrained}
            </div>
            <p className="stat-card__sub">most trained</p>
          </div>

        </div>
      </section>

      {/* Weekly Bar Chart */}
      <section className="chart-section">
        <div className="chart-section__header">
          <h2 className="chart-section__title">This Week</h2>
          <span className="chart-section__sub label-caps">Workouts per day</span>
        </div>
        <div className="stat-card stat-card--chart">
          <WeeklyBarChart data={stats.weeklyData} />
        </div>
      </section>

    </div>
  );
}