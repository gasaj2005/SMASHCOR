import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { globalUsers } from '../data/mockData';
import { Users, UserPlus, Search, Check, X, ShieldAlert, MessageCircle, Send, Plus, Globe, Lock, ImageIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const TABS = [
  { id: 'friends', label: 'Amistades' },
  { id: 'communities', label: 'Comunidades' }
];

const COMM_TABS = [
  { id: 'mine', label: 'Mis Grupos' },
  { id: 'explore', label: 'Explorar' },
  { id: 'create', label: 'Crear' }
];

export default function Social() {
  const { currentUser } = useAuth();
  const { 
    friendsIds, friendRequests, communities, 
    sendFriendRequest, acceptRequest, rejectRequest,
    createCommunity, joinCommunity, requestJoin, sendMessage 
  } = useSocial();

  const [activeTab, setActiveTab] = useState('friends');
  const [activeCommTab, setActiveCommTab] = useState('mine');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Chat state
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showCommInfo, setShowCommInfo] = useState(false);
  const chatScrollRef = useRef(null);

  // Form state
  const [createData, setCreateData] = useState({ name: '', isPrivate: false, maxMembers: 10, description: '' });
  const [iconBase64, setIconBase64] = useState(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeChat, communities]);

  // -- Helpers Amigos --
  const myFriends = globalUsers.filter(u => friendsIds.includes(u.id));
  const pendingUsers = globalUsers.filter(u => friendRequests.includes(u.id));
  const searchResults = globalUsers.filter(u => 
    u.id !== currentUser?.id && 
    !friendsIds.includes(u.id) &&
    u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -- Helpers Comunidades --
  const myCommunities = communities.filter(c => c.membersIds?.includes(currentUser?.id));
  const exploreComms = communities.filter(c => !c.membersIds?.includes(currentUser?.id));
  
  const currentChatComm = activeChat ? communities.find(c => c.id === activeChat) : null;

  // -- Lógica de Compresión de Imagen por Canvas --
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 500;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setIconBase64(compressedBase64);
      };
    };
  };

  const handleCreateCommunity = (e) => {
    e.preventDefault();
    createCommunity({ ...createData, iconBase64 });
    setActiveCommTab('mine');
    setCreateData({ name: '', isPrivate: false, maxMembers: 10, description: '' });
    setIconBase64(null);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (chatMessage.trim() && activeChat) {
      sendMessage(activeChat, chatMessage);
      setChatMessage('');
    }
  };

  // ── RENDER DE CHAT AISLADO ──
  if (activeChat && currentChatComm) {
    return (
      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="fixed inset-0 z-40 bg-dark-bg flex flex-col pb-[72px]">
        {/* Header Chat */}
        <div 
          className="bg-dark-card border-b border-dark-border p-4 flex items-center shadow-lg pt-safe select-none cursor-pointer hover:bg-dark-card/80 transition"
          onClick={() => setShowCommInfo(true)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveChat(null); }} 
            className="mr-3 text-slate-400 hover:text-white p-2 bg-dark-bg rounded-xl transition"
          >
            <ArrowLeft size={20} />
          </button>
          {currentChatComm.iconBase64 ? (
            <img src={currentChatComm.iconBase64} alt="icon" className="w-10 h-10 rounded-full object-cover mr-3 border border-dark-border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand text-lg mr-3">
              {currentChatComm.icon || currentChatComm.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-bold text-white leading-tight">{currentChatComm.name}</h3>
            <span className="text-xs text-slate-400">{currentChatComm.membersCount} miembros</span>
          </div>
        </div>

        {/* Muro */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatScrollRef}>
          {!currentChatComm.messages || currentChatComm.messages.length === 0 ? (
            <div className="text-center text-slate-500 py-10">No hay mensajes. ¡Rompe el hielo!</div>
          ) : (
            currentChatComm.messages.map(msg => {
              const isMe = msg.senderId === currentUser?.id;
              const sender = globalUsers.find(u => u.id === msg.senderId) || currentUser;
              // Usar el nombre guardado en JSON si existe para persistencia universal, o calcular en caliente
              const displayName = msg.senderName || sender?.name || msg.senderId;
              
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
                  <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                    {!isMe && <img src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}&backgroundColor=93C572`} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-dark-border mb-1 hidden sm:block" />}
                    <div className={`p-3 rounded-2xl ${isMe ? 'bg-brand text-dark-bg rounded-br-sm shadow-[0_4px_15px_rgba(147,197,114,0.3)]' : 'bg-dark-card text-white border border-dark-border rounded-bl-sm shadow-md'}`}>
                      {!isMe && <p className="text-[10px] font-black opacity-50 mb-1">{displayName}</p>}
                      <p className="text-sm font-medium">{msg.text}</p>
                      <p className={`text-[9px] text-right mt-1 opacity-70 ${isMe ? 'text-dark-card' : 'text-slate-400'}`}>
                        {format(new Date(msg.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-dark-bg border-t border-dark-border shrink-0">
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-dark-card border border-dark-border p-3.5 rounded-full text-white text-sm focus:outline-none focus:border-brand transition-colors"
            />
            <button type="submit" disabled={!chatMessage.trim()} className="bg-brand text-dark-bg p-3.5 rounded-full disabled:opacity-50 hover:bg-brand-hover transition-colors shadow-lg flex-shrink-0">
              <Send size={20} />
            </button>
          </form>
        </div>

        {/* Modal Info de Comunidad */}
        <AnimatePresence>
          {showCommInfo && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowCommInfo(false)}
              />
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                className="bg-dark-card border border-dark-border w-full max-w-sm rounded-[2rem] p-6 z-10 shadow-2xl relative flex flex-col items-center text-center"
              >
                {currentChatComm.iconBase64 ? (
                  <img src={currentChatComm.iconBase64} alt="icon" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-brand" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center text-brand text-4xl mb-4">
                    {currentChatComm.icon || currentChatComm.name.charAt(0)}
                  </div>
                )}
                <h3 className="text-xl font-black text-white mb-1">{currentChatComm.name}</h3>
                <p className="text-xs text-brand mb-4 uppercase tracking-widest font-bold">{currentChatComm.isPrivate ? 'Privada 🔒' : 'Pública 🌍'}</p>
                <p className="text-sm text-slate-300 mb-6 px-4">
                  {currentChatComm.description || 'Sin descripción detallada disponible.'}
                </p>
                <div className="w-full bg-dark-bg rounded-xl p-4 mb-6 border border-dark-border flex justify-between">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Líder</p>
                    <p className="text-sm font-bold text-white truncate max-w-[120px]">{globalUsers.find(u => u.id === currentChatComm.leaderId)?.name || 'Anónimo'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Miembros</p>
                    <p className="text-sm font-bold text-white">{currentChatComm.membersCount} / {currentChatComm.maxMembers}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCommInfo(false)}
                  className="w-full py-3.5 rounded-xl font-bold bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition"
                >
                  Cerrar
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── RENDER PRINCIPAL (TABS) ──
  return (
    <div className="p-4 pt-safe pb-28 min-h-screen">
      <h2 className="text-2xl font-black text-white mb-5 tracking-tight flex items-center">
        <Users className="text-brand mr-2" size={26} strokeWidth={2.5}/> Red Social
      </h2>

      {/* TABS PRINCIPALES */}
      <div className="flex bg-dark-card rounded-xl p-1 mb-6 border border-dark-border shadow-sm">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 font-bold text-xs rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-slate-700 text-brand shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── SECCIÓN: AMISTADES ── */}
      {activeTab === 'friends' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          
          {/* Solicitudes Entrantes */}
          {pendingUsers.length > 0 && (
            <div className="bg-dark-card border border-brand/40 rounded-2xl p-4 shadow-[0_0_20px_rgba(147,197,114,0.1)]">
              <h3 className="text-xs font-bold text-brand uppercase tracking-wider mb-4 flex items-center">
                <ShieldAlert size={14} className="mr-1.5" /> Solicitudes de Amistad
              </h3>
              <div className="space-y-3">
                {pendingUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between bg-dark-bg p-2 pl-3 rounded-xl border border-dark-border">
                    <div className="flex items-center">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full bg-dark-card mr-3" />
                      <div>
                        <p className="text-sm font-bold text-white">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.division}ª Div · {u.subdivision}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => acceptRequest(u.id)} className="p-2 bg-brand text-dark-bg rounded-lg hover:bg-brand-hover"><Check size={18} /></button>
                      <button onClick={() => rejectRequest(u.id)} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"><X size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Buscar jugadores..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-dark-card border border-dark-border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-brand transition"
            />
          </div>

          {searchQuery ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Resultados</h3>
              {searchResults.length === 0 ? (
                <p className="text-slate-500 text-center py-4 text-sm">No se encontraron jugadores.</p>
              ) : (
                searchResults.map(u => (
                  <div key={u.id} className="flex flex-row items-center justify-between p-3 bg-dark-card border border-dark-border rounded-xl">
                    <div className="flex items-center flex-1 min-w-0 mr-3">
                      <img src={u.avatar} className="w-10 h-10 rounded-full mr-3 border border-dark-border shadow-sm flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white text-sm truncate">{u.name}</p>
                        <p className="text-xs text-slate-400 truncate">@{u.username}</p>
                      </div>
                    </div>
                    <button onClick={() => sendFriendRequest(u.id)} className="flex items-center text-[11px] font-bold bg-brand/10 text-brand px-3 py-1.5 rounded-lg border border-brand/20 whitespace-nowrap">
                      <UserPlus size={14} className="mr-1.5" /> Añadir
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center justify-between">
                Mis Amigos <span className="bg-dark-card px-2 py-0.5 rounded-full text-[10px]">{myFriends.length}</span>
              </h3>
              {myFriends.length === 0 ? (
                <div className="text-center py-10 bg-dark-card rounded-2xl border border-dark-border border-dashed">
                  <UserPlus size={32} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400 text-sm">Aún no tienes amigos añadidos.</p>
                </div>
              ) : (
                myFriends.map(friend => (
                  <div key={friend.id} className="flex items-center p-3 bg-dark-card border border-dark-border rounded-xl shadow-sm">
                    <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full mr-4 border border-dark-border/50" />
                    <div>
                      <p className="font-bold text-white text-sm">{friend.name}</p>
                      <p className="text-[11px] text-brand font-medium tracking-wide">{friend.division}ª División {friend.subdivision}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ── SECCIÓN: COMUNIDADES ── */}
      {activeTab === 'communities' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Sub-Tabs de Comunidad */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
            {COMM_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveCommTab(t.id)}
                className={`py-1.5 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeCommTab === t.id ? 'bg-brand text-dark-bg shadow-md' : 'bg-dark-card text-slate-400 border border-dark-border'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* MIS COMUNIDADES */}
          {activeCommTab === 'mine' && (
            <div className="grid grid-cols-2 gap-4">
              {myCommunities.length === 0 ? (
                <div className="col-span-2 text-center py-16 bg-dark-card rounded-2xl border border-dark-border border-dashed">
                  <MessageCircle size={32} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400 text-sm">No perteneces a ninguna comunidad.</p>
                </div>
              ) : (
                myCommunities.map(c => (
                  <button key={c.id} onClick={() => setActiveChat(c.id)} className="flex flex-col items-center bg-dark-card border border-dark-border p-4 rounded-2xl shadow-sm hover:border-brand/50 transition">
                    {c.iconBase64 ? (
                      <img src={c.iconBase64} alt={c.name} className="w-16 h-16 rounded-full object-cover mb-3 ring-2 ring-brand/30" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl mb-3 shadow-inner">
                        {c.icon || c.name.charAt(0)}
                      </div>
                    )}
                    <h4 className="font-bold text-white text-sm text-center leading-tight mb-1">{c.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-dark-bg rounded-md">{c.membersCount} miemb.</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* EXPLORAR COMUNIDADES */}
          {activeCommTab === 'explore' && (
            <div className="space-y-4">
              {exploreComms.map(c => {
                const isFull = c.membersCount >= c.maxMembers;
                return (
                  <div key={c.id} className="bg-dark-card border border-dark-border p-4 rounded-2xl flex flex-col shadow-sm relative overflow-hidden">
                    {c.isPrivate && <div className="absolute top-0 right-0 bg-red-500/10 text-red-400 text-[9px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest"><Lock size={10} className="inline mr-1 -mt-0.5"/>Privada</div>}
                    <div className="flex items-center mb-3">
                      {c.iconBase64 ? (
                        <img src={c.iconBase64} className="w-12 h-12 rounded-xl object-cover mr-3" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl mr-3">{c.icon || '🎾'}</div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base leading-tight pr-6">{c.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{c.membersCount} / {c.maxMembers} miembros</p>
                      </div>
                    </div>
                    {isFull ? (
                      <button disabled className="w-full py-2.5 rounded-xl bg-dark-bg text-slate-500 text-xs font-bold border border-dark-border cursor-not-allowed">
                        Comunidad Llena
                      </button>
                    ) : c.isPrivate ? (
                      <button onClick={() => requestJoin(c.id)} className="w-full py-2.5 rounded-xl bg-transparent border-2 border-brand/50 text-brand text-xs font-bold hover:bg-brand/10 transition">
                        Solicitar Unión
                      </button>
                    ) : (
                      <button onClick={() => joinCommunity(c.id)} className="w-full py-2.5 rounded-xl bg-brand text-dark-bg text-xs font-black hover:bg-brand-hover transition shadow-md">
                        Unirse Ahora
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CREAR COMUNIDAD */}
          {activeCommTab === 'create' && (
            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-lg">
              <form onSubmit={handleCreateCommunity} className="space-y-4">
                
                {/* Portada Input */}
                <div className="flex flex-col items-center justify-center">
                  <label className="relative cursor-pointer group">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {iconBase64 ? (
                      <img src={iconBase64} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-brand shadow-lg" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-dark-bg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center group-hover:border-brand/50 group-hover:bg-brand/5 transition">
                        <ImageIcon size={28} className="text-slate-500 mb-1" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Logo</span>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-bold uppercase mb-1 block">Nombre del Club/Grupo</label>
                  <input required type="text" value={createData.name} onChange={e => setCreateData({...createData, name: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white text-sm focus:border-brand outline-none" placeholder="Ej. Veteranos Sur" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold uppercase mb-1 block">Privacidad</label>
                    <select value={createData.isPrivate} onChange={e => setCreateData({...createData, isPrivate: e.target.value === 'true'})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white text-sm focus:border-brand outline-none appearance-none">
                      <option value="false">Pública 🌍</option>
                      <option value="true">Privada 🔒</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold uppercase mb-1 block">Límite Miembros</label>
                    <input type="number" min="4" max="50" required value={createData.maxMembers} onChange={e => setCreateData({...createData, maxMembers: parseInt(e.target.value)})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white text-sm focus:border-brand outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-bold uppercase mb-1 block">Descripción breve</label>
                  <textarea rows="2" value={createData.description} onChange={e => setCreateData({...createData, description: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white text-sm focus:border-brand outline-none resize-none" placeholder="Para organizar pachangas..." />
                </div>

                <button type="submit" className="w-full bg-brand text-dark-bg font-black py-3.5 rounded-xl text-sm shadow-[0_0_20px_rgba(147,197,114,0.3)] mt-2 hover:bg-brand-hover transition">
                  Crear Comunidad
                </button>
              </form>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
