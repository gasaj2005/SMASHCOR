import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ShieldAlert, ArrowLeft, Plus, Globe, Lock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PadelCourtUI from '../components/PadelCourtUI';

const TABS = [
  { id: 'my_matches', label: 'Mis Partidos' },
  { id: 'public', label: 'Disponibles' },
  { id: 'join', label: 'Código' },
  { id: 'create', label: 'Crear' },
];

export default function Play() {
  const { currentUser, rooms, addRoom, joinRoom } = useAuth();

  const [activeTab, setActiveTab] = useState('my_matches');
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  // Null-safe array (si el contexto aún no cargó, rooms puede ser [])
  const safeRooms = Array.isArray(rooms) ? rooms : [];

  // Mis Partidos: salas en las que está el usuario actual
  const myMatches = safeRooms.filter(r =>
    Array.isArray(r?.players) && r.players.some(p => p.id === currentUser?.id)
  );

  // Partidos Disponibles: públicas con huecos donde el usuario NO está aún
  const publicRooms = safeRooms.filter(r =>
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
    }
  };

  const handleJoinPublic = (roomId) => {
    setJoinError('');
    const res = joinRoom(roomId, true);
    if (!res || !res.success) {
      setJoinError(res?.message ?? 'Error al unirse');
    } else {
      // Leer el room fresco desde rooms (ya actualizado por joinRoom)
      const freshRoom = safeRooms.find(r => r.id === (res.room?.id ?? roomId)) || res.room;
      setSelectedRoom(freshRoom);
    }
  };

  // Vista de Pista Cenital
  if (selectedRoom) {
    const currentRoomState = rooms.find(r => r.id === selectedRoom.id) || selectedRoom;
    return (
      <div className="flex flex-col bg-dark-bg p-4 pb-24 overflow-y-auto min-h-screen">
        <button
          onClick={() => setSelectedRoom(null)}
          className="flex items-center w-max text-slate-400 hover:text-white mb-5 bg-dark-card px-4 py-2 rounded-xl text-sm font-semibold border border-dark-border shadow-sm transition"
        >
          <ArrowLeft size={16} className="mr-2" /> Volver
        </button>
        <PadelCourtUI match={currentRoomState} />
      </div>
    );
  }

  return (
    <div className="p-4 pb-28 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-5">Partidos</h2>

      {/* NAV TABS */}
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

      {/* ── MIS PARTIDOS ── */}
      {activeTab === 'my_matches' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {myMatches.length === 0 ? (
            <div className="text-center text-slate-400 py-14 bg-dark-card border border-dark-border rounded-2xl">
              <Users size={36} className="mx-auto mb-3 text-slate-600" />
              <p className="font-semibold text-white mb-1">Sin partidos activos</p>
              <p className="text-sm">Crea uno o únete desde "Disponibles".</p>
            </div>
          ) : (
            myMatches.map(match => (
              <MatchCard key={match.id} match={match} onClick={() => setSelectedRoom(match)} />
            ))
          )}
        </motion.div>
      )}

      {/* ── PARTIDOS DISPONIBLES (PÚBLICOS) ── */}
      {activeTab === 'public' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {publicRooms.length === 0 ? (
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

      {/* ── UNIRSE POR CÓDIGO ── */}
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

      {/* ── CREAR PARTIDO ── */}
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

            {/* PRIVACIDAD SELECTOR */}
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
    </div>
  );
}

// ── SUBCOMPONENTES ──

function MatchCard({ match, onClick }) {
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
        {match?.datetime && (
          <span className="flex items-center gap-2"><Clock size={12} className="text-slate-500" /> {format(new Date(match.datetime), "dd MMM · HH:mm", { locale: es })} hs</span>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-dark-border flex items-center justify-between">
        <div className="flex -space-x-2">
          {players.map((p, i) => (
            <img key={p?.id || i} src={p?.avatar || 'https://via.placeholder.com/150'} className="w-7 h-7 rounded-full border-2 border-dark-card" alt="Player" />
          ))}
          {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, i) => (
            <div key={`e-${i}`} className="w-7 h-7 rounded-full border-2 border-dark-card bg-slate-800 flex items-center justify-center text-slate-500">
              <Plus size={10} />
            </div>
          ))}
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ver pista →</span>
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
          {match?.datetime && (
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
