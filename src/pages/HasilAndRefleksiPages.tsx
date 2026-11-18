import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Cloud,
  Printer,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { MathText } from '../components/MathText';
import {
  LearningProgress,
  MenuId,
  ReflectionRecord,
  RubricCategory,
  StudentIdentity,
} from '../types/module';
import { analyzeStudentCompetencies } from '../utils/competencyAnalysis';
import {
  calculateActivityScore,
  calculateGamification,
  calculateOverallProgress,
  computeAssessmentRubric,
  getAchievementBadges,
} from '../utils/storage';
import { SyncStatusSummary } from '../utils/syncService';

interface HasilBelajarPageProps {
  identity: StudentIdentity;
  progress: LearningProgress;
  syncStatus?: SyncStatusSummary;
  onNavigate: (menu: MenuId) => void;
}

const RUBRIC_STYLE: Record<RubricCategory, string> = {
  'Sangat Mahir': 'text-teal-800 bg-teal-50 border-teal-200',
  Mahir: 'text-sky-800 bg-sky-50 border-sky-200',
  'Mulai Berkembang': 'text-amber-800 bg-amber-50 border-amber-200',
  'Belum Berkembang': 'text-slate-600 bg-slate-100 border-slate-200',
};

export const HasilBelajarPage: React.FC<HasilBelajarPageProps> = ({
  identity,
  progress,
  syncStatus,
  onNavigate,
}) => {
  const overallProgress = calculateOverallProgress(progress);
  const avgScore = calculateActivityScore(progress);
  const badges = getAchievementBadges(progress);
  const gamification = calculateGamification(progress);
  const rubricDims = computeAssessmentRubric(progress);
  const analysis = analyzeStudentCompetencies(progress);
  const sumatifScore = progress.sumatif?.score ?? null;

  const getPredikat = (score: number | null) => {
    if (score === null) return 'Belum Dinilai';
    if (score >= 88) return 'Sangat Mahir';
    if (score >= 75) return 'Mahir (Tuntas Fase E)';
    if (score >= 55) return 'Mulai Berkembang';
    return 'Belum Berkembang';
  };

  const rows = [
    {
      komponen: 'Asesmen Diagnostik (10 Soal Prasyarat)',
      status: progress.diagnostik?.completed ? 'Selesai' : 'Belum Dikerjakan',
      skor: progress.diagnostik?.completed ? `${progress.diagnostik.score}` : '—',
      keterangan: progress.diagnostik?.completed
        ? `${progress.diagnostik.correctCount} dari ${progress.diagnostik.totalQuestions} benar`
        : 'Kerjakan untuk pemetaan awal',
    },
    {
      komponen: 'Eksplorasi Konsep SPLTV',
      status:
        progress.conceptExploration.completedTasks.length >= 3
          ? 'Selesai (3/3)'
          : `${progress.conceptExploration.completedTasks.length}/3 Aktivitas`,
      skor:
        progress.conceptExploration.completedTasks.length > 0
          ? `${progress.conceptExploration.score}`
          : '—',
      keterangan: 'Drag & drop unsur, linearitas, dan analisis sistem',
    },
    {
      komponen: 'LKPD 1: Definisi & Pemodelan SPLTV',
      status: progress.lkpd.lkpd1.completed ? 'Selesai' : 'Belum Dikerjakan',
      skor: progress.lkpd.lkpd1.completed ? `${progress.lkpd.lkpd1.score}` : '—',
      keterangan: 'Identifikasi variabel & pemodelan kontekstual',
    },
    {
      komponen: 'LKPD 2: Penyelesaian Metode Substitusi',
      status: progress.lkpd.lkpd2.completed ? 'Selesai' : 'Belum Dikerjakan',
      skor: progress.lkpd.lkpd2.completed ? `${progress.lkpd.lkpd2.score}` : '—',
      keterangan: 'Penyelesaian berjenjang & verifikasi nilai',
    },
    {
      komponen: 'LKPD 3: Penyelesaian Metode Eliminasi',
      status: progress.lkpd.lkpd3.completed ? 'Selesai' : 'Belum Dikerjakan',
      skor: progress.lkpd.lkpd3.completed ? `${progress.lkpd.lkpd3.score}` : '—',
      keterangan: 'Penyetaraan koefisien & himpunan penyelesaian',
    },
    {
      komponen: 'Latihan HOTS SMK (30 Soal)',
      status: progress.latihan?.completed ? 'Selesai' : 'Belum Dikerjakan',
      skor: progress.latihan?.completed ? `${progress.latihan.score}` : '—',
      keterangan: progress.latihan?.completed
        ? `${progress.latihan.correctCount} dari ${progress.latihan.totalQuestions} benar`
        : '10 PG, 10 PG Kompleks, 5 B/S, 5 Uraian',
    },
    {
      komponen: 'Asesmen Sumatif Akhir (20 Soal)',
      status: progress.sumatif?.completed ? 'Selesai' : 'Belum Dikerjakan',
      skor: progress.sumatif?.completed ? `${progress.sumatif.score}` : '—',
      keterangan: progress.sumatif?.completed
        ? `${progress.sumatif.correctCount} dari ${progress.sumatif.totalQuestions} benar`
        : 'Evaluasi akhir penentu ketuntasan',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono font-semibold text-teal-700">
            Menu 14 · Laporan Individu & Analisis 5 Kompetensi
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
            Laporan Hasil Belajar SPLTV
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Rekapitulasi nilai resmi, analisis penguasaan 5 kompetensi inti, dan rekomendasi remedial/pengayaan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4 text-sky-300" />
          <span>Cetak / Ekspor PDF</span>
        </button>
      </div>

      {/* Student Identity & Gamification Summary Box */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <p className="text-xs text-slate-500">Nama Peserta Didik</p>
          <p className="font-display font-bold text-navy-900 mt-0.5">{identity.namaLengkap}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Kelas & Absen</p>
          <p className="font-display font-bold text-navy-900 mt-0.5">
            {identity.kelas} · No. {identity.nomorAbsen}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Progres Modul</p>
          <p className="font-mono font-bold text-teal-700 mt-0.5 tabular-nums">
            {overallProgress}%
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Level & XP</p>
          <p className="font-mono font-bold text-navy-900 mt-0.5 flex items-center gap-1 tabular-nums">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            <span>
              Lv.{gamification.level} ({gamification.xp} XP)
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Perolehan Bintang</p>
          <p className="font-mono font-bold text-navy-900 mt-0.5 flex items-center gap-1 tabular-nums">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>
              {gamification.stars} / {gamification.maxStars}
            </span>
          </p>
        </div>
      </section>

      {/* Server & Official Record Integrity Readout */}
      {syncStatus && (
        <section className="bg-slate-50 rounded-xl border border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              Status Integritas Data:{' '}
              <strong className="text-navy-900">
                {syncStatus.state === 'synced-gas'
                  ? 'Tersinkron ke Google Sheets & Server'
                  : syncStatus.state === 'saved-server'
                    ? 'Tersimpan Tervalidasi di Server Aplikasi'
                    : syncStatus.state === 'failed'
                      ? 'Menunggu Sinkronisasi Ulang'
                      : 'Tersimpan di Perangkat'}
              </strong>
            </span>
          </div>
          <span className="text-slate-500 tabular-nums">
            {progress.sumatif?.completedAt
              ? `Pengumpulan Sumatif: ${new Date(progress.sumatif.completedAt).toLocaleString('id-ID')}`
              : 'Asesmen Sumatif belum dikumpulkan'}
          </span>
        </section>
      )}

      {/* Assessment Score Table */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-navy-900">
            Rekap Nilai Evaluasi & Aktivitas
          </h2>
          <p className="text-xs font-semibold text-navy-900">
            Predikat Sumatif: <span className="text-teal-700">{getPredikat(sumatifScore)}</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-5">Komponen Penilaian</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Skor</th>
                <th className="py-3 px-5">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.komponen}>
                  <td className="py-3.5 px-5 font-medium text-navy-900">{r.komponen}</td>
                  <td className="py-3.5 px-5 text-slate-600">{r.status}</td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-navy-900 tabular-nums">
                    {r.skor}
                  </td>
                  <td className="py-3.5 px-5 text-xs text-slate-600">{r.keterangan}</td>
                </tr>
              ))}
              <tr className="bg-sky-50/60 font-semibold">
                <td className="py-3.5 px-5 text-navy-900" colSpan={2}>
                  Rata-Rata Nilai Aktivitas Tercatat
                </td>
                <td className="py-3.5 px-5 text-right font-mono text-base font-bold text-teal-700 tabular-nums">
                  {avgScore > 0 ? avgScore : '—'}
                </td>
                <td className="py-3.5 px-5 text-xs text-slate-600">KKTP Minimal: 75</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ANALISIS 5 KOMPETENSI OTOMATIS */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200">
          <h2 className="font-display text-lg font-bold text-navy-900">
            Analisis Penguasaan 5 Kompetensi SPLTV
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dihitung langsung dari bukti penyelesaian Eksplorasi Konsep, Diagnostik, LKPD 1–3, Latihan HOTS, dan Sumatif (KKTP ≥ 75).
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {analysis.competencies.map((comp) => (
            <div key={comp.id} className="p-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-slate-500">{comp.code}</span>
                  <h3 className="font-display text-base font-bold text-navy-900">{comp.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-navy-900 tabular-nums">
                    {comp.score !== null ? `${comp.score} / 100` : 'Belum Diuji'}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      comp.score === null
                        ? 'bg-slate-50 text-slate-600 border-slate-200'
                        : comp.mastered
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {comp.score === null
                      ? 'Belum Ada Bukti'
                      : comp.mastered
                        ? 'Sudah Dikuasai'
                        : 'Perlu Penguatan'}
                  </span>
                </div>
              </div>

              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    comp.mastered ? 'bg-teal-500' : comp.score !== null ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                  style={{ width: `${comp.score ?? 0}%` }}
                />
              </div>

              <p className="text-xs text-slate-600">{comp.evidenceSummary}</p>
              <p className="text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200/80">
                <strong>{comp.mastered ? 'Saran Pengayaan:' : 'Saran Remedial:'}</strong>{' '}
                {comp.mastered ? comp.enrichmentRecommendation : comp.remedialRecommendation}
              </p>
            </div>
          ))}
        </div>

        {/* Ringkasan Kekuatan, Kelemahan, Remedial & Pengayaan */}
        <div className="p-5 sm:p-6 bg-sky-50/50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-teal-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Kompetensi yang Sudah Dikuasai ({analysis.masteredList.length}/5)</span>
            </div>
            {analysis.masteredList.length > 0 ? (
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {analysis.masteredList.map((c) => (
                  <li key={c.id}>
                    <strong>{c.name}</strong> (Skor {c.score})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                Belum ada kompetensi yang mencapai skor ≥ 75. Lengkapi LKPD dan Asesmen untuk memetakan kekuatanmu.
              </p>
            )}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Rekomendasi Pengayaan</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">{analysis.overallEnrichment}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Kompetensi yang Belum Dikuasai ({analysis.unmasteredList.length}/5)</span>
            </div>
            {analysis.unmasteredList.length > 0 ? (
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {analysis.unmasteredList.map((c) => (
                  <li key={c.id}>
                    <strong>{c.name}</strong> ({c.score !== null ? `Skor ${c.score}` : 'Belum dikerjakan'})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-teal-700 font-medium">
                Selamat! Seluruh 5 kompetensi dasar SPLTV telah tuntas di atas KKTP.
              </p>
            )}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Rekomendasi Remedial</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">{analysis.overallRemedial}</p>
            </div>
          </div>
        </div>
      </section>

      {/* RUBRIK PENILAIAN 6 ASPEK (4 KATEGORI) */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-navy-900">
              Rubrik Penilaian 6 Dimensi Matematis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kategori: Belum Berkembang (&lt;55) · Mulai Berkembang (55–74) · Mahir (75–87) · Sangat Mahir (88–100)
            </p>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {rubricDims.map((dim) => (
            <div
              key={dim.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <p className="text-sm font-bold text-navy-900">{dim.aspect}</p>
                <p className="text-xs text-slate-600">
                  <MathText text={dim.description} />
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm font-bold text-navy-900 tabular-nums">
                  {dim.score > 0 ? dim.score : '0'}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border ${RUBRIC_STYLE[dim.category]}`}
                >
                  {dim.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed Meetings & Badges */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display text-base font-bold text-navy-900 mb-3">
            Ketuntasan Pertemuan & Simulasi
          </h2>
          <ul className="space-y-2.5 text-sm">
            {[
              {
                done: progress.completedMeetings.includes('pertemuan-1'),
                label: 'Pertemuan 1: Definisi dan Konsep SPLTV',
              },
              {
                done: progress.completedMeetings.includes('pertemuan-2'),
                label: 'Pertemuan 2: Metode Substitusi',
              },
              {
                done: progress.completedMeetings.includes('pertemuan-3'),
                label: 'Pertemuan 3: Metode Eliminasi',
              },
              {
                done: progress.substitutionLabDone && progress.eliminationLabDone,
                label: 'Lab Simulasi Substitusi & Eliminasi',
              },
            ].map((m, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${m.done ? 'text-teal-600' : 'text-slate-300'}`}
                />
                <span className={m.done ? 'text-navy-900 font-medium' : 'text-slate-500'}>
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display text-base font-bold text-navy-900 mb-3">
            Lencana Pencapaian yang Diraih
          </h2>
          <div className="space-y-2">
            {badges.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Award
                    className={`w-4 h-4 ${b.earned ? 'text-teal-600' : 'text-slate-300'}`}
                  />
                  <span className={b.earned ? 'font-semibold text-navy-900' : 'text-slate-400'}>
                    {b.title}
                  </span>
                </span>
                <span className="text-xs text-slate-500">{b.earned ? 'Diraih' : 'Belum'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={() => onNavigate('refleksi')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <span>Isi Refleksi Pembelajaran</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface RefleksiPageProps {
  identity: StudentIdentity;
  refleksi: ReflectionRecord;
  onSaveRefleksi: (record: ReflectionRecord) => void;
  onNavigate: (menu: MenuId) => void;
}

export const RefleksiPage: React.FC<RefleksiPageProps> = ({
  identity,
  refleksi,
  onSaveRefleksi,
  onNavigate,
}) => {
  const [ratings, setRatings] = useState(refleksi.ratings);
  const [materiDipahami, setMateriDipahami] = useState(refleksi.materiDipahami);
  const [materiBelumDipahami, setMateriBelumDipahami] = useState(refleksi.materiBelumDipahami);
  const [kesulitanSiswa, setKesulitanSiswa] = useState(refleksi.kesulitanSiswa);
  const [strategiPemecahan, setStrategiPemecahan] = useState(refleksi.strategiPemecahan);
  const [pengalamanBelajar, setPengalamanBelajar] = useState(refleksi.pengalamanBelajar);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    onSaveRefleksi({
      completed: true,
      ratings,
      materiDipahami: materiDipahami.trim(),
      materiBelumDipahami: materiBelumDipahami.trim(),
      kesulitanSiswa: kesulitanSiswa.trim(),
      strategiPemecahan: strategiPemecahan.trim(),
      pengalamanBelajar: pengalamanBelajar.trim(),
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono font-semibold text-teal-700">
          Menu 15 · Evaluasi Diri Peserta Didik (+60 XP)
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
          Refleksi Pembelajaran SPLTV
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tuliskan refleksi mendalam mengenai pemahaman, kendala, strategi, serta pengalaman
          belajarmu di E-Modul SPLTV Smart Learning.
        </p>
      </div>

      {savedBanner && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-teal-50 border border-teal-200 text-sm text-teal-900">
          <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
          <span>
            Terima kasih, {identity.namaLengkap}. Refleksi pembelajaranmu telah tersimpan dan +60 XP ditambahkan.
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
      >
        <div className="space-y-4">
          <h2 className="font-display text-base font-bold text-navy-900">
            Skala Penguasaan Materi (1 = Belum Paham · 5 = Sangat Paham)
          </h2>
          {(
            [
              { key: 'konsep', label: 'Definisi, Bentuk Umum & Unsur SPLTV' },
              { key: 'pemodelan', label: 'Pemodelan Matematika Masalah Kontekstual SMK' },
              { key: 'substitusi', label: 'Penyelesaian dengan Metode Substitusi' },
              { key: 'eliminasi', label: 'Penyelesaian dengan Metode Eliminasi' },
            ] as const
          ).map((item) => (
            <div
              key={item.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
            >
              <span className="text-sm font-medium text-navy-900">{item.label}</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRatings((prev) => ({ ...prev, [item.key]: val }))}
                    className={`w-9 h-9 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      ratings[item.key] === val
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-sky-50'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[
            {
              id: 'materiDipahami',
              label: '1. Materi yang Dipahami: Bagian konsep atau metode apa yang paling kamu kuasai?',
              val: materiDipahami,
              setter: setMateriDipahami,
              ph: 'Contoh: Saya sudah menguasai cara memodelkan transaksi 3 barang menjadi 3 persamaan dan memakai eliminasi...',
            },
            {
              id: 'materiBelumDipahami',
              label: '2. Materi yang Belum Dipahami: Konsep atau langkah mana yang masih terasa samar?',
              val: materiBelumDipahami,
              setter: setMateriBelumDipahami,
              ph: 'Contoh: Saya masih sering tertukar tanda saat memindahkan suku pada metode substitusi...',
            },
            {
              id: 'kesulitanSiswa',
              label: '3. Kesulitan yang Dihadapi: Hambatan spesifik apa yang muncul saat mengerjakan soal HOTS atau LKPD?',
              val: kesulitanSiswa,
              setter: setKesulitanSiswa,
              ph: 'Contoh: Kesulitan menentukan pengali KPK saat koefisiennya berbeda tanda...',
            },
            {
              id: 'strategiPemecahan',
              label: '4. Strategi Pemecahan Masalah: Cara atau trik apa yang kamu gunakan untuk mengatasi kesulitan tersebut?',
              val: strategiPemecahan,
              setter: setStrategiPemecahan,
              ph: 'Contoh: Menggunakan fitur Tutor Cerdas tahap demi tahap dan selalu melakukan pengecekan hasil ke ketiga persamaan awal...',
            },
            {
              id: 'pengalamanBelajar',
              label: '5. Pengalaman Belajar: Bagaimana kesanmu belajar menggunakan simulasi interaktif & e-modul ini?',
              val: pengalamanBelajar,
              setter: setPengalamanBelajar,
              ph: 'Tuliskan pengalaman belajarmu selama menggunakan SPLTV Smart Learning...',
            },
          ].map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-semibold text-navy-900 mb-1.5"
              >
                {field.label}
              </label>
              <textarea
                id={field.id}
                rows={2}
                value={field.val}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.ph}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-300" />
            <span>Simpan Refleksi</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-50 hover:bg-sky-100 text-navy-900 text-sm font-semibold rounded-xl border border-sky-200 transition-colors"
          >
            <span>Kembali ke Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
