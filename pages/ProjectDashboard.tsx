
import React from 'react';
import { Project, ProjectStatus } from '../types';

interface DashboardProps {
  projects: Project[];
  onSelect: (id: string) => void;
  onNew: () => void;
  filterClientName?: string;
  onClearFilter?: () => void;
}

const ProjectDashboard: React.FC<DashboardProps> = ({ projects, onSelect, onNew, filterClientName, onClearFilter }) => {
  
  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(deadline);
    delivery.setHours(0, 0, 0, 0);
    const diffTime = delivery.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusStyle = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.INICIADO:
        return 'text-sky-400 border-sky-400/20 bg-sky-400/5';
      case ProjectStatus.RENDERIZANDO:
        return 'text-amber-500 border-amber-500/20 bg-amber-500/5 animate-pulse';
      case ProjectStatus.FINALIZADO:
        return 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5';
      case ProjectStatus.APROVADO:
        return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
      case ProjectStatus.REPROVADO:
        return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
      default:
        return 'text-slate-400 border-slate-400/20 bg-slate-400/5';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {filterClientName ? `Projetos: ${filterClientName}` : 'Dashboard G3 Art'}
            </h2>
            {filterClientName && (
              <button 
                onClick={onClearFilter}
                className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded hover:text-white transition-colors uppercase font-black"
              >
                Limpar
              </button>
            )}
          </div>
          <p className="text-slate-500 font-medium">Você tem {projects.length} projetos ativos no momento.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-[#C0562F] hover:bg-[#a14324] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95"
        >
          <i className="fas fa-plus"></i> Novo Stand
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => {
          const days = getDaysRemaining(project.briefing?.deliveryDeadline);
          const nextMilestone = project.briefing?.timeline?.find(m => !m.completed);

          return (
            <div 
              key={project.id}
              onClick={() => onSelect(project.id)}
              className="group bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 cursor-pointer transition-all duration-500 hover:border-[#C0562F]/50 hover:bg-slate-900/60 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-xl font-black border ${getStatusStyle(project.status)}`}>
                  {project.status}
                </span>
                <span className="text-[10px] font-black text-slate-600">#{project.id.slice(0,4)}</span>
              </div>

              <h3 className="text-xl font-black text-white group-hover:text-[#C0562F] transition-colors mb-2 truncate">
                {project.title}
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">
                {project.briefing?.clientName || 'Cliente não definido'}
              </p>

              {nextMilestone && (
                 <div className="mb-6 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Próxima Etapa</p>
                    <p className="text-[10px] font-black text-sky-400 uppercase truncate">{nextMilestone.task}</p>
                 </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  <span>Progresso</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#C0562F] transition-all duration-700 shadow-[0_0_10px_rgba(192,86,47,0.5)]" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/40 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                  <i className="far fa-calendar"></i>
                  <span>{days !== null ? `${days} dias p/ entrega` : 'Sem prazo'}</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-black text-white">
                    G3
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectDashboard;
