import { motion } from 'framer-motion';
import { newsFeed } from '../data/mockData';
import { Info, Zap, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function News() {
  const getIconForType = (type) => {
    switch (type) {
      case 'system': return <Info className="text-blue-400" size={24} />;
      case 'ai_achievement': return <Zap className="text-yellow-400" size={24} />;
      case 'ai_stats': return <TrendingUp className="text-brand" size={24} />;
      default: return <Info className="text-slate-400" size={24} />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Novedades</h2>
      
      {newsFeed.map((news, index) => (
        <motion.div
          key={news.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-800/50 rounded-full shrink-0">
              {getIconForType(news.type)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{news.title}</h3>
              <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                {news.content}
              </p>
              <div className="text-xs text-slate-500 font-medium">
                {format(new Date(news.date), "d 'de' MMMM, HH:mm", { locale: es })}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
