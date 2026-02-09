import React, { useState } from 'react';
import { db } from '../services/db';
import { Card, Badge, Button } from '../components/ui';
import { 
  Calendar, 
  Clock, 
  Activity, 
  Trash2, 
  Moon, 
  Wind, 
  Activity as ActivityIcon, 
  Beef, 
  ShieldAlert 
} from 'lucide-react';
import { AppRoute, WorkoutSession } from '../types';

interface HistoryProps {
  navigate: (route: AppRoute, params?: any) => void;
}

const SAFETY_LOCK_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 zile

export const History: React.FC<HistoryProps> = ({ navigate }) => {
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => 
    db.getSessions()
      .filter(s => s.status === 'COMPLETED')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  
  const [sessionToDelete, setSessionToDelete] = useState<WorkoutSession | null>(null);
  const program = db.getProgram();

  const handleDelete = () => {
    if (sessionToDelete) {
      db.deleteSession(sessionToDelete.id);
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      setSessionToDelete(null);
    }
  };

  const handleCardClick = (session: WorkoutSession) => {
    navigate(AppRoute.LOG_WORKOUT, { sessionId: session.id });
  };

  const isOldSession = (session: WorkoutSession | null) => {
    if (!session) return false;
    const timestamp = session.completedTimestamp || new Date(session.date).getTime();
    return (Date.now() - timestamp) > SAFETY_LOCK_THRESHOLD_MS;
  };

  return (
    <div className="pb-24 pt-4">
      <h1 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter italic">Istoric <span className="text-primary">Antrenamente</span></h1>

      {sessionToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md">
          <Card className={`w-full max-w-xs p-8 text-center space-y-6 shadow-2xl transition-all ${isOldSession(sessionToDelete) ? 'border-primary/40 ring-4 ring-primary/5' : 'border-rose-500/20'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isOldSession(sessionToDelete) ? 'bg-primary/10 text-primary' : 'bg-rose-500/10 text-rose-500'}`}>
              {isOldSession(sessionToDelete) ? <ShieldAlert size={32} /> : <Trash2 size={32} />}
            </div>
            
            <div>
              {isOldSession(sessionToDelete) ? (
                <>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic">Sesiune importantă</h3>
                  <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
                    Această sesiune face parte din progresul tău pe termen lung. 
                    Ștergerea ei poate afecta interpretarea corectă a evoluției tale.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic">Ștergi Sesiunea?</h3>
                  <p className="text-zinc-500 text-sm mt-2">Această acțiune este permanentă și va elimina progresul înregistrat.</p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleDelete} variant="danger" className="w-full py-4 uppercase font-black text-xs">Șterge Definitiv</Button>
              <Button onClick={() => setSessionToDelete(null)} variant="secondary" className="w-full uppercase font-bold text-[10px]">Anulează</Button>
            </div>
          </Card>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-dashed border-white/5 rounded-2xl">
          <Activity className="text-zinc-800 mx-auto mb-4" size={48} />
          <p className="text-zinc-500 font-medium italic">Niciun antrenament salvat încă.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => {
            const dayTemplate = program.find(d => d.id === session.dayId);
            const hasFlags = session.contextFlags && (
              session.contextFlags.sleepPoor || 
              session.contextFlags.highStress || 
              session.contextFlags.jointPain || 
              session.contextFlags.poorNutrition
            );

            return (
              <Card 
                key={session.id} 
                className="p-5 hover:border-primary/20 transition-all group cursor-pointer active:scale-[0.99] relative"
                onClick={() => handleCardClick(session)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="pr-10">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1 block">
                      {dayTemplate?.name || 'Manual'}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors italic uppercase tracking-tight leading-tight">
                      {dayTemplate?.focus || 'Sesiune Custom'}
                    </h3>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-rose-500/5 text-zinc-800 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    title="Șterge sesiune"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-zinc-500 text-xs font-medium">
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <Calendar size={13} className="text-primary/60" />
                    {new Date(session.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <Clock size={13} className="text-primary/60" />
                    {session.durationMinutes} min
                  </div>
                </div>

                {hasFlags && (
                   <div className="mt-3 flex flex-wrap gap-2">
                      {session.contextFlags?.sleepPoor && <span title="Somn Slab" className="text-zinc-600"><Moon size={12} /></span>}
                      {session.contextFlags?.highStress && <span title="Stres Ridicat" className="text-zinc-600"><Wind size={12} /></span>}
                      {session.contextFlags?.jointPain && <span title="Dureri Articulare" className="text-zinc-600"><ActivityIcon size={12} /></span>}
                      {session.contextFlags?.poorNutrition && <span title="Alimentație Slabă" className="text-zinc-600"><Beef size={12} /></span>}
                   </div>
                )}

                <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-1.5 opacity-60">
                   {session.logs.slice(0, 3).map((log, i) => {
                     const exName = dayTemplate?.exercises.find(e => e.id === log.exerciseId)?.name || log.manualExerciseName;
                     return <Badge key={i} color="zinc">{exName}</Badge>
                   })}
                   {session.logs.length > 3 && (
                     <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest flex items-center px-1">
                       +{session.logs.length - 3} altele
                     </span>
                   )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};