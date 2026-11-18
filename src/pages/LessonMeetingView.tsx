import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Target,
} from 'lucide-react';
import { ConceptExplorationLab } from '../components/ConceptExplorationLab';
import { MathBlock, MathText } from '../components/MathText';
import { CONTOH_BUKAN_CONTOH_ITEMS, MEETINGS_DATA } from '../data/curriculumData';
import { ConceptExplorationRecord, MenuId } from '../types/module';

interface LessonMeetingViewProps {
  meetingId: 'pertemuan-1' | 'pertemuan-2' | 'pertemuan-3';
  isCompleted: boolean;
  conceptExploration: ConceptExplorationRecord;
  onUpdateExploration: (rec: ConceptExplorationRecord) => void;
  onCompleteAndContinue: (meetingId: 'pertemuan-1' | 'pertemuan-2' | 'pertemuan-3', nextMenu: MenuId) => void;
}

export const LessonMeetingView: React.FC<LessonMeetingViewProps> = ({
  meetingId,
  isCompleted,
  conceptExploration,
  onUpdateExploration,
  onCompleteAndContinue,
}) => {
  const lesson = MEETINGS_DATA[meetingId];
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [showPembahasan, setShowPembahasan] = useState(true);

  // Interactive widgets per meeting
  const [selectedPart, setSelectedPart] = useState<'var' | 'koef' | 'konst' | 'suku'>('var');
  const [classifierGuesses, setClassifierGuesses] = useState<Record<string, boolean | null>>({});
  const [rearrangeTarget, setRearrangeTarget] = useState<'x' | 'y' | 'z'>('x');
  const [elimPair, setElimPair] = useState<'same' | 'opposite'>('same');

  const activeCase = lesson.caseStudies[activeCaseIndex] ?? lesson.caseStudies[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. JUDUL */}
      <header className="rounded-2xl bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-sky-300 font-medium">
          <span>
            Pertemuan {lesson.meetingNumber} · {lesson.duration}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 text-teal-300 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sudah Diselesaikan</span>
            </span>
          )}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-balance">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-200 mt-1.5">{lesson.subtitle}</p>
      </header>

      {/* 2. TUJUAN */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-lg">
          <Target className="w-5 h-5 text-teal-700" />
          <h2>Tujuan Pembelajaran</h2>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {lesson.tujuan.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="font-mono text-xs font-semibold text-teal-700 mt-0.5 tabular-nums">
                {String(i + 1).padStart(2, '0')}.
              </span>
              <span className="leading-relaxed">
                <MathText text={item} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. PERTANYAAN PEMANTIK */}
      <section className="bg-sky-50/80 rounded-2xl border border-sky-200 p-6">
        <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-base">
          <HelpCircle className="w-5 h-5 text-sky-700" />
          <h2>Pertanyaan Pemantik</h2>
        </div>
        <p className="mt-2.5 text-sm sm:text-base text-navy-900 leading-relaxed font-medium">
          <MathText text={lesson.pertanyaanPemantik} />
        </p>
      </section>

      {/* 4. STIMULUS MASALAH */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-lg">
          <Lightbulb className="w-5 h-5 text-teal-700" />
          <h2>{lesson.stimulus.title}</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          <MathText text={lesson.stimulus.scenario} />
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-navy-900">
          <p className="font-semibold text-xs text-teal-700 mb-1">Ayo Pikirkan</p>
          <MathText text={lesson.stimulus.promptQuestion} />
        </div>
      </section>

      {/* 5. PENJELASAN KONSEP */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-xl">
          <BookOpen className="w-5 h-5 text-teal-700" />
          <h2>Penjelasan Konsep</h2>
        </div>

        <div className="space-y-4">
          {lesson.konsepSections.map((sec) => (
            <div key={sec.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="font-display text-base sm:text-lg font-bold text-navy-900">
                {sec.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <MathText text={sec.body} />
              </p>
              {sec.mathBlocks &&
                sec.mathBlocks.map((mb, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 text-navy-900"
                  >
                    <MathBlock math={mb} />
                  </div>
                ))}
              {sec.bullets && (
                <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      <MathText text={b} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Meeting-specific Interactive Concept Labs */}
        {meetingId === 'pertemuan-1' && (
          <div className="space-y-5 pt-2">
            <ConceptExplorationLab
              record={conceptExploration}
              onUpdateRecord={onUpdateExploration}
            />
            {/* Interactive Equation Anatomy Inspector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-navy-900">
                Eksplorasi Interaktif: Anatomi Unsur Persamaan
              </h3>
              <p className="text-sm text-slate-600">
                Klik tombol unsur di bawah untuk menyoroti bagian dari persamaan{' '}
                <span className="font-mono font-semibold text-navy-900">3x + 5y - 2z = 24.000</span>:
              </p>

              <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-lg sm:text-xl justify-center">
                <span
                  className={`px-2 py-1 rounded ${
                    selectedPart === 'koef'
                      ? 'bg-teal-600 text-white font-bold'
                      : selectedPart === 'suku'
                      ? 'bg-sky-200 text-navy-900'
                      : ''
                  }`}
                >
                  3
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    selectedPart === 'var'
                      ? 'bg-navy-900 text-white font-bold'
                      : selectedPart === 'suku'
                      ? 'bg-sky-200 text-navy-900'
                      : ''
                  }`}
                >
                  x
                </span>
                <span>+</span>
                <span
                  className={`px-2 py-1 rounded ${
                    selectedPart === 'koef'
                      ? 'bg-teal-600 text-white font-bold'
                      : selectedPart === 'suku'
                      ? 'bg-sky-200 text-navy-900'
                      : ''
                  }`}
                >
                  5
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    selectedPart === 'var'
                      ? 'bg-navy-900 text-white font-bold'
                      : selectedPart === 'suku'
                      ? 'bg-sky-200 text-navy-900'
                      : ''
                  }`}
                >
                  y
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    selectedPart === 'koef'
                      ? 'bg-teal-600 text-white font-bold'
                      : selectedPart === 'suku'
                      ? 'bg-sky-200 text-navy-900'
                      : ''
                  }`}
                >
                  -2
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    selectedPart === 'var'
                      ? 'bg-navy-900 text-white font-bold'
                      : selectedPart === 'suku'
                      ? 'bg-sky-200 text-navy-900'
                      : ''
                  }`}
                >
                  z
                </span>
                <span>=</span>
                <span
                  className={`px-2 py-1 rounded ${
                    selectedPart === 'konst'
                      ? 'bg-sky-600 text-white font-bold'
                      : selectedPart === 'suku'
                      ? 'bg-sky-200 text-navy-900'
                      : ''
                  }`}
                >
                  24.000
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'var' as const, label: 'Variabel (x, y, z)' },
                  { id: 'koef' as const, label: 'Koefisien (3, 5, -2)' },
                  { id: 'konst' as const, label: 'Konstanta (24.000)' },
                  { id: 'suku' as const, label: 'Suku Persamaan' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setSelectedPart(btn.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      selectedPart === btn.id
                        ? 'bg-navy-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Contoh dan Bukan Contoh SPLTV Classifier */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-navy-900">
                Uji Pemahaman: Contoh dan Bukan Contoh SPLTV
              </h3>
              <p className="text-sm text-slate-600">
                Tentukan apakah sistem persamaan berikut merupakan <strong>SPLTV</strong> atau{' '}
                <strong>Bukan SPLTV</strong>, lalu periksa alasannya!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONTOH_BUKAN_CONTOH_ITEMS.map((item) => {
                  const guess = classifierGuesses[item.id] ?? null;
                  const answered = guess !== null;
                  const correct = guess === item.isSpltv;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between"
                    >
                      <div className="bg-white rounded-lg p-3 border border-slate-200 text-sm overflow-x-auto">
                        <MathBlock math={item.equationLatex} />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setClassifierGuesses((prev) => ({ ...prev, [item.id]: true }))
                          }
                          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                            guess === true
                              ? 'bg-navy-900 text-white border-navy-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-sky-50'
                          }`}
                        >
                          Contoh SPLTV
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setClassifierGuesses((prev) => ({ ...prev, [item.id]: false }))
                          }
                          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                            guess === false
                              ? 'bg-navy-900 text-white border-navy-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-sky-50'
                          }`}
                        >
                          Bukan SPLTV
                        </button>
                      </div>
                      {answered && (
                        <div
                          className={`p-3 rounded-lg text-xs leading-relaxed ${
                            correct
                              ? 'bg-teal-50 text-teal-900 border border-teal-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          <p className="font-bold mb-0.5">
                            {correct ? 'Tepat!' : 'Kurang tepat.'} (
                            {item.isSpltv ? 'Termasuk SPLTV' : 'Bukan SPLTV'})
                          </p>
                          <MathText text={item.reason} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {meetingId === 'pertemuan-2' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-navy-900">
              Simulasi Mini: Perubahan Bentuk Persamaan Substitusi
            </h3>
            <p className="text-sm text-slate-600">
              Diberikan persamaan <MathText text="$x + 2y - z = 10$" />. Pilih variabel mana yang
              ingin kamu nyatakan secara eksplisit di ruas kiri:
            </p>
            <div className="flex flex-wrap gap-2">
              {(['x', 'y', 'z'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRearrangeTarget(v)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    rearrangeTarget === v
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  Nyatakan {v} = ...
                </button>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm space-y-2">
              {rearrangeTarget === 'x' && (
                <>
                  <p className="font-semibold text-navy-900">
                    Koefisien $x$ adalah $1$ (paling praktis tanpa pecahan):
                  </p>
                  <MathBlock math="x + 2y - z = 10 \implies x = 10 - 2y + z" />
                </>
              )}
              {rearrangeTarget === 'y' && (
                <>
                  <p className="font-semibold text-navy-900">
                    Koefisien $y$ adalah $2$ (menghasilkan bentuk pecahan bagi 2):
                  </p>
                  <MathBlock math="2y = 10 - x + z \implies y = \frac{10 - x + z}{2}" />
                </>
              )}
              {rearrangeTarget === 'z' && (
                <>
                  <p className="font-semibold text-navy-900">
                    Koefisien $z$ adalah $-1$ (pindah ruas jadi $+z$ di kanan, juga bebas pecahan):
                  </p>
                  <MathBlock math="x + 2y - 10 = z \implies z = x + 2y - 10" />
                </>
              )}
            </div>
          </div>
        )}

        {meetingId === 'pertemuan-3' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-navy-900">
              Panduan Cepat: Aturan Tanda Saat Eliminasi
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setElimPair('same')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  elimPair === 'same'
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                }`}
              >
                Koefisien Bertanda Sama (+6z dan +6z)
              </button>
              <button
                type="button"
                onClick={() => setElimPair('opposite')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  elimPair === 'opposite'
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                }`}
              >
                Koefisien Berlawanan (+6z dan -6z)
              </button>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm">
              {elimPair === 'same' ? (
                <div className="space-y-1">
                  <p className="font-semibold text-navy-900">
                    Gunakan Operasi PENGURANGAN (−)
                  </p>
                  <MathBlock math="(6x + 9y + 6z) - (6x + 4y + 6z) = 81.000 - 66.000 \implies 5y = 15.000" />
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-semibold text-navy-900">
                    Gunakan Operasi PENJUMLAHAN (+)
                  </p>
                  <MathBlock math="(4x + 6y - 2z) + (x - y + 2z) = 18 + 5 \implies 5x + 5y = 23" />
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 6. CONTOH SOAL & 7. PEMBAHASAN */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-navy-900">
            Contoh Soal & Pembahasan Kontekstual SMK
          </h2>
          {lesson.caseStudies.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {lesson.caseStudies.map((cs, idx) => (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => setActiveCaseIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeCaseIndex === idx
                      ? 'bg-navy-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  Kasus {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-xs font-semibold text-teal-700">{activeCase.contextTag}</p>
            <h3 className="font-display text-lg sm:text-xl font-bold text-navy-900 mt-1">
              {activeCase.title}
            </h3>
            <p className="mt-2.5 text-sm text-slate-700 leading-relaxed">
              <MathText text={activeCase.problemText} />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-navy-900 mb-2">Diketahui</p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                {activeCase.givenInfo.map((g, idx) => (
                  <li key={idx}>
                    <MathText text={g} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
              <p className="text-xs font-semibold text-navy-900 mb-2">Pemisalan Variabel</p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                {activeCase.variables.map((v, idx) => (
                  <li key={idx}>
                    <MathText text={v} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Toggle Pembahasan */}
          <div>
            <button
              type="button"
              onClick={() => setShowPembahasan((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-navy-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
            >
              <span>{showPembahasan ? 'Sembunyikan Pembahasan' : 'Tampilkan Pembahasan'}</span>
              {showPembahasan ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {showPembahasan && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="font-display text-base font-bold text-navy-900">
                Pembahasan Langkah demi Langkah
              </h4>
              <div className="space-y-3">
                {activeCase.steps.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                  >
                    <p className="text-sm font-bold text-navy-900">
                      <MathText text={st.stepTitle} />
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <MathText text={st.description} />
                    </p>
                    {st.math && (
                      <div className="p-3 rounded-lg bg-white border border-slate-200 overflow-x-auto text-sm">
                        <MathBlock math={st.math} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {activeCase.verification && (
                <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1.5">
                  <p className="text-xs font-bold text-teal-800">Pengecekan Hasil (Verifikasi)</p>
                  <ul className="space-y-1 text-xs sm:text-sm text-teal-900">
                    {activeCase.verification.map((ver, vIdx) => (
                      <li key={vIdx}>
                        <MathText text={ver} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 rounded-xl bg-navy-900 text-white text-sm leading-relaxed">
                <p className="text-xs font-semibold text-sky-300 mb-1">Kesimpulan</p>
                <MathText text={activeCase.conclusion} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. RANGKUMAN */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-lg">
          <Sparkles className="w-5 h-5 text-teal-700" />
          <h2>Rangkuman Pertemuan {lesson.meetingNumber}</h2>
        </div>
        <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
          {lesson.rangkuman.map((r, rIdx) => (
            <li key={rIdx} className="leading-relaxed">
              <MathText text={r} />
            </li>
          ))}
        </ul>
      </section>

      {/* 9. TOMBOL LANJUT */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-500">
          Klik tombol di samping untuk menandai Pertemuan {lesson.meetingNumber} selesai dan melanjutkan belajar.
        </p>
        <button
          type="button"
          onClick={() => onCompleteAndContinue(meetingId, lesson.nextMenuId)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{lesson.nextButtonLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
