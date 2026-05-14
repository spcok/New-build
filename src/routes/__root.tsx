import React, { useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { PGliteProvider } from '@electric-sql/pglite-react';
import { useAuthStore } from '../store/authStore';
import { Login } from '../features/auth/Login';
import { pg } from '../lib/db';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isInitialized = useAuthStore(s => s.isInitialized);
  const session = useAuthStore(s => s.session);
  const initializeAuth = useAuthStore(s => s.initializeAuth);
  const signOut = useAuthStore(s => s.signOut);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen bg-[#0A0B0E] flex items-center justify-center">
        <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest animate-pulse">
          Initializing Security...
        </p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0">
        <div className="font-black text-slate-800 tracking-widest uppercase text-sm">
          Vetaura Systems
        </div>
        <div className="flex items-center gap-4">
          {/* Local Mode Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            Local Vault Active
          </div>
          
          <div className="text-xs font-bold text-slate-800">
            {session.user?.email}
          </div>
          <button 
            onClick={signOut} 
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        {/* CRITICAL: Providing the local database to the UI tree */}
        <PGliteProvider db={pg}>
          <Outlet />
        </PGliteProvider>
      </main>
    </div>
  );
}