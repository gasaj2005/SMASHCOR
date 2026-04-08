import { useState } from 'react';
import { Calendar, MapPin, Users, HelpCircle } from 'lucide-react';

const CreateRoom = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
    isPrivate: false,
    division: '4',
    subdivision: 'Media',
  });
  
  const [roomCode, setRoomCode] = useState(null);

  const mockSubmit = (e) => {
    e.preventDefault();
    if(formData.isPrivate) {
      setRoomCode('PAD-' + Math.random().toString(36).substring(2, 6).toUpperCase());
    } else {
      setRoomCode('PUBLIC-SUCCESS');
    }
  };

  return (
    <div className="flex flex-col h-full p-5 pt-8 overflow-y-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Organizar Partido</h1>
      <p className="text-sm text-gray-400 mb-6">Crea una sala pública o privada y busca jugadores.</p>

      {roomCode ? (
        <div className="flex flex-col items-center justify-center mt-12 bg-dark-card p-6 rounded-3xl border border-brand/50 shadow-[0_0_30px_rgba(225,255,0,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <h2 className="text-xl font-bold text-white mb-2">¡Sala Creada con Éxito!</h2>
          {formData.isPrivate ? (
            <>
              <p className="text-sm text-gray-400 mb-6 text-center">Comparte este código con tus amigos para que se unan a la sala privada.</p>
              <div className="bg-zinc-900 border-2 border-brand font-mono text-3xl font-bold rounded-2xl py-4 px-8 text-center text-brand mb-6 w-full tracking-widest">
                {roomCode}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 mb-6 text-center">Tu sala es pública y aparecerá en el Matchmaking para jugadores de nivel {formData.division}ª {formData.subdivision}.</p>
          )}
          
          <button 
            className="w-full bg-brand text-zinc-900 font-bold py-3 rounded-xl hover:bg-brand-hover transition"
            onClick={() => setRoomCode(null)}
          >
            Aceptar
          </button>
        </div>
      ) : (
        <form onSubmit={mockSubmit} className="flex flex-col gap-5">
          {/* General info */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-white flex items-center gap-2"><MapPin size={18} className="text-brand"/> Detalles Básicos</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 ml-1">Nombre de la Piel/Sala</label>
                <input type="text" required placeholder="Ej: Pachanga Jueves" className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-400 ml-1">Lugar o Club</label>
                <input type="text" required placeholder="Ej: Padel Madrid Sur" className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 ml-1">Fecha</label>
                  <input type="date" required className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 ml-1">Hora</label>
                  <input type="time" required className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Level Requirements */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2"><Users size={18} className="text-brand"/> Nivel Requerido</h3>
              <HelpCircle size={16} className="text-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 ml-1">División</label>
                <select className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand appearance-none" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})}>
                  <option value="1">1ª División</option>
                  <option value="2">2ª División</option>
                  <option value="3">3ª División</option>
                  <option value="4">4ª División</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 ml-1">Subdivisión</label>
                <select className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand appearance-none" value={formData.subdivision} onChange={e => setFormData({...formData, subdivision: e.target.value})}>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Sala Privada</h3>
              <p className="text-xs text-gray-400 mt-1">Requiere código para unirse</p>
            </div>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, isPrivate: !formData.isPrivate})}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isPrivate ? 'bg-brand' : 'bg-zinc-700'}`}
            >
              <div className={`bg-dark-bg w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${formData.isPrivate ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <button type="submit" className="w-full mt-4 bg-brand text-zinc-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(225,255,0,0.3)] hover:shadow-[0_0_25px_rgba(225,255,0,0.5)] transition duration-200 uppercase tracking-wide">
            Crear Partido
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateRoom;
