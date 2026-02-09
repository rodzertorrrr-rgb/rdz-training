import React from 'react';
import { AppRoute, User } from '../types';
import { Home, TrendingUp, Settings, Activity, History, BookOpen, MoreHorizontal } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  currentUser: User | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeRoute, navigate, currentUser }) => {
  const isWorkoutActive = activeRoute === AppRoute.LOG_WORKOUT;
  const isLogin = activeRoute === AppRoute.LOGIN;
  const hideNav = isLogin || isWorkoutActive;

  const isJurnalActive = activeRoute === AppRoute.WORKOUT_LOG_TAB || activeRoute === AppRoute.DASHBOARD;

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col selection:bg-primary selection:text-black">
      <main className={`flex-1 max-w-lg mx-auto w-full p-4 relative ${!hideNav ? 'pb-24' : ''}`}>
        {children}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-xl border-t border-white/5 px-1 py-3 flex justify-around items-center z-50 max-w-lg mx-auto right-0">
          <button onClick={() => navigate(AppRoute.WORKOUT_LOG_TAB)} 
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${isJurnalActive ? 'text-primary' : 'text-zinc-600'}`}>
            <Activity size={18} /><span className="text-[7px] font-bold uppercase tracking-widest">Jurnal</span>
          </button>

          <button onClick={() => navigate(AppRoute.PROGRESS)}
             className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeRoute === AppRoute.PROGRESS ? 'text-primary' : 'text-zinc-600'}`}>
            <TrendingUp size={18} /><span className="text-[7px] font-bold uppercase tracking-widest">Progres</span>
          </button>

          <button onClick={() => navigate(AppRoute.HISTORY)}
             className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeRoute === AppRoute.HISTORY ? 'text-primary' : 'text-zinc-600'}`}>
            <History size={18} /><span className="text-[7px] font-bold uppercase tracking-widest">Istoric</span>
          </button>

          <button onClick={() => navigate(AppRoute.TACTICS)}
             className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeRoute === AppRoute.TACTICS ? 'text-primary' : 'text-zinc-600'}`}>
            <BookOpen size={18} /><span className="text-[7px] font-bold uppercase tracking-widest">Tehnică</span>
          </button>
          
          <button onClick={() => navigate(AppRoute.MORE)}
             className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeRoute === AppRoute.MORE ? 'text-primary' : 'text-zinc-600'}`}>
            <MoreHorizontal size={18} /><span className="text-[7px] font-bold uppercase tracking-widest">Mai mult</span>
          </button>
        </nav>
      )}
    </div>
  );
};