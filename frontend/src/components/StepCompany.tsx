import React from 'react';
import { Building2, Users, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { CompanyIntroduction } from '../types';


interface StepCompanyProps {
  company: CompanyIntroduction;
  onChange: (company: CompanyIntroduction) => void;
  onNext: () => void;
}

const PRESET_COMPANIES: Array<{
  label: string;
  badge: string;
  data: CompanyIntroduction;
}> = [
  {
    label: 'Rostoucí B2B SaaS Startup',
    badge: 'Dynamické tempo',
    data: {
      company_type: 'B2B SaaS Scale-up',
      industry: 'Software & Cloud Automation',
      company_size: 45,
    },
  },
  {
    label: 'Finanční Korporace',
    badge: 'Stabilita & Bezpečnost',
    data: {
      company_type: 'Finanční instituce / Bankovnictví',
      industry: 'FinTech & Banking Services',
      company_size: 450,
    },
  },
  {
    label: 'Digitální & Kreativní Agentura',
    badge: 'Klientské projekty',
    data: {
      company_type: 'Vývojářská & Design Agentura',
      industry: 'E-commerce & Web Development',
      company_size: 25,
    },
  },
];

export const StepCompany: React.FC<StepCompanyProps> = ({ company, onChange, onNext }) => {
  const isSelected = (preset: CompanyIntroduction) =>
    company.company_type === preset.company_type &&
    company.industry === preset.industry &&
    company.company_size === preset.company_size;

  const isValid =
    company.company_type.trim().length > 0 &&
    company.industry.trim().length > 0 &&
    company.company_size > 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Krok 1 ze 3: Profil a kontext společnosti</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Pro jakou společnost nábor probíhá?
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Gemini AI zohledňuje velikost a typ firmy při posuzování seniority, adaptability a kulturního souladu kandidáta.
        </p>
      </div>

      {/* 1-Click Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Rychlý výběr šablony (pro okamžité otestování)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_COMPANIES.map((preset, index) => {
            const active = isSelected(preset.data);
            return (
              <button
                key={index}
                type="button"
                onClick={() => onChange(preset.data)}
                className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                  active
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {preset.badge}
                  </span>
                  {active && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="font-semibold text-sm text-slate-900">{preset.label}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {preset.data.company_size} zaměstnanců • {preset.data.industry}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>Vlastní parametry společnosti</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Company Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Typ společnosti
            </label>
            <input
              type="text"
              value={company.company_type}
              onChange={(e) => onChange({ ...company, company_type: e.target.value })}
              placeholder="např. B2B SaaS Scale-up, Startup, Enterprise"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Obor / Odvětví
            </label>
            <input
              type="text"
              value={company.industry}
              onChange={(e) => onChange({ ...company, industry: e.target.value })}
              placeholder="např. IT & AI, FinTech, E-commerce, Zdravotnictví"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Company Size */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Počet zaměstnanců
            </label>
            <input
              type="number"
              min={1}
              max={100000}
              value={company.company_size || ''}
              onChange={(e) => onChange({ ...company, company_size: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-end pt-2">
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
          <span>Pokračovat na zadání pozice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

