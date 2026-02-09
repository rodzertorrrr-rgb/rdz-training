import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Button, Card, Input, Label } from '../components/ui';
import { User } from '../types';
import { UserPlus, User as UserIcon, Trash2, ChevronRight, Plus, X, AlertTriangle } from 'lucide-react';

export const Login: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const handleSelectUser = (userId: string) => {
    if (confirmDeleteId) return; // Prevenim selecția dacă suntem în modul de ștergere
    const user = db.loginAs(userId);
    if (user) onLogin(user);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const user = db.addUser(newName);
    setUsers(db.getUsers());
    setNewName('');
    setShowAdd(false);
  };

  const handleDeleteUser = (userId: string) => {
    db.deleteUser(userId);
    setUsers(db.getUsers());
    setConfirmDeleteId(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-10">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2 text-center flex flex-col items-center">
          RDZ <span className="text-primary leading-none">TRAINING</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] opacity-60">Hipertrofie & Autoreglare</p>
      </div>

      <div className="max-w-md mx-auto w-full space-y-6">
        {users.length > 0 && !showAdd && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              {confirmDeleteId ? 'CONFIRMĂ ȘTERGEREA PROFILULUI' : 'ALEGE PROFILUL'}
            </h2>
            <div className="grid gap-3">
              {users.map(user => {
                const isConfirming = confirmDeleteId === user.id;
                
                return (
                  <div
                    key={user.id}
                    className={`w-full bg-surface border rounded-2xl flex items-center group transition-all shadow-xl overflow-hidden relative active:scale-[0.99] ${
                      isConfirming ? 'border-rose-500 bg-rose-500/5' : 'border-white/5 hover:border-primary/40'
                    }`}
                  >
                    <button
                      onClick={() => handleSelectUser(user.id)}
                      className="flex-1 flex items-center gap-4 p-5 text-left transition-colors"
                      disabled={!!confirmDeleteId && !isConfirming}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isConfirming ? 'bg-rose-500 text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black'
                      }`}>
                        {isConfirming ? <AlertTriangle size={24} /> : <UserIcon size={24} />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg transition-colors ${
                          isConfirming ? 'text-rose-500' : 'text-white group-hover:text-primary'
                        }`}>{user.name}</h3>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                          {isConfirming ? 'DATELE VOR FI PIERDUTE' : 'Profil Atlet'}
                        </p>
                      </div>
                    </button>
                    
                    <div className="flex items-center gap-1 pr-4 z-10 relative">
                      {isConfirming ? (
                        <div className="flex gap-2">
                           <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-rose-500 text-white text-[10px] font-black px-4 py-3 rounded-xl uppercase tracking-tighter"
                          >
                            Șterge
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-zinc-800 text-zinc-400 p-3 rounded-xl"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfirmDeleteId(user.id);
                          }}
                          className="p-4 text-zinc-600 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showAdd ? (
          <Card className="p-8 border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tighter flex items-center gap-2">
              <UserPlus className="text-primary" /> Profil Nou
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label>Numele Tău</Label>
                <Input 
                  autoFocus 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  placeholder="ex: Roberto B." 
                  className="text-lg py-6"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 py-4">Creează Profil</Button>
                <Button variant="ghost" onClick={() => setShowAdd(false)}>Anulează</Button>
              </div>
            </form>
          </Card>
        ) : (
          !confirmDeleteId && (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center gap-3 text-zinc-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Adaugă Profil Nou</span>
            </button>
          )
        )}
      </div>

      <footer className="mt-20 text-center">
        <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em]">
          Version 2.5 • Priority-Based Symmetrical Training
        </p>
      </footer>
    </div>
  );
};