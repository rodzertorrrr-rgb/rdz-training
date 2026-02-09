import React, { useState, useRef } from 'react';
import { db } from '../services/db';
import { Button, Card } from '../components/ui';
import { Download, Upload, Trash2, LogOut, Scan, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { AppRoute } from '../types';

export const Settings: React.FC<{ navigate: (r: AppRoute) => void }> = ({ navigate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanResult, setScanResult] = useState<{ errors: string[], status: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleExport = () => {
    const data = {
      sessions: localStorage.getItem('roberto_v3_sessions'),
      users: localStorage.getItem('roberto_v3_users'),
      checkins: localStorage.getItem('roberto_v3_checkins')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rdz_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.sessions) localStorage.setItem('roberto_v3_sessions', data.sessions);
        if (data.users) localStorage.setItem('roberto_v3_users', data.users);
        if (data.checkins) localStorage.setItem('roberto_v3_checkins', data.checkins);
        alert('Import reușit! Aplicația se va reîncărca.');
        window.location.reload();
      } catch (err) {
        alert('Fișier invalid.');
      }
    };
    reader.readAsText(file);
  };

  const runScanner = () => {
    setIsScanning(true);
    setTimeout(() => {
      const result = db.runErrorScanner();
      setScanResult(result);
      setIsScanning(false);
    }, 1200);
  };

  const fixErrors = () => {
    if (confirm("Această acțiune va șterge orice DRAFT activ pentru a curăța datele corupte. Sesiunile COMPLETED sunt sigure. Continui?")) {
      db.fixErrors();
      alert("Sesiunile corupte au fost eliminate. Draft-ul tău va începe de la zero data viitoare.");
      setScanResult(null);
    }
  };

  return (
    <div className="pb-24 pt-4 px-1 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sistem <span className="text-primary">Config</span></h1>
      
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Instrumente Diagnostic</h3>
        <Card className="bg-surface border-white/5 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${scanResult?.errors.length ? 'bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'bg-primary/10 text-primary'}`}>
              <Scan size={28}/>
            </div>
            <div>
              <h4 className="font-bold text-white text-base uppercase italic">Error Scanner</h4>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Detectează leak-uri între exerciții sau sesiuni corupte.</p>
            </div>
          </div>

          {scanResult && (
            <div className={`p-4 rounded-xl border text-[11px] font-bold animate-in zoom-in-95 ${scanResult.errors.length ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'}`}>
              {scanResult.errors.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-500 font-black"><AlertTriangle size={14}/> ANOMALII DETECTATE:</div>
                  <ul className="space-y-1 pl-1">
                    {scanResult.errors.map((e, i) => <li key={i} className="opacity-90">• {e}</li>)}
                  </ul>
                  <Button onClick={fixErrors} variant="danger" size="sm" className="w-full mt-2 font-black uppercase">Fix Automat & Curățare</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-black uppercase tracking-widest"><CheckCircle size={14} className="text-emerald-500"/> Integritate sistem: 100% OK</div>
              )}
            </div>
          )}

          <Button onClick={runScanner} disabled={isScanning} variant="outline" className="w-full py-4 text-xs font-black uppercase tracking-widest" icon={Scan}>
            {isScanning ? 'Se scanează baza de date...' : 'Scanează Erori'}
          </Button>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Management Date</h3>
        <Card className="bg-surface border-white/5 p-6">
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleExport} variant="outline" size="sm" icon={Download} className="text-[10px] font-black uppercase tracking-wider">Export Backup</Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" icon={Upload} className="text-[10px] font-black uppercase tracking-wider">Import Backup</Button>
            <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
          </div>
        </Card>
      </section>

      <section className="pt-10">
        <Button onClick={() => navigate(AppRoute.LOGIN)} variant="danger" className="w-full py-5 text-xs font-black uppercase italic tracking-widest" icon={LogOut}>
          Deconectare Profil
        </Button>
      </section>

      <footer className="text-center opacity-20 pt-10">
        <ShieldCheck size={24} className="mx-auto mb-2" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em]">RDZ PROTECT • SECURE DATA LAYER</p>
      </footer>
    </div>
  );
};