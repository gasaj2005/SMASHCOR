import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ShieldAlert, ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PadelCourtUI from '../components/PadelCourtUI';

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

  const myMatches = rooms.filter(r => r.players.some(p => p.id === currentUser.id));

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const roomCode = 'PAD-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newRoom = addRoom({
      ...createData,
      roomCode
    });
    setSelectedRoom(newRoom);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    setJoinError('');
    if (!joinCode.trim()) return;
    
    const res = joinRoom(joinCode);
    if (!res.success) {
      setJoinError(res.message);
    } else {
      setSelectedRoom(res.room);
      setJoinCode('');
    }
  };

  if (selectedRoom) {
    // Escuchar cambios contextuales por si otro estado actualiza el room actual
    const currentRoomState = rooms.find(r => r.id === selectedRoom.id) || selectedRoom;
    return (
      <div className="flex flex-col h-full bg-dark-bg p-4 pb-24 overflow-y-auto">
        <button 
          onClick={() => setSelectedRoom(null)} 
          className="flex items-center w-max text-slate-400 hover:text-white mb-4 bg-dark-card px-4 py-2 rounded-lg text-sm font-medium border border-dark-border shadow-sm transition"
        >
          <ArrowLeft size={16} className="mr-2"/> Volver al Cajón
        </button>
        <PadelCourtUI match={currentRoomState} />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">Gestión de Partidos</h2>
      
      <div className="flex bg-dark-card rounded-xl p-1 mb-6 border border-dark-border shadow-sm">
        {['my_matches', 'create', 'join'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 font-bold text-xs sm:text-sm rounded-lg transition-colors ${activeTab === tab ? 'bg-slate-700 text-brand shadow' : 'text-slate-400 hover:text-white'}`}
          >
            {tab === 'my_matches' && 'Mis Partidos'}
            {tab === 'create' && 'Crear Sala'}
            {tab === 'join' && 'Unirse'}
          </button>
        ))}
      </div>

      {activeTab === 'my_matches' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {myMatches.length === 0 ? (
             <div className="text-center text-slate-400 py-10 bg-dark-card border border-dark-border rounded-xl">No estás en ningún partido.<br/> ¡Anímate a crear uno o unirte!</div>
          ) : (
            myMatches.map(match => (
              <div 
                key={match.id} 
                onClick={() => setSelectedRoom(match)}
                className="bg-dark-card border border-dark-border p-5 rounded-2xl cursor-pointer hover:border-brand/50 transition shadow-lg relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-brand text-dark-bg font-bold px-4 py-1.5 text-xs rounded-bl-xl z-10">
                  {match.players.length}/4
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand transition-colors">{match.name}</h3>
                <p className="text-xs text-brand font-mono font-bold tracking-widest mb-4 bg-brand/10 inline-block px-2 py-0.5 rounded">{match.roomCode}</p>
                
                <div className="flex flex-col gap-2 text-xs text-slate-300">
                  <span className="flex items-center gap-2"><MapPin size={14} className="text-slate-500"/> {match.location}</span>
                  {match.datetime && (
                    <span className="flex items-center gap-2"><Clock size={14} className="text-slate-500"/> {format(new Date(match.datetime), "dd/MMM HH:mm", { locale: es })} hs</span>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {match.players.map((p, i) => (
                      <img key={i} src={p.avatar} className="w-8 h-8 rounded-full border-2 border-dark-card" alt="Player"/>
                    ))}
                    {Array.from({ length: 4 - match.players.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-8 h-8 rounded-full border-2 border-dark-card bg-slate-800 flex items-center justify-center text-slate-500">
                        <Plus size={12}/>
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tocar para entrar &gt;</span>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-lg">
          <form onSubmit={handleCreateRoom} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">Nombre de la Pista / Encuentro</label>
              <input required type="text" value={createData.name} onChange={e=>setCreateData({...createData, name: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none transition" placeholder="Pachanga de Jueves" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">Lugar de reserva</label>
              <input required type="text" value={createData.location} onChange={e=>setCreateData({...createData, location: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none transition" placeholder="Club Centro, Pista 2" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">Fecha y Hora</label>
              <input required type="datetime-local" value={createData.datetime} onChange={e=>setCreateData({...createData, datetime: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none transition" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Formato Sets</label>
                <select value={createData.durationSets} onChange={e=>setCreateData({...createData, durationSets: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none appearance-none font-medium">
                  <option value="1">A 1 Set (Rápido)</option>
                  <option value="2">A 2 Sets</option>
                  <option value="3">Al mejor de 3</option>
                  <option value="5">Al mejor de 5</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Nivel Requerido</label>
                <select value={createData.requiredDivision} onChange={e=>setCreateData({...createData, requiredDivision: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3.5 text-white focus:border-brand outline-none appearance-none font-medium">
                  <option value="1">1ª División</option>
                  <option value="2">2ª División</option>
                  <option value="3">3ª División</option>
                  <option value="4">4ª División</option>
                </select>
              </div>
            </div>
            
            <div className="bg-dark-bg border border-dark-border p-4 rounded-xl flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-white block">Sala Privada</label>
                <span className="text-[10px] text-slate-500">Solo usuarios con código</span>
              </div>
              <input type="checkbox" checked={createData.isPrivate} onChange={e=>setCreateData({...createData, isPrivate: e.target.checked})} className="w-5 h-5 accent-brand" />
            </div>
            
            <button type="submit" className="w-full bg-brand text-dark-bg font-bold py-4 rounded-xl shadow-lg hover:bg-brand-hover transition-colors uppercase tracking-wide mt-2">
              Convocar Partido
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'join' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-lg text-center py-12">
          <ShieldAlert size={56} className="text-brand mx-auto mb-4 opacity-70"/>
          <h3 className="text-2xl font-bold text-white mb-2">Código de Inserción</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-[250px] mx-auto">Solicita el código a tu compañero e ingrésalo debajo para sumarte a la pista.</p>
          
          <form onSubmit={handleJoinRoom} className="space-y-5">
            <input 
              type="text" value={joinCode} onChange={(e)=>setJoinCode(e.target.value.toUpperCase())}
              placeholder="PAD-XXX" 
              className="w-full max-w-[220px] mx-auto block bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-4 text-3xl text-center text-brand font-mono font-bold tracking-widest focus:outline-none focus:border-brand uppercase placeholder:text-slate-700 transition-colors"
            />
            {joinError && (
              <motion.p initial={{ opacity: 0}} animate={{ opacity: 1}} className="text-red-400 text-sm bg-red-400/10 py-2 px-4 rounded-lg inline-block">
                {joinError}
              </motion.p>
            )}
            <button type="submit" className="w-full max-w-[220px] mx-auto block bg-slate-700 text-white font-bold px-6 py-4 rounded-xl hover:bg-slate-600 transition-colors mt-4 shadow-md">
              Validar y Entrar
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
