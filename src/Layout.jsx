
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { quotes } from './data/quotes';


import Header from './components/Header';
import SideNav from './components/SideNav';
import MobileDrawer from './components/MobileDrawer';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';



function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        // Try to get name from metadata first
        const name =
          user.user_metadata?.name ||
          user.email?.split('@')[0];

        setUserName(name);
      }

      // Demo fallback
      if (localStorage.getItem('demoMode') === 'true') {
        setUserName('Friend');
      }
    }

    fetchUser();
  }, []);
 


  useEffect(() => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  setQuote(quotes[randomIndex]);
}, []);


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

         {/* demo-Mode banner */}
        {localStorage.getItem('demoMode') === 'true' && (
          <div className="demo-banner">
            Demo Mode — changes won’t be saved
          </div>
        )}

        {/* Desktop top bar */}
        <div className="top-bar">
          <div className="top-bar__left">
            <span className="top-bar__greeting">Your Progress</span>
            <span className="top-bar__title">{getGreeting()}, {userName} 👋</span>
          </div>
          <p className="top-bar__quote">
            "{quote}"
          </p>
        </div>
      

        {/* Page routes */}
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/log" element={<LogWorkout />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/progress" element={<Progress />} />
        
        </Routes>

      </main>
    </div>
  );
}