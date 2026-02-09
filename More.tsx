import React from 'react';
import { Card, Button } from '../components/ui';
import { AppRoute } from '../types';
import { 
  Settings, 
  Zap, 
  Scan, 
  Download, 
  ChevronRight, 
  LayoutDashboard,
  LogOut,
  Info
} from 'lucide-react';

interface MoreProps {
  navigate: (route: AppRoute) => void;
}

export const More: React.FC<MoreProps> = ({ navigate }) => {
  const menuItems = [
    { 
      id: AppRoute.DASHBOARD, 
      label: 'Home & Recomandări', 
      icon: LayoutDashboard, 
      color: 'text-zinc-400' 
    },
    { 
      id: AppRoute.ADVANCED_MODE, 
      label: 'Modul Avansat', 
      icon: Zap, 
      color: 'text-primary',
      description: 'Wave-uri volum & cicluri'
    },
    { 
      id: AppRoute.SETTINGS, 
      label: 'Setări & Diagnoză', 
      icon: Settings, 
      color: 'text-zinc-400',
      description: 'Backup, Scanner erori'
    },
  ];

  return (
    <div className="pb-24 pt-4 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Mai <span className="text-primary">Mult</span></h1>
      
      <div className="space-y-3">
        {menuItems.map((item) => (
          <Card 
            key={item.id} 
            onClick={() => navigate(item.id)}
            className="flex items-center justify-between p-5 cursor-pointer hover:border-primary/20 group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-surfaceHighlight group-hover:bg-primary/10 transition-colors ${item.color}`}>
                <item.icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase italic tracking-tight">{item.label}</h3>
                {item.description && <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{item.description}</p>}
              </div>
            </div>
            <ChevronRight size={18} className="text-zinc-800 group-hover:text-primary transition-colors" />
          </Card>
        ))}
      </div>

      <div className="p-4 bg-surfaceHighlight/30 border border-white/5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 px-1">
          <Info size={14} /> Informații Aplicație
        </div>
        <div className="flex justify-between text-[11px] font-bold uppercase px-1">
          <span className="text-zinc-700">Versiune</span>
          <span className="text-white">v3.1 Stable</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold uppercase px-1">
          <span className="text-zinc-700">Tip Licență</span>
          <span className="text-primary">Advanced Pro</span>
        </div>
      </div>

      <Button 
        onClick={() => navigate(AppRoute.LOGIN)} 
        variant="ghost" 
        className="w-full text-zinc-600 hover:text-rose-500 py-4 font-black uppercase tracking-widest text-[10px]"
        icon={LogOut}
      >
        Deconectare Profil
      </Button>
    </div>
  );
};