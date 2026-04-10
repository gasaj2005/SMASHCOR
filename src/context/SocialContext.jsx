import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { communitiesList as mockCommunities } from '../data/mockData';

const SocialContext = createContext();

export const useSocial = () => useContext(SocialContext);

export const SocialProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [friendsIds, setFriendsIds] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [communities, setCommunities] = useState([]);

  // Carga inicial
  useEffect(() => {
    if (!currentUser) {
      setFriendsIds([]);
      setFriendRequests([]);
      setCommunities([]);
      return;
    }

    try {
      const sf = localStorage.getItem(`smashcor_friends_${currentUser.id}`);
      setFriendsIds(sf ? JSON.parse(sf) : []);

      const sr = localStorage.getItem(`smashcor_requests_${currentUser.id}`);
      // Llenamos algunas falsas si está vacío por testeo
      setFriendRequests(sr ? JSON.parse(sr) : ['u4', 'u3']);

      const sc = localStorage.getItem('smashcor_communities');
      setCommunities(sc ? JSON.parse(sc) : mockCommunities);
    } catch {
      setFriendsIds([]);
      setFriendRequests([]);
      setCommunities(mockCommunities);
    }
  }, [currentUser]);

  // Persistencia de Amigos
  const persistFriends = (newFriends) => {
    setFriendsIds(newFriends);
    if (currentUser) localStorage.setItem(`smashcor_friends_${currentUser.id}`, JSON.stringify(newFriends));
  };

  // Persistencia de Peticiones
  const persistRequests = (newRequests) => {
    setFriendRequests(newRequests);
    if (currentUser) localStorage.setItem(`smashcor_requests_${currentUser.id}`, JSON.stringify(newRequests));
  };

  // Persistencia de Comunidades Globales
  const persistCommunities = (newComms) => {
    setCommunities(newComms);
    localStorage.setItem('smashcor_communities', JSON.stringify(newComms));
  };

  // -- AMISTAD --
  const sendFriendRequest = (userId) => {
    if (!currentUser) return { success: false };
    
    // Leer bandeja del objetivo
    const targetKey = `smashcor_requests_${userId}`;
    const existingRaw = localStorage.getItem(targetKey);
    let targetRequests = existingRaw ? JSON.parse(existingRaw) : [];
    
    // Añadir nuestro ID si no está ya
    if (!targetRequests.includes(currentUser.id)) {
      targetRequests.push(currentUser.id);
      localStorage.setItem(targetKey, JSON.stringify(targetRequests));
    }
    
    return { success: true, message: 'Solicitud enviada' };
  };

  const acceptRequest = (userId) => {
    const newReqs = friendRequests.filter(id => id !== userId);
    persistRequests(newReqs);
    if (!friendsIds.includes(userId)) {
      persistFriends([...friendsIds, userId]);
    }
  };

  const rejectRequest = (userId) => {
    persistRequests(friendRequests.filter(id => id !== userId));
  };

  // -- COMUNIDADES --
  const createCommunity = (commData) => {
    if (!currentUser) return null;
    const newCommunity = {
      id: 'c' + Math.floor(Math.random() * 100000),
      ...commData,
      leaderId: currentUser.id,
      membersIds: [currentUser.id],
      membersCount: 1,
      messages: [],
      joinRequests: [],
    };
    persistCommunities([...communities, newCommunity]);
    return newCommunity;
  };

  const joinCommunity = (commId) => {
    if (!currentUser) return { success: false };
    const updated = communities.map(c => {
      if (c.id === commId) {
        if (c.membersIds.includes(currentUser.id)) return c;
        if (c.membersIds.length >= c.maxMembers) return c;
        return {
          ...c,
          membersIds: [...c.membersIds, currentUser.id],
          membersCount: c.membersCount + 1
        };
      }
      return c;
    });
    persistCommunities(updated);
    return { success: true };
  };

  const requestJoin = (commId, optionalMessage = '') => {
    if (!currentUser) return { success: false };
    const requestObject = { userId: currentUser.id, message: optionalMessage, timestamp: new Date().toISOString() };
    const updated = communities.map(c => {
      const hasRequested = c.joinRequests?.some(req => typeof req === 'object' ? req.userId === currentUser.id : req === currentUser.id);
      if (c.id === commId && !hasRequested) {
        return { ...c, joinRequests: [...(c.joinRequests || []), requestObject] };
      }
      return c;
    });
    persistCommunities(updated);
    return { success: true, message: 'Solicitud enviada al líder' };
  };

  const sendMessage = (commId, text) => {
    if (!currentUser || !text.trim()) return;
    const msg = {
      id: 'm' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    const updated = communities.map(c => {
      if (c.id === commId) {
        return { ...c, messages: [...(c.messages || []), msg] };
      }
      return c;
    });
    persistCommunities(updated);
  };

  return (
    <SocialContext.Provider value={{
      friendsIds, friendRequests, communities,
      sendFriendRequest, acceptRequest, rejectRequest,
      createCommunity, joinCommunity, requestJoin, sendMessage
    }}>
      {children}
    </SocialContext.Provider>
  );
};
