import { motion } from 'framer-motion';

export default function Splash() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg text-white">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="w-24 h-24 mb-6 rounded-full bg-brand flex items-center justify-center text-dark-bg text-4xl shadow-[0_0_30px_rgba(147,197,114,0.5)]"
        >
          🎾
        </motion.div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Smash<span className="text-brand">Cor</span>
        </h1>
        <p className="text-slate-400 font-medium">Elevando tu pádel en Córdoba</p>
      </motion.div>
    </div>
  );
}
