import { Bot, Sparkles } from 'lucide-react';
import React from 'react';
import type { HealthResponse } from '../api/client';

interface NavbarProps {
  health: HealthResponse | null;
  onOpenFeedback: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  health,
  onOpenFeedback,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-slate-900 tracking-tight lowercase">desideo</span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">AI Srovnání & Doporučení kandidátů pro recruitery</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3 sm:space-x-4">

          {/* Feedback & Willingness to Pay Button */}
          <button
            onClick={onOpenFeedback}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-sm transition-all shadow-indigo-500/25 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Poslat zpětnou vazbu</span>
          </button>
        </div>
      </div>
    </header>
  );
};


