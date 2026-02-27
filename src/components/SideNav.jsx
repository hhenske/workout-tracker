import { useLocation, useNavigate } from 'react-router-dom';
import './SideNav.css';
import logo from '../assets/logo-wc.png';
import navItems from '../navItems';
import { supabase } from '../services/supabaseClient';

// SideNav — fixed left sidebar, visible on desktop only.
// Hidden on mobile via CSS.

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <nav className="side-nav">
      <div className="side-nav__logo">
        <img
          src={logo}
          alt="Workout_Coach"
          className="side-nav__logo-img"
        />
      </div>

      <span className="side-nav__section-label label-caps">Menu</span>

      <ul className="side-nav__items">
        {navItems.map((item) => (
          <li
            key={item.label}
            className={`side-nav__item${location.pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="side-nav__icon"><item.icon /></span>
            {item.label}
          </li>
        ))}
      </ul>

      <div className="side-nav__footer">
        <div className="side-nav__item">
          <span className="side-nav__icon">⚙️</span>
          Settings
        </div>
        <button className="side-nav__logout" onClick={handleLogout}>
          <span className="side-nav__icon">🚪</span>
          Log Out
        </button>
      </div>
    </nav>
  );
}