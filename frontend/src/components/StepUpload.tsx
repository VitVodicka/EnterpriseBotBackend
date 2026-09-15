import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, ArrowLeft, Sparkles, UserCheck } from 'lucide-react';
import { createSamplePdfBlob } from '../data/sampleData';

interface StepUploadProps {
  files: File[];
  onFilesChange: (files: File[], isSample?: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const StepUpload: React.FC<StepUploadProps> = ({
  files,
  onFilesChange,
  onBack,
  onSubmit,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setErrorMessage(null);

    const pdfs: File[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage(`Soubor "${file.name}" není ve formátu PDF.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`Soubor "${file.name}" přesahuje maximální velikost 10 MB.`);
        return;
      }
      pdfs.push(file);
    }

    const merged = [...files, ...pdfs].slice(0, 2);
    onFilesChange(merged, false);
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated, false);
  };

  const handleLoadSamplePdfs = () => {
    setErrorMessage(null);
    const blob1 = createSamplePdfBlob('Ing. Petr Svoboda', 'Senior Python Developer');
    const blob2 = createSamplePdfBlob('Jan Dvorak', 'Mid-level Python Developer');

    const file1 = new File([blob1], 'CV_Petr_Svoboda_Senior.pdf', { type: 'application/pdf' });
    const file2 = new File([blob2], 'CV_Jan_Dvorak_Mid.pdf', { type: 'application/pdf' });

    onFilesChange([file1, file2], true);
  };


  const canSubmit = files.length === 2 && !isLoading;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Krok 3 ze 3: Nahrání CV kandidátů</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Nahrajte 2 životopisy v PDF pro vzájemné porovnání
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Model extrahuje zkušenosti, technologie, vzdělání a porovná obě CV s požadavky pozice.
        </p>
      </div>

      {/* Quick Sample CV Loader Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Nemáte po ruce 2 životopisy?</div>
            <div className="text-xs text-slate-600">
              Načtěte 1-klikem připravená testovací PDF: <strong>Petr Svoboda (Senior)</strong> vs <strong>Jan Dvořák (Mid)</strong>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLoadSamplePdfs}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-50 shadow-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nahrát testovací CV</span>
        </button>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div className="font-semibold text-slate-800 text-base">
          Přetáhněte sem 2 PDF soubory nebo <span className="text-indigo-600 underline">vyberte z disku</span>
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          Podporován je formát PDF (max. 5 stran na soubor, max. 10 MB).
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Files Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Nahrané soubory ({files.length} ze 2 vyžadovaných)</span>
          {files.length === 2 && (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Připraveno k analýze
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((index) => {
            const file = files[index];
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  file
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-900 shadow-xs'
                    : 'border-dashed border-slate-300 bg-slate-50/50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      file ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-500">
                      Kandidát {index + 1}
                    </div>
                    {file ? (
                      <div className="text-sm font-semibold text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </div>
                    ) : (
                      <div className="text-sm italic text-slate-400">Čeká na nahrání...</div>
                    )}
                    {file && (
                      <div className="text-[11px] text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    )}
                  </div>
                </div>

                {file && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Odebrat soubor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation and Launch Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zpět na pozici</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
            canSubmit
              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-indigo-500/30 hover:scale-[1.02]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Spustit AI srovnání kandidátů</span>
        </button>
      </div>
    </div>
  );
};

