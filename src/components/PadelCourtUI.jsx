import { motion } from 'framer-motion';

export default function PadelCourtUI({ match, onPlayerClick }) {
  // Posiciones base en la pista
  const positions = {
    'left-top': { top: '20%', left: '25%' },     // Jugador 1 pareja A
    'left-bottom': { top: '80%', left: '25%' },  // Jugador 2 pareja A
    'right-top': { top: '20%', left: '75%' },    // Jugador 1 pareja B
    'right-bottom': { top: '80%', left: '75%' }, // Jugador 2 pareja B
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[1/2] sm:aspect-[4/5] bg-sky-600 rounded-lg p-2 overflow-hidden shadow-2xl">
      {/* Pista base */}
      <div className="absolute inset-2 border-2 border-white/70 rounded-sm pointer-events-none"></div>
      
      {/* Línea central (Red) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-1.5 -ml-[3px] bg-white/90 shadow-sm pointer-events-none"></div>
      
      {/* Líneas de servicio (T) */}
      <div className="absolute top-1/4 bottom-1/4 left-[30%] w-0.5 bg-white/70 pointer-events-none"></div>
      <div className="absolute top-1/4 bottom-1/4 right-[30%] w-0.5 bg-white/70 pointer-events-none"></div>
      
      <div className="absolute top-1/4 left-[30%] right-[30%] h-0.5 bg-white/70 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-[30%] right-[30%] h-0.5 bg-white/70 pointer-events-none"></div>

      <div className="absolute left-[30%] w-[40%] top-1/2 h-0.5 bg-white/70 -mt-px pointer-events-none text-white/50 z-0"></div>

      {/* Jugadores */}
      {match.players.map((player) => {
        const pos = positions[player.courtPosition] || { top: '50%', left: '50%' };
        return (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            key={player.id}
            onClick={() => onPlayerClick(player)}
            className="absolute -ml-6 -mt-6 z-10 focus:outline-none"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="relative">
              <img 
                src={player.avatar} 
                alt={player.name} 
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg bg-dark-bg"
              />
              <div className="absolute -bottom-2 -right-2 bg-brand text-dark-bg text-[10px] font-bold px-1.5 rounded-md shadow">
                N.{player.division}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
