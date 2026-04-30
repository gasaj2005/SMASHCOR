import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import Splash from '../pages/Splash';

export default function MainLayout() {
  const { currentUser, loading, updateProfile, rooms, addNotification } = useAuth();
  const [bioInput, setBioInput] = useState('');

  // ── Recordatorios de 24h (Anti-Spam) ──
  useEffect(() => {
    if (!currentUser || !Array.isArray(rooms) || rooms.length === 0) return;

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Filtrar partidos donde el usuario está inscrito
    const myMatches = rooms.filter(r => 
      Array.isArray(r.players) && r.players.some(p => p.id === currentUser.id)
    );

    myMatches.forEach(match => {
      if (match.datetime) {
        const matchDate = new Date(match.datetime);
        // Si el partido es en el futuro y dentro de las próximas 24 horas
        if (matchDate > now && matchDate <= next24Hours) {
          // Bloqueo Anti-Spam: ¿Ya existe una notificación 'reminder' para este match.id?
          const hasReminder = currentUser.notifications?.some(
            n => n.type === 'reminder' && n.relatedId === match.id
          );

          if (!hasReminder) {
            const message = `Recordatorio: ¡Tienes un partido en menos de 24 horas en ${match.location || 'tu club'}!`;
            addNotification(currentUser.id, message, 'reminder', match.id);
          }
        }
      }
    });
  }, [currentUser, rooms, addNotification]);

  const handleSaveBio = () => {
    updateProfile({ bio: bioInput || '¡Nuevo jugador en SmashCor!', isFirstLogin: false });
  };

  const handleSkip = () => {
    updateProfile({ isFirstLogin: false });
  };

  if (loading) {
    return <Splash />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">
      <TopBar />
      <main className="animate-fade-in relative z-0">
        <Outlet />
      </main>
      <BottomNav />

      {/* Onboarding Modal */}
      <AnimatePresence>
        {currentUser?.isFirstLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="bg-dark-card border border-dark-border w-full max-w-sm rounded-[2rem] p-6 z-10 shadow-2xl relative"
            >
              <h2 className="text-2xl font-black text-white text-center mb-2">¡Bienvenido a SmashCor!</h2>
              <p className="text-sm text-slate-400 text-center mb-5">
                ¿Quieres añadir una breve descripción para que el resto de jugadores te conozcan?
              </p>
              
              <textarea
                rows="3"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Ej: Apasionado del pádel, juego cruzado, buscando sumar partidos..."
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-white text-sm focus:outline-none focus:border-brand transition-colors resize-none mb-5 shadow-inner"
              />
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSaveBio}
                  className="w-full py-3.5 rounded-xl font-black bg-brand hover:bg-brand-hover text-dark-bg transition shadow-md"
                >
                  Guardar Descripción
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full py-3.5 rounded-xl font-bold bg-dark-bg text-slate-400 border border-dark-border hover:bg-slate-800 hover:text-white transition"
                >
                  Saltar / Hacerlo más tarde
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
