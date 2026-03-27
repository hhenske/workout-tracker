import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './Settings.css';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;

      setUser(currentUser);
      setName(currentUser?.user_metadata?.name || '');

      // load theme
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    loadUser();
  }, []);

  async function handleSave() {
    const { error } = await supabase.auth.updateUser({
      data: { name }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Settings saved!');
      await supabase.auth.refreshSession();
    }
  }

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <div className="settings-card">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="settings-card">
        <label>Email</label>
        <input
          type="text"
          value={user?.email || ''}
          disabled
        />
      </div>

      <div className="settings-card">
        <label>Theme</label>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>

      {message && <p className="settings-message">{message}</p>}
    </div>
  );
}
