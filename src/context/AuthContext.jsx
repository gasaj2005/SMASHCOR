import { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as mockUser, mockRooms } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('smashcor_currentUser');
      const storedUsers = localStorage.getItem('smashcor_users');
      const storedRooms = localStorage.getItem('smashcor_rooms');

      if (!storedUsers) {
        const initialMockUser = { ...mockUser, password: '123' };
        localStorage.setItem('smashcor_users', JSON.stringify([initialMockUser]));
      }

      if (storedUser && storedUser !== 'undefined') {
        setCurrentUser(JSON.parse(storedUser));
      }

      if (!storedRooms) {
        localStorage.setItem('smashcor_rooms', JSON.stringify(mockRooms));
        setRooms(mockRooms);
      } else {
        setRooms(JSON.parse(storedRooms));
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

  const addRoom = (roomData) => {
    const newRoom = {
      id: 'r' + Math.floor(Math.random() * 10000),
      ...roomData,
      players: [{
        ...currentUser,
        courtPosition: 'left-top'
      }]
    };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    localStorage.setItem('smashcor_rooms', JSON.stringify(updatedRooms));
    return newRoom;
  };

  const joinRoom = (roomCode) => {
    const room = rooms.find(r => r.roomCode.toUpperCase() === roomCode.toUpperCase());
    if (!room) return { success: false, message: 'Código de sala incorrecto' };
    if (room.players.length >= 4) return { success: false, message: 'La sala ya está llena' };
    if (room.players.some(p => p.id === currentUser.id)) return { success: false, message: 'Ya estás en esta sala', room };

    const positions = ['left-top', 'right-top', 'left-bottom', 'right-bottom'];
    const takenPositions = room.players.map(p => p.courtPosition);
    const availablePosition = positions.find(pos => !takenPositions.includes(pos));

    const updatedRoom = {
      ...room,
      players: [...room.players, { ...currentUser, courtPosition: availablePosition }]
    };

    const updatedRooms = rooms.map(r => r.id === room.id ? updatedRoom : r);
    setRooms(updatedRooms);
    localStorage.setItem('smashcor_rooms', JSON.stringify(updatedRooms));
    
    return { success: true, room: updatedRoom };
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, login, register, logout, updateProfile, deleteAccount, loading,
      rooms, addRoom, joinRoom
    }}>
      {children}
    </AuthContext.Provider>
  );
};
