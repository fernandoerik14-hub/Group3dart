
import React, { useState, useEffect } from 'react';
import { Employee, EmployeeRole, TimeLog } from '../types';
import { isAiActive } from '../services/geminiService';

interface HRViewProps {
  timeLogs: TimeLog[];
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

const HRView: React.FC<HRViewProps> = ({ timeLogs, employees, setEmployees }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'config'>('overview');
  const [aiStatus, setAiStatus] = useState(false);

  useEffect(() => {
    setAiStatus(isAiActive());
  }, []);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">CONFIGURAÇÕES</h2>
          <p className="text-slate-500 font-medium italic">Gerenciamento simplificado do seu Studio G3 Art</p>
        </div>
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
          {[
            { id: 'overview', label: 'Resumo' },
            { id: 'employees', label: 'Minha Equipe' },
            { id: 'config', label: 'Configurar Site' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#C0562F] text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'config' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
           <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl text-white">
                 <i className="fas fa-globe"></i>
              </div>
              
              <div className="max-w-2xl">
                 <h4 className="text-[#C0562F] font-black text-xs uppercase tracking-[0.3em] mb-4">Saúde do Sistema</h4>
                 <h3 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">Seu site está online!</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="bg-black/40 p-6 rounded-3xl border border-emerald-500/20 flex items-center gap-4">
                       <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase">Servidor Vercel</p>
                          <p className="text-sm font-bold text-white">Ativo e Seguro</p>
                       </div>
                    </div>
                    
                    <div className={`p-6 rounded-3xl border flex items-center gap-4 ${aiStatus ? 'bg-black/40 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                       <div className={`w-4 h-4 rounded-full ${aiStatus ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase">Inteligência Artificial</p>
                          <p className={`text-sm font-bold ${aiStatus ? 'text-white' : 'text-rose-400'}`}>
                             {aiStatus ? 'Pronta para Criar' : 'Chave não encontrada'}
                          </p>
                       </div>
                    </div>
                 </div>

                 {!aiStatus && (
                    <div className="bg-[#C0562F]/10 border border-[#C0562F]/20 p-8 rounded-3xl mb-8">
                       <p className="text-white text-sm leading-relaxed mb-6">
                          Fernando, para o gerador de imagens funcionar, você só precisa colar sua <b>API_KEY</b> no painel da Vercel. É o último passo para o sistema ficar 100%.
                       </p>
                       <div className="flex flex-col sm:flex-row gap-4">
                          <a 
                            href="https://vercel.com/dashboard" 
                            target="_blank" 
                            className="bg-white text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C0562F] hover:text-white transition-all text-center"
                          >
                             ABRIR VERCEL (PASSO ÚNICO)
                          </a>
                       </div>
                    </div>
                 )}
                 
                 <div className="pt-6 border-t border-slate-800">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Link Oficial do seu Studio:</p>
                    <code className="text-[#C0562F] text-xs font-mono block mt-2">g3-art-studio.vercel.app</code>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'overview' && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] group hover:border-[#C0562F]/40 transition-all">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Projetos em Andamento</h4>
               <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white">08</span>
                  <span className="text-xs font-bold text-emerald-500 uppercase">Stands</span>
               </div>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] group hover:border-[#C0562F]/40 transition-all">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Membros da Equipe</h4>
               <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white">{employees.length}</span>
                  <span className="text-xs font-bold text-sky-500 uppercase">Pessoas</span>
               </div>
            </div>

            <div className="bg-[#C0562F] p-10 rounded-[2.5rem] shadow-2xl shadow-[#C0562F]/20 flex flex-col justify-between">
               <div>
                  <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Ação Rápida</h4>
                  <p className="text-white font-bold text-lg leading-tight">Precisa de um novo colaborador?</p>
               </div>
               <button 
                 onClick={() => setActiveTab('employees')}
                 className="mt-6 w-full bg-black text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
               >
                 CADASTRAR TALENTO
               </button>
            </div>
         </div>
      )}

      {activeTab === 'employees' && (
         <div className="animate-in fade-in duration-500 text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
            <i className="fas fa-users-cog text-4xl text-slate-700 mb-6"></i>
            <h3 className="text-xl font-black text-white uppercase mb-2">Gestão de Pessoal</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">Aqui você gerencia quem pode entrar no sistema e o que eles podem ver.</p>
            <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C0562F] hover:text-white transition-all">ADICIONAR PRIMEIRO MEMBRO</button>
         </div>
      )}
    </div>
  );
};

export default HRView;
