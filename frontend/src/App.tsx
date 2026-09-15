import { AlertTriangle, Award, Building2, FileText, Sparkles, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { HealthResponse } from './api/client';
import {
  checkBackendHealth,
  submitCandidateEvaluation,
} from './api/client';
import { Navbar } from './components/Navbar';
import { ProcessingState } from './components/ProcessingState';
import { ResultsDashboard } from './components/ResultsDashboard';
import { StepCompany } from './components/StepCompany';
import { StepJobAd } from './components/StepJobAd';
import { StepUpload } from './components/StepUpload';
import { WillingnessToPayModal } from './components/WillingnessToPayModal';
import { PRESET_JOBS, createSamplePdfBlob } from './data/sampleData';
import type { CompanyIntroduction, PresetJob, RecommendationResponse } from './types';


export function App() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [company, setCompany] = useState<CompanyIntroduction>(PRESET_JOBS[0].company);
  const [jobAd, setJobAd] = useState<string>(PRESET_JOBS[0].jobAd);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState<boolean>(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Check health on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setHealth(res);
    });
  }, []);

  const handleApplyPreset = (preset: PresetJob) => {
    setCompany(preset.company);
    setJobAd(preset.jobAd);
  };

  const handleQuickDemo = () => {
    // 1-click load preset job, company, and sample PDFs, then transition to step 3 ready to run
    const defaultJob = PRESET_JOBS[0];
    setCompany(defaultJob.company);
    setJobAd(defaultJob.jobAd);

    const blob1 = createSamplePdfBlob('Ing. Petr Svoboda', 'Senior Python Developer');
    const blob2 = createSamplePdfBlob('Jan Dvorak', 'Mid-level Python Developer');
    const f1 = new File([blob1], 'CV_Petr_Svoboda_Senior.pdf', { type: 'application/pdf' });
    const f2 = new File([blob2], 'CV_Jan_Dvorak_Mid.pdf', { type: 'application/pdf' });
    setFiles([f1, f2]);
    setIsSampleData(true);
    setStep(3);
  };

  const handleSubmitEvaluation = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await submitCandidateEvaluation(company, jobAd, files, isSampleData);
      setResult(response);
      setStep(4);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Chyba při zpracování CV';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setError(null);
    setFiles([]);
    setIsSampleData(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navigation */}
      <Navbar
        health={health}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offline notification banner if backend is down */}
        {health && !health.available && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Backend (FastAPI) není online.</strong> Pro analýzu vlastních CV spusťte backend (<code>start_backend.bat</code>). Pro okamžité vyzkoušení s ukázkovými daty můžete kliknout na <strong>Nahrát testovací CV</strong>.
              </span>
            </div>
            <button
              onClick={() => checkBackendHealth().then(setHealth)}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg shrink-0 cursor-pointer"
            >
              Zkontrolovat znovu
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-lg shrink-0 cursor-pointer"
            >
              Zavřít
            </button>
          </div>
        )}


        {/* Stepper Header (only visible when not analyzing and not on results) */}
        {!isLoading && step !== 4 && (
          <div className="mb-10 no-print">
            {/* Quick 1-click test button */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 mb-8">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Srovnání a doporučení kandidátů pomocí AI
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Objektivní posouzení 2 životopisů vůči požadavkům firmy za méně než 1 minutu
                </p>
              </div>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rychlý 1-klik test s ukázkovými CV</span>
              </button>
            </div>

            {/* Stepper Pills */}
            <nav className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-1"></div>

              {[
                { num: 1, label: 'Společnost', icon: Building2 },
                { num: 2, label: 'Pracovní pozice', icon: FileText },
                { num: 3, label: 'Nahrání CV', icon: UploadCloud },
                { num: 4, label: 'Výsledek & Vítěz', icon: Award },
              ].map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                const Icon = s.icon;

                return (
                  <div
                    key={s.num}
                    onClick={() => {
                      if (s.num < step && !isLoading) setStep(s.num as any);
                    }}
                    className={`flex flex-col items-center group ${
                      s.num < step ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                        isActive
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-indigo-500/25 scale-110'
                          : isCompleted
                          ? 'bg-emerald-600 text-white group-hover:bg-emerald-700'
                          : 'bg-white text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isCompleted ? '✓' : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-xs mt-2 font-semibold hidden sm:block ${
                        isActive
                          ? 'text-indigo-600'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </nav>
          </div>
        )}

        {/* Dynamic Step Content */}
        {isLoading ? (
          <ProcessingState isDemoMode={isSampleData} />
        ) : step === 1 ? (
          <StepCompany
            company={company}
            onChange={setCompany}
            onNext={() => setStep(2)}
          />
        ) : step === 2 ? (
          <StepJobAd
            jobAd={jobAd}
            onChangeJobAd={setJobAd}
            onApplyPreset={handleApplyPreset}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        ) : step === 3 ? (
          <StepUpload
            files={files}
            onFilesChange={(newFiles, isSample) => {
              setFiles(newFiles);
              setIsSampleData(!!isSample);
            }}
            onBack={() => setStep(2)}
            onSubmit={handleSubmitEvaluation}
            isLoading={isLoading}
          />
        ) : step === 4 && result ? (

          <ResultsDashboard
            result={result}
            onReset={handleReset}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} desideo • Inteligentní screening & evaluace kandidátů</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Dotazník ochoty platit pro recruitery
            </button>
          </div>
        </div>
      </footer>

      {/* Willingness to Pay & Feedback Modal */}
      <WillingnessToPayModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}

export default App;

