import React, { useState, useEffect } from 'react';
import { AppRoute, User } from '../types';
import { Layout } from './Layout';
import { Dashboard } from '../pages/Dashboard';
import { ProgramView } from '../pages/ProgramView';
import { WorkoutLogger } from '../pages/WorkoutLogger';
import { WorkoutLogTab } from '../pages/WorkoutLogTab';
import { Progress } from '../pages/Progress';
import { CheckIn } from '../pages/CheckIn';
import { Tactics } from '../pages/Tactics';
import { History } from '../pages/History';
import { Login } from '../pages/Login';
import { Settings } from '../pages/Settings';
import { More } from '../pages/More';
import { AdvancedMode } from '../pages/AdvancedMode';
import { db } from '../services/db';

export default function App() {
  const [user, setUser] = useState<User | null>(db.getCurrentUser());
  const [route, setRoute] = useState<AppRoute>(user ? AppRoute.DASHBOARD : AppRoute.LOGIN);
  const [routeParams, setRouteParams] = useState<any>({});

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (!currentUser && route !== AppRoute.LOGIN) {
      setRoute(AppRoute.LOGIN);
    }
  }, [route]);

  const navigate = (newRoute: AppRoute, params?: any) => {
    if (newRoute === AppRoute.LOGIN) {
      db.logout();
      setUser(null);
    }
    setRoute(newRoute);
    if (params) setRouteParams(params);
    else setRouteParams({});
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (u: User) => {
    setUser(u);
    navigate(AppRoute.DASHBOARD);
  };

  const renderPage = () => {
    if (!user && route !== AppRoute.LOGIN) return <Login key="login-fallback" onLogin={handleLogin} />;

    switch (route) {
      case AppRoute.LOGIN:
        return <Login key="login" onLogin={handleLogin} />;
      case AppRoute.DASHBOARD:
        return <Dashboard key="dashboard" navigate={navigate} />;
      case AppRoute.PROGRAM:
        return <ProgramView key="program" navigate={navigate} />;
      case AppRoute.WORKOUT_LOG_TAB:
        return <WorkoutLogTab key="log-tab" navigate={navigate} />;
      case AppRoute.LOG_WORKOUT:
        return (
          <WorkoutLogger 
            key={routeParams.sessionId || routeParams.dayId || 'logger-default'}
            dayId={routeParams.dayId} 
            sessionId={routeParams.sessionId}
            editMode={routeParams.editMode}
            onFinish={() => navigate(AppRoute.HISTORY)}
            onBack={() => {
              if (routeParams.sessionId) navigate(AppRoute.HISTORY);
              else navigate(AppRoute.WORKOUT_LOG_TAB);
            }}
          />
        );
      case AppRoute.PROGRESS:
        return <Progress key="progress" />;
      case AppRoute.HISTORY:
        return <History key="history" navigate={navigate} />;
      case AppRoute.CHECKIN:
        return <CheckIn key="checkin" navigate={navigate} />;
      case AppRoute.TACTICS:
        return <Tactics key="tactics" />;
      case AppRoute.SETTINGS:
        return <Settings navigate={navigate} />;
      case AppRoute.MORE:
        return <More navigate={navigate} />;
      case AppRoute.ADVANCED_MODE:
        return <AdvancedMode navigate={navigate} />;
      default:
        return <Dashboard key="dashboard-default" navigate={navigate} />;
    }
  };

  return (
    <Layout activeRoute={route} navigate={navigate} currentUser={user}>
      {renderPage()}
    </Layout>
  );
}