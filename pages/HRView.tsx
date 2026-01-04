
import React, { useState } from 'react';
import { Employee, EmployeeRole, TimeLog } from '../types';

const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-layer-group' },
  { id: 'clients', label: 'Clientes', icon: 'fa-users' },
  { id: 'schedule', label: 'Cronograma', icon: 'fa-calendar-days' },
  { id: 'tech-files', label: 'Arquivos Técnicos', icon: 'fa-file-shield' },
  { id: 'hr', label: 'RH Administrativo', icon: 'fa-user-tie' },
  { id: 'video-meeting', label: 'Vídeo Reunião', icon: 'fa-video' },
  { id: 'whatsapp', label: 'WhatsApp Web', icon: 'fa-brands fa-whatsapp' },
];

interface HRViewProps {
  timeLogs: TimeLog[];
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

const HRView: React.FC<HRViewProps> = ({ timeLogs, employees, setEmployees }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'honorary' | 'deploy'>('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  const [expandedSubTab, setExpandedSubTab] = useState<'info' | 'docs' | 'access'>('info');
  
  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    role: EmployeeRole.DESIGNER_3D,
    status: 'Ativo',
    isAccessEnabled: false,
    permissions: ['dashboard', 'clients']
  });

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      setEmployees(employees.map(emp => emp.id === editingId ? { ...emp, ...newEmp as Employee } : emp));
    } else {
      const employee: Employee = {
        id: Math.random().toString(36).substring(2, 11),
        name: newEmp.name || '',
        role: newEmp.role as EmployeeRole,
        email: newEmp.email || '',
        phone: newEmp.phone || '',
        startDate: newEmp.startDate || new Date().toISOString().split('T')[0],
        status: (newEmp.status as any) || 'Ativo',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newEmp.name}`,
        ...newEmp
      } as Employee;
      setEmployees([...employees, employee]);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setEditingId(null);
    setNewEmp({ role: EmployeeRole.DESIGNER_3D, status: 'Ativo', isAccessEnabled: false, permissions: ['dashboard', 'clients'] });
  };

  const startEdit = (emp: Employee) => {
    setNewEmp(emp);
    setEditingId(emp.id);
    setIsEditing(true);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePermission = (moduleId: string) => {
    const current = newEmp.permissions || [];
    setNewEmp({
      ...newEmp,
      permissions: current.includes(moduleId) ? current.filter(p => p !== moduleId) : [...current, moduleId]
    });
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">SETOR DE RH</h2>
          <p className="text-slate-500 font-medium">Gestão de Talentos e Acessos Group 3D Art</p>
        </div>
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'employees', label: 'Funcionários' },
            { id: 'honorary', label: 'Honorários' },
            { id: 'deploy', label: 'Hospedagem & Link' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'deploy' && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="w-20 h-20 brand-gradient brand-shape flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-2xl">
                 <i className="fas fa-rocket"></i>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">COMO CRIAR SEU LINK NO NAVEGADOR</h3>
              <p className="text-slate-500">Fernando, siga este guia visual para colocar o sistema da Group 3D Art online para sua equipe em menos de 5 minutos.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-2xl shrink-0 shadow-lg">01</div>
                    <div>
                       <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">Crie sua conta na Vercel</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">Acesse <b>vercel.com</b> e conecte usando sua conta do GitHub ou e-mail. Escolha o plano "Hobby" (grátis para sempre).</p>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-2xl shrink-0 shadow-lg">02</div>
                    <div>
                       <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">Importe o Projeto</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">Clique em "Add New" -> "Project". Selecione o repositório onde você salvou este código. A Vercel vai ler as configurações automaticamente.</p>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-[#C0562F] text-white font-black flex items-center justify-center rounded-2xl shrink-0 shadow-lg shadow-[#C0562F]/20">03</div>
                    <div>
                       <h4 className="text-[#C0562F] font-black text-sm uppercase tracking-widest mb-2">Configuração Crucial (Gemini)</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">Antes do Deploy, abra a aba "Environment Variables". Adicione uma variável com o nome <b>API_KEY</b> e cole sua chave do Google Gemini no valor. Sem isso, as IAs do briefing não funcionarão.</p>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald-500 text-black font-black flex items-center justify-center rounded-2xl shrink-0 shadow-lg">04</div>
                    <div>
                       <h4 className="text-emerald-400 font-black text-sm uppercase tracking-widest mb-2">Finalize e Compartilhe</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">Clique em "Deploy". Em 60 segundos você terá um link como <b>g3art-sistema.vercel.app</b> para enviar no WhatsApp da equipe.</p>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[3rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl text-white">
                    <i className="fas fa-terminal"></i>
                 </div>
                 <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-8">Dica de Especialista G3</h4>
                 <div className="space-y-6 relative z-10">
                    <div className="p-5 bg-black/40 rounded-2xl border border-slate-800">
                       <p className="text-white font-bold text-xs mb-2">Domínio Próprio</p>
                       <p className="text-slate-500 text-[10px]">Você pode conectar o domínio <b>portal.group3dart.com.br</b> na aba "Domains" da Vercel após o deploy.</p>
                    </div>
                    <div className="p-5 bg-black/40 rounded-2xl border border-slate-800">
                       <p className="text-white font-bold text-xs mb-2">Segurança de Dados</p>
                       <p className="text-slate-500 text-[10px]">A Vercel oferece HTTPS (o cadeado verde) automaticamente. Seus briefings e dados de montadoras estarão protegidos.</p>
                    </div>
                    <button className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C0562F] hover:text-white transition-all">
                       VER TUTORIAL EM VÍDEO NO YOUTUBE
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-9xl text-white/5 opacity-10">
              <i className="fas fa-users"></i>
            </div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Total da Equipe</h4>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-black text-white">{employees.length}</span>
              <span className="text-emerald-500 text-xs font-black uppercase mb-3">Membros</span>
            </div>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-9xl text-white/5 opacity-10">
              <i className="fas fa-check-double"></i>
            </div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Status Ativo</h4>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-black text-white">{employees.filter(e => e.status === 'Ativo').length}</span>
              <span className="text-sky-500 text-xs font-black uppercase mb-3">Em Produção</span>
            </div>
          </div>

          <div className="bg-rose-600/10 border border-rose-500/20 p-10 rounded-[2.5rem] relative overflow-hidden group">
            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6">Central de Ação</h4>
            <p className="text-slate-400 text-xs mb-8">Gerencie novos ingressos ou edite permissões de acesso da equipe.</p>
            <button 
              onClick={() => setActiveTab('employees')}
              className="w-full bg-rose-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-colors shadow-lg"
            >
              IR PARA QUADRO DE COLABORADORES
            </button>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Controle de Colaboradores</h3>
            <button onClick={() => { if(isEditing) resetForm(); else setShowAddForm(!showAddForm); }} className="bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-rose-600 hover:text-white">
              {showAddForm ? 'FECHAR FORMULÁRIO' : '+ NOVO TALENTO'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSaveEmployee} className="p-10 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 animate-in slide-in-from-top-4">
              <div className="flex gap-4 border-b border-slate-800 pb-4 mb-10">
                {['info', 'docs', 'access'].map(t => (
                  <button key={t} type="button" onClick={() => setExpandedSubTab(t as any)} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${expandedSubTab === t ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
                    {t === 'info' ? 'Dados' : t === 'docs' ? 'Documentos' : 'Acesso ao Sistema'}
                  </button>
                ))}
              </div>

              {expandedSubTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
                  <input required className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm" value={newEmp.name || ''} onChange={e => setNewEmp({...newEmp, name: e.target.value})} placeholder="Nome Completo" />
                  <input required className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm" value={newEmp.email || ''} onChange={e => setNewEmp({...newEmp, email: e.target.value})} placeholder="E-mail Corporativo" />
                  <select className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value as any})}>
                    {Object.values(EmployeeRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}

              {expandedSubTab === 'access' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Liberar Usuário?</span>
                      <button type="button" onClick={() => setNewEmp({...newEmp, isAccessEnabled: !newEmp.isAccessEnabled})} className={`w-12 h-6 rounded-full transition-all p-1 ${newEmp.isAccessEnabled ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${newEmp.isAccessEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                    <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm" value={newEmp.username || ''} onChange={e => setNewEmp({...newEmp, username: e.target.value})} placeholder="Usuário para Login" />
                    <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm" value={newEmp.password || ''} onChange={e => setNewEmp({...newEmp, password: e.target.value})} placeholder="Senha de Acesso" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-3 block">Módulos Liberados</label>
                    <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_MODULES.map(m => (
                        <button key={m.id} type="button" onClick={() => togglePermission(m.id)} className={`flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase transition-all ${newEmp.permissions?.includes(m.id) ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                          <div className="flex items-center gap-3"><i className={`fas ${m.icon}`}></i> {m.label}</div>
                          {newEmp.permissions?.includes(m.id) && <i className="fas fa-check"></i>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-10">
                <button type="submit" className="bg-rose-600 text-white px-12 py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">SALVAR DADOS DO COLABORADOR</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(emp => (
              <div key={emp.id} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 hover:border-indigo-500/50 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 p-1 border border-slate-800 overflow-hidden"><img src={emp.avatar} alt={emp.name} /></div>
                  <div className={`text-[8px] font-black px-3 py-1.5 rounded-full border ${emp.isAccessEnabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                    {emp.isAccessEnabled ? 'ACESSO LIBERADO' : 'ACESSO BLOQUEADO'}
                  </div>
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight">{emp.name}</h4>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{emp.role}</p>
                
                <div className="flex flex-col gap-3">
                  <button onClick={() => startEdit(emp)} className="bg-white text-black py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Editar Tudo</button>
                  <button onClick={() => {
                    if (window.confirm(`Remover ${emp.name}?`)) setEmployees(employees.filter(e => e.id !== emp.id));
                  }} className="text-slate-600 hover:text-rose-500 py-1 text-[8px] font-black uppercase tracking-widest transition-all">Remover da Base</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HRView;
