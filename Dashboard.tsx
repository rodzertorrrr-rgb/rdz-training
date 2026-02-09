import React from 'react';
import { db } from '../services/db';
import { Button, Card, Badge } from '../components/ui';
import { Activity, AlertTriangle, TrendingUp, Play, LogOut, BookOpen, ChevronRight } from 'lucide-react';
import { AppRoute } from '../types';

interface DashboardProps {
  navigate: (route: AppRoute, params?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const user = db.getCurrentUser();
  const needsDeload = db.needsDeload();
  const program = db.getProgram();
  const history = db.getSessions().filter(s => s.status === 'COMPLETED');
  const draft = db.getDraftSession();
  
  const lastSession = history.length > 0 ? history[history.length - 1] : null;
  let nextDayIndex = 0;
  if (lastSession) {
    const lastDayIdx = program.findIndex(p => p.id === lastSession.dayId);
    nextDayIndex = lastDayIdx !== -1 ? (lastDayIdx + 1) % program.length : 0;
  }
  const todayWorkout = program[nextDayIndex] || program[0];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white italic uppercase">SALUT, <span className="text-primary">{user?.name}</span></h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Hipertrofie Sistematizată</p>
        </div>
        <button onClick={() => navigate(AppRoute.LOGIN)} className="p-2 bg-surfaceHighlight rounded-lg text-zinc-500 hover:text-rose-500 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {draft && (
        <Card className="border-primary/40 bg-primary/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Activity size={20} className="animate-pulse" />
             </div>
             <div>
               <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Sesiune activă</span>
               <h3 className="text-sm font-bold text-white uppercase tracking-tight">{program.find(d => d.id === draft.dayId)?.focus}</h3>
             </div>
          </div>
          <Button onClick={() => navigate(AppRoute.LOG_WORKOUT)} size="sm" variant="primary">Continuă</Button>
        </Card>
      )}

      {needsDeload && (
        <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-rose-500 uppercase text-xs tracking-widest">Deload Recomandat</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Oboseala acumulată depășește pragul de refacere.</p>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-3 italic">RECOMANDAT ASTĂZI</h2>
        <Card className="relative overflow-hidden group border-primary/20 bg-gradient-to-br from-surface to-black ring-1 ring-primary/10 p-6">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-primary">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{todayWorkout.focus}</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6">{todayWorkout.name} • {todayWorkout.exercises.length} exerciții</p>
            <Button onClick={() => navigate(AppRoute.LOG_WORKOUT, { dayId: todayWorkout.id })} variant="primary" icon={Play} className="w-full sm:w-auto uppercase italic tracking-tighter">
               Start Antrenament
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-black text-white uppercase tracking-tighter italic">EDUCATIE</h2>
          <button onClick={() => navigate(AppRoute.TACTICS)} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
            Vezi Tot <ChevronRight size={14} />
          </button>
        </div>
        <Card onClick={() => navigate(AppRoute.TACTICS)} className="flex items-center gap-4 bg-surfaceHighlight/30 border-white/5 cursor-pointer hover:bg-surfaceHighlight/50 transition-all p-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase italic tracking-tight">Tactici & Raționament</h4>
            <p className="text-[10px] text-zinc-500 uppercase font-black">RIR, Deload, Progresie</p>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-3 italic">PROGRAM SĂPTĂMÂNAL</h2>
        <div className="grid grid-cols-1 gap-2">
          {program.map((day) => (
            <button
              key={day.id}
              onClick={() => navigate(AppRoute.LOG_WORKOUT, { dayId: day.id })}
              className="flex items-center justify-between bg-surface border border-white/5 p-4 rounded-xl hover:border-primary/40 transition-all text-left group"
            >
              <div>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-primary transition-colors">{day.name}</span>
                <h4 className="text-white font-bold text-sm uppercase tracking-tight leading-none mt-1">{day.focus}</h4>
              </div>
              <div className="p-2 rounded-full bg-white/5 text-zinc-700 group-hover:bg-primary group-hover:text-black">
                 <Play size={12} fill="currentColor" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};