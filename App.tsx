
import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, Client, TimeLog, WorkStatus, Employee, EmployeeRole } from './types';
import Sidebar from './components/Sidebar';
import ProjectDashboard from './pages/ProjectDashboard';
import BriefingView from './pages/BriefingView';
import ClientsView from './pages/ClientsView';
import VideoMeetingView from './pages/VideoMeetingView';
import HRView from './pages/HRView';

const CommunicationHub = ({ title, icon, color, url, description }: { title: string, icon: string, color: string, url: string, description: string }) => {
  const openApp = () => {
    window.open(url, title, 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in duration-500">
      <div className={`w-32 h-32 rounded-[3rem] ${color} flex items-center justify-center text-white text-5xl mb-8 shadow-2xl shadow-${color.split('-')[1]}-500/20`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <h2 className="text-4xl font-black text-white mb-4">{title} Business</h2>
      <p className="text-slate-500 max-w-lg text-lg mb-10">
        {description} Por segurança, o {title} funciona em uma janela dedicada para proteger seus dados.
      </p>
      
      <button 
        onClick={openApp}
        className={`${color} hover:brightness-110 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-4`}
      >
        <i className="fas fa-external-link-alt"></i> Conectar Agora
      </button>
    </div>
  );
};

const PlaceholderView = ({ title, icon, description }: { title: string, icon: string, description: string }) => (
  <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
    <div className="w-24 h-24 rounded-[2.5rem] bg-slate-900 border border-slate-800 flex items-center justify-center text-[#C0562F] text-4xl mb-6 shadow-2xl">
      <i className={`fas ${icon}`}></i>
    </div>
    <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
    <p className="text-slate-500 max-w-md font-medium">{description}</p>
  </div>
);

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
    username: 'FernandoDomingues',
    password: '16011998Fe!!',
    isAccessEnabled: true,
    permissions: ['dashboard', 'clients', 'schedule', 'tech-files', 'hr', 'video-meeting', 'whatsapp']
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedUser, setLoggedUser] = useState<Employee | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [currentWorkStatus, setCurrentWorkStatus] = useState<WorkStatus>(WorkStatus.OFFLINE);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<string>('clients');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filterClientId, setFilterClientId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = employees.find(emp => emp.username === loginUsername && emp.password === loginPassword);

    if (user) {
      if (user.isAccessEnabled) {
        setIsAuthenticated(true);
        setLoggedUser(user);
        setLoginError('');
        // Define visão inicial baseada em permissão
        if (user.permissions?.includes('dashboard')) setCurrentView('dashboard');
        else if (user.permissions?.includes('clients')) setCurrentView('clients');
        else setCurrentView(user.permissions?.[0] || 'dashboard');
      } else {
        setLoginError('Acesso bloqueado pela administração.');
      }
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedUser(null);
    setLoginUsername('');
    setLoginPassword('');
  };

  const logTime = (type: TimeLog['type']) => {
    if (!loggedUser) return;
    const newLog: TimeLog = {
      id: Math.random().toString(36).substring(2, 9),
      employeeId: loggedUser.id,
      employeeName: loggedUser.name,
      type,
      timestamp: new Date()
    };
    setTimeLogs([newLog, ...timeLogs]);
    if (type === 'Entrada' || type === 'Retorno') setCurrentWorkStatus(WorkStatus.WORKING);
    else if (type === 'Almoço') setCurrentWorkStatus(WorkStatus.LUNCH);
    else if (type === 'Saída') setCurrentWorkStatus(WorkStatus.FINISHED);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#070b14] overflow-hidden p-6 relative">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C0562F]/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-md w-full animate-in zoom-in fade-in duration-700">
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 brand-gradient brand-shape flex items-center justify-center text-white text-2xl font-black shadow-2xl mb-6">G3</div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">GROUP 3D ART</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2 opacity-60">Studio Management Portal</p>
          </div>
          <form onSubmit={handleLogin} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Usuário</label>
                <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#C0562F]/50 transition-all" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="Seu usuário" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha</label>
                <input type="password" required className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#C0562F]/50 transition-all" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" />
              </div>
              {loginError && <p className="text-rose-500 text-[10px] font-black uppercase text-center animate-pulse">{loginError}</p>}
              <button type="submit" className="w-full bg-[#C0562F] hover:bg-[#a14324] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl hover:scale-[1.02]">ACESSAR PLATAFORMA</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200">
      <Sidebar 
        currentView={currentView}
        currentWorkStatus={currentWorkStatus}
        onTimeLog={logTime}
        user={loggedUser!}
        onLogout={handleLogout}
        setView={setCurrentView} 
      />
      <main className="flex-1 overflow-y-auto relative flex flex-col no-scrollbar p-8 md:p-12">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#C0562F]/10 to-transparent pointer-events-none"></div>
        {currentView === 'clients' && <ClientsView clients={[]} projects={projects} onOpenFolder={setFilterClientId} />}
        {currentView === 'dashboard' && <ProjectDashboard projects={projects} onSelect={setSelectedProjectId} onNew={() => {}} />}
        {currentView === 'hr' && <HRView timeLogs={timeLogs} employees={employees} setEmployees={setEmployees} />}
        {currentView === 'video-meeting' && <VideoMeetingView />}
        {currentView === 'whatsapp' && <CommunicationHub url="https://web.whatsapp.com" title="WhatsApp" icon="fa-brands fa-whatsapp" color="bg-emerald-500" description="Canal direto com montadoras." />}
        {['schedule', 'tech-files'].includes(currentView) && <PlaceholderView title="Em Breve" icon="fa-clock" description="Módulo em fase final de detalhamento." />}
      </main>
    </div>
  );
};

export default App;
