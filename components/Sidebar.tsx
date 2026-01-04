
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
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-layer-group', group: 'Geral' },
    { id: 'clients', label: 'Clientes', icon: 'fa-users', group: 'Geral' },
    { id: 'schedule', label: 'Cronograma', icon: 'fa-calendar-days', group: 'Geral' },
    { id: 'tech-files', label: 'Arquivos Técnicos', icon: 'fa-file-shield', group: 'Recursos' },
    { id: 'hr', label: 'RH', icon: 'fa-user-tie', group: 'Administrativo' },
    { id: 'video-meeting', label: 'Vídeo Reunião', icon: 'fa-video', group: 'Canais' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', group: 'Canais' },
  ];

  // Filtra itens baseado nas permissões do usuário
  const allowedItems = menuItems.filter(item => user.permissions?.includes(item.id));

  return (
    <aside className="w-20 md:w-72 bg-[#111827] border-r border-slate-800/60 flex flex-col h-full shrink-0">
      <div className="p-8 flex items-center gap-4 cursor-pointer" onClick={() => setView('clients')}>
        <div className="w-12 h-12 brand-gradient brand-shape flex items-center justify-center text-white font-bold text-xl shadow-lg">G3</div>
        <div className="hidden md:block">
          <h1 className="text-xl font-black tracking-tighter text-white">GROUP 3D ART</h1>
          <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black opacity-60">Studio Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto no-scrollbar py-4">
        {/* Ponto Eletrônico */}
        <div className="hidden md:block bg-slate-900/50 border border-slate-800/60 rounded-3xl p-5 mb-6">
           <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ponto Digital</span>
              <span className={`text-[8px] font-black px-2 py-1 rounded-full ${currentWorkStatus === WorkStatus.WORKING ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>{currentWorkStatus}</span>
           </div>
           <div className="flex gap-2">
              <button onClick={() => onTimeLog(currentWorkStatus === WorkStatus.LUNCH ? 'Retorno' : 'Entrada')} className="flex-1 aspect-square bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-xl transition-all flex items-center justify-center"><i className="fas fa-play text-xs"></i></button>
              <button onClick={() => onTimeLog('Almoço')} className="flex-1 aspect-square bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-white rounded-xl transition-all flex items-center justify-center"><i className="fas fa-utensils text-xs"></i></button>
              <button onClick={() => onTimeLog('Saída')} className="flex-1 aspect-square bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all flex items-center justify-center"><i className="fas fa-stop text-xs"></i></button>
           </div>
        </div>

        {['Geral', 'Recursos', 'Administrativo', 'Canais'].map(group => {
          const groupItems = allowedItems.filter(i => i.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group} className="space-y-1">
              <p className="hidden md:block px-3 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">{group}</p>
              {groupItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all group ${currentView === item.id ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-slate-500 hover:bg-slate-800/40'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentView === item.id ? 'bg-[#C0562F] text-white' : 'bg-slate-900 group-hover:text-white'}`}>
                    <i className={`fas ${item.icon} text-sm`}></i>
                  </div>
                  <span className="hidden md:inline text-xs font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/60 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-[10px] font-black text-white">{user.name.substring(0,2).toUpperCase()}</div>
          <div className="hidden md:block overflow-hidden flex-1">
            <p className="text-[11px] font-black truncate text-white uppercase">{user.name}</p>
            <p className="text-[9px] text-[#C0562F] font-bold uppercase tracking-widest">{user.role}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl text-[9px] font-black uppercase text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all">
          <i className="fas fa-power-off"></i>
          <span className="hidden md:inline">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
