import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Sparkles, Send, Download } from 'lucide-react';
import type { RecruiterFeedback } from '../types';


interface WillingnessToPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WillingnessToPayModal: React.FC<WillingnessToPayModalProps> = ({ isOpen, onClose }) => {
  const [timeSaved, setTimeSaved] = useState('30-60 min');
  const [willingness, setWillingness] = useState<'yes' | 'maybe' | 'no'>('yes');
  const [priceRange, setPriceRange] = useState('2 500 - 5 000 Kč / měsíčně (HR tým)');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Integrace na ATS (Teamio, Datacruit, Recruitis)',
  ]);
  const [comments, setComments] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feedback: RecruiterFeedback = {
      timeSavedMinutes: timeSaved,
      willingnessToPay: willingness,
      priceRange,
      featureRequests: selectedFeatures,
      comments,
      recruiterEmail: email,
      companyName,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage so owner can easily review or export
    try {
      const existing = JSON.parse(localStorage.getItem('recruiter_feedback_list') || '[]');
      existing.push(feedback);
      localStorage.setItem('recruiter_feedback_list', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
  };

  const handleExportData = () => {
    const list = localStorage.getItem('recruiter_feedback_list') || '[]';
    const blob = new Blob([list], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recruiter_validation_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-fadeIn">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Děkujeme za vaši zpětnou vazbu!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Vaše odpověď byla uložena. Pokud jste uvedli e-mail, brzy se vám ozveme s přednostním přístupem do plné verze a pilotního programu.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportovat nasbírané odpovědi (JSON)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Zavřít
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Validace pro recruitment & HR</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Zaplatili byste za toto AI srovnání kandidátů?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Pomozte nám produkt vyladit pro vaše denní potřeby při náboru.
              </p>
            </div>

            {/* 1. Time Saved */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                1. Kolik času by vám tento screening ušetřil na jedno vyhodnocení?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['10-15 min', '20-30 min', '30-60 min', 'Více než 1 hodinu'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTimeSaved(val)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      timeSaved === val
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Willingness to Pay */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                2. Byli byste ochotni za takový nástroj platit?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'yes', label: 'Ano, určitě' },
                  { key: 'maybe', label: 'Spíše ano' },
                  { key: 'no', label: 'Spíše ne' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setWillingness(key as 'yes' | 'maybe' | 'no')}
                    className={`px-3 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      willingness === key
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Fair Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                3. Jaký cenový model by pro vás byl férový?
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              >
                <option value="990 - 1 500 Kč / měsíčně (Freelance recruiter)">
                  990 – 1 500 Kč / měsíčně (Freelance recruiter)
                </option>
                <option value="2 500 - 5 000 Kč / měsíčně (HR tým)">
                  2 500 – 5 000 Kč / měsíčně (HR tým ve firmě)
                </option>
                <option value="8 000 - 15 000 Kč / měsíčně (Recruitment agentura)">
                  8 000 – 15 000 Kč / měsíčně (Recruitment agentura)
                </option>
                <option value="Pay-per-use (např. 25 Kč za vyhodnocené CV)">
                  Pay-per-use (např. 25–40 Kč za jedno vyhodnocené CV)
                </option>
              </select>
            </div>

            {/* 4. Missing features */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                4. Které funkce jsou pro vás nejdůležitější?
              </label>
              <div className="space-y-1.5">
                {[
                  'Integrace na ATS (Teamio, Datacruit, Recruitis)',
                  'Hromadný upload 20+ CV najednou z jedné složky',
                  'Generování specifických otázek na pohovor na míru kandidátovi',
                  'Sdílení interaktivního odkazu pro hiring manažera',
                ].map((feat) => {
                  const checked = selectedFeatures.includes(feat);
                  return (
                    <label
                      key={feat}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFeature(feat)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{feat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Contact fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Váš pracovní e-mail (pro přednostní přístup)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="např. recruiter@firma.cz"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Společnost / Agentura
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="např. TechHire s.r.o."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Poznámka / Co by vám nejvíce pomohlo v praxi?
              </label>
              <textarea
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Napište nám jakýkoliv nápad, zkušenost nebo požadavek..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Zrušit
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Odeslat zpětnou vazbu</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

