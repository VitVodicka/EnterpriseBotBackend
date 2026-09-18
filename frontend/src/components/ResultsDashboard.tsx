import confetti from 'canvas-confetti';
import {
  Award,
  Briefcase,
  CheckCircle,
  FolderGit2,
  GraduationCap,
  HeartHandshake,
  MessageSquareHeart,
  Printer,
  RotateCcw,
  Sparkles,
  Trophy,
  Users2,
  Wrench
} from 'lucide-react';
import React, { useEffect } from 'react';
import type { CandidateEvaluation, RecommendationResponse } from '../types';


interface ResultsDashboardProps {
  result: RecommendationResponse;
  onReset: () => void;
  onOpenFeedback: () => void;
}

const CATEGORY_MAP: Array<{
  key: keyof CandidateEvaluation;
  label: string;
  icon: React.ElementType;
}> = [
  { key: 'job_part', label: 'Pracovní zkušenosti & seniorita', icon: Briefcase },
  { key: 'skills_part', label: 'Technické & soft dovednosti', icon: Wrench },
  { key: 'education_part', label: 'Vzdělání & certifikace', icon: GraduationCap },
  { key: 'projects_part', label: 'Projekty & portfolio', icon: FolderGit2 },
  { key: 'basic_part', label: 'Základní profil & soulad s rolí', icon: Award },
  { key: 'reference_part', label: 'Reference & doporučení', icon: Users2 },
  { key: 'hobbies_part', label: 'Kulturní fit & volný čas', icon: HeartHandshake },
];

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onReset,
  onOpenFeedback,
}) => {
  const winnerIdx = result.recommended_candidate_index ?? 0;

  const candidates = result.extracted_candidates || [

    { candidate_name: 'Kandidát 1' },
    { candidate_name: 'Kandidát 2' },
  ];

  const evaluations = result.evaluated_candidates || [];

  const winnerCandidate = candidates[winnerIdx] || { candidate_name: `Kandidát ${winnerIdx + 1}` };


  useEffect(() => {
    // Fire confetti on successful evaluation
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore in environments without canvas
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 7.0) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 5.0) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8.5) return 'Silné doporučení';
    if (score >= 7.0) return 'Vhodný kandidát';
    if (score >= 5.0) return 'Částečná shoda';
    return 'Nízká shoda';
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Vyhodnocení dokončeno</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Výsledná srovnávací zpráva kandidátů
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Tisk / PDF report</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nové srovnání</span>
          </button>
        </div>
      </div>

      {/* Winner Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Doporučený vítězný kandidát</span>
            </div>

            <h3 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{winnerCandidate.candidate_name}</span>
            </h3>

            {winnerCandidate.candidate_location && (
              <p className="text-sm text-indigo-200">{winnerCandidate.candidate_location}</p>
            )}

            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              {result.recommendation_reason}
            </p>
          </div>

          {/* Score Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-center min-w-[200px] shrink-0 self-start md:self-center">
            <div className="text-xs uppercase tracking-wider font-semibold text-indigo-200">
              Celkové skóre shody
            </div>
            <div className="text-5xl font-black text-white my-2 tracking-tight">
              {result.recommendation_score?.toFixed(1) ?? '9.0'}
              <span className="text-2xl text-indigo-300 font-normal"> / 10</span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-slate-950">
              {getScoreBadge(result.recommendation_score ?? 9.0)}
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Feedback Trigger Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              Zaplatili byste za tento screening?
            </div>
            <div className="text-xs text-slate-600">
              Zajímá nás váš názor na úsporu času a požadované funkce.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFeedback}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0 flex items-center gap-2"
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Vyplnit 30s dotazník</span>
        </button>
      </div>

      {/* Head-to-Head Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Detailní srovnání: {candidates[0]?.candidate_name} vs {candidates[1]?.candidate_name}
            </h3>
            <p className="text-xs text-slate-500">
              Rozpad hodnocení v klíčových kategoriích podle požadavků zadání
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider p-4 hidden md:grid">
            <div className="md:col-span-4">Kategorie</div>
            <div className="md:col-span-4 flex items-center gap-2">
              <span>{candidates[0]?.candidate_name}</span>
              {winnerIdx === 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  VÍTĚZ
                </span>
              )}
            </div>
            <div className="md:col-span-4 flex items-center gap-2">
              <span>{candidates[1]?.candidate_name}</span>
              {winnerIdx === 1 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  VÍTĚZ
                </span>
              )}
            </div>
          </div>

          {/* Category Rows */}
          {CATEGORY_MAP.map(({ key, label, icon: Icon }) => {
            const eval0 = evaluations[0]?.[key];
            const eval1 = evaluations[1]?.[key];

            return (
              <div key={key} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 gap-4 hover:bg-slate-50/50 transition-colors">
                {/* Category Title */}
                <div className="md:col-span-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">{label}</span>
                  </div>
                </div>

                {/* Candidate 0 evaluation */}
                <div className="md:col-span-4 bg-slate-50/70 md:bg-transparent p-3 md:p-0 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between md:justify-start gap-2">
                    <span className="text-xs font-semibold text-slate-500 md:hidden">
                      {candidates[0]?.candidate_name}:
                    </span>
                    {eval0 && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreColor(eval0.evaluated_score)}`}>
                        {eval0.evaluated_score.toFixed(1)} / 10
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {eval0?.evaluated_reason || 'Hodnocení zpracováno v celkovém reportu.'}
                  </p>
                </div>

                {/* Candidate 1 evaluation */}
                <div className="md:col-span-4 bg-slate-50/70 md:bg-transparent p-3 md:p-0 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between md:justify-start gap-2">
                    <span className="text-xs font-semibold text-slate-500 md:hidden">
                      {candidates[1]?.candidate_name}:
                    </span>
                    {eval1 && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreColor(eval1.evaluated_score)}`}>
                        {eval1.evaluated_score.toFixed(1)} / 10
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {eval1?.evaluated_reason || 'Hodnocení zpracováno v celkovém reportu.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
    </div>
  );
};

