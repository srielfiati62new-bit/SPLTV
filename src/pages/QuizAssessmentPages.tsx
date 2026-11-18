import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { MathText } from '../components/MathText';
import {
  DIAGNOSTIC_10_QUESTIONS,
  HOTS_30_QUESTIONS,
  SUMMATIVE_20_QUESTIONS,
} from '../data/stage2Questions';
import {
  AnswerValue,
  AssessmentRecord,
  MenuId,
  QuestionFormat,
  QuizQuestion,
  StudentIdentity,
} from '../types/module';
import {
  evaluateQuestionCorrectness,
  getDiagnosticRecommendation,
} from '../utils/storage';

interface MultiFormatAssessmentProps {
  menuNumberLabel: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  record: AssessmentRecord | null;
  identity: StudentIdentity;
  onSaveRecord: (record: AssessmentRecord) => void;
  nextMenuId: MenuId;
  nextButtonLabel: string;
  onNavigate: (menu: MenuId) => void;
  passingScore?: number;
  enableTimerMinutes?: number;
  requireSubmitConfirm?: boolean;
  showFormatFilter?: boolean;
  isDiagnostic?: boolean;
  isSummative?: boolean;
}

const FORMAT_LABELS: Record<QuestionFormat, string> = {
  pg: 'Pilihan Ganda',
  'pg-kompleks': 'PG Kompleks (Pilih >1)',
  'benar-salah': 'Benar / Salah',
  uraian: 'Uraian HOTS',
};

const MultiFormatAssessment: React.FC<MultiFormatAssessmentProps> = ({
  menuNumberLabel,
  title,
  description,
  questions,
  record,
  identity,
  onSaveRecord,
  nextMenuId,
  nextButtonLabel,
  onNavigate,
  passingScore = 75,
  enableTimerMinutes,
  requireSubmitConfirm = false,
  showFormatFilter = false,
  isDiagnostic = false,
  isSummative = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(record?.answers ?? {});
  const [submitted, setSubmitted] = useState<boolean>(Boolean(record?.completed));
  const [formatFilter, setFormatFilter] = useState<'all' | QuestionFormat>('all');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validationWarn, setValidationWarn] = useState(false);

  const initialSeconds =
    enableTimerMinutes !== undefined
      ? record?.remainingSeconds ?? enableTimerMinutes * 60
      : undefined;
  const [remainingSeconds, setRemainingSeconds] = useState<number | undefined>(initialSeconds);

  // Auto-save draft answers during active assessment (especially for Sumatif!)
  const persistDraft = (nextAnswers: Record<string, AnswerValue>, remSec?: number) => {
    if (submitted) return;
    onSaveRecord({
      completed: false,
      score: 0,
      correctCount: 0,
      totalQuestions: questions.length,
      answers: nextAnswers,
      completedAt: '',
      remainingSeconds: remSec,
    });
  };

  const finalizeSubmit = (currentAnswers: Record<string, AnswerValue>) => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (evaluateQuestionCorrectness(q, currentAnswers[q.id])) {
        correctCount += 1;
      }
    });
    const score = Math.round((correctCount / questions.length) * 100);
    setSubmitted(true);
    setConfirmOpen(false);
    setValidationWarn(false);
    onSaveRecord({
      completed: true,
      score,
      correctCount,
      totalQuestions: questions.length,
      answers: currentAnswers,
      completedAt: new Date().toISOString(),
      remainingSeconds,
    });
  };

  // Countdown timer for Summative Assessment (40 minutes)
  useEffect(() => {
    if (!enableTimerMinutes || submitted) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === undefined) return prev;
        if (prev <= 1) {
          clearInterval(timer);
          finalizeSubmit(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [enableTimerMinutes, submitted, answers]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isAnswered = (q: QuizQuestion) => {
    const val = answers[q.id];
    if (val === undefined) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'string') return val.trim().length > 0;
    return true;
  };

  const answeredCount = questions.filter(isAnswered).length;

  const handleSelectSingle = (qId: string, idx: number) => {
    if (submitted) return;
    setValidationWarn(false);
    const next = { ...answers, [qId]: idx };
    setAnswers(next);
    persistDraft(next, remainingSeconds);
  };

  const handleToggleComplex = (qId: string, idx: number) => {
    if (submitted) return;
    setValidationWarn(false);
    const prevArr = Array.isArray(answers[qId]) ? (answers[qId] as number[]) : [];
    const nextArr = prevArr.includes(idx)
      ? prevArr.filter((i) => i !== idx)
      : [...prevArr, idx];
    const next = { ...answers, [qId]: nextArr };
    setAnswers(next);
    persistDraft(next, remainingSeconds);
  };

  const handleChangeEssay = (qId: string, text: string) => {
    if (submitted) return;
    setValidationWarn(false);
    const next = { ...answers, [qId]: text };
    setAnswers(next);
    persistDraft(next, remainingSeconds);
  };

  const handleRequestSubmit = () => {
    if (!requireSubmitConfirm && answeredCount < questions.length) {
      setValidationWarn(true);
      return;
    }
    if (requireSubmitConfirm) {
      setConfirmOpen(true);
      return;
    }
    finalizeSubmit(answers);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setValidationWarn(false);
    if (enableTimerMinutes) {
      setRemainingSeconds(enableTimerMinutes * 60);
    }
  };

  const filteredQuestions =
    formatFilter === 'all'
      ? questions
      : questions.filter((q) => (q.format ?? 'pg') === formatFilter);

  const computedScore =
    submitted && record?.completed
      ? record.score
      : Math.round(
          (questions.filter((q) => evaluateQuestionCorrectness(q, answers[q.id])).length /
            questions.length) *
            100
        );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono font-semibold text-teal-700">{menuNumberLabel}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
            {title}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
          <p className="text-xs text-slate-500 mt-1">
            Peserta Didik: <strong>{identity.namaLengkap}</strong> · {identity.kelas} ·{' '}
            {questions.length} Soal
          </p>
        </div>

        <div className="flex items-center gap-3">
          {enableTimerMinutes !== undefined && remainingSeconds !== undefined && !submitted && (
            <div
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 font-mono text-sm font-bold tabular-nums ${
                remainingSeconds < 300
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-navy-900 border-navy-900 text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-300" />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>
          )}

          {submitted && (
            <div
              className={`px-5 py-3 rounded-xl border text-right ${
                computedScore >= passingScore
                  ? 'bg-teal-50 border-teal-200 text-teal-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <p className="text-xs font-semibold">Nilai Akhir</p>
              <p className="font-display text-3xl font-bold tabular-nums">{computedScore}</p>
              <p className="text-xs">
                {computedScore >= passingScore
                  ? `Tuntas (KKTP ≥ ${passingScore})`
                  : `Remedial (KKTP ${passingScore})`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostic / Summative Post-Submission Recommendation Banner */}
      {submitted && isDiagnostic && (
        <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
          <p className="text-xs font-bold text-navy-900">Rekomendasi Belajar Diagnostik</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {getDiagnosticRecommendation(record)}
          </p>
        </div>
      )}

      {submitted && isSummative && (
        <div
          className={`p-5 rounded-2xl border space-y-1.5 ${
            computedScore >= passingScore
              ? 'bg-teal-50 border-teal-200 text-teal-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          <p className="text-xs font-bold">
            {computedScore >= passingScore
              ? 'Rekomendasi Pengayaan (Lulus KKTP ≥ 75)'
              : 'Rekomendasi Remedial (Skor < 75)'}
          </p>
          <p className="text-sm leading-relaxed">
            {computedScore >= passingScore
              ? 'Selamat! Kamu telah menguasai SPLTV Fase E. Lanjutkan tantangan HOTS di Latihan Soal Uraian dan eksplorasi sistem custom pada Simulasi 3D.'
              : 'Tinjau kembali pembahasan soal yang masih salah di bawah ini, ulangi Lab Substitusi dan Lab Eliminasi di menu Simulasi Matematika, lalu kerjakan ulang Asesmen Sumatif.'}
          </p>
        </div>
      )}

      {/* Format Filter Tabs (for 30-question HOTS bank) */}
      {showFormatFilter && (
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/70 rounded-xl">
          {[
            { id: 'all' as const, label: `Semua (${questions.length})` },
            { id: 'pg' as const, label: 'Pilihan Ganda (10)' },
            { id: 'pg-kompleks' as const, label: 'PG Kompleks (10)' },
            { id: 'benar-salah' as const, label: 'Benar/Salah (5)' },
            { id: 'uraian' as const, label: 'Uraian HOTS (5)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFormatFilter(tab.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                formatFilter === tab.id
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Question Navigator */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {filteredQuestions.map((q) => {
            const globalIdx = questions.findIndex((item) => item.id === q.id);
            const ans = isAnswered(q);
            const isCorrect = submitted && evaluateQuestionCorrectness(q, answers[q.id]);
            const isWrong = submitted && !evaluateQuestionCorrectness(q, answers[q.id]);
            return (
              <a
                key={q.id}
                href={`#q-${q.id}`}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold flex items-center justify-center border transition-colors tabular-nums ${
                  isCorrect
                    ? 'bg-teal-600 text-white border-teal-600'
                    : isWrong
                    ? 'bg-rose-600 text-white border-rose-600'
                    : ans
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-sky-50'
                }`}
              >
                {globalIdx + 1}
              </a>
            );
          })}
        </div>
        <span className="text-xs text-slate-600 tabular-nums">
          Terjawab: <strong>{answeredCount}</strong> / {questions.length}
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {filteredQuestions.map((q) => {
          const globalIdx = questions.findIndex((item) => item.id === q.id);
          const format = q.format ?? 'pg';
          const isCorrect = submitted && evaluateQuestionCorrectness(q, answers[q.id]);

          return (
            <article
              key={q.id}
              id={`q-${q.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold text-teal-700">
                  Soal {String(globalIdx + 1).padStart(2, '0')} · {FORMAT_LABELS[format]} · {q.topic}
                </span>
                {submitted && (
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      isCorrect ? 'text-teal-700' : 'text-rose-700'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Benar</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Perlu Perbaikan</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="text-sm sm:text-base text-navy-900 font-medium leading-relaxed">
                <MathText text={q.question} />
              </div>

              {/* PG / Benar-Salah */}
              {(format === 'pg' || format === 'benar-salah') && (
                <div className={format === 'benar-salah' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === oIdx;
                    const isRightOpt = q.correctIndex === oIdx;
                    let cls =
                      'bg-slate-50 border-slate-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300';
                    if (submitted) {
                      if (isRightOpt) {
                        cls = 'bg-teal-50 border-teal-500 text-teal-950 font-semibold';
                      } else if (isSelected && !isRightOpt) {
                        cls = 'bg-rose-50 border-rose-400 text-rose-900';
                      } else {
                        cls = 'bg-slate-50 border-slate-200 text-slate-500 opacity-80';
                      }
                    } else if (isSelected) {
                      cls = 'bg-navy-900 border-navy-900 text-white font-medium';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectSingle(q.id, oIdx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm flex items-start gap-3 transition-colors ${cls}`}
                      >
                        <span className="font-mono text-xs font-bold mt-0.5 shrink-0">
                          {format === 'benar-salah' ? (oIdx === 0 ? 'B' : 'S') : String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span className="flex-1 overflow-x-auto">
                          <MathText text={opt} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* PG Kompleks (Multi-select checkboxes) */}
              {format === 'pg-kompleks' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Pilih lebih dari satu jawaban yang menurutmu benar:
                  </p>
                  {q.options.map((opt, oIdx) => {
                    const selectedArr = Array.isArray(answers[q.id])
                      ? (answers[q.id] as number[])
                      : [];
                    const checked = selectedArr.includes(oIdx);
                    const isRightOpt = q.correctIndices?.includes(oIdx) ?? false;

                    let cls =
                      'bg-slate-50 border-slate-200 text-slate-800 hover:bg-sky-50';
                    if (submitted) {
                      if (isRightOpt && checked) {
                        cls = 'bg-teal-50 border-teal-500 text-teal-950 font-semibold';
                      } else if (isRightOpt && !checked) {
                        cls = 'bg-amber-50 border-amber-400 text-amber-950';
                      } else if (!isRightOpt && checked) {
                        cls = 'bg-rose-50 border-rose-400 text-rose-900';
                      } else {
                        cls = 'bg-slate-50 border-slate-200 text-slate-500 opacity-80';
                      }
                    } else if (checked) {
                      cls = 'bg-sky-50 border-navy-900 text-navy-900 font-semibold';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleToggleComplex(q.id, oIdx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm flex items-start gap-3 transition-colors ${cls}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="mt-1 accent-navy-900 pointer-events-none"
                        />
                        <span className="flex-1 overflow-x-auto">
                          <MathText text={opt} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Uraian HOTS */}
              {format === 'uraian' && (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    disabled={submitted}
                    value={typeof answers[q.id] === 'string' ? (answers[q.id] as string) : ''}
                    onChange={(e) => handleChangeEssay(q.id, e.target.value)}
                    placeholder="Tuliskan langkah pemodelan, perhitungan substitusi/eliminasi, dan nilai akhir x, y, z..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  {submitted && q.sampleAnswer && (
                    <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-950">
                      <p className="font-bold mb-0.5">Kunci Jawaban Uraian:</p>
                      <p>{q.sampleAnswer}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pembahasan ONLY shown after submission */}
              {submitted && (
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs sm:text-sm text-navy-900 leading-relaxed">
                  <p className="font-bold text-teal-800 mb-0.5">Pembahasan:</p>
                  <MathText text={q.explanation} />
                </div>
              )}
            </article>
          );
        })}
      </div>

      {validationWarn && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          Masih ada soal yang belum terjawab ({answeredCount}/{questions.length}). Silakan lengkapi sebelum mengirim.
        </div>
      )}

      {/* Confirmation Modal for Summative */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-lg font-bold text-navy-900">
                  Konfirmasi Pengumpulan Asesmen
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Kamu telah menjawab <strong>{answeredCount}</strong> dari{' '}
                  <strong>{questions.length}</strong> soal. Setelah dikumpulkan, jawaban akan
                  dinilai otomatis dan pembahasan akan terbuka.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={() => finalizeSubmit(answers)}
                className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {!submitted ? (
          <button
            type="button"
            onClick={handleRequestSubmit}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <ClipboardCheck className="w-4 h-4 text-teal-300" />
            <span>Kumpulkan Jawaban</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-navy-900 text-sm font-semibold rounded-xl border border-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kerjakan Ulang</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate(nextMenuId)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <span>{nextButtonLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AsesmenDiagnostikPage: React.FC<{
  identity: StudentIdentity;
  record: AssessmentRecord | null;
  onSaveRecord: (r: AssessmentRecord) => void;
  onNavigate: (m: MenuId) => void;
}> = ({ identity, record, onSaveRecord, onNavigate }) => (
  <MultiFormatAssessment
    menuNumberLabel="Menu 06 · Pemetaan Prasyarat (10 Soal)"
    title="Asesmen Diagnostik"
    description="Ukur penguasaan kemampuan prasyarat aljabar, pemindahan ruas, dan SPLDV sebelum memulai Pertemuan 1."
    questions={DIAGNOSTIC_10_QUESTIONS}
    record={record}
    identity={identity}
    onSaveRecord={onSaveRecord}
    nextMenuId="pertemuan-1"
    nextButtonLabel="Lanjut ke Pertemuan 1"
    onNavigate={onNavigate}
    passingScore={70}
    isDiagnostic
  />
);

export const LatihanSoalPage: React.FC<{
  identity: StudentIdentity;
  record: AssessmentRecord | null;
  onSaveRecord: (r: AssessmentRecord) => void;
  onNavigate: (m: MenuId) => void;
}> = ({ identity, record, onSaveRecord, onNavigate }) => (
  <MultiFormatAssessment
    menuNumberLabel="Menu 12 · Bank Soal HOTS SMK (30 Soal)"
    title="Latihan Soal HOTS SPLTV"
    description="10 Pilihan Ganda, 10 Pilihan Ganda Kompleks, 5 Benar/Salah, dan 5 Uraian kontekstual usaha kuliner, koperasi, produksi, dan kewirausahaan SMK."
    questions={HOTS_30_QUESTIONS}
    record={record}
    identity={identity}
    onSaveRecord={onSaveRecord}
    nextMenuId="sumatif"
    nextButtonLabel="Lanjut ke Asesmen Sumatif"
    onNavigate={onNavigate}
    passingScore={75}
    showFormatFilter
  />
);

export const AsesmenSumatifPage: React.FC<{
  identity: StudentIdentity;
  record: AssessmentRecord | null;
  onSaveRecord: (r: AssessmentRecord) => void;
  onNavigate: (m: MenuId) => void;
}> = ({ identity, record, onSaveRecord, onNavigate }) => (
  <MultiFormatAssessment
    menuNumberLabel="Menu 13 · Evaluasi Akhir Terjadwal (20 Soal · 40 Menit)"
    title="Asesmen Sumatif SPLTV Fase E"
    description="Terdiri atas 10 Pilihan Ganda, 5 PG Kompleks, dan 5 Benar/Salah. Jawaban tersimpan otomatis; pembahasan terbuka setelah kamu mengumpulkan."
    questions={SUMMATIVE_20_QUESTIONS}
    record={record}
    identity={identity}
    onSaveRecord={onSaveRecord}
    nextMenuId="hasil-belajar"
    nextButtonLabel="Lihat Hasil Belajar & Rubrik"
    onNavigate={onNavigate}
    passingScore={75}
    enableTimerMinutes={40}
    requireSubmitConfirm
    isSummative
  />
);
