import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, Calendar as CalendarIcon, Trophy, Target, Edit3, Trash2 } from 'lucide-react';
import { userHistory } from '../data/mockData';
import { useState } from 'react';

export default function Profile() {
  const { currentUser, logout, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [racketModel, setRacketModel] = useState(currentUser?.racketModel || '');
  const [racketPhotoFile, setRacketPhotoFile] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      deleteAccount();
      navigate('/login');
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleSaveProfile = async () => {
    let photoBase64 = currentUser.racketPhoto;
    if (racketPhotoFile) {
      photoBase64 = await fileToBase64(racketPhotoFile);
    }
    updateProfile({
      racketModel,
      racketPhoto: photoBase64
    });
    setIsEditing(false);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">
      <div className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-dark-card transition-colors -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
        <button onClick={() => setIsEditing(!isEditing)} className="p-2 text-brand hover:text-brand-hover rounded-full transition-colors flex items-center gap-2">
          <Edit3 size={18} />
          <span className="text-sm font-bold hidden sm:inline">Editar Perfil</span>
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center shadow-lg relative">
          <button 
            onClick={handleLogout}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
          </button>
          
          <img src={currentUser.avatar} alt="avatar" className="w-24 h-24 mx-auto rounded-full border-4 border-brand shadow-lg mb-4 bg-slate-800 object-cover" />
          <h2 className="text-2xl font-bold">{currentUser.name} <span className="text-sm font-normal text-slate-400">({currentUser.age} años)</span></h2>
          <p className="text-slate-400 font-medium mb-1">@{currentUser.username}</p>
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-3 py-1 rounded-full text-sm font-bold border border-brand/30 mt-2">
            Nivel {currentUser.division} - {currentUser.subdivision}
          </div>
          <p className="text-slate-300 mt-4 text-sm leading-relaxed max-w-[280px] mx-auto">
            {currentUser.bio}
          </p>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Trophy className="text-yellow-400" size={20}/> Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-card border border-dark-border p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-brand mb-1">{currentUser.points}</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Puntos</span>
            </div>
            <div className="bg-dark-card border border-dark-border p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-white mb-1">45</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Partidos</span>
            </div>
          </div>
        </div>

        {/* Pala (Equipamiento) */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Target className="text-brand" size={20}/> Equipamiento</h3>
          
          {isEditing ? (
            <div className="bg-dark-card border border-dark-border rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Modelo de Pala</label>
                <input 
                  type="text" value={racketModel} onChange={(e) => setRacketModel(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:outline-none focus:border-brand"
                  placeholder="Ej. Head Speed Pro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Foto de la Pala</label>
                <input 
                  type="file" accept="image/*" onChange={(e) => setRacketPhotoFile(e.target.files[0])}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand file:text-dark-bg file:font-semibold hover:file:bg-brand-hover"
                />
              </div>
              <button onClick={handleSaveProfile} className="w-full bg-brand text-dark-bg font-bold p-3 rounded-xl hover:bg-brand-hover transition-colors">
                Guardar Equipamiento
              </button>
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-4">
              {currentUser.racketPhoto ? (
                <img src={currentUser.racketPhoto} alt="pala" className="w-16 h-16 object-contain rounded-lg bg-dark-bg p-1" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-dark-bg flex items-center justify-center text-2xl">🎾</div>
              )}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Pala Actual</p>
                <h4 className="font-bold text-white leading-tight">{currentUser.racketModel}</h4>
              </div>
            </div>
          )}
        </div>

        {/* Historial */}
        <div>
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

        {/* Configuración Peligrosa */}
        <div className="pt-8">
          <button 
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center space-x-2 bg-red-500/10 text-red-500 border border-red-500/20 font-bold p-4 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={20} />
            <span>Eliminar cuenta</span>
          </button>
          <p className="text-center text-xs text-slate-500 mt-3">Esta acción es irreversible.</p>
        </div>
      </div>
    </div>
  );
}
