import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, Calendar as CalendarIcon, Trophy, Target, Edit3, Trash2, Camera, X, Crown } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { currentUser, logout, updateProfile, deleteAccount, rooms } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || '');
  const [racketModel, setRacketModel] = useState(currentUser?.racketModel || '');
  
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);

  const [racketPreview, setRacketPreview] = useState(currentUser?.racketPhoto || '');
  const [racketFile, setRacketFile] = useState(null);

  const [selectedHistoryMatch, setSelectedHistoryMatch] = useState(null);

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const historyMatches = safeRooms.filter(r => 
    r.status === 'completed' && Array.isArray(r.players) && r.players.some(p => p.id === currentUser?.id)
  ).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  const handleLogout = () => {
    localStorage.removeItem('smashcor_currentUser'); 
    if (logout) logout();
    navigate('/');
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

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
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
      name,
      username,
      bio,
      birthDate,
      racketModel,
      avatar: newAvatar,
      racketPhoto: newRacketPhoto
    });
    
    setAvatarFile(null);
    setRacketFile(null);
    setIsEditing(false);
    alert('Perfil actualizado con éxito');
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

          <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-slate-300 border-b border-dark-border pb-2 mb-3">Datos Personales</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="Tu nombre real"
              />
            </div>
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
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Descripción (Bio)</label>
              <textarea 
                rows="3"
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                placeholder="¡Hola! Soy un jugador de pádel apasionado..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Fecha de Nacimiento</label>
              <input 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-brand border-b border-dark-border/50 pb-2 mb-3">Equipamiento Padel</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Nombre de la Pala</label>
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
                setName(currentUser?.name || '');
                setUsername(currentUser?.username || '');
                setBio(currentUser?.bio || '');
                setBirthDate(currentUser?.birthDate || '');
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
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-brand/20 to-transparent"></div>
            
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
                <span className="block text-3xl font-black text-white mb-0.5">{historyMatches.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Partidos Fin.</span>
              </div>
            </div>
          </div>

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
              <CalendarIcon className="text-blue-400" size={16}/> Historial de Partidos
            </h3>
            <div className="space-y-3">
              {historyMatches.length === 0 ? (
                <div className="text-center text-slate-500 py-6 text-sm bg-dark-card border border-dark-border rounded-xl">
                  Aún no tienes partidos finalizados.
                </div>
              ) : (
                historyMatches.map(match => {
                  const didIWin = match.scoreData && match.scoreData.winner !== 0 && (
                    (match.scoreData.winner === 1 && (match.players[0]?.id === currentUser.id || match.players[2]?.id === currentUser.id)) ||
                    (match.scoreData.winner === 2 && (match.players[1]?.id === currentUser.id || match.players[3]?.id === currentUser.id))
                  );
                  const isDraw = !match.scoreData || match.scoreData.winner === 0;

                  return (
                    <div 
                      key={match.id} 
                      onClick={() => setSelectedHistoryMatch(match)}
                      className="bg-dark-card border border-dark-border rounded-2xl p-4 flex justify-between items-center shadow-sm cursor-pointer hover:border-brand transition-colors"
                    >
                      <div>
                        <p className={`font-bold text-sm ${didIWin ? 'text-brand' : (isDraw ? 'text-slate-300' : 'text-red-400')}`}>
                          {didIWin ? 'Victoria' : (isDraw ? 'Amistoso / Sin Result.' : 'Derrota')}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {match.datetime ? format(new Date(match.datetime), "dd MMM", { locale: es }) : 'Fecha inst.'} • {match.location || 'Pista'}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        {match.scoreData && match.scoreData.sets?.length > 0 ? (
                          <div className="flex gap-1">
                            {match.scoreData.sets.map((set, i) => (
                              <span key={i} className="text-xs font-bold bg-dark-bg px-1.5 py-0.5 rounded border border-dark-border text-white">{set}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-500">-</span>
                        )}
                        <span className="text-[10px] text-brand/80 mt-1.5 flex items-center gap-1 uppercase tracking-wider font-bold">Pista →</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-6 pb-4 space-y-3">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-dark-card text-slate-300 border border-dark-border font-bold p-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"
            >
              <span className="pointer-events-none flex items-center justify-center">
                <LogOut size={18} />
              </span>
              <span className="text-sm pointer-events-none">Cerrar Sesión</span>
            </button>
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

      {/* VISUALIZADOR DE PISTA (MODAL) */}
      <AnimatePresence>
        {selectedHistoryMatch && (
          <MatchHistoryDetails 
            match={selectedHistoryMatch} 
            onClose={() => setSelectedHistoryMatch(null)} 
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SUBCOMPONENTE VISUALIZADOR PISTA ──
function MatchHistoryDetails({ match, onClose, currentUser }) {
  const players = Array.isArray(match?.players) ? match.players : [];
  
  // Posiciones: Team 1 (left) = left-top, left-bottom (o indices 0, 2)
  // Team 2 (right) = right-top, right-bottom (o indices 1, 3)
  const team1 = [
    players.find(p => p.courtPosition === 'left-top') || players[0],
    players.find(p => p.courtPosition === 'left-bottom') || players[2],
  ].filter(Boolean);

  const team2 = [
    players.find(p => p.courtPosition === 'right-top') || players[1],
    players.find(p => p.courtPosition === 'right-bottom') || players[3],
  ].filter(Boolean);

  const scoreData = match.scoreData;
  const isWinnerT1 = scoreData?.winner === 1;
  const isWinnerT2 = scoreData?.winner === 2;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="bg-dark-card border border-dark-border w-full max-w-lg rounded-[2rem] p-5 md:p-8 z-10 shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-20 bg-dark-bg/50 rounded-full p-1 backdrop-blur-sm transition-colors">
          <X size={24} />
        </button>

        <h3 className="text-xl font-black text-white text-center mb-1">Resultado Final</h3>
        <p className="text-sm text-brand font-mono font-bold tracking-widest text-center mb-6">{match.name}</p>

        {/* PISTA AZUL WPT */}
        <div className="relative w-full aspect-[4/3] bg-blue-600 rounded-lg border-4 border-white shadow-inner overflow-hidden flex">
          
          {/* Línea Central (Red) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1.5 -ml-[3px] bg-white opacity-80 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-0"></div>

          {/* Área de Saque Izquierda */}
          <div className="absolute top-1/4 bottom-1/4 left-[15%] right-1/2 border-2 border-white/40 border-r-0 z-0"></div>
          <div className="absolute top-1/2 left-[15%] right-1/2 h-0 border-t-2 border-white/40 z-0"></div>

          {/* Área de Saque Derecha */}
          <div className="absolute top-1/4 bottom-1/4 left-1/2 right-[15%] border-2 border-white/40 border-l-0 z-0"></div>
          <div className="absolute top-1/2 left-1/2 right-[15%] h-0 border-t-2 border-white/40 z-0"></div>

          {/* Equipo 1 (Izquierda) */}
          <div className="flex-1 flex flex-col items-center justify-around py-4 z-10 relative">
            {isWinnerT1 && (
              <div className="absolute top-2 flex flex-col items-center animate-bounce text-yellow-400">
                <Crown size={24} className="drop-shadow-md" />
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded-full mt-1 text-white">Campeones</span>
              </div>
            )}
            {team1.map((p, idx) => (
              <div key={idx} className={`flex flex-col items-center ${isWinnerT1 ? 'mt-8' : ''}`}>
                <img src={p?.avatar || 'https://via.placeholder.com/150'} className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 ${isWinnerT1 ? 'border-yellow-400' : 'border-white'} shadow-lg object-cover bg-slate-800`} alt="P1" />
                <span className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded-full mt-2 max-w-[80px] truncate text-center backdrop-blur-sm border border-white/10">
                  {p?.username || 'Jugador'}
                </span>
              </div>
            ))}
          </div>

          {/* Equipo 2 (Derecha) */}
          <div className="flex-1 flex flex-col items-center justify-around py-4 z-10 relative">
            {isWinnerT2 && (
              <div className="absolute top-2 flex flex-col items-center animate-bounce text-yellow-400">
                <Crown size={24} className="drop-shadow-md" />
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded-full mt-1 text-white">Campeones</span>
              </div>
            )}
            {team2.map((p, idx) => (
              <div key={idx} className={`flex flex-col items-center ${isWinnerT2 ? 'mt-8' : ''}`}>
                <img src={p?.avatar || 'https://via.placeholder.com/150'} className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 ${isWinnerT2 ? 'border-yellow-400' : 'border-white'} shadow-lg object-cover bg-slate-800`} alt="P2" />
                <span className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded-full mt-2 max-w-[80px] truncate text-center backdrop-blur-sm border border-white/10">
                  {p?.username || 'Jugador'}
                </span>
              </div>
            ))}
          </div>

          {/* Marcador Central */}
          {scoreData && scoreData.sets && scoreData.sets.length > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-bg/95 backdrop-blur-md border-2 border-brand px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20 flex gap-2.5">
              {scoreData.sets.map((set, i) => {
                const [s1, s2] = set.split('-');
                return (
                  <div key={i} className="flex gap-1 items-center font-black text-lg">
                    <span className={parseInt(s1) > parseInt(s2) ? 'text-white' : 'text-slate-500'}>{s1}</span>
                    <span className="text-slate-600 text-sm">-</span>
                    <span className={parseInt(s2) > parseInt(s1) ? 'text-white' : 'text-slate-500'}>{s2}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
