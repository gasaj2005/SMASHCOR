import { NavLink } from 'react-router-dom';
import { Newspaper, Trophy, PlayCircle, Users, Settings } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { name: 'NOTICIAS', path: '/news', icon: Newspaper },
    { name: 'TOP', path: '/leaderboard', icon: Trophy },
    { name: 'PARTIDOS', path: '/play', icon: PlayCircle },
    { name: 'AMIGOS', path: '/social', icon: Users },
    { name: 'AJUSTES', path: '/settings', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 w-full bg-dark-bg/90 backdrop-blur-lg border-t border-dark-border pb-safe">
      <nav className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-brand scale-110 drop-shadow-[0_0_10px_rgba(147,197,114,0.4)]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <item.icon size={24} strokeWidth={2.5} className="mb-1" />
            <span className="text-[10px] font-bold tracking-wider">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
