
import React from 'react';
import { Client, Project } from '../types';

interface ClientsViewProps {
  clients: Client[];
  projects: Project[];
  onOpenFolder: (clientId: string) => void;
}

const ClientsView: React.FC<ClientsViewProps> = ({ clients, projects, onOpenFolder }) => {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Montadoras Parceiras</h2>
        <p className="text-slate-500 mt-2 font-medium">Selecione uma pasta para gerenciar os projetos de cada empresa.</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {clients.map(client => {
          const clientProjects = projects.filter(p => p.clientId === client.id);
          
          return (
            <div 
              key={client.id}
              onClick={() => onOpenFolder(client.id)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="relative w-full aspect-[4/3] mb-4">
                {/* Aba da Pasta */}
                <div className="absolute top-0 left-0 w-16 h-6 bg-slate-800 rounded-t-xl border-t border-x border-slate-700 group-hover:bg-[#C0562F]/80 transition-all"></div>
                {/* Corpo da Pasta */}
                <div className="absolute inset-x-0 bottom-0 top-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl group-hover:bg-slate-700/50 group-hover:border-[#C0562F]/40 transition-all flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-white font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                      {client.name.substring(0,1)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-[#C0562F] transition-colors">
                      {clientProjects.length} PROJETOS
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors text-center truncate w-full px-2">
                {client.name}
              </h3>
            </div>
          );
        })}

        {/* Adicionar Nova Pasta */}
        <div className="group cursor-pointer flex flex-col items-center opacity-30 hover:opacity-100 transition-all">
          <div className="w-full aspect-[4/3] mb-4 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center hover:border-[#C0562F]/50 transition-colors">
            <i className="fas fa-plus text-2xl text-slate-700 group-hover:text-[#C0562F]"></i>
          </div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Nova Pasta</span>
        </div>
      </div>
    </div>
  );
};

export default ClientsView;
