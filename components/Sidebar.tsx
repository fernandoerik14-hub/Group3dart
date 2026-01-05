
import React from 'react';
import { WorkStatus, Employee } from '../types';

interface SidebarProps {
  setView: (view: string) => void;
  currentView: string;
  currentWorkStatus: WorkStatus;
  user: Employee;
  onLogout: () => void;
  onTimeLog: (type: 'Entrada' | 'Almoço' | 'Retorno' | 'Saída') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setView, currentView, currentWorkStatus, onTimeLog, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Meus Projetos', icon: 'fa-layer-group', group: 'Operação' },
    { id: 'clients', label: 'Montadoras', icon: 'fa-users', group: 'Operação' },
    { id: 'hr', label: 'Configurações', icon: 'fa-cog', group: 'Sistema' },
    { id: 'video-meeting', label: 'Reunião Online', icon: 'fa-video', group: 'Comunicação' },
    { id: 'whatsapp', label: 'WhatsApp G3', icon: 'fa-brands fa-whatsapp', group: 'Comunicação' },
  ];

  const allowedItems = menuItems.filter(item => user.permissions?.includes(item.id) || user.role === 'Diretor de Arte');

  return (
    <aside className="w-20 md:w-72 bg-[#0b1120] border-r border-slate-800/60 flex flex-col h-full shrink-0 shadow-2xl">
      <div className="p-8 flex items-center gap-4 cursor-pointer" onClick={() => setView('dashboard')}>
        <div className="w-12 h-12 brand-gradient brand-shape flex items-center justify-center text-white font-bold text-xl shadow-lg">G3</div>
        <div className="hidden md:block">
          <h1 className="text-xl font-black tracking-tighter text-white">G3 ART</h1>
          <p className="text-[9px] text-[#C0562F] uppercase tracking-[0.3em] font-black">Studio Cloud</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar py-6">
        {['Operação', 'Sistema', 'Comunicação'].map(group => {
          const groupItems = allowedItems.filter(i => i.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group} className="space-y-2">
              <p className="hidden md:block px-3 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 opacity-50">{group}</p>
              {groupItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${currentView === item.id ? 'bg-[#C0562F] text-white shadow-xl' : 'text-slate-500 hover:bg-slate-800/40 hover:text-white'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentView === item.id ? 'bg-white/20' : 'bg-slate-900 group-hover:bg-slate-800'}`}>
                    <i className={`fas ${item.icon} text-sm`}></i>
                  </div>
                  <span className="hidden md:inline text-xs font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800/60">
        <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 mb-4">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-[10px] font-black text-white">FD</div>
          <div className="hidden md:block overflow-hidden flex-1">
            <p className="text-[11px] font-black truncate text-white uppercase">Fernando</p>
            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-3 text-[9px] font-black uppercase text-slate-500 hover:text-rose-500 transition-all">
          <i className="fas fa-power-off"></i>
          <span className="hidden md:inline">Sair do Studio</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
