import React, { useState } from 'react';
import { db } from '../services/db';
import { Button, Card, Label } from '../components/ui';
import { AppRoute } from '../types';
import { Save } from 'lucide-react';

export const CheckIn: React.FC<{ navigate: (r: AppRoute) => void }> = ({ navigate }) => {
  const user = db.getCurrentUser();
  const [flat, setFlat] = useState(false);
  const [pain, setPain] = useState(false);
  const [perfDrop, setPerfDrop] = useState(false);

  const handleSubmit = () => {
    if (!user) return;

    // Logic: If 2 of 3 are true -> Needs Deload
    const score = (flat ? 1 : 0) + (pain ? 1 : 0) + (perfDrop ? 1 : 0);
    const needsDeload = score >= 2;

    db.addCheckin({
      id: Math.random().toString(),
      userId: user.id,
      date: new Date().toISOString(),
      feelingFlat: !!flat,
      jointPain: !!pain,
      performanceDrop: !!perfDrop,
      needsDeload
    });

    navigate(AppRoute.DASHBOARD);
  };

  return (
    <div className="max-w-md mx-auto pb-20 pt-10 px-4">
      <h1 className="text-2xl font-bold text-white mb-2">Check-in Săptămânal</h1>
      <p className="text-zinc-400 mb-8">Răspunde sincer pentru a calibra autoreglarea.</p>

      <div className="space-y-4">
        <Card onClick={() => setFlat(!flat)} className={`cursor-pointer border-2 transition-colors ${flat ? 'border-amber-500 bg-amber-500/10' : 'border-surfaceHighlight'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${flat ? 'border-amber-500' : 'border-zinc-600'}`}>
              {flat && <div className="w-3 h-3 bg-amber-500 rounded-full" />}
            </div>
            <div>
              <h3 className="font-bold text-white">Pompare slabă / Flat</h3>
              <p className="text-sm text-zinc-500">Simți că mușchii nu se "umflă" la antrenament?</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => setPain(!pain)} className={`cursor-pointer border-2 transition-colors ${pain ? 'border-amber-500 bg-amber-500/10' : 'border-surfaceHighlight'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${pain ? 'border-amber-500' : 'border-zinc-600'}`}>
              {pain && <div className="w-3 h-3 bg-amber-500 rounded-full" />}
            </div>
            <div>
              <h3 className="font-bold text-white">Dureri articulare</h3>
              <p className="text-sm text-zinc-500">Persistă mai mult de 7 zile?</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => setPerfDrop(!perfDrop)} className={`cursor-pointer border-2 transition-colors ${perfDrop ? 'border-amber-500 bg-amber-500/10' : 'border-surfaceHighlight'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${perfDrop ? 'border-amber-500' : 'border-zinc-600'}`}>
              {perfDrop && <div className="w-3 h-3 bg-amber-500 rounded-full" />}
            </div>
            <div>
              <h3 className="font-bold text-white">Scădere performanță</h3>
              <p className="text-sm text-zinc-500">Ai scăzut greutatea sau repetările la 2+ exerciții cheie?</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={handleSubmit} className="w-full py-4" icon={Save}>
          Salvează Raportul
        </Button>
      </div>
    </div>
  );
};