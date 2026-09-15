import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import React from 'react';
import { PRESET_JOBS } from '../data/sampleData';
import type { PresetJob } from '../types';


interface StepJobAdProps {
  jobAd: string;
  onChangeJobAd: (text: string) => void;
  onApplyPreset: (preset: PresetJob) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepJobAd: React.FC<StepJobAdProps> = ({
  jobAd,
  onChangeJobAd,
  onApplyPreset,
  onBack,
  onNext,
}) => {
  const isValid = jobAd.trim().length >= 30;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Krok 2 ze 3: Požadavky a popis pracovní pozice</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Jakou pozici aktuálně obsazujete?
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Vložte text inzerátu nebo vyberte připravenou pozici. Program automaticky extrahuje klíčová kritéria, potřebnou senioritu a technologický stack.
        </p>
      </div>

      {/* 1-Click Role Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Doporučené ukázkové pozice (1-klik vyplnění)
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_JOBS.map((preset) => {
            const isMatch = jobAd.includes(preset.title);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isMatch
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {preset.category}
                  </span>
                  {isMatch ? (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <span className="text-[11px] font-semibold text-indigo-600 hover:underline">
                      Použít
                    </span>
                  )}
                </div>
                <div className="font-semibold text-sm text-slate-900 line-clamp-1">{preset.title}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {preset.company.company_type} • {preset.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea Editor */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Znění inzerátu / Požadavky na kandidáta
          </label>
          <span className="text-xs text-slate-400">
            {jobAd.length} znaků {isValid ? '✓' : '(min. 30 znaků)'}
          </span>
        </div>

        <textarea
          rows={10}
          value={jobAd}
          onChange={(e) => onChangeJobAd(e.target.value)}
          placeholder="Zde vložte text pracovní nabídky, seznam požadovaných technologií, odpovědností a seniority..."
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sans leading-relaxed text-slate-800"
        />

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            <strong>Tip pro recruitery:</strong> Čím konkrétnější požadavky (např. technologie, minimální roky praxe, jazyky), tím přesnější a detailnější bude AI bodování.
          </span>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zpět na firmu</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer ${
            isValid
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 hover:translate-x-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Pokračovat na nahrání CV</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

