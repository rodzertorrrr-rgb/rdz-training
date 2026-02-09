
import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon, Play, Pause, RotateCcw, Plus, Minus, X, Bell } from 'lucide-react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, id }) => (
  <div 
    id={id} 
    onClick={onClick} 
    className={`bg-surface border border-white/5 rounded-2xl p-5 shadow-xl ${className}`}
  >
    {children}
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary'|'secondary'|'danger'|'outline'|'ghost';
  size?: 'sm'|'md'|'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  disabled, 
  icon: Icon,
  type = 'button'
}) => {
  const base = "font-black uppercase italic tracking-tighter rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-black hover:bg-primaryDark shadow-lg shadow-primary/20",
    secondary: "bg-surfaceHighlight text-zinc-300 hover:bg-zinc-800",
    danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
    outline: "border border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40",
    ghost: "text-zinc-500 hover:text-white hover:bg-surfaceHighlight/50"
  };
  const sizes = {
    sm: "text-[10px] px-3 py-2",
    md: "text-xs px-5 py-3.5",
    lg: "text-sm px-8 py-4"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled} 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={3} />}
      {children}
    </button>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  color?: 'zinc'|'emerald'|'rose'|'amber'|'blue'|'gold';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gold' }) => {
  const colors = {
    zinc: "bg-zinc-900 text-zinc-500 border-white/5",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    amber: "bg-primary/20 text-primary border-primary/40",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    gold: "bg-primary text-black border-primary font-black",
  };
  return (
    <span className={`
      inline-flex items-center justify-center
      px-2 py-0.5 
      rounded-md 
      text-[9px] font-bold uppercase tracking-widest 
      border 
      ${colors[color]}
    `}>
      {children}
    </span>
  );
};

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props}
    className={`bg-surfaceHighlight border border-white/5 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-primary/50 transition-colors w-full font-bold ${props.className}`}
  />
);

interface LabelProps {
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ children }) => (
  <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black mb-2">
    {children}
  </label>
);

export const RestTimer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(120); 
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      audioRef.current?.play().catch(() => {});
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-6">
      <div className="w-full max-w-xs bg-surface border border-white/10 rounded-3xl p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-700 hover:text-white"><X size={24} /></button>
        <div className="text-center mb-10">
          <h3 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-4">Pauză Activă</h3>
          <div className="text-7xl font-black font-mono text-white tracking-tighter italic">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="flex justify-center gap-6 mb-10">
           <button onClick={() => setIsActive(!isActive)} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-white/5 text-zinc-600' : 'bg-primary text-black shadow-lg shadow-primary/20'}`}>
             {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
           </button>
           <button onClick={() => { setIsActive(false); setTimeLeft(120); }} className="w-20 h-20 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center"><RotateCcw size={28} /></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
           <Button variant="outline" size="sm" onClick={() => setTimeLeft(prev => Math.max(0, prev - 15))}>-15s</Button>
           <Button variant="outline" size="sm" onClick={() => setTimeLeft(prev => prev + 15)}>+15s</Button>
        </div>
      </div>
    </div>
  );
};

export const PlateCalculatorModal: React.FC<{ targetWeight: number; onClose: () => void }> = ({ targetWeight, onClose }) => {
  const needed = (targetWeight - 20) / 2;
  const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
  const result: number[] = [];
  let rem = needed;
  plates.forEach(p => { while(rem >= p) { result.push(p); rem -= p; } });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-6" onClick={onClose}>
      <div className="bg-surface border border-white/10 w-full max-w-xs rounded-3xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6">Plate Calc</h3>
        <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="text-center flex-1">
            <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">Total</span>
            <span className="text-xl font-black text-primary">{targetWeight}kg</span>
          </div>
          <div className="w-px h-8 bg-white/10 mx-4"></div>
          <div className="text-center flex-1">
            <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">Pe Parte</span>
            <span className="text-xl font-black text-white">{needed}kg</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {result.length === 0 ? <p className="text-zinc-600 italic text-xs uppercase font-bold">Bara goală (20kg)</p> : 
            result.map((p, i) => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-primary/40 bg-zinc-900 flex items-center justify-center text-[10px] font-black text-primary shadow-lg">
                {p}
              </div>
            ))
          }
        </div>
        <Button onClick={onClose} className="w-full">Închide</Button>
      </div>
    </div>
  );
};
