import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { mockRooms } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PadelCourtUI from '../components/PadelCourtUI';

export default function Play() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('organize'); // organize | my_matches
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [roomData, setRoomData] = useState({
    name: 'Partido Amistoso', location: 'Club Padel Madrid', datetime: '',
    durationSets: 3, requiredDivision: 4, requiredSubdivision: 'Media', isPrivate: false
  });

  const [joinCode, setJoinCode] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    alert('Sala creada! (Mock)');
  };

  const handleJoinRoom = () => {
    alert(joinCode ? 'Uniéndose a sala... (Mock)' : 'Por favor ingresa un código.');
  };

  return (
    <div className="p-4">
      <div className="flex bg-dark-card rounded-xl p-1 mb-6 border border-dark-border">
        <button
          onClick={() => setActiveTab('organize')}
          className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'organize' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Matchmaking
        </button>
        <button
          onClick={() => setActiveTab('my_matches')}
          className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'my_matches' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Mis Partidos
        </button>
      </div>

      {activeTab === 'organize' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Unirse a partida</h3>
            <div className="flex gap-2">
              <input 
                type="text" value={joinCode} onChange={(e)=>setJoinCode(e.target.value.toUpperCase())}
                placeholder="Código (ej. PAD-1234)" 
                className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand uppercase"
              />
              <button onClick={handleJoinRoom} className="bg-brand text-dark-bg font-bold px-6 py-3 rounded-xl hover:bg-brand-hover">Unirse</button>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Crear Sala</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <input type="text" value={roomData.name} onChange={e=>setRoomData({...roomData, name: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:border-brand outline-none" placeholder="Nombre de la sala" />
              <input type="text" value={roomData.location} onChange={e=>setRoomData({...roomData, location: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:border-brand outline-none" placeholder="Lugar (Ej. Pista 3 Club Centro)" />
              <input type="datetime-local" value={roomData.datetime} onChange={e=>setRoomData({...roomData, datetime: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:border-brand outline-none" />
              
              <div className="flex items-center gap-4">
                <label className="text-slate-400 text-sm">Privada?</label>
                <input type="checkbox" checked={roomData.isPrivate} onChange={e=>setRoomData({...roomData, isPrivate: e.target.checked})} className="w-5 h-5 accent-brand" />
              </div>
              <button type="submit" className="w-full bg-brand text-dark-bg font-bold py-4 rounded-xl mt-4">Crear Sala de Juego</button>
            </form>
          </div>
        </motion.div>
      )}

      {activeTab === 'my_matches' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-4">
          <h2 className="text-xl font-bold text-white mb-2">Próximo Partido</h2>
          {mockRooms.length > 0 && (
            <div className="bg-dark-card border-2 border-brand/40 p-4 rounded-2xl mb-8 relative shadow-[0_0_15px_rgba(147,197,114,0.1)]">
              <div className="absolute top-0 right-0 bg-brand text-dark-bg font-bold px-3 py-1 text-xs rounded-tr-xl rounded-bl-xl">Nivel {mockRooms[0].requiredDivision} {mockRooms[0].requiredSubdivision}</div>
              <h3 className="text-lg font-bold text-white mb-2">{mockRooms[0].name}</h3>
              <div className="text-sm text-slate-400 space-y-2 mb-4">
                <p className="flex items-center gap-2"><MapPin size={16} className="text-brand"/> {mockRooms[0].location}</p>
                <p className="flex items-center gap-2"><Calendar size={16} className="text-brand"/> {format(new Date(mockRooms[0].datetime), "EEEE d 'de' MMMM", { locale: es })}</p>
                <p className="flex items-center gap-2"><Clock size={16} className="text-brand"/> {format(new Date(mockRooms[0].datetime), "HH:mm")} hs</p>
              </div>

              <div className="pt-4 border-t border-dark-border mt-4">
                <p className="text-center text-xs text-slate-500 mb-4 font-bold tracking-widest uppercase">Vista de Pista</p>
                <PadelCourtUI match={mockRooms[0]} onPlayerClick={setSelectedPlayer}/>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Modal/Tooltip de info del jugador */}
      <AnimatePresence>
        {selectedPlayer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setSelectedPlayer(null)}
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-24 left-4 right-4 bg-dark-card border border-dark-border p-6 rounded-2xl z-50 shadow-2xl"
            >
              <div className="flex gap-4 items-center">
                <img src={selectedPlayer.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-brand" />
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedPlayer.name}</h3>
                  <p className="text-brand font-medium">Nivel {selectedPlayer.division} - {selectedPlayer.subdivision}</p>
                  <p className="text-slate-400 text-sm mt-1">{selectedPlayer.age} años • {selectedPlayer.gender === 'M' ? 'Hombre' : 'Mujer'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlayer(null)}
                className="w-full mt-6 bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
