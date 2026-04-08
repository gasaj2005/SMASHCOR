import { useState } from 'react';
import { motion } from 'framer-motion';
import { leaderboardData } from '../data/mockData';
import { Trophy, Medal, Star } from 'lucide-react';

export default function Leaderboard() {
  const [filter, setFilter] = useState('4');

  const filteredData = leaderboardData.filter(user => user.division.toString() === filter);

  return (
    <div className="p-4 flex flex-col h-full bg-dark-bg">
      <h2 className="text-2xl font-bold text-white mb-4">Top Globales</h2>

      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
        {['1', '2', '3', '4'].map((div) => (
          <button
            key={div}
            onClick={() => setFilter(div)}
            className={`whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-colors border ${
              filter === div
                ? 'bg-brand text-dark-bg border-brand'
                : 'bg-dark-card text-slate-300 border-dark-border hover:bg-slate-800'
            }`}
          >
            {div}ª División
          </button>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-4 text-xs text-slate-400">
        <p className="mb-1"><span className="text-brand font-bold">Victoria:</span> +10 pts (base)</p>
        <p className="mb-1"><span className="text-yellow-400 font-bold">Reñida (≤5 juegos diff):</span> +25 pts</p>
        <p><span className="text-red-400 font-bold">Rosco (set a 0):</span> +35 pts</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {filteredData.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center p-4 mb-3 rounded-2xl border ${
              index < 3 ? 'border-brand/30 bg-slate-800/80 mt-2' : 'border-dark-border bg-dark-card'
            }`}
          >
            <div className="w-8 shrink-0 flex justify-center text-xl font-bold">
              {index === 0 ? <Trophy className="text-yellow-400" /> : index === 1 ? <Medal className="text-slate-300" /> : index === 2 ? <Medal className="text-amber-600" /> : <span className="text-slate-500">{index + 1}</span>}
            </div>

            <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full mx-4 border-2 border-dark-border" />
            
            <div className="flex-1">
              <h3 className="font-bold text-white text-base">{user.name}</h3>
              <p className="text-xs text-slate-400">Nivel {user.division} - {user.subdivision}</p>
            </div>

            <div className="flex items-center gap-1 text-brand font-bold text-lg">
              {user.points} <Star size={16} className="fill-brand" />
            </div>
          </motion.div>
        ))}
        {filteredData.length === 0 && (
          <p className="text-center text-slate-500 mt-10">No hay jugadores en esta categoría.</p>
        )}
      </div>
    </div>
  );
}
