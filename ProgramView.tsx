
import React, { useState } from 'react';
import { db } from '../services/db';
import { Badge, Card, Button } from '../components/ui';
import { Info, Play } from 'lucide-react';
import { AppRoute } from '../types';

interface ProgramViewProps {
  navigate: (route: AppRoute, params?: any) => void;
}

export const ProgramView: React.FC<ProgramViewProps> = ({ navigate }) => {
  const program = db.getProgram();
  const [activeTab, setActiveTab] = useState(program[0].id);

  const activeDay = program.find(d => d.id === activeTab) || program[0];

  return (
    <div className="pb-32">
      <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter italic">Plan <span className="text-primary">Antrenament</span></h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2">
        {program.map(day => (
          <button
            key={day.id}
            onClick={() => setActiveTab(day.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
              activeTab === day.id 
                ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10' 
                : 'bg-surfaceHighlight text-zinc-500 border-white/5 hover:text-white'
            }`}
          >
            {day.name}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-primary/20 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white leading-tight uppercase tracking-tight italic">{activeDay.focus}</h2>
              <span className="text-[10px] text-primary uppercase font-extrabold tracking-widest">{activeDay.name}</span>
            </div>
        </div>

        <div className="space-y-4">
          {activeDay.exercises.map((ex, idx) => {
            const isPriority = ex.notes.toLowerCase().includes('volum prioritar');
            const hasTopSet = !!ex.topSetTarget;
            
            return (
              <Card key={ex.id} className="relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className={`absolute top-0 left-0 w-0.5 h-full transition-colors ${isPriority ? 'bg-primary' : 'bg-zinc-800'}`}></div>
                <div className="pl-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white pr-2 leading-none flex items-center gap-3">
                      <span className="text-primary text-sm font-mono opacity-50">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                      {ex.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {ex.isKeyLift && <Badge color="gold">KEY LIFT</Badge>}
                      {isPriority && <Badge color="amber">VOLUM PRIORITAR</Badge>}
                      {ex.isSupportVolume && !isPriority && <Badge color="emerald">SIMETRIE</Badge>}
                    </div>
                  </div>
                  
                  <p className="text-zinc-500 text-xs mb-6 italic flex items-center gap-2 leading-relaxed">
                    <Info size={12} className="text-primary/40 shrink-0" /> {ex.notes}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                      <span className="block text-[8px] text-zinc-500 uppercase font-extrabold tracking-widest mb-1.5 leading-none">Pregătire</span>
                      <span className="text-zinc-300 text-sm font-medium">{ex.rampUpSets}</span>
                    </div>
                    <div className={`${!hasTopSet ? 'bg-zinc-900/40 opacity-70' : 'bg-primary/5 border-primary/20'} p-3 rounded-lg border`}>
                      <span className="block text-[8px] text-primary uppercase font-extrabold tracking-widest mb-1.5 leading-none">{!hasTopSet ? 'Volum principal' : 'Top Set'}</span>
                      <div className="text-white font-bold text-sm">
                        {hasTopSet ? (
                          <>
                            {ex.topSetTarget?.minReps}-{ex.topSetTarget?.maxReps} Reps <span className="text-primary/50 mx-1">/</span> RIR {ex.topSetTarget?.targetRIR}
                          </>
                        ) : (
                          "Volum Standard"
                        )}
                      </div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                      <span className="block text-[8px] text-zinc-500 uppercase font-extrabold tracking-widest mb-1.5 leading-none">Regulă Volum</span>
                      <span className="text-zinc-300 text-sm font-medium">{ex.backOffRule}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          {activeDay.exercises.length === 0 && (
            <div className="text-center py-20 bg-surface border border-dashed border-white/5 rounded-xl">
               <p className="text-zinc-500 text-sm italic font-medium">Niciun exercițiu definit în acest program.</p>
               <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mt-2">Personalizează planul prin adăugarea de exerciții ad-hoc.</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-20 left-0 w-full px-4 z-40 max-w-lg mx-auto right-0">
        <Button 
          onClick={() => navigate(AppRoute.LOG_WORKOUT, { dayId: activeDay.id })} 
          className="w-full shadow-2xl shadow-primary/20 border border-primary/20" 
          size="lg"
          variant="primary"
          icon={Play}
        >
          ÎNCEPE {activeDay.name.toUpperCase()}
        </Button>
      </div>
    </div>
  );
};
