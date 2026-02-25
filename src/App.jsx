import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';


import Header from './components/Header';
import SideNav from './components/SideNav';
import MobileDrawer from './components/MobileDrawer';
import Dashboard from './pages/Dashboard';


// Owns the drawer open/close state so Header and MobileDrawer can share it.
// Add new <Route> entries here



export default function App() {
  return (
    <BrowserRouter basename="/workout-tracker">
      <Layout />
    </BrowserRouter>
  );
}