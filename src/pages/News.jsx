import { motion } from 'framer-motion';
import { newsFeed } from '../data/mockData';
import { Smartphone, Newspaper, Flame, Info } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function News() {
  const getIconForType = (type) => {
    switch (type) {
      case 'app_update': return <Smartphone className="text-blue-400" size={24} />;
      case 'padel_news': return <Newspaper className="text-brand" size={24} />;
      case 'community': return <Flame className="text-orange-400" size={24} />;
      default: return <Info className="text-slate-400" size={24} />;
    }
  };

  const getBadgeForType = (type) => {
    switch (type) {
      case 'app_update': return <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">SmashCor</span>;
      case 'padel_news': return <span className="text-[10px] uppercase font-bold tracking-wider text-brand bg-brand/10 px-2 py-1 rounded-md">Pádel Global</span>;
      case 'community': return <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md">Comunidad</span>;
      default: return null;
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">Tu Feed Inicial</h2>
      
      {newsFeed.map((news, index) => (
        <motion.div
          key={news.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-800/50 rounded-full shrink-0 mt-1">
              {getIconForType(news.type)}
            </div>
            <div className="flex-1">
              <div className="mb-2">
                {getBadgeForType(news.type)}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-tight">{news.title}</h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {news.content}
              </p>
              <div className="text-xs text-slate-500 font-medium border-t border-dark-border pt-3">
                {format(new Date(news.date), "d 'de' MMMM, HH:mm", { locale: es })}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
