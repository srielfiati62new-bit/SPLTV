import React, { useState } from 'react';
import { HelpCircle, Lightbulb, Sparkles } from 'lucide-react';
import { MathText } from './MathText';

export interface TutorScaffolding {
  topicTitle: string;
  konsepHint: string;
  prosesHint: string;
  perhitunganHint: string;
  errorDiagnosis?: string | null;
}

interface SmartTutorPanelProps {
  scaffolding: TutorScaffolding;
}

export const SmartTutorPanel: React.FC<SmartTutorPanelProps> = ({ scaffolding }) => {
  const [tier, setTier] = useState<number>(0);

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-sm">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <span>Tutor Pembelajaran Cerdas · {scaffolding.topicTitle}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => setTier(step)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                tier === step
                  ? 'bg-navy-900 text-white border-navy-900'
                  : tier > step
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-100'
              }`}
            >
              {step === 1
                ? '1. Petunjuk Konsep'
                : step === 2
                ? '2. Petunjuk Proses'
                : '3. Petunjuk Hitung'}
            </button>
          ))}
        </div>
      </div>

      {scaffolding.errorDiagnosis && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
          <p className="font-bold mb-0.5">Analisis Kesalahan Jawabanmu:</p>
          <MathText text={scaffolding.errorDiagnosis} />
        </div>
      )}

      {tier === 0 ? (
        <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Butuh bantuan tanpa langsung melihat jawaban akhir? Pilih tahap petunjuk di atas.
            </span>
          </span>
          <button
            type="button"
            onClick={() => setTier(1)}
            className="px-3 py-1.5 bg-navy-900 text-white font-semibold rounded-lg text-xs hover:bg-navy-800 transition-colors whitespace-nowrap shrink-0"
          >
            Buka Petunjuk Konsep
          </button>
        </div>
      ) : (
        <div className="space-y-2 text-xs sm:text-sm text-navy-900">
          {tier >= 1 && (
            <div className="p-3 rounded-lg bg-white border border-sky-200">
              <p className="text-[11px] font-bold text-teal-700 mb-0.5">
                Tahap 1 · Petunjuk Konsep
              </p>
              <MathText text={scaffolding.konsepHint} />
            </div>
          )}
          {tier >= 2 && (
            <div className="p-3 rounded-lg bg-white border border-sky-200">
              <p className="text-[11px] font-bold text-sky-700 mb-0.5">
                Tahap 2 · Petunjuk Proses
              </p>
              <MathText text={scaffolding.prosesHint} />
            </div>
          )}
          {tier >= 3 && (
            <div className="p-3 rounded-lg bg-white border border-sky-200">
              <p className="text-[11px] font-bold text-navy-900 mb-0.5">
                Tahap 3 · Petunjuk Perhitungan
              </p>
              <MathText text={scaffolding.perhitunganHint} />
            </div>
          )}
          {tier < 3 && (
            <button
              type="button"
              onClick={() => setTier((t) => Math.min(3, t + 1))}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Masih bingung? Lanjut ke Petunjuk Tahap {tier + 1}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
