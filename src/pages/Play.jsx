import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ShieldAlert, ArrowLeft, Plus, Globe, Lock, Users, Trash2, LogOut, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import PadelCourtUI from '../components/PadelCourtUI';

const TABS = [
  { id: 'my_matches', label: 'Mis Partidos' },
  { id: 'public', label: 'Disponibles' },
  { id: 'join', label: 'Código' },
  { id: 'create', label: 'Crear' },
];

export default function Play() {
  const { currentUser, rooms, addRoom, joinRoom, leaveRoom, deleteRoom, addNotification, finishMatch } = useAuth();

  const [activeTab, setActiveTab] = useState('my_matches');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [finishMatchData, setFinishMatchData] = useState(null);
  const [matchScore, setMatchScore] = useState([{ t1: '', t2: '', tb1: '', tb2: '' }, { t1: '', t2: '', tb1: '', tb2: '' }, { t1: '', t2: '', tb1: '', tb2: '' }]);

  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const [createData, setCreateData] = useState({
    name: '',
    location: '',
    datetime: '',
    durationSets: '3',
    requiredDivision: currentUser?.division || 4,
    requiredSubdivision: currentUser?.subdivision || 'Media',
    isPrivate: false,
  });

  const safeRooms = Array.isArray(rooms) ? rooms : [];

  const myMatches = safeRooms.filter(r =>
    r.status !== 'completed' && Array.isArray(r?.players) && r.players.some(p => p.id === currentUser?.id)
  );

  const publicRooms = safeRooms.filter(r =>
    r.status !== 'completed' &&
    !r.isPrivate &&
    Array.isArray(r?.players) &&
    r.players.length < 4 &&
    !r.players.some(p => p.id === currentUser?.id)
  );

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const roomCode = 'PAD-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newRoom = addRoom({ ...createData, roomCode });
    setSelectedRoom(newRoom);
  };

  const handleJoinByCode = (e) => {
    e.preventDefault();
    setJoinError('');
    if (!joinCode.trim()) return;
    const res = joinRoom(joinCode);
    if (!res || !res.success) {
      setJoinError(res?.message ?? 'Error desconocido');
    } else {
      setSelectedRoom(res.room);
      setJoinCode('');
      
      if (res.room.creatorId && res.room.creatorId !== currentUser?.id) {
        addNotification(res.room.creatorId, `¡${currentUser?.username || 'Un jugador'} se ha unido a tu partido!`, 'success');
      }
    }
  };

  const handleJoinPublic = (roomId) => {
    setJoinError('');
    const res = joinRoom(roomId, true);
    if (!res || !res.success) {
      setJoinError(res?.message ?? 'Error al unirse');
    } else {
      const freshRoom = safeRooms.find(r => r.id === (res.room?.id ?? roomId)) || res.room;
      setSelectedRoom(freshRoom);

      if (freshRoom.creatorId && freshRoom.creatorId !== currentUser?.id) {
        addNotification(freshRoom.creatorId, `¡${currentUser?.username || 'Un jugador'} se ha unido a tu partido!`, 'success');
      }
    }
  };

  const openFinishMatch = (match) => {
    setFinishMatchData(match);
    setMatchScore([{ t1: '', t2: '', tb1: '', tb2: '' }, { t1: '', t2: '', tb1: '', tb2: '' }, { t1: '', t2: '', tb1: '', tb2: '' }]);
  };

  const submitFinishMatch = (withScore) => {
    if (!finishMatchData) return;
    
    if (!withScore) {
      finishMatch(finishMatchData.id, null);
    } else {
      let team1Sets = 0;
      let team2Sets = 0;
      const validSets = [];

      matchScore.forEach(set => {
        const t1 = parseInt(set.t1);
        const t2 = parseInt(set.t2);
        if (!isNaN(t1) && !isNaN(t2)) {
          let setWinner = 0;
          if (t1 === 6 && t2 === 6) {
            const tb1 = parseInt(set.tb1);
            const tb2 = parseInt(set.tb2);
            if (!isNaN(tb1) && !isNaN(tb2)) {
              validSets.push(`6-6 (${tb1}-${tb2})`);
              if (tb1 > tb2) setWinner = 1;
              else if (tb2 > tb1) setWinner = 2;
            } else {
              validSets.push(`6-6`);
            }
          } else {
            validSets.push(`${t1}-${t2}`);
            if (t1 > t2) setWinner = 1;
            else if (t2 > t1) setWinner = 2;
          }

          if (setWinner === 1) team1Sets++;
          else if (setWinner === 2) team2Sets++;
        }
      });

      const scoreData = {
        sets: validSets,
        team1Sets,
        team2Sets,
        winner: team1Sets > team2Sets ? 1 : (team2Sets > team1Sets ? 2 : 0)
      };

      finishMatch(finishMatchData.id, scoreData);
    }
    
    setFinishMatchData(null);
  };

  if (selectedRoom) {
    const currentRoomState = rooms.find(r => r.id === selectedRoom.id) || selectedRoom;
    return (
      <div className="flex flex-col bg-dark-bg p-4 pb-24 overflow-y-auto min-h-screen">
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => setSelectedRoom(null)}
            className="flex items-center text-slate-400 hover:text-white bg-dark-card px-4 py-2 rounded-xl text-sm font-semibold border border-dark-border shadow-sm transition"
          >
            <ArrowLeft size={16} className="mr-2" /> Volver
          </button>
          
          { (currentUser?.id === currentRoomState.creatorId || currentRoomState.players?.[0]?.id === currentUser?.id) ? (
            <button
              onClick={() => setConfirmAction({ type: 'delete', roomId: currentRoomState.id })}
              className="flex items-center text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-2 rounded-xl text-sm font-bold border border-red-500/20 shadow-sm transition"
            >
              <Trash2 size={16} className="mr-1.5" /> Eliminar
            </button>
          ) : (
            <button
              onClick={() => setConfirmAction({ type: 'leave', roomId: currentRoomState.id })}
              className="flex items-center text-orange-400 hover:text-orange-300 bg-orange-400/10 px-3 py-2 rounded-xl text-sm font-bold border border-orange-400/20 shadow-sm transition"
            >
              <LogOut size={16} className="mr-1.5" /> Abandonar
            </button>
          )}
        </div>

        <PadelCourtUI match={currentRoomState} />

        <AnimatePresence>
          {confirmAction && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setConfirmAction(null)}
              />
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                className="bg-dark-card border border-dark-border w-full max-w-sm rounded-[2rem] p-6 z-10 shadow-2xl relative flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${confirmAction.type === 'delete' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                  {confirmAction.type === 'delete' ? <Trash2 size={32} /> : <LogOut size={32} />}
                </div>
                <h3 className="text-xl font-black text-white mb-2">
                  {confirmAction.type === 'delete' ? '¿Eliminar Sala?' : '¿Abandonar Partido?'}
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  {confirmAction.type === 'delete' 
                    ? 'Esta acción borrará la sala por completo y expulsará a todos los jugadores.'
                    : 'Dejarás un hueco vacío en la pista. Podrás volver a unirte más tarde.'}
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 py-3.5 rounded-xl font-bold bg-dark-bg border border-dark-border text-white hover:bg-slate-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (confirmAction.type === 'delete') {
                        deleteRoom(confirmAction.roomId);
                      } else {
                        leaveRoom(confirmAction.roomId);
                      }
                      setConfirmAction(null);
                      setSelectedRoom(null);
                    }}
                    className={`flex-1 py-3.5 rounded-xl font-black text-white shadow-lg transition ${confirmAction.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                  >
                    Confirmar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-4 pb-28 min-h-screen relative">
      <h2 className="text-2xl font-bold text-white mb-5">Partidos</h2>

      <div className="flex bg-dark-card rounded-xl p-1 mb-6 border border-dark-border shadow-sm gap-0.5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 font-bold text-[11px] sm:text-xs rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-slate-700 text-brand shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'my_matches' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {!myMatches || myMatches.length === 0 ? (
            <div className="text-center text-slate-400 py-14 bg-dark-card border border-dark-border rounded-2xl">
              <Users size={36} className="mx-auto mb-3 text-slate-600" />
              <p className="font-semibold text-white mb-1">Sin partidos activos</p>
              <p className="text-sm">Crea uno o únete desde "Disponibles".</p>
            </div>
          ) : (
            myMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onClick={() => setSelectedRoom(match)} 
                onFinish={() => openFinishMatch(match)}
                isCreator={currentUser?.id === match.creatorId}
              />
            ))
          )}
        </motion.div>
      )}

      {activeTab === 'public' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {!publicRooms || publicRooms.length === 0 ? (
            <div className="text-center text-slate-400 py-14 bg-dark-card border border-dark-border rounded-2xl">
              <Globe size={36} className="mx-auto mb-3 text-slate-600" />
              <p className="font-semibold text-white mb-1">No hay partidos disponibles</p>
              <p className="text-sm">¡Sé el primero en crear uno público!</p>
            </div>
          ) : (
            publicRooms.map(match => (
              <PublicMatchCard key={match.id} match={match} onJoin={() => handleJoinPublic(match.id)} />
            ))
          )}
        </motion.div>
      )}

      {activeTab === 'join' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-card border border-dark-border p-6 rounded-2xl shadow-lg text-center py-12">
          <ShieldAlert size={52} className="text-brand mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold text-white mb-2">Código Privado</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-[240px] mx-auto">
            Ingresa el código que te pasó el anfitrión por WhatsApp.
          </p>
          <form onSubmit={handleJoinByCode} className="space-y-4">
            <input
              type="text" value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="PAD-XXXX"
              className="w-full max-w-[220px] mx-auto block bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-4 text-3xl text-center text-brand font-mono font-black tracking-widest focus:outline-none focus:border-brand uppercase placeholder:text-slate-700 transition-colors"
            />
            <AnimatePresence>
              {joinError && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-red-400 text-sm bg-red-400/10 py-2 px-4 rounded-lg inline-block"
                >
                  {joinError}
                </motion.p>
              )}
            </AnimatePresence>
            <button type="submit" className="w-full max-w-[220px] mx-auto block bg-slate-700 text-white font-bold px-6 py-4 rounded-xl hover:bg-slate-600 transition-colors shadow-md">
              Entrar
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-lg">
          <form onSubmit={handleCreateRoom} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">Nombre del encuentro</label>
              <input required type="text" value={createData.name}
                onChange={e => setCreateData({ ...createData, name: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none transition"
                placeholder="Pachanga de Jueves" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">Club / Lugar</label>
              <input required type="text" value={createData.location}
                onChange={e => setCreateData({ ...createData, location: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none transition"
                placeholder="Club Centro, Pista 2" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">Fecha y Hora</label>
              <input required type="datetime-local" value={createData.datetime}
                onChange={e => setCreateData({ ...createData, datetime: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none transition" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Sets</label>
                <select value={createData.durationSets}
                  onChange={e => setCreateData({ ...createData, durationSets: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none appearance-none font-medium">
                  <option value="1">1 Set</option>
                  <option value="2">2 Sets</option>
                  <option value="3">Mejor de 3</option>
                  <option value="5">Mejor de 5</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Nivel</label>
                <select value={createData.requiredDivision}
                  onChange={e => setCreateData({ ...createData, requiredDivision: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none appearance-none font-medium">
                  {[1, 2, 3, 4].map(d => <option key={d} value={d}>{d}ª División</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: false, icon: Globe, label: 'Pública', desc: 'Visible en Disponibles' },
                { value: true, icon: Lock, label: 'Privada', desc: 'Solo por código' },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setCreateData({ ...createData, isPrivate: opt.value })}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                    createData.isPrivate === opt.value
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-dark-border bg-dark-bg text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <opt.icon size={22} />
                  <span className="font-bold text-sm">{opt.label}</span>
                  <span className="text-[10px] opacity-70">{opt.desc}</span>
                </button>
              ))}
            </div>

            <button type="submit" className="w-full bg-brand text-dark-bg font-black py-4 rounded-xl shadow-lg hover:bg-brand-hover transition-colors uppercase tracking-wide mt-2">
              Convocar Partido
            </button>
          </form>
        </motion.div>
      )}

      {/* MODAL FINISH MATCH */}
      <AnimatePresence>
        {finishMatchData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setFinishMatchData(null)}
            />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="bg-dark-card border border-dark-border w-full max-w-sm rounded-[2rem] p-6 z-10 shadow-2xl relative flex flex-col"
            >
              <button onClick={() => setFinishMatchData(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                <CheckCircle2 className="text-brand" /> Finalizar Partido
              </h3>
              <p className="text-sm text-slate-400 mb-6">{finishMatchData.name}</p>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-[1fr_2fr_1fr] gap-2 items-center text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Eq. 1</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resultado</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Eq. 2</span>
                </div>
                
                {[1, 2, 3].map((setNum, idx) => {
                  const isTieBreak = matchScore[idx].t1 === '6' && matchScore[idx].t2 === '6';
                  return (
                    <div key={idx} className="flex flex-col gap-2 items-center">
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center w-full">
                        <input 
                          type="number" min="0" max="7" 
                          value={matchScore[idx].t1}
                          onChange={(e) => {
                            const newScore = [...matchScore];
                            newScore[idx].t1 = e.target.value;
                            setMatchScore(newScore);
                          }}
                          className="bg-dark-bg border border-dark-border rounded-lg p-2 text-center text-white font-bold text-lg focus:border-brand focus:outline-none"
                        />
                        <span className="text-xs text-slate-500 font-bold uppercase text-center tracking-widest px-2">Set {setNum}</span>
                        <input 
                          type="number" min="0" max="7" 
                          value={matchScore[idx].t2}
                          onChange={(e) => {
                            const newScore = [...matchScore];
                            newScore[idx].t2 = e.target.value;
                            setMatchScore(newScore);
                          }}
                          className="bg-dark-bg border border-dark-border rounded-lg p-2 text-center text-white font-bold text-lg focus:border-brand focus:outline-none"
                        />
                      </div>
                      
                      {isTieBreak && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-2 items-center bg-brand/10 px-3 py-1.5 rounded-lg border border-brand/20 w-auto justify-center mt-1 mb-2">
                           <span className="text-[10px] font-bold text-brand uppercase mr-1">TB</span>
                           <input 
                              type="number" min="0"
                              value={matchScore[idx].tb1 || ''}
                              onChange={(e) => {
                                const newScore = [...matchScore];
                                newScore[idx].tb1 = e.target.value;
                                setMatchScore(newScore);
                              }}
                              className="bg-dark-bg border border-dark-border rounded p-1 text-center text-brand font-bold text-sm w-12 focus:border-brand focus:outline-none"
                            />
                            <span className="text-slate-500 font-bold">-</span>
                            <input 
                              type="number" min="0"
                              value={matchScore[idx].tb2 || ''}
                              onChange={(e) => {
                                const newScore = [...matchScore];
                                newScore[idx].tb2 = e.target.value;
                                setMatchScore(newScore);
                              }}
                              className="bg-dark-bg border border-dark-border rounded p-1 text-center text-brand font-bold text-sm w-12 focus:border-brand focus:outline-none"
                            />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 w-full mt-2">
                <button
                  onClick={() => submitFinishMatch(true)}
                  className="w-full py-3.5 rounded-xl font-black bg-brand text-dark-bg hover:bg-brand-hover shadow-lg transition"
                >
                  Guardar y Finalizar
                </button>
                <button
                  onClick={() => submitFinishMatch(false)}
                  className="w-full py-3.5 rounded-xl font-bold bg-dark-bg border border-dark-border text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  Cerrar sin resultado
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SUBCOMPONENTES ──

function MatchCard({ match, onClick, onFinish, isCreator }) {
  const players = Array.isArray(match?.players) ? match.players : [];
  return (
    <div
      onClick={onClick}
      className="bg-dark-card border border-dark-border p-5 rounded-2xl cursor-pointer hover:border-brand/50 transition shadow-lg relative group overflow-hidden"
    >
      <div className="absolute top-0 right-0 bg-brand text-dark-bg font-bold px-4 py-1.5 text-xs rounded-bl-xl z-10">
        {players.length}/4
      </div>
      {match?.isPrivate
        ? <Lock size={12} className="text-slate-500 mb-1" />
        : <Globe size={12} className="text-brand/60 mb-1" />
      }
      <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">{match?.name || 'Partido'}</h3>
      <p className="text-xs text-brand font-mono font-bold tracking-widest mb-3 bg-brand/10 inline-block px-2 py-0.5 rounded mt-0.5">{match?.roomCode || 'PAD-????'}</p>
      <div className="flex flex-col gap-1.5 text-xs text-slate-400">
        <span className="flex items-center gap-2"><MapPin size={12} className="text-slate-500" /> {match?.location || 'Sin ubicación'}</span>
        {match?.datetime && isValid(new Date(match.datetime)) && (
          <span className="flex items-center gap-2"><Clock size={12} className="text-slate-500" /> {format(new Date(match.datetime), "dd MMM · HH:mm", { locale: es })} hs</span>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-dark-border flex items-center justify-between">
        <div className="flex -space-x-2">
          {players?.length > 0 && players.map((p, i) => (
            <img key={p?.id || i} src={p?.avatar || 'https://via.placeholder.com/150'} className="w-7 h-7 rounded-full border-2 border-dark-card" alt="Player" />
          ))}
          {Array.from({ length: Math.max(0, 4 - (players?.length || 0)) }).map((_, i) => (
            <div key={`e-${i}`} className="w-7 h-7 rounded-full border-2 border-dark-card bg-slate-800 flex items-center justify-center text-slate-500">
              <Plus size={10} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {isCreator && (
            <button 
              onClick={(e) => { e.stopPropagation(); onFinish(match); }}
              className="text-[10px] bg-brand/20 text-brand px-3 py-1.5 rounded-lg font-bold uppercase hover:bg-brand hover:text-dark-bg transition-colors"
            >
              Finalizar
            </button>
          )}
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ver pista →</span>
        </div>
      </div>
    </div>
  );
}

function PublicMatchCard({ match, onJoin }) {
  const playersCount = Array.isArray(match?.players) ? match.players.length : 0;
  const free = Math.max(0, 4 - playersCount);
  return (
    <div className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-lg overflow-hidden relative">
      <div className={`absolute top-0 left-0 h-1 ${free === 1 ? 'bg-orange-400' : 'bg-brand'}`} style={{ width: `${(playersCount / 4) * 100}%` }} />
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{match?.name || 'Partido disponible'}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <MapPin size={12} className="text-slate-500" /> {match?.location || 'Sin ubicación'}
          </div>
        </div>
        <div className={`shrink-0 ml-2 text-center px-3 py-1.5 rounded-xl font-black text-sm ${free === 1 ? 'bg-orange-400/20 text-orange-400' : 'bg-brand/20 text-brand'}`}>
          {free} {free === 1 ? 'hueco' : 'huecos'}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {match?.datetime && isValid(new Date(match.datetime)) && (
            <><Clock size={11} className="text-slate-500" /> {format(new Date(match.datetime), "dd MMM · HH:mm", { locale: es })} hs</>
          )}
        </div>
        <button
          onClick={onJoin}
          className="bg-brand text-dark-bg font-bold text-sm px-5 py-2 rounded-xl hover:bg-brand-hover transition-colors shadow"
        >
          Unirme
        </button>
      </div>
    </div>
  );
}
