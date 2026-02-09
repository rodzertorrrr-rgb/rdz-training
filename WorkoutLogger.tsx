import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { 
  WorkoutSession, 
  SetLog, 
  SetType, 
  AppRoute, 
  ExerciseLog,
  ContextFlags,
  WeekType
} from '../types';
import { 
  Button, 
  Card, 
  Badge, 
  RestTimer, 
  PlateCalculatorModal 
} from '../components/ui';
import { 
  ChevronLeft, 
  Save, 
  Check, 
  Trash2, 
  Plus, 
  Minus, 
  History as HistoryIcon,
  Settings,
  Star,
  Zap,
  ShieldAlert,
  Info,
  HelpCircle
} from 'lucide-react';

interface WorkoutLoggerProps {
  dayId?: string;
  sessionId?: string;
  editMode?: boolean;
  onFinish: () => void;
  onBack: () => void;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ dayId, sessionId, onFinish, onBack }) => {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [showPlateCalc, setShowPlateCalc] = useState<number | null>(null);
  const [showRirGuide, setShowRirGuide] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSaveSummary, setShowSaveSummary] = useState(false);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [topSetComparisons, setTopSetComparisons] = useState<Record<string, {weight: number, reps: number, rir: number | null}[]>>({});
  
  const [contextFlags, setContextFlags] = useState<ContextFlags>({
    sleepPoor: false,
    highStress: false,
    jointPain: false,
    poorNutrition: false
  });

  const timerRef = useRef<any>(null);
  const saveTimeoutRef = useRef<any>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const user = db.getCurrentUser();
    if (!user) return;

    if (sessionId) {
      const pastSessions = db.getSessions();
      const found = pastSessions.find(s => s.id === sessionId);
      if (found) {
        setSession(found);
        setElapsed(found.durationMinutes);
        if (found.contextFlags) setContextFlags(found.contextFlags);
        return;
      }
    }

    const draft = db.getDraftSession();
    const effectiveDayId = dayId || draft?.dayId;
    if (!effectiveDayId) return;

    let currentSession = draft;
    if (dayId && currentSession && currentSession.dayId !== dayId) {
      db.deleteSession(currentSession.id);
      currentSession = undefined;
    }

    if (!currentSession) {
      currentSession = db.initSessionFromTemplate(effectiveDayId) || undefined;
      if (currentSession) db.saveSession(currentSession);
    }

    if (currentSession) {
      setSession(currentSession);
      if (currentSession.contextFlags) setContextFlags(currentSession.contextFlags);
      
      const comparisons: Record<string, {weight: number, reps: number, rir: number | null}[]> = {};
      currentSession.logs.forEach(log => {
        comparisons[log.exerciseId] = db.getLastTwoTopSets(log.exerciseId);
      });
      setTopSetComparisons(comparisons);

      const start = currentSession.startTimestamp || Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 60000));
      }, 10000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [dayId, sessionId]);

  useEffect(() => {
    if (session && session.status === 'DRAFT') {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        db.saveSession({ ...session, contextFlags, durationMinutes: elapsed });
      }, 500);
    }
  }, [session, contextFlags, elapsed]);

  const handleUpdateSet = (exIdx: number, setIdx: number, updates: Partial<SetLog>) => {
    if (!session || session.status === 'COMPLETED') return;
    const newLogs = [...session.logs];
    const exLog = { ...newLogs[exIdx] };
    const sets = [...exLog.sets];
    
    if (updates.isPrimaryTopSet === true) {
      sets.forEach((s, i) => { if (i !== setIdx) s.isPrimaryTopSet = false; });
      updates.type = 'TOP'; 
    }

    sets[setIdx] = { ...sets[setIdx], ...updates };
    exLog.sets = sets;
    newLogs[exIdx] = exLog;

    if (updates.completed === true) setShowTimer(true);
    setSession({ ...session, logs: newLogs });
  };

  const handleAddSet = (exIdx: number, type: SetType) => {
    if (!session || session.status === 'COMPLETED') return;
    const newLogs = [...session.logs];
    const sets = [...newLogs[exIdx].sets];
    
    sets.push({
      id: Math.random().toString(36).substr(2, 9),
      type,
      weight: 0,
      reps: 0,
      rir: null,
      completed: false,
      isManual: true,
      isPrimaryTopSet: false
    });

    newLogs[exIdx] = { ...newLogs[exIdx], sets };
    setSession({ ...session, logs: newLogs });
  };

  const handleDeleteSet = (exIdx: number, type: SetType) => {
    if (!session || session.status === 'COMPLETED') return;
    const newLogs = [...session.logs];
    const sets = [...newLogs[exIdx].sets];
    
    // Găsim toți indicii seturilor de acest tip
    const indicesOfType = sets
      .map((s, i) => ({...s, i}))
      .filter(s => s.type === type && !s.isDisabledByAdvancedMode);
      
    if (indicesOfType.length === 0) return;
    
    const lastSet = indicesOfType[indicesOfType.length - 1];
    
    // Nu permitem ștergerea setului principal din greșeală
    if (lastSet.isPrimaryTopSet) {
      alert("Nu poți șterge setul principal. Setează altul ca principal mai întâi.");
      return;
    }

    // Eliminăm exact acel index
    const updatedSets = sets.filter((_, idx) => idx !== lastSet.i);
    newLogs[exIdx] = { ...newLogs[exIdx], sets: updatedSets };
    setSession({ ...session, logs: newLogs });
  };

  const applySuggestion = (exIdx: number, level: string) => {
    if (!session) return;
    const newLogs = [...session.logs];
    const exLog = { ...newLogs[exIdx] };
    const sets = [...exLog.sets];

    if (level === 'SUPPORT_REDUCTION') {
      const backOffIndices = sets.map((s, i) => ({...s, i})).filter(s => s.type === 'BACKOFF' && !s.isDisabledByAdvancedMode);
      if (backOffIndices.length > 0) {
        sets[backOffIndices[backOffIndices.length - 1].i].isDisabledByAdvancedMode = true;
      }
    } else if (level === 'DELOAD') {
      sets.forEach(s => { if (s.type === 'BACKOFF') s.isDisabledByAdvancedMode = true; });
    }

    exLog.sets = sets;
    newLogs[exIdx] = exLog;
    setSession({ ...session, logs: newLogs });
  };

  const handleFinalSave = () => {
    if (!session) return;
    for (const log of session.logs) {
      if (log.sets.length > 0 && !log.sets.some(s => s.isPrimaryTopSet)) {
        alert(`Exercițiul ${activeExerciseIdx + 1} necesită un Top Set Principal.`);
        return;
      }
    }
    const finalSession: WorkoutSession = {
      ...session,
      status: 'COMPLETED',
      durationMinutes: elapsed,
      completedTimestamp: Date.now(),
      contextFlags
    };
    db.saveSession(finalSession);
    onFinish();
  };

  if (!session) return null;

  const isReadOnly = session.status === 'COMPLETED';
  const program = db.getProgram();
  const dayTemplate = program.find(d => d.id === session.dayId);
  const activeEx = session.logs[activeExerciseIdx];
  const activeExTemplate = dayTemplate?.exercises.find(e => e.id === activeEx?.exerciseId);
  const comparison = activeEx ? topSetComparisons[activeEx.exerciseId] || [] : [];
  const regressionInfo = activeEx ? db.checkRegression(activeEx.exerciseId) : { level: 'NONE', description: '' };

  return (
    <div className="pb-32">
      <RestTimer isOpen={showTimer} onClose={() => setShowTimer(false)} />
      {showPlateCalc !== null && <PlateCalculatorModal targetWeight={showPlateCalc} onClose={() => setShowPlateCalc(null)} />}

      <header className="flex items-center justify-between mb-8 sticky top-0 bg-background/90 backdrop-blur-md z-40 py-4 px-4 border-b border-white/5 -mx-4">
        <button onClick={() => isReadOnly ? onBack() : setShowExitConfirm(true)} className="p-1 text-zinc-500 hover:text-white"><ChevronLeft size={28} /></button>
        <div className="text-center">
           <span className="text-[10px] font-black text-primary uppercase tracking-widest block">
             {session.weekType && session.weekType !== 'BUILD' ? `MOD AVANSAT: ${session.weekType}` : (isReadOnly ? 'Sesiune Istoric' : 'Jurnal Draft')}
           </span>
           <h1 className="text-sm font-bold text-white uppercase italic tracking-tighter leading-none">{dayTemplate?.focus}</h1>
        </div>
        {!isReadOnly ? <Button onClick={() => setShowSaveSummary(true)} variant="primary" size="sm">Final</Button> : <div className="w-10"></div>}
      </header>

      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
           <Card className="w-full max-w-sm p-8 text-center space-y-6">
             <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500"><Trash2 size={32} /></div>
             <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Abandonezi?</h3>
             <Button onClick={() => { db.deleteSession(session.id); onBack(); }} variant="danger" className="w-full">Șterge Draft</Button>
             <Button onClick={() => setShowExitConfirm(false)} variant="secondary" className="w-full">Anulează</Button>
           </Card>
        </div>
      )}

      {showSaveSummary && (
        <div className="fixed inset-0 z-[100] bg-black p-6 flex flex-col">
           <div className="flex-1 overflow-y-auto pt-10 pb-20">
             <h2 className="text-3xl font-black text-white italic uppercase mb-8">Rezumat</h2>
             <div className="grid grid-cols-2 gap-2 mb-10">
                {[{ key: 'sleepPoor', label: 'Somn slab' }, { key: 'highStress', label: 'Stres ridicat' }, { key: 'jointPain', label: 'Dureri' }, { key: 'poorNutrition', label: 'Nutriție slabă' }].map(flag => (
                  <button key={flag.key} onClick={() => setContextFlags(f => ({...f, [flag.key]: !f[flag.key] as any}))}
                    className={`p-4 rounded-xl border text-[10px] font-bold uppercase transition-all ${contextFlags[flag.key as keyof ContextFlags] ? 'bg-primary/20 border-primary text-white shadow-lg' : 'bg-surface border-white/5 text-zinc-600'}`}>
                    {flag.label}
                  </button>
                ))}
             </div>
             <div className="bg-surfaceHighlight/50 border border-white/5 p-4 rounded-xl">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic leading-relaxed">
                  "Volumul eficient este suficient, nu maxim. Performanța la Top Set este criteriul principal de progres."
                </p>
             </div>
           </div>
           <div className="mt-auto space-y-4">
             <Button onClick={handleFinalSave} variant="primary" className="w-full py-5 text-lg font-black uppercase italic">SALVEAZĂ LOG</Button>
             <Button onClick={() => setShowSaveSummary(false)} variant="ghost" className="w-full">Anulează</Button>
           </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 sticky top-16 bg-background/90 backdrop-blur-md z-30 py-2 -mx-4 px-4">
         {session.logs.map((log, idx) => (
           <button key={idx} onClick={() => setActiveExerciseIdx(idx)}
             className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border font-black transition-all ${
               activeExerciseIdx === idx ? 'bg-primary border-primary text-black scale-110 shadow-lg' : 'bg-surface border-white/5 text-zinc-600'
             }`}
           >
             {idx + 1}
           </button>
         ))}
      </div>

      {activeEx && (
        <div className="space-y-8 animate-in fade-in duration-300">
           <div>
             <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-black text-white italic uppercase leading-tight flex-1">{activeExTemplate?.name}</h2>
                <button onClick={() => setShowPlateCalc(activeEx.sets.find(s => !s.completed)?.weight || 0)} className="p-2 bg-surfaceHighlight rounded-lg text-primary"><Settings size={18} /></button>
             </div>
             <div className="flex flex-wrap gap-2">
               {comparison[0] && (
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-[9px] text-primary font-black uppercase tracking-widest">
                   <HistoryIcon size={12} /> Sugerăm: {comparison[0].weight}kg × {comparison[0].reps}
                 </div>
               )}
               {session.weekType === 'DELOAD' && <Badge color="zinc">DELOAD: RIR 2 LIMITĂ</Badge>}
               <button onClick={() => setShowRirGuide(!showRirGuide)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] text-zinc-500 font-black uppercase tracking-widest hover:text-white transition-colors">
                 <HelpCircle size={12} /> Ghid RIR
               </button>
             </div>
             
             {showRirGuide && (
               <div className="mt-3 p-4 bg-surfaceHighlight/50 border border-white/5 rounded-xl animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-black text-primary uppercase block mb-1">RIR 0-1</span>
                      <p className="text-[10px] text-zinc-400 leading-relaxed italic">Eșec tehnic. Maximul posibil. Optim pentru hipertrofie la Top Set.</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-primary uppercase block mb-1">RIR 2+</span>
                      <p className="text-[10px] text-zinc-400 leading-relaxed italic">Rezervă sigură. Ideal pentru volumul de suport sau deload.</p>
                    </div>
                  </div>
               </div>
             )}

             {!isReadOnly && regressionInfo.level !== 'NONE' && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
                   <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                     <ShieldAlert size={14} /> Sugestie Autoreglare
                   </div>
                   <p className="text-[11px] text-zinc-400 font-medium italic">
                     {regressionInfo.description} <br/>
                     <span className="text-[9px] text-zinc-500 mt-1 block uppercase font-bold tracking-tighter">
                       "Scăderea performanței indică acumulare de oboseală. Volumul eficient este cel din care te poți recupera."
                     </span>
                   </p>
                   <Button onClick={() => applySuggestion(activeExerciseIdx, regressionInfo.level)} variant="outline" size="sm" className="w-full text-[10px] border-amber-500/20 text-amber-500">Aplică sugerarea acum</Button>
                </div>
             )}
           </div>

           <div className="space-y-12">
              {['RAMP', 'TOP', 'BACKOFF'].map(type => {
                const setsOfType = activeEx.sets.map((s, i) => ({...s, originalIdx: i})).filter(s => s.type === type);
                return (
                  <div key={type} className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${type === 'TOP' ? 'text-primary' : 'text-zinc-600'}`}>{type} SETS</span>
                      {!isReadOnly && (
                        <div className="flex gap-2">
                           <button onClick={() => handleDeleteSet(activeExerciseIdx, type as SetType)} className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-rose-500 transition-colors bg-white/5 rounded-lg"><Minus size={16}/></button>
                           <button onClick={() => handleAddSet(activeExerciseIdx, type as SetType)} className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-primary transition-colors bg-white/5 rounded-lg"><Plus size={16}/></button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {setsOfType.length === 0 && <div className="p-4 border border-dashed border-white/5 rounded-xl text-center text-[10px] font-bold text-zinc-800 uppercase italic">Fără seturi de {type}</div>}
                      {setsOfType.map((set) => (
                        <div key={set.id} className={`grid grid-cols-[1fr_80px_70px_55px_45px] gap-2 items-center p-3 rounded-xl border transition-all ${
                          set.isDisabledByAdvancedMode ? 'opacity-30 grayscale pointer-events-none' : (set.completed ? 'bg-primary/5 border-primary/20' : 'bg-surface border-white/5')
                        } ${set.isPrimaryTopSet ? 'ring-2 ring-primary/30 border-primary/50' : ''}`}>
                          
                          <button disabled={isReadOnly || set.isDisabledByAdvancedMode} onClick={() => handleUpdateSet(activeExerciseIdx, set.originalIdx, { isPrimaryTopSet: !set.isPrimaryTopSet })}
                            className={`text-[9px] font-black uppercase text-left flex flex-col items-start ${set.isPrimaryTopSet ? 'text-primary' : 'text-zinc-600'}`}>
                            <span className="leading-tight">{set.isDisabledByAdvancedMode ? 'DEZACTIVAT' : (set.isPrimaryTopSet ? 'PRINCIPAL' : (set.type === 'TOP' ? 'TOP SET' : 'WORKING'))}</span>
                            {set.isPrimaryTopSet && <Star size={8} fill="currentColor" className="mt-0.5" />}
                          </button>

                          <div className="relative">
                            <input disabled={isReadOnly || set.isDisabledByAdvancedMode} type="number" className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 text-center font-bold text-white text-sm" 
                              value={set.weight || ''} onChange={(e) => handleUpdateSet(activeExerciseIdx, set.originalIdx, { weight: Number(e.target.value) })} />
                            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-black text-zinc-700 bg-zinc-900 px-1 uppercase">KG</span>
                          </div>

                          <div className="relative">
                            <input disabled={isReadOnly || set.isDisabledByAdvancedMode} type="number" className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 text-center font-bold text-white text-sm" 
                              value={set.reps || ''} onChange={(e) => handleUpdateSet(activeExerciseIdx, set.originalIdx, { reps: Number(e.target.value) })} />
                            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-black text-zinc-700 bg-zinc-900 px-1 uppercase">REPS</span>
                          </div>

                          <div className="relative">
                            <input disabled={isReadOnly || set.isDisabledByAdvancedMode} type="number" className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 text-center font-bold text-zinc-400 text-xs" 
                              value={set.rir === null ? '' : set.rir} onChange={(e) => handleUpdateSet(activeExerciseIdx, set.originalIdx, { rir: e.target.value === '' ? null : Number(e.target.value) })} />
                            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-black text-zinc-700 bg-zinc-900 px-1 uppercase">RIR</span>
                          </div>

                          <button disabled={isReadOnly || set.isDisabledByAdvancedMode} onClick={() => handleUpdateSet(activeExerciseIdx, set.originalIdx, { completed: !set.completed })} 
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-700'}`}>
                            <Check size={20} strokeWidth={4} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}
    </div>
  );
};