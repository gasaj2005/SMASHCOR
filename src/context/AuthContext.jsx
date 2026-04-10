import { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as mockUser } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('smashcor_currentUser');
      const storedUsers = localStorage.getItem('smashcor_users');

      if (!storedUsers) {
        // Attach a default password to the mock data for testing if needed
        const initialMockUser = { ...mockUser, password: '123' };
        localStorage.setItem('smashcor_users', JSON.stringify([initialMockUser]));
      }

      if (storedUser && storedUser !== 'undefined') {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse auth data from localStorage:', e);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('smashcor_users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('smashcor_currentUser', JSON.stringify(user));
      return { success: true };
    } else {
      return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
  };

  const register = (data) => {
    const users = JSON.parse(localStorage.getItem('smashcor_users') || '[]');
    
    if (users.find(u => u.username === data.username)) {
      return { success: false, message: 'El nombre de usuario ya está en uso' };
    }

    const newUser = {
      points: 0,
      racketModel: "Sin especificar",
      racketPhoto: "",
      bio: "¡Nuevo jugador en SmashCor!",
      ...data,
      id: 'u' + Math.floor(Math.random() * 10000)
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('smashcor_users', JSON.stringify(updatedUsers));
    
    setCurrentUser(newUser);
    localStorage.setItem('smashcor_currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const updateProfile = (data) => {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('smashcor_users') || '[]');
    const updatedUser = { ...currentUser, ...data };
    
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    localStorage.setItem('smashcor_users', JSON.stringify(updatedUsers));
    
    setCurrentUser(updatedUser);
    localStorage.setItem('smashcor_currentUser', JSON.stringify(updatedUser));
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('smashcor_users') || '[]');
    const updatedUsers = users.filter(u => u.id !== currentUser.id);
    localStorage.setItem('smashcor_users', JSON.stringify(updatedUsers));
    
    setCurrentUser(null);
    localStorage.removeItem('smashcor_currentUser');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smashcor_currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateProfile, deleteAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
