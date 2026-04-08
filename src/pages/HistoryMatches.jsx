import { Clock, Trophy } from 'lucide-react';
import { userHistory } from '../data/mockData';

const HistoryMatches = () => {
  return (
    <div className="flex flex-col h-full p-5 pt-8 overflow-y-auto w-full">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Historial de Partidos</h1>
      
      <div className="flex flex-col gap-4">
        {userHistory.map(match => (
           <div key={match.id} className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg relative overflow-hidden">
             
             {match.result.includes('Victoria') && (
               <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-2xl rounded-full"></div>
             )}
             
             <div className="flex items-center gap-3 mb-3">
               <Trophy size={18} className={match.result.includes('Victoria') ? 'text-green-400' : 'text-gray-500'} />
               <span className={`font-bold ${match.result.includes('Victoria') ? 'text-green-400' : 'text-gray-400'}`}>
                 {match.result}
               </span>
             </div>
             
             <div className="flex flex-col gap-1.5 text-sm text-gray-300">
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-brand"/> {match.date}
                </span>
                <span className="text-xs text-gray-500 mt-1">{match.location}</span>
             </div>
           </div>
        ))}
      </div>
      
      {userHistory.length === 0 && (
         <div className="flex-1 flex flex-col items-center justify-center -mt-10">
           <Trophy size={40} className="text-gray-600 mb-4" />
           <p className="text-gray-400 text-sm">Aún no has jugado ningún partido.</p>
         </div>
      )}
    </div>
  );
};

export default HistoryMatches;
