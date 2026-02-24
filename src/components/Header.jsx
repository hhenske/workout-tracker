import './Header.css';
import logo from '../assets/logo-wc.png';

// Header — mobile only (hidden on desktop via CSS).
// Shows the app logo and a hamburger button that opens the mobile drawer.

export default function Header({ onMenuOpen }) {
  return (
    <header className="header">
      <div className="header__logo">
        <img
          src={logo}
          alt="Workout_Coach"
          className="header__logo-img"
        />
      </div>

      <button
        className="header__hamburger"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        aria-expanded="false"
      >
        <span className="header__bar" />
        <span className="header__bar" />
        <span className="header__bar" />
      </button>
    </header>
  );
}