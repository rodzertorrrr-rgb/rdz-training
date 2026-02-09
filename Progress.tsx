import React, { useState, useMemo } from 'react';
import { db } from '../services/db';
import { Card, Badge } from '../components/ui';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Minus, Search } from 'lucide-react';

export const Progress: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const allExercises = useMemo(() => {
    return db.getProgram().flatMap(d => d.exercises);
  }, []);

  const exercisesWithHistory = useMemo(() => {
    return allExercises.filter(ex => db.getPrimaryTopSetHistory(ex.id).length > 0);
  }, [allExercises]);

  const filteredExercises = useMemo(() => {
    return exercisesWithHistory.filter(ex => 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exercisesWithHistory, searchQuery]);

  const [selectedExId, setSelectedExId] = useState(exercisesWithHistory[0]?.id || '');

  const history = useMemo(() => db.getPrimaryTopSetHistory(selectedExId), [selectedExId]);
  
  const lastEntry = history[history.length - 1];
  const prevEntry = history[history.length - 2];

  const chartData = useMemo(() => history.map(h => ({
    date: new Date(h.date).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' }),
    weight: h.weight,
    reps: h.reps,
    e1rm: h.e1rm || 0
  })), [history]);

  const diffWeight = prevEntry ? lastEntry.weight - prevEntry.weight : 0;
  
  return (
    <div className="pb-28 pt-4 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Analiză <span className="text-primary">Evoluție</span></h1>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Caută exercițiu..." 
            className="w-full bg-surface border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
          {filteredExercises.map(ex => (
            <button
              key={ex.id}
              onClick={() => setSelectedExId(ex.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedExId === ex.id 
                  ? 'bg-primary text-black border-primary' 
                  : 'bg-surfaceHighlight text-zinc-500 border-white/5'
              }`}
            >
              {ex.name}
            </button>
          ))}
          {filteredExercises.length === 0 && searchQuery && (
            <span className="text-zinc-600 text-[10px] uppercase font-black py-2">Fără rezultate</span>
          )}
        </div>
      </div>

      {!selectedExId || history.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 bg-surface/30 border border-dashed border-white/5 rounded-3xl p-6">
          <Activity className="mx-auto mb-4 opacity-10" size={64} />
          <p className="italic text-sm font-bold uppercase tracking-widest text-zinc-500">Așteptăm primele date...</p>
          <p className="text-[10px] text-zinc-700 mt-2 uppercase tracking-tight">Finalizează un antrenament pentru a începe monitorizarea.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <Card className="p-4 bg-surfaceHighlight/30 border-white/5">
                <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Ultimul Top Set</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white italic">{lastEntry.weight}kg</span>
                  <span className="text-xs font-bold text-zinc-400">×{lastEntry.reps}</span>
                </div>
                {prevEntry && (
                  <div className={`mt-2 flex items-center gap-1 text-[9px] font-black uppercase ${diffWeight >= 0 ? 'text-primary' : 'text-rose-500'}`}>
                    {diffWeight > 0 ? <ArrowUpRight size={10}/> : diffWeight < 0 ? <ArrowDownRight size={10}/> : <Minus size={10}/>}
                    {Math.abs(diffWeight)}kg delta
                  </div>
                )}
             </Card>
             <Card className="p-4 bg-surfaceHighlight/30 border-white/5">
                <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">e1RM (Epley)</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black italic ${lastEntry.e1rm ? 'text-primary' : 'text-zinc-700'}`}>
                    {lastEntry.e1rm ? `${lastEntry.e1rm}kg` : '--'}
                  </span>
                </div>
                {!lastEntry.e1rm && (
                   <div className="mt-2 text-[8px] text-zinc-700 font-bold uppercase leading-tight">Limita 1-12 reps.</div>
                )}
                {lastEntry.e1rm && prevEntry && prevEntry.e1rm && (
                   <div className={`mt-2 flex items-center gap-1 text-[9px] font-black uppercase ${lastEntry.e1rm >= prevEntry.e1rm ? 'text-primary' : 'text-rose-500'}`}>
                     {lastEntry.e1rm > prevEntry.e1rm ? <ArrowUpRight size={10}/> : lastEntry.e1rm < prevEntry.e1rm ? <ArrowDownRight size={10}/> : <Minus size={10}/>}
                     {Math.abs(lastEntry.e1rm - prevEntry.e1rm)}kg delta
                   </div>
                )}
             </Card>
          </div>

          <Card className="p-6 border-white/5 bg-gradient-to-b from-surfaceHighlight/50 to-surface">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic tracking-widest">Evoluție Forță (kg)</h3>
              <TrendingUp size={14} className="text-primary/40" />
            </div>
            <div className="h-48 w-full" style={{ minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="date" stroke="#333" fontSize={9} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#333" fontSize={9} tickLine={false} axisLine={false} width={25} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '12px' }}
                    labelStyle={{ fontSize: '10px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'black', color: '#d4af37' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-3">
             <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Istoric Sesiuni (Top Set Principal)</h3>
             {history.slice().reverse().map((data, i) => (
               <div key={i} className="flex justify-between items-center p-4 bg-surface border border-white/5 rounded-2xl transition-all hover:border-primary/20">
                 <div>
                   <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block mb-1">{new Date(data.date).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' })}</span>
                   <p className="text-sm font-bold text-white uppercase italic">{data.weight}kg × {data.reps} <span className="text-zinc-600 text-[10px] not-italic ml-1">RIR {data.rir ?? '?'}</span></p>
                 </div>
                 <div className="text-right">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-0.5">e1RM</span>
                    <span className="text-sm font-black text-primary italic">{data.e1rm ? `${data.e1rm}kg` : '--'}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};