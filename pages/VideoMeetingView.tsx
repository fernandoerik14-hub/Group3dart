
import React, { useState } from 'react';

const VideoMeetingView: React.FC = () => {
  const [roomName, setRoomName] = useState('G3-Art-Studio-' + Math.random().toString(36).substring(7).toUpperCase());
  const [isCopied, setIsCopied] = useState(false);

  const meetingUrl = `https://meet.jit.si/${roomName}`;

  const startMeeting = () => {
    window.open(meetingUrl, 'G3Meeting', 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no');
  };

  const copyInvite = () => {
    const text = `Olá! A Group 3D Art convida você para uma reunião de briefing.\n\nLink da Sala: ${meetingUrl}\n\nAbra pelo navegador do PC ou app Jitsi Meet no celular.`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[75vh] animate-in fade-in zoom-in duration-700">
      {/* Visual de Sala Virtual */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 text-4xl mb-8 shadow-inner border border-purple-500/20">
            <i className="fas fa-video"></i>
          </div>
          
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">G3 CONFERENCE</h2>
          <p className="text-slate-500 font-medium mb-10 max-w-sm">
            Inicie reuniões instantâneas com clientes e montadoras sem complicação.
          </p>

          <div className="w-full bg-slate-950/50 border border-slate-800 p-6 rounded-3xl mb-10 flex flex-col items-center gap-4">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">ID DA SALA ATUAL</span>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-mono font-black text-purple-400 tracking-wider">{roomName}</span>
              <button 
                onClick={() => setRoomName('G3-Art-' + Math.random().toString(36).substring(7).toUpperCase())}
                className="text-slate-600 hover:text-white transition-colors"
                title="Gerar Novo ID"
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <button 
              onClick={startMeeting}
              className="bg-purple-600 hover:bg-purple-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <i className="fas fa-play"></i> Iniciar Reunião
            </button>
            
            <button 
              onClick={copyInvite}
              className="bg-slate-800 hover:bg-slate-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 border border-slate-700"
            >
              <i className={`fas ${isCopied ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
              {isCopied ? 'CONVITE COPIADO!' : 'COPIAR CONVITE'}
            </button>
          </div>
        </div>

        {/* Efeito Decorativo Digital */}
        <div className="mt-12 flex justify-center gap-2 opacity-20">
            <div className="w-1 h-8 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            <div className="w-1 h-12 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-1 h-10 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-14 bg-purple-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
            <div className="w-1 h-8 bg-purple-500 rounded-full animate-bounce [animation-delay:0.3s]"></div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-8 w-full max-w-3xl">
        <div className="text-center">
            <i className="fas fa-shield-halved text-emerald-500 text-xl mb-3"></i>
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest">Privacidade</h4>
            <p className="text-slate-600 text-[9px] mt-1 font-medium">Criptografia em trânsito ponta a ponta.</p>
        </div>
        <div className="text-center">
            <i className="fas fa-expand text-sky-500 text-xl mb-3"></i>
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest">Sem Limites</h4>
            <p className="text-slate-600 text-[9px] mt-1 font-medium">Reuniões ilimitadas sem custo extra.</p>
        </div>
        <div className="text-center">
            <i className="fas fa-mobile-screen text-amber-500 text-xl mb-3"></i>
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest">Multiplataforma</h4>
            <p className="text-slate-600 text-[9px] mt-1 font-medium">Acesse do PC, Tablet ou Celular.</p>
        </div>
      </div>
    </div>
  );
};

export default VideoMeetingView;
