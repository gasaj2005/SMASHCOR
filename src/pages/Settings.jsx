import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Wrench } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-6 h-[80vh] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-dark-card w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl border border-dark-border relative">
          <SettingsIcon size={48} className="text-slate-600" />
          <div className="absolute -bottom-2 -right-2 bg-brand w-10 h-10 rounded-full flex items-center justify-center border-2 border-dark-bg text-dark-bg">
            <Wrench size={20} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sección en Construcción</h2>
        <p className="text-slate-400 max-w-[250px] mx-auto">
          Estamos trabajando para traerte todas las opciones de configuración muy pronto.
        </p>
      </motion.div>
    </div>
  );
}
