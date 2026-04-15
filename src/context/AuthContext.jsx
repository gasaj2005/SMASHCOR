import { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as mockUser, mockRooms } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Normaliza un room antiguo para asegurarse que siempre tenga players[] y roomCode
const normalizeRoom = (r) => ({
  ...r,
  players: Array.isArray(r.players) ? r.players : [],
  roomCode: r.roomCode || ('PAD-' + r.id?.slice(-4).toUpperCase()) || 'PAD-????',
  isPrivate: r.isPrivate ?? false,
  creatorId: r.creatorId || (Array.isArray(r.players) && r.players[0]?.id) || 'unknown',
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    try {
      // ── Usuarios ──
      try {
        const storedUsers = localStorage.getItem('smashcor_users');
        if (!storedUsers) {
          const initialMockUser = { ...mockUser, password: '123' };
          localStorage.setItem('smashcor_users', JSON.stringify([initialMockUser]));
        }
      } catch {}

      try {
        const storedUser = localStorage.getItem('smashcor_currentUser');
        if (storedUser && storedUser !== 'undefined') {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch {}

      // ── Salas: siempre normalizar para sobrevivir formatos viejos ──
      try {
        const storedRooms = localStorage.getItem('smashcor_rooms');
        if (storedRooms) {
          const parsed = JSON.parse(storedRooms);
          const normalized = Array.isArray(parsed) ? parsed.map(normalizeRoom) : [];
          setRooms(normalized);
          try { localStorage.setItem('smashcor_rooms', JSON.stringify(normalized)); } catch {}
        } else {
          setRooms([]);
          try { localStorage.setItem('smashcor_rooms', JSON.stringify([])); } catch {}
        }
      } catch {
        setRooms([]);
        try { localStorage.setItem('smashcor_rooms', JSON.stringify([])); } catch {}
      }
    } catch (e) {
      console.error('AuthContext init error:', e);
      setRooms([]);
    }
    setLoading(false);
  }, []);

  const persistRooms = (updatedRooms) => {
    const safe = Array.isArray(updatedRooms) ? updatedRooms : [];
    setRooms(safe);
    localStorage.setItem('smashcor_rooms', JSON.stringify(safe));
  };

  const login = (username, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('smashcor_users') || '[]');
      const user = users?.find(u => u?.username === username && u?.password === password);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('smashcor_currentUser', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, message: 'Usuario o contraseña incorrectos' };
    } catch {
      return { success: false, message: 'Error interno. Inténtalo de nuevo.' };
    }
  };

  const register = (data) => {
    try {
      const users = JSON.parse(localStorage.getItem('smashcor_users') || '[]');
      if (users?.find(u => u?.username === data.username)) {
        return { success: false, message: 'El nombre de usuario ya está en uso' };
      }
      const newUser = {
        points: 0, racketModel: 'Sin especificar', racketPhoto: '',
        bio: '¡Nuevo jugador en SmashCor!', ...data,
        id: 'u' + Math.floor(Math.random() * 10000),
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('smashcor_users', JSON.stringify(updatedUsers));
      setCurrentUser(newUser);
      localStorage.setItem('smashcor_currentUser', JSON.stringify(newUser));
      return { success: true };
    } catch {
      return { success: false, message: 'Error interno al registrar.' };
    }
  };

  const updateProfile = (data) => {
    if (!currentUser) return;
    try {
      const users = JSON.parse(localStorage.getItem('smashcor_users') || '[]');
      const updatedUser = { ...currentUser, ...data };
      const updatedUsers = users?.map(u => u?.id === currentUser?.id ? updatedUser : u) || [];
      localStorage.setItem('smashcor_users', JSON.stringify(updatedUsers));
      setCurrentUser(updatedUser);
      localStorage.setItem('smashcor_currentUser', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('updateProfile error:', e);
    }
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    try {
      const users = JSON.parse(localStorage.getItem('smashcor_users') || '[]');
      const updatedUsers = users?.filter(u => u?.id !== currentUser?.id) || [];
      localStorage.setItem('smashcor_users', JSON.stringify(updatedUsers));
      setCurrentUser(null);
      localStorage.removeItem('smashcor_currentUser');
    } catch (e) {
      console.error('deleteAccount error:', e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smashcor_currentUser');
  };

  const addRoom = (roomData) => {
    if (!currentUser) return null;
    const newRoom = normalizeRoom({
      id: 'r' + Math.floor(Math.random() * 10000),
      creatorId: currentUser.id,
      ...roomData,
      players: [{ ...currentUser, courtPosition: 'left-top' }],
    });
    const updatedRooms = [...rooms, newRoom];
    persistRooms(updatedRooms);
    return newRoom;
  };

  const joinRoom = (identifier, byId = false) => {
    if (!currentUser) return { success: false, message: 'No hay sesión activa' };
    const safeRooms = Array.isArray(rooms) ? rooms : [];

    const room = byId
      ? safeRooms.find(r => r.id === identifier)
      : safeRooms.find(r => r.roomCode && r.roomCode.toUpperCase() === String(identifier).toUpperCase());

    if (!room) return { success: false, message: 'Código incorrecto o sala inexistente' };

    const players = Array.isArray(room.players) ? room.players : [];
    if (players.length >= 4) return { success: false, message: 'Lo sentimos, la sala se ha completado' };
    if (players.some(p => p.id === currentUser.id)) return { success: true, room, alreadyIn: true };

    const allPositions = ['left-top', 'right-top', 'left-bottom', 'right-bottom'];
    const takenPositions = players.map(p => p.courtPosition);
    const availablePosition = allPositions.find(pos => !takenPositions.includes(pos)) || 'left-top';

    const updatedRoom = normalizeRoom({
      ...room,
      players: [...players, { ...currentUser, courtPosition: availablePosition }],
    });

    const updatedRooms = safeRooms.map(r => r.id === room.id ? updatedRoom : r);
    persistRooms(updatedRooms);
    return { success: true, room: updatedRoom };
  };

  const updatePlayerPosition = (roomId, newPosition) => {
    if (!currentUser || !roomId || !newPosition) return { success: false };
    const safeRooms = Array.isArray(rooms) ? rooms : [];
    const room = safeRooms.find(r => r.id === roomId);
    if (!room) return { success: false };

    const players = Array.isArray(room.players) ? room.players : [];
    const targetOccupant = players.find(p => p.courtPosition === newPosition);
    if (targetOccupant && targetOccupant.id !== currentUser.id) {
      return { success: false, message: 'Esa posición ya está ocupada' };
    }

    const updatedPlayers = players.map(p =>
      p.id === currentUser.id ? { ...p, courtPosition: newPosition } : p
    );
    const updatedRoom = normalizeRoom({ ...room, players: updatedPlayers });
    const updatedRooms = safeRooms.map(r => r.id === roomId ? updatedRoom : r);
    persistRooms(updatedRooms);
    return { success: true, room: updatedRoom };
  };

  const leaveRoom = (roomId) => {
    if (!currentUser || !roomId) return { success: false };
    const safeRooms = Array.isArray(rooms) ? rooms : [];
    const room = safeRooms.find(r => r.id === roomId);
    if (!room) return { success: false };
    
    // Remueve al usuario actual de los players
    const players = Array.isArray(room.players) ? room.players : [];
    const updatedPlayers = players.filter(p => p.id !== currentUser.id);
    
    const updatedRoom = normalizeRoom({ ...room, players: updatedPlayers });
    const updatedRooms = safeRooms.map(r => r.id === roomId ? updatedRoom : r);
    persistRooms(updatedRooms);
    return { success: true };
  };

  const deleteRoom = (roomId) => {
    if (!currentUser || !roomId) return { success: false };
    const safeRooms = Array.isArray(rooms) ? rooms : [];
    // Borrado duro filtrando la sala
    const updatedRooms = safeRooms.filter(r => r.id !== roomId);
    persistRooms(updatedRooms);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      currentUser, login, register, logout, updateProfile, deleteAccount, loading,
      rooms: Array.isArray(rooms) ? rooms : [],
      addRoom, joinRoom, updatePlayerPosition, leaveRoom, deleteRoom,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
