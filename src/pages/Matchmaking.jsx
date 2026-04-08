import { useState } from 'react';
import { Search, Flame, KeyRound, MapPin, Clock } from 'lucide-react';
import { currentUser, mockRooms } from '../data/mockData';

// Utilidad simple de validación de nivel
const checkLevelMatch = (userDiv, userSub, roomDiv, roomSub) => {
  if (userDiv.toString() !== roomDiv.toString()) return false;
  
  const subs = ['Baja', 'Media', 'Alta'];
  const uIndex = subs.indexOf(userSub);
  const rIndex = subs.indexOf(roomSub);
  
  // Condición: Match si es igual o inmediatamente superior
  // Ejemplo: User Media (1). Room Media (1) o Alta (2) -> válido.
  // User Alta (2). Room Alta (2) -> válido.
  return (rIndex === uIndex || rIndex === uIndex + 1);
};

const Matchmaking = () => {
  const [searchMode, setSearchMode] = useState('matchmaking'); // 'matchmaking' | 'code'
  const [codeInput, setCodeInput] = useState('');
  const [matchedRooms, setMatchedRooms] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const runMatchmaking = () => {
    // Filtramos salas publicas con reglas de nivel
    const found = mockRooms.filter(room => {
      // Si la sala es privada o está llena, ignoramos (max 4). Asumimos 4 es lleno.
      if (room.isPrivate) return false;
      if (room.players.length >= 4) return false;
      
      return checkLevelMatch(currentUser.division, currentUser.subdivision, room.requiredDivision, room.requiredSubdivision);
    });
    setMatchedRooms(found);
    setHasSearched(true);
  };

  const handleCodeJoin = (e) => {
    e.preventDefault();
    // Simular unirse vía código
    alert(`Uniéndose a sala con código: ${codeInput}`);
  };

  return (
    <div className="flex flex-col h-full p-5 pt-8 overflow-y-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Encontrar Partido</h1>

      {/* Tabs Selector */}
      <div className="flex bg-dark-card border border-dark-border rounded-xl p-1 mb-6 relative">
        <div 
           className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-800 rounded-lg shadow-sm transition-transform duration-300 ease-out`}
           style={{ transform: searchMode === 'code' ? 'translateX(100%)' : 'translateX(0)' }}
        ></div>
        <button 
          onClick={() => {setSearchMode('matchmaking'); setHasSearched(false);}} 
          className={`flex-1 py-2 text-sm font-semibold z-10 transition-colors ${searchMode === 'matchmaking' ? 'text-brand' : 'text-gray-400'}`}
        >
          Matchmaking
        </button>
        <button 
          onClick={() => setSearchMode('code')} 
          className={`flex-1 py-2 text-sm font-semibold z-10 transition-colors ${searchMode === 'code' ? 'text-brand' : 'text-gray-400'}`}
        >
          Código de Sala
        </button>
      </div>

      {searchMode === 'matchmaking' ? (
        <div className="flex-1 flex flex-col items-center">
          {!hasSearched ? (
            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
               <div className="w-32 h-32 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center p-4 mb-6 relative">
                 <div className="absolute inset-0 bg-brand/5 blur-xl rounded-full"></div>
                 <Flame size={48} className="text-brand z-10" />
               </div>
               <h3 className="text-xl font-bold text-white text-center mb-2">Algoritmo de Nivel</h3>
               <p className="text-gray-400 text-sm text-center mb-8 px-4">
                 Buscaremos salas de <b>{currentUser.division}ª {currentUser.subdivision}</b> o inmediatamente superior según tu perfil.
               </p>
               <button 
                  onClick={runMatchmaking}
                  className="bg-brand text-zinc-900 font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(225,255,0,0.3)] hover:scale-105 transition transform flex items-center gap-2"
                >
                 <Search size={20} />
                 Buscar Ahora
               </button>
            </div>
          ) : (
            <div className="w-full flex-1">
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">{matchedRooms.length} salas encontradas</span>
                <button onClick={() => setHasSearched(false)} className="text-xs text-brand hover:underline">Volver</button>
              </div>

              {matchedRooms.length > 0 ? (
                <div className="flex flex-col gap-4 pb-10">
                  {matchedRooms.map(room => (
                    <div key={room.id} className="bg-dark-card border border-dark-border rounded-2xl p-4 shadow-lg hover:border-brand/40 transition">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-white text-lg">{room.name}</h4>
                        <span className="bg-zinc-800 text-xs px-2 py-1 rounded text-gray-300 font-mono font-bold">
                           {room.players.length}/4
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-brand"/> {room.location}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand"/> {new Date(room.datetime).toLocaleString()}</span>
                        <span className="flex items-center gap-1.5 text-white bg-zinc-800 self-start px-2 py-1 flex items-center rounded mt-1">
                          Nivel Requerido: <b className="ml-1 text-brand">{room.requiredDivision}ª {room.requiredSubdivision}</b>
                        </span>
                      </div>

                      <button className="w-full bg-zinc-800 border border-zinc-700 text-white font-bold py-2.5 rounded-xl hover:bg-brand hover:text-zinc-900 hover:border-brand transition">
                        Unirse a la Sala
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center mt-20 p-8 text-center bg-dark-card border border-dark-border rounded-3xl">
                  <Flame size={40} className="text-gray-600 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Sin partidos</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    No hay salas públicas a las que puedas unirte ahora mismo con tu nivel ({currentUser.division}ª {currentUser.subdivision}).
                  </p>
                  <button onClick={() => window.location.href='/organize'} className="text-brand font-medium text-sm border-b border-brand pb-0.5">
                    ¡Anímate y crea tú una!
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 -mt-10 px-4">
           <div className="bg-dark-card border border-dark-border rounded-2xl w-full p-6 shadow-xl">
              <div className="flex items-center justify-center mb-6 text-brand">
                 <KeyRound size={40} className="drop-shadow-[0_0_8px_rgba(225,255,0,0.5)]" />
              </div>
              <h2 className="text-xl font-bold text-center text-white mb-2">Ingresa tu Código</h2>
              <p className="text-xs text-center text-gray-400 mb-6">Escribe el código alfanumérico que te ha compartido el anfitrión.</p>
              
              <form onSubmit={handleCodeJoin} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="PAD-XXXX"
                  className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-brand text-center text-2xl font-mono text-white tracking-widest py-4 rounded-xl outline-none transition uppercase"
                  required
                />
                <button type="submit" className="w-full bg-zinc-200 text-zinc-900 font-bold py-3.5 rounded-xl hover:bg-white transition mt-2">
                  Entrar a Sala
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Matchmaking;
