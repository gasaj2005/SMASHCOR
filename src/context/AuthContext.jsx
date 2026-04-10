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

  const persistRooms = (updatedRooms) => {
    setRooms(updatedRooms);
    localStorage.setItem('smashcor_rooms', JSON.stringify(updatedRooms));
  };

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
      points: 0, racketModel: "Sin especificar", racketPhoto: "",
      bio: "¡Nuevo jugador en SmashCor!", ...data,
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
      players: [{ ...currentUser, courtPosition: 'left-top' }]
    };
    const updatedRooms = [...rooms, newRoom];
    persistRooms(updatedRooms);
    return newRoom;
  };

  // Unirse por CÓDIGO (salas privadas) o por ID directo (salas públicas)
  const joinRoom = (identifier, byId = false) => {
    const room = byId
      ? rooms.find(r => r.id === identifier)
      : rooms.find(r => r.roomCode && r.roomCode.toUpperCase() === identifier.toUpperCase());

    if (!room) return { success: false, message: 'Código incorrecto o sala inexistente' };
    if (room.players.length >= 4) return { success: false, message: 'Lo sentimos, la sala se ha completado' };
    if (room.players.some(p => p.id === currentUser.id)) return { success: true, room, alreadyIn: true };

    const allPositions = ['left-top', 'right-top', 'left-bottom', 'right-bottom'];
    const takenPositions = room.players.map(p => p.courtPosition);
    const availablePosition = allPositions.find(pos => !takenPositions.includes(pos));

    const updatedRoom = {
      ...room,
      players: [...room.players, { ...currentUser, courtPosition: availablePosition }]
    };

    const updatedRooms = rooms.map(r => r.id === room.id ? updatedRoom : r);
    persistRooms(updatedRooms);
    return { success: true, room: updatedRoom };
  };

  // Drag & Drop: mueve al currentUser a una nueva posición libre en la pista y persiste
  const updatePlayerPosition = (roomId, newPosition) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false };

    const targetOccupant = room.players.find(p => p.courtPosition === newPosition);
    if (targetOccupant && targetOccupant.id !== currentUser.id) {
      return { success: false, message: 'Esa posición ya está ocupada' };
    }

    const updatedPlayers = room.players.map(p =>
      p.id === currentUser.id ? { ...p, courtPosition: newPosition } : p
    );

    const updatedRoom = { ...room, players: updatedPlayers };
    const updatedRooms = rooms.map(r => r.id === roomId ? updatedRoom : r);
    persistRooms(updatedRooms);
    return { success: true, room: updatedRoom };
  };

  return (
    <AuthContext.Provider value={{
      currentUser, login, register, logout, updateProfile, deleteAccount, loading,
      rooms, addRoom, joinRoom, updatePlayerPosition
    }}>
      {children}
    </AuthContext.Provider>
  );
};
