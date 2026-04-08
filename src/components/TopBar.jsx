import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-dark-bg font-bold text-lg">
          🎾
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Smash<span className="text-brand">Cor</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-dark-bg rounded-full"></span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-dark-border hover:border-brand transition-colors focus:outline-none"
        >
          <img 
            src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback&backgroundColor=93C572'} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  );
}
