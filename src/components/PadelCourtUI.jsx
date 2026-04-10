import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Trophy, X } from 'lucide-react';

export default function PadelCourtUI({ match }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const getPlayerInPosition = (pos) => {
    return match.players.find(p => p.courtPosition === pos);
  };

  const positions = [
    { id: 'left-top', label: 'T1 - Reves/Drive', style: { top: '15%', left: '25%' } },
    { id: 'right-top', label: 'T1 - Revés/Drive', style: { top: '15%', left: '75%' } },
    { id: 'left-bottom', label: 'T2 - Revés/Drive', style: { top: '85%', left: '25%' } },
    { id: 'right-bottom', label: 'T2 - Revés/Drive', style: { top: '85%', left: '75%' } },
  ];

  return (
    <div className="flex flex-col items-center mt-2">
      {/* HEADER DE SALA IMPORTANT */}
      <div className="bg-dark-card border border-brand/50 rounded-2xl p-4 mb-6 text-center w-full shadow-[0_0_15px_rgba(147,197,114,0.15)] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl rounded-full"></div>
         <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Código de Pista</h4>
         <div className="text-4xl sm:text-5xl font-black font-mono tracking-[0.15em] text-brand select-all">{match.roomCode}</div>
         <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">Compártelo con tus amigos</p>
      </div>

      {/* PISTA CENITAL */}
      <div className="relative w-full max-w-[280px] aspect-[1/2] bg-[#1a4a38] border-[12px] border-slate-800 rounded-sm p-2 shadow-2xl">
        
        {/* EXTERIOR LINES */}
        <div className="absolute inset-1 border-2 border-white/80 rounded-[2px] pointer-events-none"></div>
        
        {/* RED (NET) */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 -mt-[3px] bg-slate-300 shadow-sm pointer-events-none z-0 flex items-center justify-center overflow-hidden">
           {/* Tramado de la red */}
           <div className="w-full h-[1px] bg-black/20"></div>
        </div>
        <div className="absolute top-1/2 left-0 w-1.5 h-3 bg-white -mt-1.5"></div>
        <div className="absolute top-1/2 right-0 w-1.5 h-3 bg-white -mt-1.5"></div>
        
        {/* LINEAS DE SAQUE (SERVICE LINES) */}
        <div className="absolute top-[25%] left-1 right-1 h-0.5 bg-white/70 pointer-events-none z-0"></div>
        <div className="absolute bottom-[25%] left-1 right-1 h-0.5 bg-white/70 pointer-events-none z-0"></div>
        
        {/* LINEA CENTRAL DE SAQUE */}
        <div className="absolute top-[25%] bottom-[25%] left-1/2 w-0.5 -ml-px bg-white/70 pointer-events-none z-0"></div>

        {/* JUGADORES */}
        {positions.map(pos => {
          const player = getPlayerInPosition(pos.id);
          
          return (
            <div key={pos.id} className="absolute -ml-6 -mt-6 z-10" style={pos.style}>
              {player ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedPlayer(player)}
                  className="relative group focus:outline-none"
                >
                  <img 
                    src={player.avatar} 
                    alt={player.name} 
                    className="w-12 h-12 rounded-full border-[3px] border-white shadow-[0_5px_15px_rgba(0,0,0,0.5)] object-cover bg-slate-900"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-brand text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    {player.division}ª {player.subdivision[0]}
                  </div>
                </motion.button>
              ) : (
                <div
                  className="w-12 h-12 rounded-full border-[3px] border-dashed border-white/40 bg-white/5 flex items-center justify-center text-white/60 cursor-default shadow-sm"
                >
                  <Plus size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL DE JUGADOR */}
      <AnimatePresence>
        {selectedPlayer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedPlayer(null)}
            />
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              className="bg-dark-card border border-dark-border w-full max-w-sm rounded-[2rem] overflow-hidden z-10 shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-24 bg-brand/10"></div>
              <div className="pt-8 pb-4 px-6 flex flex-col items-center relative">
                <button 
                  onClick={() => setSelectedPlayer(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={16}/>
                </button>
                <img 
                  src={selectedPlayer.avatar} 
                  className="w-24 h-24 rounded-full border-4 border-dark-card shadow-xl object-cover mb-4 bg-slate-900" 
                  alt={selectedPlayer.name}
                />
                <h3 className="text-2xl font-bold text-white mb-1 tracking-tight text-center">{selectedPlayer.name}</h3>
                <p className="text-slate-400 text-sm font-medium mb-6 text-center">@{selectedPlayer.username}</p>
                
                <div className="flex gap-3 w-full">
                  <div className="flex-1 bg-dark-bg border border-dark-border rounded-2xl p-4 flex flex-col items-center shadow-inner">
                    <Trophy size={18} className="text-brand mb-2"/>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nivel</span>
                    <span className="text-sm font-black text-white mt-1">{selectedPlayer.division}ª {selectedPlayer.subdivision}</span>
                  </div>
                  <div className="flex-1 bg-dark-bg border border-dark-border rounded-2xl p-4 flex flex-col items-center shadow-inner">
                    <User size={18} className="text-brand mb-2"/>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Perfil</span>
                    <span className="text-sm font-black text-white mt-1">{selectedPlayer.age}a • {selectedPlayer.gender === 'M' ? 'H' : 'M'}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-8 pt-2">
                <p className="text-sm text-slate-300 italic text-center leading-relaxed font-medium">
                  "{selectedPlayer.bio || 'Preparado para darlo todo en la pista.'}"
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
