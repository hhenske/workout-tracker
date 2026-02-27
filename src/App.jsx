import { useState, useEffect } from 'react';
import { HashRouterRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/Login';
import { supabase } from './services/supabaseClient';    // ✅ named import


// Owns the drawer open/close state so Header and MobileDrawer can share it.
// Add new <Route> entries here



export default function App() {

  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="auth-loading">
        Loading...
      </div>
    );
  }


  return (
    <HashRouter basename="/workout-tracker">
      <Routes>
        {/* Public — redirect to home if already logged in */}
        <Route
          path="/login"
          element={session ? <Navigate to="/" replace /> : <Login />}
        />

        {/* All other routes go through Layout, protected by auth */}
        <Route
          path="/*"
          element={session ? <Layout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </HashRouter>
  );
}