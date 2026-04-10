import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Trophy, X, Move } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COURT_POSITIONS = [
  { id: 'left-top',     cx: 25, cy: 15 },
  { id: 'right-top',   cx: 75, cy: 15 },
  { id: 'left-bottom',  cx: 25, cy: 85 },
  { id: 'right-bottom', cx: 75, cy: 85 },
];

export default function PadelCourtUI({ match }) {
  const { currentUser, updatePlayerPosition } = useAuth();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [dragHappened, setDragHappened] = useState(false);
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const courtRef = useRef(null);

  // Garantías de seguridad: si match o players son undefined no crashea
  const players = Array.isArray(match?.players) ? match.players : [];
  const roomId   = match?.id;
  const roomCode = match?.roomCode ?? '—';

  const getPlayerInPosition = useCallback(
    (posId) => players.find(p => p.courtPosition === posId),
    [players]
  );

  const isCurrentUser = useCallback(
    (player) => player && currentUser && player.id === currentUser.id,
    [currentUser]
  );

  // Calcula qué slot queda más cerca del punto de suelta (coordenadas % relativas al court)
  const resolveDropZone = (clientX, clientY) => {
    if (!courtRef.current) return null;
    const rect = courtRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const px = ((clientX - rect.left) / rect.width) * 100;
    const py = ((clientY - rect.top) / rect.height) * 100;

    let closest = null;
    let minDist = Infinity;
    COURT_POSITIONS.forEach(pos => {
      const d = Math.hypot(px - pos.cx, py - pos.cy);
      if (d < minDist) { minDist = d; closest = pos.id; }
    });
    return minDist < 35 ? closest : null;
  };

  const handleDragStart = () => {
    setDragHappened(false);
  };

  const handleDrag = (event, info) => {
    setDragHappened(true);
    // info.point puede faltar en algunos navegadores, usar fallback nativo
    const clientX = info?.point?.x ?? event?.clientX ?? event?.changedTouches?.[0]?.clientX;
    const clientY = info?.point?.y ?? event?.clientY ?? event?.changedTouches?.[0]?.clientY;
    if (clientX == null || clientY == null) return;
    const zone = resolveDropZone(clientX, clientY);
    setDragOverTarget(zone);
  };

  const handleDragEnd = (event, info, currentPosId) => {
    setDragOverTarget(null);
    const moved = dragHappened;
    setDragHappened(false);

    if (!moved) return; // fue un tap, no un drag

    const clientX = info?.point?.x ?? event?.clientX ?? event?.changedTouches?.[0]?.clientX;
    const clientY = info?.point?.y ?? event?.clientY ?? event?.changedTouches?.[0]?.clientY;
    if (clientX == null || clientY == null) return;

    const targetPos = resolveDropZone(clientX, clientY);
    if (targetPos && targetPos !== currentPosId) {
      const occupant = getPlayerInPosition(targetPos);
      if (!occupant) {
        updatePlayerPosition(roomId, targetPos);
      }
    }
  };

  const handleAvatarClick = (player) => {
    if (!dragHappened) {
      setSelectedPlayer(player);
    }
  };

  if (!match) {
    return (
      <div className="text-center text-slate-400 py-10">
        No se pudo cargar la sala.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-2 w-full">

      {/* ── HEADER CÓDIGO ── */}
      <div className="bg-dark-card border border-brand/50 rounded-2xl p-4 mb-5 text-center w-full shadow-[0_0_15px_rgba(147,197,114,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-brand/10 blur-3xl rounded-full pointer-events-none" />
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Código de Pista</p>
        <div className="text-4xl sm:text-5xl font-black font-mono tracking-[0.15em] text-brand select-all">{roomCode}</div>
        <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest">Compártelo para que se unan</p>
      </div>

      {/* ── META INFO ── */}
      <div className="flex items-center justify-between w-full mb-3 text-xs text-slate-400">
        <span className="font-bold text-white truncate max-w-[60%]">{match.name ?? 'Sala sin nombre'}</span>
        <span className="bg-slate-800 px-2 py-1 rounded font-mono shrink-0">{players.length}/4</span>
      </div>

      {/* ── PISTA ── */}
      {currentUser && players.some(p => p.id === currentUser.id) && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3 bg-dark-card border border-dark-border px-3 py-1.5 rounded-full">
          <Move size={12} className="text-brand" />
          Arrastra tu avatar para cambiar posición
        </div>
      )}

      <div
        ref={courtRef}
        className="relative w-full max-w-[280px] aspect-[1/2] border-[12px] border-slate-800 rounded-sm shadow-2xl select-none overflow-visible"
        style={{ background: 'linear-gradient(180deg, #1e5a41 0%, #1a4a38 50%, #1e5a41 100%)' }}
      >
        {/* Línea perimetral */}
        <div className="absolute inset-1 border-2 border-white/80 rounded-[2px] pointer-events-none" />

        {/* Red */}
        <div
          className="absolute top-1/2 left-0 right-0 h-[5px] -mt-[2.5px] pointer-events-none z-[1]"
          style={{ background: 'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 3px, transparent 3px, transparent 8px)' }}
        />
        <div className="absolute top-1/2 left-0 w-2 h-4 bg-white -mt-2 z-[2]" />
        <div className="absolute top-1/2 right-0 w-2 h-4 bg-white -mt-2 z-[2]" />

        {/* Líneas de saque */}
        <div className="absolute top-[25%] left-1 right-1 h-px bg-white/60 pointer-events-none" />
        <div className="absolute bottom-[25%] left-1 right-1 h-px bg-white/60 pointer-events-none" />
        <div className="absolute top-[25%] bottom-[25%] left-1/2 w-px -ml-px bg-white/60 pointer-events-none" />

        {/* ── SLOTS ── */}
        {COURT_POSITIONS.map(pos => {
          const player     = getPlayerInPosition(pos.id);
          const isEmpty    = !player;
          const isMe       = isCurrentUser(player);
          const isTarget   = dragOverTarget === pos.id && isEmpty;

          return (
            <div
              key={pos.id}
              style={{
                position: 'absolute',
                left: `${pos.cx}%`,
                top: `${pos.cy}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isMe ? 20 : 10,
              }}
            >
              {isEmpty ? (
                <motion.div
                  animate={isTarget
                    ? { scale: 1.3, borderColor: 'rgba(163,230,53,0.9)', backgroundColor: 'rgba(163,230,53,0.15)' }
                    : { scale: 1,   borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.04)' }
                  }
                  transition={{ duration: 0.12 }}
                  className="w-12 h-12 rounded-full border-[3px] border-dashed flex items-center justify-center text-white/50"
                >
                  {isTarget
                    ? <div className="w-3 h-3 rounded-full bg-brand animate-ping" />
                    : <Plus size={18} />
                  }
                </motion.div>
              ) : isMe ? (
                /* MI AVATAR — arrastrable */
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0.08}
                  onDragStart={handleDragStart}
                  onDrag={(e, info) => handleDrag(e, info)}
                  onDragEnd={(e, info) => handleDragEnd(e, info, pos.id)}
                  animate={{ x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  whileDrag={{ scale: 1.25, zIndex: 50 }}
                  onClick={() => handleAvatarClick(player)}
                  className="relative cursor-grab active:cursor-grabbing touch-none focus:outline-none"
                >
                  <img
                    src={player.avatar}
                    alt={player.name ?? 'Yo'}
                    className="w-12 h-12 rounded-full border-[3px] border-brand shadow-[0_0_12px_rgba(163,230,53,0.6)] object-cover bg-slate-900 pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-brand text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow pointer-events-none">
                    Tú
                  </div>
                </motion.div>
              ) : (
                /* OTROS JUGADORES — solo tap */
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelectedPlayer(player)}
                  className="relative focus:outline-none"
                >
                  <img
                    src={player.avatar}
                    alt={player.name ?? 'Jugador'}
                    className="w-12 h-12 rounded-full border-[3px] border-white shadow-[0_5px_15px_rgba(0,0,0,0.5)] object-cover bg-slate-900"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow border border-slate-600">
                    {player.division ?? '?'}ª
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
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-dark-card border border-dark-border w-full max-w-sm rounded-[2rem] overflow-hidden z-10 shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-brand/15 to-transparent pointer-events-none" />
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-full transition-colors z-10"
              >
                <X size={16} />
              </button>
              <div className="pt-10 pb-4 px-6 flex flex-col items-center relative">
                <img
                  src={selectedPlayer.avatar}
                  className="w-24 h-24 rounded-full border-4 border-dark-card shadow-xl object-cover mb-3 bg-slate-900"
                  alt={selectedPlayer.name}
                />
                <h3 className="text-2xl font-black text-white mb-0.5 tracking-tight text-center">{selectedPlayer.name ?? '—'}</h3>
                <p className="text-slate-500 text-sm mb-5 text-center">@{selectedPlayer.username ?? '—'}</p>
                <div className="flex gap-3 w-full">
                  <StatCard icon={Trophy} label="Nivel" value={`${selectedPlayer.division ?? '?'}ª ${selectedPlayer.subdivision ?? ''}`} />
                  <StatCard icon={User}   label="Perfil" value={`${selectedPlayer.age ?? '?'}a · ${selectedPlayer.gender === 'M' ? 'Hombre' : 'Mujer'}`} />
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
