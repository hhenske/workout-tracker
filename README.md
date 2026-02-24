# Workout Tracker App

A professional-grade workout tracking application built with React, Vite, and Supabase. Users can create workouts, track exercises, monitor progress, and receive exercise recommendations based on muscle groups and exercise type.

Live App: https://hhenske.github.io/workout-tracker

---

# Tech Stack

Frontend

* React (Vite)
* JavaScript (ES6+)
* CSS (mobile-first)

Backend / Services

* Supabase

  * Authentication
  * PostgreSQL database
  * REST API

Deployment

* GitHub Pages

Version Control

* Git + GitHub

---

# Architecture Overview

```
                ┌────────────────────────┐
                │       GitHub Pages     │
                │   (Static Hosting)     │
                └────────────┬───────────┘
                             │
                             │ serves
                             ▼
                ┌────────────────────────┐
                │     React Frontend     │
                │       (Vite App)       │
                └────────────┬───────────┘
                             │
                             │ Supabase Client
                             ▼
                ┌─────────────────────────┐
                │        Supabase         │
                │                         │
                │  ┌─────────────────┐    │
                │  │ Authentication  │    │
                │  └─────────────────┘    │
                │                         │
                │  ┌─────────────────┐    │
                │  │ PostgreSQL DB   │    │
                │  └─────────────────┘    │
                │                         │
                └─────────────────────────┘
```

---

# Application Architecture (Frontend)

```
src/
│
├── components/        Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── ExerciseCard.jsx
│   └── WorkoutForm.jsx
│
├── pages/             Full application views
│   ├── Dashboard.jsx
│   ├── WorkoutDetail.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── services/          External service integrations
│   └── supabase.js
│
├── context/           Global state management
│   └── AuthContext.jsx
│
├── hooks/             Custom React hooks
│   └── useWorkouts.js
│
├── utils/             Utility functions
│   └── helpers.js
│
├── App.jsx
└── main.jsx
```

---

# Database Architecture

```
users
  id (uuid)
  email
  created_at

workouts
  id (uuid)
  user_id (uuid)
  name
  date
  created_at

exercises
  id (uuid)
  name
  muscle_group
  type

workout_exercises
  id (uuid)
  workout_id (uuid)
  exercise_id (uuid)
  sets
  reps
  weight
```

---

# Data Flow

User Action → React Component → Supabase Client → Database → Supabase Response → React State Update → UI Update

---

# Features

Current

* Professional project structure
* GitHub Pages deployment
* Mobile-first responsive design

Planned

* User authentication
* Create workouts
* Add exercises to workouts
* Track sets, reps, and weight
* Workout history tracking
* Exercise recommendation engine
* Progress tracking

Future Enhancements

* Charts and analytics
* Offline support
* Exercise filtering by muscle group
* Personal records tracking

---

# Local Development

Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

---

# Deployment

Build project

```
npm run build
```

Deploy to GitHub Pages

```
npm run deploy
```

---

# Environment Variables

Create .env file

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

# Professional Goals of This Project

This project demonstrates:

* Professional React architecture
* Real-world backend integration
* Authentication systems
* Database design
* Clean, maintainable code structure
* Production deployment workflow

---

# Author

Holly Henske

Frontend Developer
React | Supabase | JavaScript | CSS

GitHub: https://github.com/hhenske
