import { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as mockUser } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth status
    const timer = setTimeout(() => {
      // By default not logged in, but we can set it to mockUser to bypass if we want
      // For this demo, let's start non-logged in so we see the Splash -> Login flow
      setCurrentUser(null);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const login = (email, pass) => {
    // Simulate login
    setCurrentUser(mockUser);
  };

  const register = (data) => {
    // Simulate register
    setCurrentUser({
      ...mockUser,
      ...data,
      id: 'u' + Math.floor(Math.random() * 1000)
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
