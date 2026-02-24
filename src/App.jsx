import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import SideNav from './components/SideNav';
import MobileDrawer from './components/MobileDrawer';
import Dashboard from './pages/Dashboard';


// Owns the drawer open/close state so Header and MobileDrawer can share it.
// Add new <Route> entries here


function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-shell">

      {/* Mobile header — hidden on desktop via Header.css */}
      <Header onMenuOpen={() => setDrawerOpen(true)} />

      {/* Mobile drawer + backdrop — hidden on desktop via MobileDrawer.css */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Desktop side nav — hidden on mobile via SideNav.css */}
      <SideNav />

      {/* Main scrollable content area */}
      <main className="main-content">

        {/* Desktop top bar */}
        <div className="top-bar">
          <div className="top-bar__left">
            <span className="top-bar__greeting">Your Progress</span>
            <span className="top-bar__title">{getGreeting()} 👋</span>
          </div>
          <p className="top-bar__quote">
            "The only bad workout is the one that didn't happen."
          </p>
        </div>
      

        {/* Page routes */}
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          {/* <Route path="/workouts"   element={<Workouts />} />
          <Route path="/log"        element={<LogWorkout />} />
          <Route path="/progress"   element={<Progress />} />
          <Route path="/exercises"  element={<Exercises />} /> */}
        
        </Routes>

      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/workout-tracker">
      <AppLayout />
    </BrowserRouter>
  );
}