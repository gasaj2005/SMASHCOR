import { useState } from 'react';
import { motion } from 'framer-motion';
import { friendsList, communitiesList } from '../data/mockData';
import { Search, UserPlus, Users, Unlock, Lock } from 'lucide-react';

export default function Social() {
  const [activeTab, setActiveTab] = useState('friends');

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-2xl font-bold text-white mb-6">Social</h2>

      <div className="flex bg-dark-card rounded-xl p-1 mb-6 border border-dark-border">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'friends' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Amigos
        </button>
        <button
          onClick={() => setActiveTab('communities')}
          className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'communities' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Comunidades
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border text-white rounded-xl focus:outline-none focus:border-brand" 
          placeholder={`Buscar ${activeTab === 'friends' ? 'amigos' : 'comunidades'}...`} 
        />
      </div>

      {activeTab === 'friends' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-6">
          {friendsList.map(friend => (
            <div key={friend.id} className="flex items-center p-4 bg-dark-card border border-dark-border rounded-xl">
              <img src={friend.avatar} alt="avatar" className="w-12 h-12 rounded-full border border-slate-600 mr-4" />
              <div className="flex-1">
                <h4 className="font-bold text-white">{friend.name}</h4>
                <p className="text-xs text-slate-400">Nivel {friend.division} {friend.subdivision}</p>
              </div>
              <button className="text-slate-400 hover:text-brand bg-slate-800 p-2 rounded-full transition-colors">
                <UserPlus size={20} />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'communities' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-6">
          {communitiesList.map(community => (
            <div key={community.id} className="flex flex-col p-5 bg-dark-card border border-dark-border rounded-xl text-left">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg text-2xl">
                    {community.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">{community.name}</h4>
                    <span className="text-xs text-slate-400 flex items-center mt-1">
                      {community.isPrivate ? <Lock size={12} className="mr-1" /> : <Unlock size={12} className="mr-1" />}
                      {community.isPrivate ? 'Privada' : 'Pública'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-brand bg-brand/10 px-2 py-1 rounded-md">
                  <Users size={12} className="mr-1" /> {community.membersCount}/{community.maxMembers}
                </div>
              </div>
              <button className={`mt-4 py-2 w-full rounded-lg font-bold text-sm transition-colors ${
                community.isPrivate 
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                  : 'bg-brand/20 text-brand hover:bg-brand/30 border border-brand/50'
              }`}>
                {community.isPrivate ? 'Solicitar Unión' : 'Unirme'}
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
