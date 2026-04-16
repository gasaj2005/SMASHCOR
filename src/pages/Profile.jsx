import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, Calendar as CalendarIcon, Trophy, Target, Edit3, Trash2, Camera } from 'lucide-react';
import { userHistory } from '../data/mockData';
import { useState } from 'react';

export default function Profile() {
  const { currentUser, logout, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || '');
  const [racketModel, setRacketModel] = useState(currentUser?.racketModel || '');
  
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);

  const [racketPreview, setRacketPreview] = useState(currentUser?.racketPhoto || '');
  const [racketFile, setRacketFile] = useState(null);

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

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file provided");
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // WebP preserves transparency and compresses better
          const compressedBase64 = canvas.toDataURL('image/webp', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRacketSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRacketFile(file);
      setRacketPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    let newAvatar = currentUser.avatar;
    let newRacketPhoto = currentUser.racketPhoto;

    try {
      if (avatarFile) {
        newAvatar = await compressImage(avatarFile);
      }
      if (racketFile) {
        newRacketPhoto = await compressImage(racketFile);
      }
    } catch (error) {
      console.error("Error compressing images", error);
    }

    updateProfile({
      username,
      racketModel,
      avatar: newAvatar,
      racketPhoto: newRacketPhoto
    });
    
    setAvatarFile(null);
    setRacketFile(null);
    setIsEditing(false);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">
      <div className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border py-4 px-6 flex items-center justify-between">
        <button onClick={() => isEditing ? setIsEditing(false) : navigate(-1)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-dark-card transition-colors -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">{isEditing ? 'Editar Perfil' : 'Mi Perfil'}</h1>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="p-2 text-brand hover:text-brand-hover rounded-full transition-colors flex items-center gap-2">
            <Edit3 size={18} />
            <span className="text-sm font-bold hidden sm:inline">Editar</span>
          </button>
        ) : (
          <div className="w-8"></div>
        )}
      </div>

      {isEditing ? (
        <div className="p-4 space-y-6 animate-fade-in">
          {/* Foto de Perfil */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 text-center shadow-lg">
            <label className="relative inline-block cursor-pointer group">
              <img src={avatarPreview || currentUser.avatar} alt="Avatar" className="w-24 h-24 mx-auto rounded-full border-4 border-brand shadow-lg object-cover bg-slate-800" />
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={28} />
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
            </label>
            <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-wider">Toca para cambiar foto</p>
          </div>

          {/* Datos Personales */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-slate-300 border-b border-dark-border pb-2 mb-3">Datos Personales</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Nombre de Usuario (@)</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="Tu usuario"
              />
            </div>
          </div>

          {/* Equipamiento */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-brand border-b border-dark-border/50 pb-2 mb-3">Equipamiento Padel</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Modelo de Pala</label>
              <input 
                type="text" 
                value={racketModel} 
                onChange={(e) => setRacketModel(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="Ej. Head Speed Pro"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Foto de la Pala</label>
              <div className="flex gap-5 items-center">
                <label className="relative inline-block cursor-pointer group flex-shrink-0">
                  {racketPreview || currentUser.racketPhoto ? (
                    <img src={racketPreview || currentUser.racketPhoto} alt="pala" className="w-24 h-24 object-contain bg-white rounded-2xl border border-dark-border p-1 shadow-inner" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-dark-bg border-2 border-dark-border border-dashed flex flex-col items-center justify-center shadow-inner hover:border-brand transition-colors">
                      <Target className="text-slate-500 mb-1.5" size={24} />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Subir</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleRacketSelect} />
                </label>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sube una foto real de tu pala para lucir el arma principal con la que dominas la pista.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3 pb-8">
            <button onClick={() => {
                setIsEditing(false);
                setAvatarPreview(currentUser?.avatar || '');
                setRacketPreview(currentUser?.racketPhoto || '');
                setUsername(currentUser?.username || '');
                setRacketModel(currentUser?.racketModel || '');
              }} 
              className="w-1/3 py-3.5 rounded-xl font-bold bg-dark-bg text-white border border-dark-border hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button onClick={handleSaveProfile} className="w-2/3 py-3.5 rounded-xl font-black bg-brand text-dark-bg hover:bg-brand-hover transition shadow-[0_0_15px_rgba(147,197,114,0.3)]">
              Guardar Cambios
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6 animate-fade-in">
          {/* Profile Card */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-brand/20 to-transparent"></div>
            <button 
              onClick={handleLogout}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10 p-2 bg-dark-bg/50 rounded-full backdrop-blur-md"
            >
              <LogOut size={18} />
            </button>
            
            <div className="relative z-10">
              <img src={currentUser.avatar} alt="avatar" className="w-24 h-24 mx-auto rounded-full border-4 border-dark-bg shadow-[0_0_15px_rgba(147,197,114,0.4)] mb-3 object-cover bg-slate-800" />
              <h2 className="text-2xl font-black tracking-tight">{currentUser.name} <span className="text-sm font-medium text-slate-400 align-middle">({currentUser.age} años)</span></h2>
              <p className="text-brand font-bold mt-0.5 text-sm">@{currentUser.username}</p>
              
              <div className="inline-flex items-center gap-2 bg-dark-bg text-white px-4 py-1.5 rounded-full text-xs font-bold border border-dark-border mt-4 shadow-sm">
                Nivel <span className="text-brand">{currentUser.division}</span> - {currentUser.subdivision}
              </div>
              
              <p className="text-slate-400 mt-5 text-sm leading-relaxed max-w-[280px] mx-auto">
                {currentUser.bio}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Trophy className="text-yellow-400" size={16}/> Estadísticas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-card border border-dark-border p-4 rounded-2xl text-center shadow-sm">
                <span className="block text-3xl font-black text-white mb-0.5">{currentUser.points}</span>
                <span className="text-[10px] text-brand font-bold uppercase tracking-widest">Puntos</span>
              </div>
              <div className="bg-dark-card border border-dark-border p-4 rounded-2xl text-center shadow-sm">
                <span className="block text-3xl font-black text-white mb-0.5">45</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Partidos</span>
              </div>
            </div>
          </div>

          {/* Pala (Equipamiento) */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Target className="text-brand" size={16}/> Tu Arma
            </h3>
            
            <div className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              {currentUser.racketPhoto ? (
                <img src={currentUser.racketPhoto} alt="pala" className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-dark-border shadow-inner" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-dark-bg flex items-center justify-center text-3xl border border-dark-border">🎾</div>
              )}
              <div>
                <p className="text-[10px] text-brand font-bold uppercase tracking-widest mb-1">Modelo Actual</p>
                <h4 className="font-bold text-white text-sm leading-tight pr-2">{currentUser.racketModel || 'Sin especificar'}</h4>
              </div>
            </div>
          </div>

          {/* Historial */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <CalendarIcon className="text-blue-400" size={16}/> Últimos Partidos
            </h3>
            <div className="space-y-3">
              {userHistory.map(history => (
                <div key={history.id} className="bg-dark-card border border-dark-border rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <p className={`font-bold text-sm ${history.result.includes('Victoria') ? 'text-brand' : 'text-slate-300'}`}>
                      {history.result}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{history.date} • {history.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-white text-base">+{history.pointsEarned}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuración Peligrosa */}
          <div className="pt-6 pb-4">
            <button 
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-center gap-2 bg-red-500/5 text-red-500 border border-red-500/20 font-bold p-3.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <Trash2 size={18} />
              <span className="text-sm">Eliminar cuenta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
