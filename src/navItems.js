// navigation items
// Needed in Header, SideNav, and MobileDrawer so they all stay in sync.
import { 
    PlusIcon,
    HomeIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    FireIcon,
    PlusCircleIcon
 } from '@heroicons/react/24/outline';



export const navItems = [
  { icon: HomeIcon, label: 'Dashboard', path: '/' },
  { icon: ClipboardDocumentListIcon, label: 'Workouts', path: '/workouts' },
  { icon: PlusCircleIcon, label: 'Log Workout', path: '/log' },
  { icon: ChartBarIcon, label: 'Progress', path: '/progress' },
  { icon: FireIcon, label: 'Exercises', path: '/exercises' },
]

export default navItems;