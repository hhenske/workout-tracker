import { useLocation, useNavigate } from 'react-router-dom';
import './SideNav.css';
import logo from '../assets/logo-wc.png';
import navItems from '../navItems';
import { supabase } from '../services/supabaseClient';
import NavItem from './NavItem';

// SideNav — fixed left sidebar, visible on desktop only.
// Hidden on mobile via CSS.

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  const mainNavItems = navItems.filter(item => item.path !== '/settings');
  const settingsItem = navItems.find(item => item.path === '/settings');

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
      {mainNavItems.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          className="side-nav__item"
          iconClass="side-nav__icon"
        />
      ))}
    </ul>


      <div className="side-nav__footer">
        
        {settingsItem && (
          <NavItem
            item={settingsItem}
            className="side-nav__item"
            iconClass="side-nav__icon"
          />
        )}


        <button className="side-nav__logout" onClick={handleLogout}>
          <span className="side-nav__icon">🚪</span>
          Log Out
        </button>
      </div>
    </nav>
  );
}