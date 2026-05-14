import React, { useState } from 'react';
import { useLiveQuery } from '@electric-sql/pglite-react';
import { Heart, AlertCircle, Calendar, Scale, Drumstick, ClipboardCheck, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('ALL');

  // LOCAL REACTIVE SQL: Fetch Animals
  const animalsQuery = useLiveQuery(
    `SELECT * FROM animals WHERE is_deleted = false ORDER BY name ASC`
  );
  const animals = animalsQuery?.rows || [];

  // LOCAL REACTIVE SQL: Fetch Tasks
  const tasksQuery = useLiveQuery(
    `SELECT * FROM tasks WHERE status = 'PENDING' AND is_deleted = false`
  );
  const tasks = tasksQuery?.rows || [];

  const filteredAnimals = activeTab === 'ALL' 
    ? animals 
    : animals.filter(a => a.category === activeTab);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-0.5 flex items-center gap-2 text-xs">
            Live Local Sync <span className="text-slate-300">|</span> 🌤️ Active
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col transition-all duration-300 h-64">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><ClipboardCheck size={18} /></div>
                      <h2 className="text-base font-semibold text-slate-800">Pending Duties</h2>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{tasks.length}</span>
              </div>
              <div className="mt-3 flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                  {tasks.length > 0 ? tasks.map((t: any) => (
                      <div key={t.id} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <AlertCircle size={12} className="text-amber-600 mt-1"/>
                          <div>
                              <p className="text-xs font-medium text-slate-900">{t.title}</p>
                              <p className="text-[10px] text-slate-500">Due: {t.due_date || 'N/A'}</p>
                          </div>
                      </div>
                  )) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <CheckCircle size={24} className="text-emerald-500 mb-2"/>
                          <p className="text-xs">All duties satisfied</p>
                      </div>
                  )}
              </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col transition-all duration-300 h-64">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Heart size={18} /></div>
                      <h2 className="text-base font-semibold text-slate-800">Health Rota</h2>
                  </div>
              </div>
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Heart size={24} className="text-rose-300 mb-2"/>
                  <p className="text-xs">Collection Stable</p>
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide bg-slate-100 p-1 rounded-xl gap-1">
        {['ALL', 'OWLS', 'RAPTORS', 'MAMMALS', 'EXOTICS', 'ARCHIVED'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`flex-1 min-w-[100px] py-2 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors whitespace-nowrap ${
              activeTab === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Database Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <tr>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Species</th>
                <th className="px-4 py-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnimals.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                      <Scale size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Local Vault Empty</h3>
                    <p className="text-xs text-slate-500 mt-1">Awaiting downstream sync from Supabase.</p>
                  </td>
                </tr>
              ) : (
                filteredAnimals.map(animal => (
                  <tr key={animal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-bold text-slate-900">{animal.name || 'Unnamed'}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{animal.species || 'Unknown'}</td>
                    <td className="px-4 py-4 text-sm font-medium text-emerald-600 bg-emerald-50/50">{animal.location || 'Unknown'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}