import React, { useEffect, useState } from 'react';
import { Bot, FileSearch, Scale, Award, CheckCircle2, Clock } from 'lucide-react';

interface ProcessingStateProps {
  isDemoMode: boolean;
}

const STAGES = [
  {
    title: 'Extrakce profilu firmy a požadavků pozice',
    desc: 'Gemini AI čte zadání inzerátu, identifikuje klíčové technologie, praxi a odpovědnosti...',
    icon: FileSearch,
    durationMs: 4000,
  },
  {
    title: 'Analýza a strukturování PDF životopisů',
    desc: 'Paralelní extrakce pracovních zkušeností, vzdělání, dovedností a projektů...',
    icon: Bot,
    durationMs: 14000,
  },
  {
    title: 'Kategorizovaná evaluace kandidátů',
    desc: 'Bodování shody (0-10) v kategoriích: Job, Skills, Vzdělání, Projekty a Reference...',
    icon: Scale,
    durationMs: 12000,
  },
  {
    title: 'Generování finálního srovnání a doporučení',
    desc: 'Syntéza výsledků, identifikace vítězného kandidáta a příprava manažerského reportu...',
    icon: Award,
    durationMs: 6000,
  },
];

export const ProcessingState: React.FC<ProcessingStateProps> = ({ isDemoMode }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Progress through stages smoothly based on elapsed time
    if (isDemoMode) {
      if (elapsedSeconds < 1) setCurrentStageIndex(0);
      else if (elapsedSeconds < 2) setCurrentStageIndex(1);
      else if (elapsedSeconds < 2.5) setCurrentStageIndex(2);
      else setCurrentStageIndex(3);
    } else {
      if (elapsedSeconds < 6) setCurrentStageIndex(0);
      else if (elapsedSeconds < 22) setCurrentStageIndex(1);
      else if (elapsedSeconds < 36) setCurrentStageIndex(2);
      else setCurrentStageIndex(3);
    }
  }, [elapsedSeconds, isDemoMode]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Central Pulsing AI Icon */}
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 animate-ping"></div>
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Bot className="w-12 h-12 animate-pulse" />
        </div>
      </div>

      {/* Main Title & Timer */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Gemini AI analyzuje kandidáty
        </h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Porovnáváme obě CV vůči zadanému profilu pozice. Tento proces trvá obvykle 25–45 sekund pro maximální hloubku a přesnost.
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mt-3">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Doba zpracování: {elapsedSeconds} s</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="space-y-3 text-left max-w-lg mx-auto">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                isCurrent
                  ? 'border-indigo-400 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/10'
                  : isDone
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 bg-slate-50/50 opacity-50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white animate-bounce'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-indigo-900' : isDone ? 'text-emerald-900' : 'text-slate-600'
                    }`}
                  >
                    {stage.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 animate-pulse">
                      Probíhá
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recruiter Quote/Tip */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 italic max-w-lg mx-auto">
        💡 <strong>Víte, že:</strong> Ruční zevrubný screening jednoho životopisu s porovnáním portfolia zabere recruiterovi v průměru 15–30 minut.
      </div>
    </div>
  );
};

