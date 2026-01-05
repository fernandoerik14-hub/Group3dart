
import React, { useState, useRef, useEffect } from 'react';
import { Project, Briefing, ProjectFile, ProjectStatus, EngineeringData, MoodboardItem, Milestone } from '../types';
import { generateStandReference, getTechnicalInsights } from '../services/geminiService';

interface BriefingViewProps {
  project: Project;
  onBack: () => void;
  onUpdate: (project: Project) => void;
}

const BriefingView: React.FC<BriefingViewProps> = ({ project, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'control' | 'creative' | 'technical' | 'moodboards' | 'schedule' | 'engineering' | 'files'>('control');
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moodboardInputRef = useRef<HTMLInputElement>(null);

  const defaultEngineering: EngineeringData = {
    structuralSpecs: '',
    electricalPlan: '',
    woodworkDetails: '',
    graphicsSpecs: '',
    externalModelLink: '',
    checklist: {
      piso: false,
      estrutura: false,
      eletrica: false,
      marcenaria: false,
      pintura: false,
      limpeza: false
    }
  };

  const defaultBriefing: Briefing = {
    clientName: '',
    eventName: '',
    eventDate: '',
    deliveryDeadline: '',
    standSize: '',
    standType: 'Ilha',
    budgetType: 'Médio',
    budgetValue: '',
    keyRequirements: '',
    aiReferences: [],
    attachments: [],
    moodboard: [],
    timeline: [
      { id: '1', task: 'Recebimento de Briefing', date: '', completed: true, priority: 'alta' },
      { id: '2', task: 'Estudo de Layout / 3D', date: '', completed: false, priority: 'alta' },
      { id: '3', task: 'Renderização Final', date: '', completed: false, priority: 'media' },
      { id: '4', task: 'Aprovação da Montadora', date: '', completed: false, priority: 'alta' },
      { id: '5', task: 'Detalhamento Executivo', date: '', completed: false, priority: 'alta' }
    ],
    technicalSpecs: {
      flooring: '',
      lighting: '',
      furniture: '',
      electricalPoints: '',
      woodwork: '',
      heightLimit: ''
    },
    engineering: defaultEngineering
  };

  const [form, setForm] = useState<Briefing>({
    ...defaultBriefing,
    ...(project.briefing || {}),
    timeline: project.briefing?.timeline || defaultBriefing.timeline,
    technicalSpecs: { ...defaultBriefing.technicalSpecs, ...(project.briefing?.technicalSpecs || {}) },
    engineering: {
      ...defaultEngineering,
      ...(project.briefing?.engineering || {}),
      checklist: { ...defaultEngineering.checklist, ...(project.briefing?.engineering?.checklist || {}) }
    },
    moodboard: project.briefing?.moodboard || []
  });

  const [currentStatus, setCurrentStatus] = useState<ProjectStatus>(project.status);

  const handleUpdate = () => {
    onUpdate({ ...project, briefing: form, status: currentStatus, lastModified: new Date() });
  };

  const isApproved = currentStatus === ProjectStatus.APROVADO;

  // Cálculos para o Painel de Controle
  const completedMilestones = form.timeline?.filter(m => m.completed).length || 0;
  const totalMilestones = form.timeline?.length || 1;
  const projectHealth = Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in slide-in-from-bottom-6 duration-500">
      
      {/* Menu Superior - Estilo Console */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 font-bold transition-colors text-xs tracking-widest uppercase">
            <i className="fas fa-chevron-left text-[10px]"></i> VOLTAR
          </button>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistema Ativo</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-1 rounded-2xl border border-slate-800 flex shadow-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'control', label: 'Painel', icon: 'fa-shield-halved' },
            { id: 'creative', label: 'Briefing', icon: 'fa-wand-magic-sparkles' },
            { id: 'technical', label: 'Técnico', icon: 'fa-clipboard-list' },
            { id: 'moodboards', label: 'Inspiração', icon: 'fa-palette' },
            { id: 'schedule', label: 'Cronograma', icon: 'fa-calendar-check' },
            { id: 'engineering', label: 'Engenharia', icon: 'fa-drafting-compass', locked: !isApproved },
            { id: 'files', label: 'Arquivos', icon: 'fa-box-open' }
          ].map(tab => (
            <button
              key={tab.id}
              disabled={(tab as any).locked}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#C0562F] text-white shadow-lg shadow-[#C0562F]/20' : 
                (tab as any).locked ? 'text-slate-700 cursor-not-allowed grayscale' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i> 
              {tab.label}
              {(tab as any).locked && <i className="fas fa-lock absolute top-1 right-2 text-[8px] opacity-40"></i>}
            </button>
          ))}
        </div>

        <button onClick={handleUpdate} className="bg-white text-black px-10 py-3 rounded-2xl font-black text-xs hover:bg-[#C0562F] hover:text-white transition-all shadow-xl uppercase tracking-widest">
          ATUALIZAR STATUS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          
          {activeTab === 'control' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Painel de Controle Inteligente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <i className="fas fa-microchip"></i> Inteligência do Projeto
                    </h4>
                    <div className="flex items-end gap-4 mb-8">
                       <span className="text-6xl font-black text-white">{projectHealth}%</span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest pb-3">Eficiência</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${projectHealth}%` }}></div>
                  </div>
                </div>

                <div className="bg-[#C0562F]/10 border border-[#C0562F]/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                  <i className="fas fa-bolt absolute -right-6 -top-6 text-9xl text-[#C0562F]/10 rotate-12"></i>
                  <h4 className="text-[10px] font-black text-[#C0562F] uppercase tracking-widest mb-6">Próxima Ação Crítica</h4>
                  <div className="relative z-10">
                     <h3 className="text-2xl font-black text-white mb-2">
                       {form.timeline?.find(m => !m.completed)?.task || "Projeto Concluído"}
                     </h3>
                     <p className="text-slate-400 text-xs font-medium">Prioridade: Máxima (G3 ART)</p>
                  </div>
                  <button onClick={() => setActiveTab('schedule')} className="mt-8 text-[10px] font-black uppercase text-white hover:underline">Ver Cronograma Completo →</button>
                </div>
              </div>

              {/* Status de Fluxo */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10">
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4">
                  <i className="fas fa-traffic-light text-slate-500"></i> STATUS DE OPERAÇÃO
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.values(ProjectStatus).map(status => (
                    <button
                      key={status}
                      onClick={() => setCurrentStatus(status)}
                      className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border flex flex-col items-center gap-2 ${
                        currentStatus === status 
                        ? 'bg-[#C0562F] border-[#C0562F] text-white shadow-xl shadow-[#C0562F]/20'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Quick Insights */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] p-10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-robot"></i> Analista Virtual G3
                  </h4>
                  <button 
                    onClick={async () => {
                      setLoading(true);
                      const res = await getTechnicalInsights(form.keyRequirements);
                      setAiInsights(res);
                      setLoading(false);
                    }}
                    className="text-xs font-black text-white hover:text-indigo-400 transition-colors"
                  >
                    {loading ? "PROCESSANDO..." : "RE-ANALISAR BRIEFING"}
                  </button>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line italic">
                  {aiInsights || "Aguardando descrição do stand para gerar recomendações técnicas de montagem..."}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'creative' && (
             <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 animate-in fade-in">
                <h3 className="text-2xl font-black text-white mb-8">Briefing de Criação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Montadora Parceira</label>
                    <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-[#C0562F]/50 transition-colors" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} placeholder="Ex: Montadora Alpha" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expositor / Evento</label>
                    <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-[#C0562F]/50 transition-colors" value={form.eventName} onChange={e => setForm({...form, eventName: e.target.value})} placeholder="Ex: Samsung - Expo 2024" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conceito do Stand</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white h-48 outline-none focus:border-[#C0562F]/50 transition-all resize-none"
                    value={form.keyRequirements}
                    onChange={e => setForm({...form, keyRequirements: e.target.value})}
                    placeholder="Descreva o estilo, cores e materiais que a montadora solicitou..."
                  />
                </div>
             </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 animate-in fade-in">
              <h3 className="text-2xl font-black text-white mb-8">Cronograma Ativo</h3>
              <div className="space-y-6">
                {form.timeline?.map((milestone, idx) => (
                  <div key={milestone.id} className="flex items-center gap-8 relative group">
                    {idx !== form.timeline!.length - 1 && (
                      <div className={`absolute left-5 top-12 w-0.5 h-12 ${milestone.completed ? 'bg-emerald-500/50' : 'bg-slate-800'}`}></div>
                    )}
                    <button 
                      onClick={() => {
                        const newTimeline = form.timeline?.map(m => m.id === milestone.id ? { ...m, completed: !m.completed } : m);
                        setForm({ ...form, timeline: newTimeline });
                      }}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        milestone.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-slate-950 border-slate-800 text-slate-700'
                      }`}
                    >
                      {milestone.completed && <i className="fas fa-check"></i>}
                    </button>
                    <div className={`flex-1 p-5 rounded-3xl border transition-all ${milestone.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950 border-slate-800'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`text-xs font-black uppercase tracking-widest ${milestone.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {milestone.task}
                          </p>
                          <p className="text-[9px] font-black text-slate-600 uppercase mt-1">Prioridade: {milestone.priority}</p>
                        </div>
                        <input 
                          type="date"
                          className="bg-transparent border-none text-[10px] text-white font-mono outline-none [color-scheme:dark]"
                          value={milestone.date}
                          onChange={e => {
                            const newTimeline = form.timeline?.map(m => m.id === milestone.id ? { ...m, date: e.target.value } : m);
                            setForm({ ...form, timeline: newTimeline });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'moodboards' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 animate-in fade-in">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white">Moodboard & Referências</h3>
                <button 
                  onClick={() => moodboardInputRef.current?.click()} 
                  className="bg-slate-800 hover:bg-[#C0562F] text-white px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all"
                >
                  UPLOAD REFERÊNCIA
                </button>
              </div>
              <input type="file" multiple className="hidden" ref={moodboardInputRef} onChange={(e) => {
                 const files = e.target.files;
                 if (!files) return;
                 // Fix: Type f as any to avoid 'unknown' errors
                 Array.from(files).forEach((f: any) => {
                   const reader = new FileReader();
                   reader.onload = (ev) => {
                     setForm(prev => ({...prev, moodboard: [...(prev.moodboard || []), { id: Math.random().toString(), url: ev.target?.result as string, title: f.name, type: 'image' }]}));
                   };
                   reader.readAsDataURL(f);
                 });
              }} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {form.moodboard?.map(item => (
                   <div key={item.id} className="aspect-square rounded-[2rem] overflow-hidden border border-slate-800 relative group">
                      <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Ref" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={() => setForm({...form, moodboard: form.moodboard?.filter(i => i.id !== item.id)})} className="text-white bg-rose-500 w-10 h-10 rounded-full">
                           <i className="fas fa-trash"></i>
                         </button>
                      </div>
                   </div>
                 ))}
                 {(form.moodboard?.length || 0) === 0 && (
                   <div className="col-span-full py-20 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-600">
                     <i className="fas fa-images text-4xl mb-4"></i>
                     <p className="text-xs font-black uppercase tracking-widest">Nenhuma imagem carregada</p>
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'engineering' && isApproved && (
            <div className="bg-slate-950 border border-emerald-500/20 rounded-[2.5rem] p-10 animate-in fade-in">
                <h3 className="text-2xl font-black text-emerald-400 mb-8 flex items-center gap-3">
                   <i className="fas fa-blueprint"></i> Detalhamento G3 ART
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notas de Marcenaria</label>
                        <textarea className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-xs h-32 resize-none" value={form.engineering?.structuralSpecs} onChange={e => setForm({...form, engineering: {...form.engineering!, structuralSpecs: e.target.value}})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notas de CV (Comunicação Visual)</label>
                        <textarea className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-xs h-32 resize-none" value={form.engineering?.graphicsSpecs} onChange={e => setForm({...form, engineering: {...form.engineering!, graphicsSpecs: e.target.value}})} />
                      </div>
                   </div>
                   <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Checklist Técnico G3</h4>
                      <div className="space-y-3">
                        {form.engineering?.checklist && Object.entries(form.engineering.checklist).map(([key, val]) => (
                           <button 
                             key={key} 
                             onClick={() => {
                               setForm({...form, engineering: { ...form.engineering!, checklist: { ...form.engineering!.checklist, [key]: !val } }})
                             }}
                             className={`w-full flex justify-between items-center p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                               val ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-600'
                             }`}
                           >
                             {key}
                             <i className={`fas ${val ? 'fa-check-circle' : 'fa-circle-notch opacity-20'}`}></i>
                           </button>
                        ))}
                      </div>
                   </div>
                </div>
            </div>
          )}

          {activeTab === 'technical' && (
             <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 animate-in fade-in">
                <h3 className="text-2xl font-black text-white mb-8">Especificações Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revestimento de Piso</label>
                        <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-[#C0562F]/50 transition-colors" value={form.technicalSpecs?.flooring} onChange={e => setForm({...form, technicalSpecs: {...form.technicalSpecs!, flooring: e.target.value}})} placeholder="Ex: Tablado + Carpete" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Iluminação Solicitada</label>
                        <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-[#C0562F]/50 transition-colors" value={form.technicalSpecs?.lighting} onChange={e => setForm({...form, technicalSpecs: {...form.technicalSpecs!, lighting: e.target.value}})} placeholder="Ex: Refletores HQI + LED" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Altura Máxima</label>
                        <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-[#C0562F]/50 transition-colors" value={form.technicalSpecs?.heightLimit} onChange={e => setForm({...form, technicalSpecs: {...form.technicalSpecs!, heightLimit: e.target.value}})} placeholder="Ex: 5,00m" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo de Marcenaria</label>
                        <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-[#C0562F]/50 transition-colors" value={form.technicalSpecs?.woodwork} onChange={e => setForm({...form, technicalSpecs: {...form.technicalSpecs!, woodwork: e.target.value}})} placeholder="Ex: Revestimento Melamínico" />
                    </div>
                </div>
             </div>
          )}

          {activeTab === 'files' && (
             <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 animate-in fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-white">Repositório de Arquivos</h3>
                  <button onClick={() => fileInputRef.current?.click()} className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest">UPLOAD</button>
                </div>
                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={() => {}} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.attachments?.map(file => (
                    <div key={file.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <i className="fas fa-file-pdf text-rose-500"></i>
                          <span className="text-xs font-bold text-white">{file.name}</span>
                       </div>
                       <span className="text-[9px] font-black text-slate-600 uppercase">{file.size}</span>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>

        {/* Barra Lateral do Projeto */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#C0562F] rounded-[2.5rem] p-8 shadow-2xl shadow-[#C0562F]/20">
             <h4 className="text-white font-black text-lg mb-6 flex items-center gap-3">
               <i className="fas fa-sparkles"></i> GERADOR G3 (IA)
             </h4>
             <button 
              onClick={async () => {
                setLoading(true);
                const img = await generateStandReference(form.keyRequirements);
                if (img) setForm(f => ({...f, aiReferences: [img, ...f.aiReferences]}));
                setLoading(false);
              }}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-[10px] flex items-center justify-center gap-3 transition-all ${
                loading ? 'bg-black/20 text-white/50' : 'bg-black text-white hover:scale-[1.02]'
              }`}
             >
               {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-cube"></i>}
               {loading ? 'PROCESSANDO...' : 'CRIAR REFERÊNCIA 3D'}
             </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Referências de IA</h4>
            <div className="space-y-4">
              {form.aiReferences?.map((img, i) => (
                <div key={i} className="rounded-3xl overflow-hidden border border-slate-800 aspect-video relative group">
                  <img src={img} className="w-full h-full object-cover" alt="IA" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="text-[10px] font-black text-white uppercase tracking-widest">Ampliar</button>
                  </div>
                </div>
              ))}
              {(form.aiReferences?.length || 0) === 0 && (
                <p className="text-[10px] text-slate-700 font-bold italic text-center py-10 uppercase tracking-widest">Nenhuma referência gerada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingView;
