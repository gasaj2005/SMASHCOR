import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TopBar() {
  const { currentUser, markNotificationsAsRead } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = currentUser?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = () => {
    if (currentUser && unreadCount > 0) {
      markNotificationsAsRead(currentUser.id);
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));

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
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-400 hover:text-white transition-colors relative p-1"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-dark-bg rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg">
                <h3 className="font-bold text-white">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAsRead}
                    className="text-xs text-brand hover:text-brand-hover flex items-center gap-1 font-medium transition"
                  >
                    <CheckCircle2 size={14} /> Marcar como leídas
                  </button>
                )}
              </div>
              
              <div className="overflow-y-auto p-2">
                {sortedNotifications.length === 0 ? (
                  <div className="text-center text-slate-500 py-8 text-sm">
                    No tienes notificaciones nuevas
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sortedNotifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 rounded-lg text-sm transition-colors ${notif.read ? 'bg-transparent text-slate-400' : 'bg-brand/10 text-white'}`}
                      >
                        <p className="mb-1">{notif.message}</p>
                        <p className={`text-xs ${notif.read ? 'text-slate-600' : 'text-brand/80'}`}>
                          {formatDistanceToNow(new Date(notif.date), { addSuffix: true, locale: es })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
