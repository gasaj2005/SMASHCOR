import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import Leaderboard from './pages/Leaderboard';
import Play from './pages/Play';
import Social from './pages/Social';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/news" replace />} />
            <Route path="news" element={<News />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="play" element={<Play />} />
            <Route path="social" element={<Social />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/news" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
