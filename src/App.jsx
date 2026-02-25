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


export default function App() {
  return (
    <BrowserRouter basename="/workout-tracker">
      <Layout />
    </BrowserRouter>
  );
}