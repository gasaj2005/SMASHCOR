import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, Calendar as CalendarIcon, Star, Trophy, Target } from 'lucide-react';
import { userHistory } from '../data/mockData';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-dark-card transition-colors -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      <div className="p-4">
        {/* Profile Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center shadow-lg relative mb-6">
          <button 
            onClick={handleLogout}
            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
          </button>
          
          <img src={currentUser.avatar} alt="avatar" className="w-24 h-24 mx-auto rounded-full border-4 border-brand shadow-lg mb-4 bg-slate-800" />
          <h2 className="text-2xl font-bold">{currentUser.name}</h2>
          <p className="text-slate-400 font-medium mb-1">@{currentUser.username}</p>
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-3 py-1 rounded-full text-sm font-bold border border-brand/30">
            Nivel {currentUser.division} - {currentUser.subdivision}
          </div>
          <p className="text-slate-300 mt-4 text-sm leading-relaxed max-w-[280px] mx-auto">
            {currentUser.bio}
          </p>
        </div>

        {/* Stats */}
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Trophy className="text-yellow-400" size={20}/> Estadísticas</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-card border border-dark-border p-4 rounded-xl text-center">
            <span className="block text-2xl font-bold text-brand mb-1">{currentUser.points}</span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Puntos</span>
          </div>
          <div className="bg-dark-card border border-dark-border p-4 rounded-xl text-center">
            <span className="block text-2xl font-bold text-white mb-1">45</span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Partidos</span>
          </div>
        </div>

        {/* Pala */}
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Target className="text-brand" size={20}/> Equipamiento</h3>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-4 mb-6">
          <img src={currentUser.racketPhoto} alt="pala" className="w-16 h-16 object-contain" />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Pala Actual</p>
            <h4 className="font-bold text-white leading-tight">{currentUser.racketModel}</h4>
          </div>
        </div>

        {/* Historial */}
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><CalendarIcon className="text-blue-400" size={20}/> Últimos Partidos</h3>
        <div className="space-y-3">
          {userHistory.map(history => (
            <div key={history.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className={`font-bold ${history.result.includes('Victoria') ? 'text-brand' : 'text-slate-300'}`}>
                  {history.result}
                </p>
                <p className="text-xs text-slate-500 mt-1">{history.date} • {history.location}</p>
              </div>
              <div className="text-right">
                <span className="block font-bold text-white">+{history.pointsEarned} pts</span>
                <span className="text-[10px] text-slate-400">{history.pointDetails}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
