import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Smartphone, UserPlus } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    login('demo@smashcor.com', '123456');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6 flex flex-col justify-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-brand flex items-center justify-center text-dark-bg text-4xl shadow-[0_0_20px_rgba(147,197,114,0.3)]">
            🎾
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Bienvenido a SmashCor</h1>
        <p className="text-center text-slate-400 mb-10">La comunidad de pádel definitiva</p>

        <div className="space-y-4">
          <button 
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center space-x-3 bg-brand text-dark-bg font-semibold p-4 rounded-xl hover:bg-brand-hover transition-colors"
          >
            <LogIn size={20} />
            <span>Ingresar (Cuenta Demo)</span>
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-dark-border"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">O continúa con</span>
            <div className="flex-grow border-t border-dark-border"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-dark-card border border-dark-border text-white p-4 rounded-xl hover:bg-slate-800 transition-colors">
              <Mail size={18} />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-dark-card border border-dark-border text-white p-4 rounded-xl hover:bg-slate-800 transition-colors">
              <Smartphone size={18} />
              <span>Teléfono</span>
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-400">
            ¿No tienes cuenta?{' '}
            <button onClick={() => navigate('/register')} className="text-brand font-medium hover:underline">
              Regístrate aquí
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
