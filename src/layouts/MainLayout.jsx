import { Outlet, Navigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import Splash from '../pages/Splash';

export default function MainLayout() {
  const { currentUser, loading } = useAuth();

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
    </div>
  );
}
