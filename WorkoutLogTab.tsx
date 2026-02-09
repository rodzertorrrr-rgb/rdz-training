
import React from 'react';
import { db } from '../services/db';
import { AppRoute } from '../types';
import { Button, Card, Badge } from '../components/ui';
import { Play, ClipboardList, Activity, ArrowRight } from 'lucide-react';

interface WorkoutLogTabProps {
  navigate: (route: AppRoute, params?: any) => void;
}

export const WorkoutLogTab: React.FC<WorkoutLogTabProps> = ({ navigate }) => {
  const draft = db.getDraftSession();
  const program = db.getProgram();

  if (draft) {
    const dayTemplate = program.find(d => d.id === draft.dayId);
    return (
      <div className="pt-10 space-y-8 text-center animate-in fade-in duration-500 px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-2xl shadow-primary/10">
          <Activity className="text-primary" size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sesiune activă</h1>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto">
            Ai un antrenament început. Continuă de unde ai rămas pentru a nu pierde datele.
          </p>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 max-w-sm mx-auto text-left relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2">
              <Badge color="gold">DRAFT</Badge>
           </div>
           <div className="mb-6">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
               {dayTemplate?.name}
             </span>
             <h3 className="text-xl font-black text-white italic uppercase tracking-tight">
               {dayTemplate?.focus || 'Sesiune Custom'}
             </h3>
           </div>
           <Button 
             onClick={() => navigate(AppRoute.LOG_WORKOUT, { dayId: draft.dayId })} 
             className="w-full py-4 text-lg" 
             icon={Play}
           >
             REIA ANTRENAMENTUL
           </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 space-y-8">
      <div className="px-1">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Jurnal <span className="text-primary">Antrenament</span></h1>
        <p className="text-zinc-500 text-sm mt-1">Start antrenament sau reia progresul.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div className="w-24 h-24 bg-surfaceHighlight rounded-3xl flex items-center justify-center text-zinc-800 mb-2 border border-white/5">
          <ClipboardList size={48} />
        </div>
        <div className="space-y-2 px-6">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight italic">Gata de muncă?</h2>
          <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
            Alege ziua de antrenament corespunzătoare pentru a înregistra seturile și a urmări autoreglarea.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Alege Ziua</h3>
        {program.map((day) => (
          <button
            key={day.id}
            onClick={() => navigate(AppRoute.LOG_WORKOUT, { dayId: day.id })}
            className="group w-full bg-surface border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all active:scale-[0.98] shadow-lg"
          >
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{day.name}</span>
              <h4 className="text-white font-bold text-lg leading-none italic uppercase tracking-tight">{day.focus}</h4>
            </div>
            <div className="w-11 h-11 rounded-xl bg-surfaceHighlight flex items-center justify-center text-zinc-700 group-hover:bg-primary group-hover:text-black transition-all">
              <Play size={20} fill="currentColor" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
