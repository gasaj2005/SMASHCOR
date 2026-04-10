import { NavLink } from 'react-router-dom';
import { Home, Trophy, Activity, Users, Settings } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { name: 'Noticias', path: '/news', icon: Home },
    { name: 'Top Globales', path: '/leaderboard', icon: Trophy },
    { name: 'Partidos', path: '/play', icon: Activity },
    { name: 'Amigos', path: '/social', icon: Users },
    { name: 'Configuración', path: '/settings', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 w-full bg-dark-bg/95 backdrop-blur-lg border-t border-dark-border pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <nav className="flex justify-around items-center px-1 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl transition-all duration-300 w-16 ${
                isActive 
                  ? 'text-brand scale-110 drop-shadow-[0_0_8px_rgba(147,197,114,0.5)]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <item.icon size={22} strokeWidth={isActive ? 3 : 2} className="mb-1" />
            <span className="text-[9px] font-bold tracking-tight text-center leading-tight truncate w-full">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
