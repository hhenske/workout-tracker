import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MobileDrawer.css';
import logo from '../assets/logo-wc.png';
import navItems from '../navItems';

// MobileDrawer — slides in from the left on mobile.
// Hidden on desktop via CSS.
// Props:
//   isOpen  — boolean controlling open/close state
//   onClose — callback to close the drawer

export default function MobileDrawer({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleNavClick(path) {
    navigate(path);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <nav
        className={`drawer${isOpen ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="drawer__header">
          <img
            src={logo}
            alt="Workout_Coach"
            className="drawer__logo-img"
          />
          <button
            className="drawer__close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <span className="drawer__section-label label-caps">Menu</span>

        <ul className="drawer__items">
          {navItems.map((item) => (
            <li
              key={item.label}
              className={`drawer__item${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <span className="drawer__icon">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>

        <div className="drawer__footer">
          <div className="drawer__item" onClick={onClose}>
            <span className="drawer__icon">⚙️</span>
            Settings
          </div>
        </div>
      </nav>
    </>
  );
}