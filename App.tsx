
import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, Client, TimeLog, WorkStatus, Employee, EmployeeRole } from './types';
import Sidebar from './components/Sidebar';
import ProjectDashboard from './pages/ProjectDashboard';
import BriefingView from './pages/BriefingView';
import ClientsView from './pages/ClientsView';
import VideoMeetingView from './pages/VideoMeetingView';
import HRView from './pages/HRView';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Fernando Domingues',
    role: EmployeeRole.DIRETOR,
    email: 'fernando@g3art.com.br',
    phone: '(11) 99999-9999',
    startDate: '2020-01-10',
    status: 'Ativo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernando',
    salary: '15.000,00',
    username: 'fernando',
    password: '123',
    isAccessEnabled: true,
    permissions: ['dashboard', 'clients', 'schedule', 'tech-files', 'hr', 'video-meeting', 'whatsapp']
  }
];

const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Samsung Brasil', projectsCount: 1 },
  { id: 'c2', name: 'LG Electronics', projectsCount: 0 },
  { id: 'c3', name: 'Volkswagen', projectsCount: 0 }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedUser, setLoggedUser] = useState<Employee | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Persistência de Dados
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('g3_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('g3_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('g3_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [currentWorkStatus, setCurrentWorkStatus] = useState<WorkStatus>(WorkStatus.OFFLINE);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filterClientId, setFilterClientId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('g3_employees', JSON.stringify(employees));
    localStorage.setItem('g3_clients', JSON.stringify(clients));
    localStorage.setItem('g3_projects', JSON.stringify(projects));
  }, [employees, clients, projects]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = employees.find(emp => emp.username?.toLowerCase() === loginUsername.toLowerCase() && emp.password === loginPassword);
    if (user && user.isAccessEnabled) {
      setIsAuthenticated(true);
      setLoggedUser(user);
      setLoginError('');
    } else {
      setLoginError('Acesso negado. Verifique usuário e senha.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedUser(null);
  };

  const createNewProject = () => {
    const newProj: Project = {
      id: Math.random().toString(36).substring(2, 7).toUpperCase(),
      clientId: filterClientId || clients[0].id,
      title: 'Novo Stand ' + (projects.length + 1),
      status: ProjectStatus.INICIADO,
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      briefing: {
        clientName: clients.find(c => c.id === filterClientId)?.name || clients[0].name,
        eventName: '',
        standSize: '',
        budgetType: 'Médio',
        keyRequirements: '',
        aiReferences: [],
        attachments: []
      }
    };
    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#070b14] p-6 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C0562F]/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <div className="max-w-md w-full animate-in zoom-in fade-in duration-700">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 brand-gradient brand-shape flex items-center justify-center text-white text-xl font-black shadow-2xl mb-6">G3</div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">PORTAL G3 ART</h1>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">Acesso Exclusivo à Equipe</p>
          </div>
          <form onSubmit={handleLogin} className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="space-y-4">
              <input type="text" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-[#C0562F]/50" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="Usuário (fernando)" />
              <input type="password" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-[#C0562F]/50" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Senha (123)" />
              {loginError && <p className="text-rose-500 text-[9px] font-black uppercase text-center">{loginError}</p>}
              <button type="submit" className="w-full bg-[#C0562F] hover:bg-[#a14324] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl">ENTRAR NO STUDIO</button>
            </div>
          </form>
          <div className="mt-8 text-center">
             <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">v1.0.4 - Group 3D Art Management</p>
          </div>
        </div>
      </div>
    );
  }

  // Se um projeto for selecionado, mostra a tela de Briefing dele
  if (selectedProjectId) {
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200">
          <Sidebar currentView={currentView} currentWorkStatus={currentWorkStatus} onTimeLog={()=>{}} user={loggedUser!} onLogout={handleLogout} setView={(v) => { setSelectedProjectId(null); setCurrentView(v); }} />
          <main className="flex-1 overflow-y-auto p-8 md:p-12 relative">
             <BriefingView 
               project={project} 
               onBack={() => setSelectedProjectId(null)} 
               onUpdate={(updated) => setProjects(projects.map(p => p.id === updated.id ? updated : p))} 
             />
          </main>
        </div>
      );
    }
  }

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200">
      <Sidebar 
        currentView={currentView}
        currentWorkStatus={currentWorkStatus}
        onTimeLog={()=>{}}
        user={loggedUser!}
        onLogout={handleLogout}
        setView={(v) => { setFilterClientId(null); setCurrentView(v); }} 
      />
      <main className="flex-1 overflow-y-auto relative p-8 md:p-12 no-scrollbar">
        {currentView === 'dashboard' && (
          <ProjectDashboard 
            projects={filterClientId ? projects.filter(p => p.clientId === filterClientId) : projects} 
            onSelect={setSelectedProjectId} 
            onNew={createNewProject} 
            filterClientName={filterClientId ? clients.find(c => c.id === filterClientId)?.name : undefined}
            onClearFilter={() => setFilterClientId(null)}
          />
        )}
        {currentView === 'clients' && (
          <ClientsView 
            clients={clients} 
            projects={projects} 
            onOpenFolder={(id) => { setFilterClientId(id); setCurrentView('dashboard'); }} 
          />
        )}
        {currentView === 'hr' && <HRView timeLogs={timeLogs} employees={employees} setEmployees={setEmployees} />}
        {currentView === 'video-meeting' && <VideoMeetingView />}
      </main>
    </div>
  );
};

export default App;
