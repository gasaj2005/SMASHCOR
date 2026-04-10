import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Trophy, X, Move } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Definición de las 4 posiciones con sus coordenadas en % (centro del slot)
const COURT_POSITIONS = [
  { id: 'left-top',     label: 'Lado Izq. Arriba',   cx: 25, cy: 15 },
  { id: 'right-top',    label: 'Lado Der. Arriba',    cx: 75, cy: 15 },
  { id: 'left-bottom',  label: 'Lado Izq. Abajo',     cx: 25, cy: 85 },
  { id: 'right-bottom', label: 'Lado Der. Abajo',     cx: 75, cy: 85 },
];

export default function PadelCourtUI({ match }) {
  const { currentUser, updatePlayerPosition } = useAuth();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragOverTarget, setDragOverTarget] = useState(null); // id del slot que está resaltado
  const courtRef = useRef(null);
  const dragDelta = useRef({ x: 0, y: 0 });

  const getPlayerInPosition = useCallback((posId) =>
    match.players.find(p => p.courtPosition === posId), [match.players]);

  const isCurrentUser = useCallback((player) =>
    player && player.id === currentUser?.id, [currentUser]);

  // Calcula sobre qué slot cayó el drag a partir de coordenadas absolutas de pantalla
  const resolveDropZone = (clientX, clientY) => {
    if (!courtRef.current) return null;
    const rect = courtRef.current.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * 100;   // % horizontal
    const py = ((clientY - rect.top) / rect.height) * 100;   // % vertical

    let closest = null;
    let minDist = Infinity;
    COURT_POSITIONS.forEach(pos => {
      const dist = Math.hypot(px - pos.cx, py - pos.cy);
      if (dist < minDist) { minDist = dist; closest = pos.id; }
    });
    return minDist < 30 ? closest : null; // 30% de tolerancia máxima
  };

  const handleDragEnd = (event, info, posId) => {
    setDragging(false);
    setDragOverTarget(null);

    // Calcular posición de suelta con la última posición del puntero
    const clientX = info.point?.x ?? (event.clientX ?? event.changedTouches?.[0]?.clientX);
    const clientY = info.point?.y ?? (event.clientY ?? event.changedTouches?.[0]?.clientY);

    const targetPos = resolveDropZone(clientX, clientY);

    if (targetPos && targetPos !== posId) {
      const occupant = getPlayerInPosition(targetPos);
      if (!occupant) {
        updatePlayerPosition(match.id, targetPos);
      }
    }
  };

  const handleDragUpdate = (event, info) => {
    const clientX = info.point?.x ?? (event.clientX ?? event.changedTouches?.[0]?.clientX);
    const clientY = info.point?.y ?? (event.clientY ?? event.changedTouches?.[0]?.clientY);
    const zone = resolveDropZone(clientX, clientY);
    setDragOverTarget(zone);
  };

  return (
    <div className="flex flex-col items-center mt-2 w-full">
      {/* ── HEADER CÓDIGO DE SALA ── */}
      <div className="bg-dark-card border border-brand/50 rounded-2xl p-4 mb-6 text-center w-full shadow-[0_0_15px_rgba(147,197,114,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl rounded-full pointer-events-none" />
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Código de Pista</h4>
        <div className="text-4xl sm:text-5xl font-black font-mono tracking-[0.15em] text-brand select-all">
          {match.roomCode}
        </div>
        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">Compártelo para que se unan</p>
      </div>

      {/* ── META INFO ── */}
      <div className="flex items-center justify-between w-full mb-4 text-xs text-slate-400">
        <span className="font-bold text-white">{match.name}</span>
        <span className="bg-slate-800 px-2 py-1 rounded font-mono">{match.players.length}/4 jugadores</span>
      </div>

      {/* ── INSTRUCCIÓN DRAG (solo para el usuario actual) ── */}
      {match.players.some(p => p.id === currentUser?.id) && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3 bg-dark-card border border-dark-border px-3 py-1.5 rounded-full">
          <Move size={12} className="text-brand" />
          Arrastra tu avatar para cambiar de posición
        </div>
      )}

      {/* ── PISTA CENITAL ── */}
      <div
        ref={courtRef}
        className="relative w-full max-w-[280px] aspect-[1/2] bg-[#1a4a38] border-[12px] border-slate-800 rounded-sm shadow-2xl select-none"
      >
        {/* CRISTAL / PAREDES (fondo) */}
        <div className="absolute inset-0 rounded-[2px]"
          style={{ background: 'linear-gradient(180deg, #1e5a41 0%, #1a4a38 50%, #1e5a41 100%)' }}
        />

        {/* EXTERIOR LINES */}
        <div className="absolute inset-1 border-2 border-white/80 rounded-[2px] pointer-events-none" />

        {/* RED */}
        <div className="absolute top-1/2 left-0 right-0 h-[5px] -mt-[2.5px] pointer-events-none z-[1]"
          style={{ background: 'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 3px, transparent 3px, transparent 8px)' }}
        />
        {/* Postes de la red */}
        <div className="absolute top-1/2 left-0 w-2 h-4 bg-white -mt-2 z-[2]" />
        <div className="absolute top-1/2 right-0 w-2 h-4 bg-white -mt-2 z-[2]" />

        {/* LÍNEAS DE SAQUE */}
        <div className="absolute top-[25%] left-1 right-1 h-px bg-white/60 pointer-events-none" />
        <div className="absolute bottom-[25%] left-1 right-1 h-px bg-white/60 pointer-events-none" />
        {/* Línea central de saque */}
        <div className="absolute top-[25%] bottom-[25%] left-1/2 w-px -ml-px bg-white/60 pointer-events-none" />

        {/* ── SLOTS / JUGADORES ── */}
        {COURT_POSITIONS.map(pos => {
          const player = getPlayerInPosition(pos.id);
          const isEmpty = !player;
          const isMe = isCurrentUser(player);
          const isDropTarget = dragOverTarget === pos.id && isEmpty;

          const slotStyle = {
            position: 'absolute',
            left: `${pos.cx}%`,
            top: `${pos.cy}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: isMe ? 20 : 10,
          };

          return (
            <div key={pos.id} style={slotStyle}>
              {isEmpty ? (
                /* SLOT VACÍO — zona de caída */
                <motion.div
                  animate={isDropTarget
                    ? { scale: 1.25, borderColor: 'rgba(163,230,53,0.9)', backgroundColor: 'rgba(163,230,53,0.15)' }
                    : { scale: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.04)' }
                  }
                  transition={{ duration: 0.15 }}
                  className="w-12 h-12 rounded-full border-[3px] border-dashed flex items-center justify-center text-white/50 shadow-sm"
                >
                  {isDropTarget
                    ? <div className="w-3 h-3 rounded-full bg-brand animate-ping" />
                    : <Plus size={18} />
                  }
                </motion.div>
              ) : isMe ? (
                /* MI AVATAR — arrastrable */
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0.1}
                  onDragStart={() => { setDragging(true); dragDelta.current = { x: 0, y: 0 }; }}
                  onDrag={handleDragUpdate}
                  onDragEnd={(e, info) => handleDragEnd(e, info, pos.id)}
                  // Vuelve a su posición cuando se suelta (la posición real la actualiza el contexto)
                  animate={{ x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  whileDrag={{ scale: 1.2, cursor: 'grabbing', zIndex: 50 }}
                  onClick={() => { if (!dragging) setSelectedPlayer(player); }}
                  className="relative cursor-grab active:cursor-grabbing focus:outline-none touch-none"
                >
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-12 h-12 rounded-full border-[3px] border-brand shadow-[0_0_12px_rgba(163,230,53,0.6)] object-cover bg-slate-900 pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-brand text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
                    Tú
                  </div>
                </motion.div>
              ) : (
                /* AVATAR DE OTRO JUGADOR — solo tappable */
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelectedPlayer(player)}
                  className="relative focus:outline-none"
                >
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-12 h-12 rounded-full border-[3px] border-white shadow-[0_5px_15px_rgba(0,0,0,0.5)] object-cover bg-slate-900"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-slate-600">
                    {player.division}ª
                  </div>
                </motion.button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── MODAL DE JUGADOR ── */}
      <AnimatePresence>
        {selectedPlayer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedPlayer(null)}
            />
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="bg-dark-card border border-dark-border w-full max-w-sm rounded-[2rem] overflow-hidden z-10 shadow-2xl relative"
            >
              {/* Banda decorativa */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-brand/15 to-transparent pointer-events-none" />

              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-full backdrop-blur-sm transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="pt-10 pb-4 px-6 flex flex-col items-center relative">
                <img
                  src={selectedPlayer.avatar}
                  className="w-24 h-24 rounded-full border-4 border-dark-card shadow-xl object-cover mb-3 bg-slate-900"
                  alt={selectedPlayer.name}
                />
                <h3 className="text-2xl font-black text-white mb-0.5 tracking-tight text-center">{selectedPlayer.name}</h3>
                <p className="text-slate-500 text-sm mb-5 text-center">@{selectedPlayer.username || '—'}</p>

                <div className="flex gap-3 w-full">
                  <StatCard icon={Trophy} label="Nivel" value={`${selectedPlayer.division}ª ${selectedPlayer.subdivision}`} />
                  <StatCard icon={User} label="Perfil" value={`${selectedPlayer.age ?? '?'}a · ${selectedPlayer.gender === 'M' ? 'Hombre' : 'Mujer'}`} />
                </div>
              </div>

              <div className="px-6 pb-8 pt-2">
                <p className="text-sm text-slate-300 italic text-center leading-relaxed">
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

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex-1 bg-dark-bg border border-dark-border rounded-2xl p-4 flex flex-col items-center shadow-inner">
      <Icon size={18} className="text-brand mb-2" />
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
      <span className="text-sm font-black text-white mt-1 text-center">{value}</span>
    </div>
  );
}
