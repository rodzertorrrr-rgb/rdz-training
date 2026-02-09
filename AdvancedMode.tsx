import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Card, Button, Badge } from '../components/ui';
import { AppRoute, WeekType, AdvancedCycleState } from '../types';
import { 
  Zap, 
  Calendar, 
  Activity, 
  ShieldAlert, 
  RotateCcw, 
  ChevronLeft,
  Info,
  TrendingUp,
  Target
} from 'lucide-react';

interface AdvancedModeProps {
  navigate: (route: AppRoute) => void;
}

const WEEK_DESCRIPTIONS: Record<WeekType, string> = {
  BUILD: 'Program standard. Top sets + Volum complet.',
  CONSOLIDATE: 'Consolidare. Volumul de suport scade ușor.',
  DELOAD: 'Recuperare. Volum redus 50%, fără eșec RIR 0.'
};

export const AdvancedMode: React.FC<AdvancedModeProps> = ({ navigate }) => {
  const [state, setState] = useState<AdvancedCycleState>(() => db.getAdvancedState());

  const handleToggle = () => {
    const newState = { ...state, isActive: !state.isActive };
    setState(newState);
    db.saveAdvancedState(newState);
  };

  const handleWeekChange = (newWeek: number) => {
    const newState = { ...state, currentWeek: newWeek };
    setState(newState);
    db.saveAdvancedState(newState);
  };

  const handleReset = () => {
    if (confirm("Resetezi ciclul de antrenament?")) {
       const defaultSchedule: WeekType[] = [
        'BUILD', 'BUILD', 'BUILD', 'CONSOLIDATE', 'CONSOLIDATE',
        'BUILD', 'DELOAD', 'BUILD', 'CONSOLIDATE', 'BUILD'
      ];
      const newState: AdvancedCycleState = { 
        isActive: true, 
        currentWeek: 1, 
        cycleLength: 10, 
        schedule: defaultSchedule 
      };
      setState(newState);
      db.saveAdvancedState(newState);
    }
  };

  const currentWeekType = state.schedule[state.currentWeek - 1];

  return (
    <div className="pb-24 pt-4 space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(AppRoute.MORE)} className="p-2 bg-surfaceHighlight rounded-lg text-zinc-500 hover:text-white">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Mod <span className="text-primary">Avansat</span></h1>
      </header>

      <Card className={`border-2 transition-all p-6 ${state.isActive ? 'border-primary/40 bg-primary/5 shadow-2xl shadow-primary/10' : 'border-white/5'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className={`p-3 rounded-2xl ${state.isActive ? 'bg-primary text-black' : 'bg-surfaceHighlight text-zinc-600'}`}>
                <Zap size={24} />
             </div>
             <div>
                <h3 className="font-bold text-white uppercase italic tracking-tight">Sistem de Ciclizare</h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{state.isActive ? 'Activ' : 'Inactiv'}</p>
             </div>
          </div>
          <button 
            onClick={handleToggle}
            className={`w-14 h-8 rounded-full transition-all relative ${state.isActive ? 'bg-primary' : 'bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-black transition-all ${state.isActive ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        {state.isActive ? (
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                 <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Săptămâna</span>
                 <div className="flex items-center gap-3">
                    <button onClick={() => handleWeekChange(Math.max(1, state.currentWeek - 1))} className="text-zinc-500 hover:text-white"><Activity size={16}/></button>
                    <span className="text-2xl font-black text-white italic">{state.currentWeek}</span>
                    <button onClick={() => handleWeekChange(Math.min(state.cycleLength, state.currentWeek + 1))} className="text-zinc-500 hover:text-white"><Activity size={16} className="rotate-180"/></button>
                 </div>
               </div>
               <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                 <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Tip Sesiune</span>
                 <Badge color={currentWeekType === 'BUILD' ? 'gold' : currentWeekType === 'CONSOLIDATE' ? 'blue' : 'zinc'}>
                    {currentWeekType}
                 </Badge>
               </div>
             </div>

             <div className="p-4 bg-surfaceHighlight/50 border border-white/5 rounded-xl">
               <p className="text-xs text-zinc-300 italic mb-2">"{WEEK_DESCRIPTIONS[currentWeekType]}"</p>
               <p className="text-[10px] text-zinc-600 font-bold uppercase leading-relaxed">
                 {currentWeekType === 'CONSOLIDATE' && 'Modificator: Se elimină ultimul set de back-off la exercițiile de suport.'}
                 {currentWeekType === 'DELOAD' && 'Modificator: Reducere 50% volum, limitare intensitate la RIR 1-2.'}
                 {currentWeekType === 'BUILD' && 'Modificator: Niciunul aplicat.'}
               </p>
             </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">Activează Modul Avansat pentru a debloca ciclizarea volumului.</p>
        )}
      </Card>

      {state.isActive && (
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Program Săptămânal</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
            {state.schedule.map((type, i) => (
              <button 
                key={i} 
                onClick={() => handleWeekChange(i + 1)}
                className={`shrink-0 w-24 p-3 rounded-2xl border transition-all ${state.currentWeek === i + 1 ? 'border-primary bg-primary/10' : 'border-white/5 bg-surfaceHighlight/20'}`}
              >
                <span className="block text-[8px] font-black text-zinc-600 uppercase mb-1">W{i + 1}</span>
                <span className={`text-[10px] font-black uppercase tracking-tight italic ${type === 'BUILD' ? 'text-white' : type === 'CONSOLIDATE' ? 'text-primary' : 'text-zinc-500'}`}>
                   {type}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Logică Autoreglare</h3>
        <div className="space-y-3">
          <Card className="bg-surfaceHighlight/30 border-white/5 p-4 flex gap-4">
             <div className="shrink-0 p-2 rounded-lg bg-white/5 text-zinc-500"><Target size={20}/></div>
             <div>
               <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-tight">Ierarhie Priorități</h4>
               <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">Umeri > Picioare > Piept > Spate > Brațe</p>
             </div>
          </Card>
          <Card className="bg-surfaceHighlight/30 border-white/5 p-4 flex gap-4">
             <div className="shrink-0 p-2 rounded-lg bg-white/5 text-zinc-500"><TrendingUp size={20}/></div>
             <div>
               <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-tight">Declanșatori Deload</h4>
               <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">2x Regresie consecutivă pe exerciții cheie.</p>
             </div>
          </Card>
        </div>
      </section>

      <div className="pt-8 flex flex-col gap-3">
        <Button onClick={handleReset} variant="outline" className="w-full text-zinc-600" icon={RotateCcw}>Resetează Ciclu</Button>
        <div className="flex items-start gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
           <ShieldAlert className="text-zinc-700 shrink-0 mt-0.5" size={16} />
           <p className="text-[9px] text-zinc-600 font-bold uppercase leading-relaxed italic">
             Modul Avansat nu modifică template-ul de bază. Acesta aplică modificări temporare asupra volumului de suport pentru a gestiona oboseala sistemică.
           </p>
        </div>
      </div>
    </div>
  );
};