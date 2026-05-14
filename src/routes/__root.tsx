import React, { useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../store/authStore';
import { Login } from '../features/auth/Login';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // ZUSTAND LAW: Strict Selectors ONLY
  const isInitialized = useAuthStore(s => s.isInitialized);
  const session = useAuthStore(s => s.session);
  const initializeAuth = useAuthStore(s => s.initializeAuth);
  const signOut = useAuthStore(s => s.signOut);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // GUARD 1: Prevent rendering while Supabase checks local storage for a token
  if (!isInitialized) {
    return (
      <div className="h-screen w-screen bg-[#0A0B0E] flex items-center justify-center">
        <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest animate-pulse">
          Initializing Security...
        </p>
      </div>
    );
  }

  // GUARD 2: No token? Render the Login portal and stop here.
  if (!session) {
    return <Login />;
  }

  // AUTHORIZED ZONE (Phase 3 Dashboard will replace this shell)
  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
        <div className="font-black text-slate-800 tracking-widest uppercase text-sm">
          Vetaura Test Shell
        </div>
        <div className="flex items-center gap-4">
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
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}