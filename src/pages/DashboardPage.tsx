import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileSpreadsheet,
  Sliders,
  Star,
  Target,
  Zap,
} from 'lucide-react';
import { LearningProgress, MenuId, StudentIdentity } from '../types/module';
import {
  calculateActivityScore,
  calculateGamification,
  calculateOverallProgress,
  getAchievementBadges,
  getLearningChallenges,
} from '../utils/storage';

interface DashboardPageProps {
  identity: StudentIdentity;
  progress: LearningProgress;
  onNavigate: (menu: MenuId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  identity,
  progress,
  onNavigate,
}) => {
  const overallPercent = calculateOverallProgress(progress);
  const activityScore = calculateActivityScore(progress);
  const badges = getAchievementBadges(progress);
  const earnedCount = badges.filter((b) => b.earned).length;
  const gamification = calculateGamification(progress);
  const challenges = getLearningChallenges(progress);

  const completedTopics = [
    {
      id: 'pertemuan-1' as MenuId,
      label: 'Pertemuan 1: Definisi, Eksplorasi Konsep & Pemodelan',
      done:
        progress.completedMeetings.includes('pertemuan-1') &&
        progress.conceptExploration.completedTasks.length >= 3,
    },
    {
      id: 'pertemuan-2' as MenuId,
      label: 'Pertemuan 2: Metode Substitusi',
      done: progress.completedMeetings.includes('pertemuan-2'),
    },
    {
      id: 'pertemuan-3' as MenuId,
      label: 'Pertemuan 3: Metode Eliminasi',
      done: progress.completedMeetings.includes('pertemuan-3'),
    },
    {
      id: 'simulasi' as MenuId,
      label: 'Simulasi Lab Substitusi & Lab Eliminasi',
      done: progress.substitutionLabDone && progress.eliminationLabDone,
    },
    {
      id: 'lkpd' as MenuId,
      label: 'LKPD Digital 1, 2 & 3',
      done:
        progress.lkpd.lkpd1.completed &&
        progress.lkpd.lkpd2.completed &&
        progress.lkpd.lkpd3.completed,
    },
  ];

  const completedCount = completedTopics.filter((t) => t.done).length;

  return (
    <div className="space-y-8">
      {/* Header Welcome & Gamification Level Card */}
      <section className="rounded-2xl bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs text-sky-300 font-medium">
            Dashboard Pembelajaran · {identity.kelas} · No. Absen {identity.nomorAbsen}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Selamat Datang, {identity.namaLengkap}
          </h1>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-teal-300">
              <Zap className="w-4 h-4" />
              <span>
                Level {gamification.level}: {gamification.levelTitle}
              </span>
            </span>
            <span className="text-sky-200 font-mono tabular-nums">
              {gamification.xp} XP
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300 font-mono tabular-nums">
              <Star className="w-4 h-4 fill-amber-300" />
              <span>
                {gamification.stars} / {gamification.maxStars} Bintang
              </span>
            </span>
          </div>
        </div>

        <div className="bg-white/10 border border-white/15 rounded-xl p-4 sm:min-w-[270px] space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-sky-200">
              <span>Progress Modul Keseluruhan</span>
              <span className="font-mono font-semibold text-white tabular-nums">
                {overallPercent}%
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full bg-navy-950/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-400 transition-all duration-300"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-sky-200">
              <span>Target Level Berikutnya</span>
              <span className="font-mono tabular-nums">
                {gamification.xp} / {gamification.nextLevelXp} XP
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full bg-navy-950/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-300"
                style={{ width: `${gamification.levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 font-medium">Nilai Rata-Rata Aktivitas</p>
          <p className="font-display text-3xl font-bold text-navy-900 mt-1 tabular-nums">
            {activityScore > 0 ? activityScore : '—'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Diagnostik, Eksplorasi, LKPD, HOTS & Sumatif
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 font-medium">Status Asesmen Diagnostik</p>
          <p className="font-display text-lg font-bold text-navy-900 mt-1.5 tabular-nums">
            {progress.diagnostik?.completed
              ? `Selesai · Skor ${progress.diagnostik.score}`
              : 'Belum Dikerjakan'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('diagnostik')}
            className="mt-2 text-xs font-semibold text-teal-700 hover:underline"
          >
            {progress.diagnostik?.completed ? 'Lihat Rekomendasi' : 'Kerjakan 10 Soal'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 font-medium">Status Asesmen Sumatif</p>
          <p className="font-display text-lg font-bold text-navy-900 mt-1.5 tabular-nums">
            {progress.sumatif?.completed
              ? `Selesai · Skor ${progress.sumatif.score}`
              : 'Belum Dikerjakan'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('sumatif')}
            className="mt-2 text-xs font-semibold text-teal-700 hover:underline"
          >
            {progress.sumatif?.completed ? 'Tinjau Pembahasan' : 'Mulai Ujian (20 Soal)'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 font-medium">Badge Pencapaian</p>
          <p className="font-display text-3xl font-bold text-navy-900 mt-1 tabular-nums">
            {earnedCount} / {badges.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {completedCount} dari {completedTopics.length} modul inti selesai
          </p>
        </div>
      </section>

      {/* Tantangan Pembelajaran & Badge Pencapaian */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 space-y-6">
          {/* Tantangan Pembelajaran */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 text-navy-900 font-display text-lg font-bold">
              <Target className="w-5 h-5 text-teal-700" />
              <h2>Tantangan Pembelajaran Aktif</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Selesaikan tantangan berikut untuk mengumpulkan XP dan menaikkan levelmu.
            </p>
            <ul className="mt-4 space-y-2.5">
              {challenges.map((ch) => (
                <li
                  key={ch.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    ch.done
                      ? 'bg-teal-50/70 border-teal-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        ch.done ? 'text-teal-600' : 'text-slate-300'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-navy-900">{ch.title}</p>
                      <p className="text-[11px] font-mono text-teal-700">+{ch.rewardXp} XP</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(ch.targetMenu)}
                    className="px-3 py-1.5 text-xs font-semibold text-navy-900 bg-white border border-slate-200 hover:border-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    {ch.done ? 'Tuntas' : 'Kerjakan'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Materi Selesai */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-display text-lg font-bold text-navy-900">
              Status Materi & Aktivitas Pembelajaran
            </h2>
            <ul className="mt-3 divide-y divide-slate-100">
              {completedTopics.map((topic) => (
                <li key={topic.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        topic.done ? 'text-teal-600' : 'text-slate-300'
                      }`}
                    />
                    <span className="text-sm font-medium text-navy-900 truncate">
                      {topic.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(topic.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-navy-900 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    {topic.done ? 'Buka Lagi' : 'Pelajari'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-display text-lg font-bold text-navy-900">5 Badge Kompetensi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Penghargaan otomatis berdasarkan capaian eksplorasi, pemodelan, dan pemecahan masalah.
          </p>
          <div className="mt-4 space-y-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                  badge.earned
                    ? 'bg-teal-50/70 border-teal-200'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    badge.earned ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy-900">
                    {badge.title}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      · {badge.earned ? 'Diraih' : 'Terkunci'}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{badge.criteria}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Navigation Menu Grid */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-display text-lg font-bold text-navy-900 mb-4">
          Akses Cepat Menu Pembelajaran
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'peta-konsep' as MenuId, label: 'Peta Konsep', icon: Compass },
            { id: 'pertemuan-1' as MenuId, label: 'Pertemuan 1', icon: BookOpenCheck },
            { id: 'simulasi' as MenuId, label: 'Simulasi Lab', icon: Sliders },
            { id: 'lkpd' as MenuId, label: 'LKPD 1–3', icon: FileSpreadsheet },
            { id: 'latihan' as MenuId, label: 'Latihan HOTS', icon: ClipboardCheck },
            { id: 'hasil-belajar' as MenuId, label: 'Hasil & Rubrik', icon: ArrowRight },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-start gap-2 p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-colors text-left"
              >
                <Icon className="w-5 h-5 text-teal-700" />
                <span className="text-sm font-semibold text-navy-900">{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
