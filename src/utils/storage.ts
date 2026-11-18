import {
  AssessmentRecord,
  LearningProgress,
  MenuId,
  NavItem,
  QuizQuestion,
  RubricCategory,
  RubricDimensionScore,
  SingleLkpdData,
  StudentIdentity,
} from '../types/module';

const IDENTITY_KEY = 'spltv_smart_student_identity_v1';
const PROGRESS_KEY = 'spltv_smart_learning_progress_v1';

export const NAV_ITEMS: NavItem[] = [
  { id: 'beranda', number: 1, label: 'Beranda', group: 'Utama', requiresIdentity: false },
  { id: 'identitas', number: 2, label: 'Identitas Peserta Didik', group: 'Utama', requiresIdentity: false },
  { id: 'dashboard', label: 'Dashboard Belajar', group: 'Utama', requiresIdentity: true },
  { id: 'petunjuk', number: 3, label: 'Petunjuk Penggunaan', group: 'Persiapan', requiresIdentity: false },
  { id: 'peta-konsep', number: 4, label: 'Peta Konsep', group: 'Persiapan', requiresIdentity: false },
  { id: 'tujuan', number: 5, label: 'Tujuan Pembelajaran', group: 'Persiapan', requiresIdentity: false },
  { id: 'diagnostik', number: 6, label: 'Asesmen Diagnostik', group: 'Persiapan', requiresIdentity: true },
  { id: 'pertemuan-1', number: 7, label: 'Pertemuan 1', group: 'Materi Inti', requiresIdentity: true },
  { id: 'pertemuan-2', number: 8, label: 'Pertemuan 2', group: 'Materi Inti', requiresIdentity: true },
  { id: 'pertemuan-3', number: 9, label: 'Pertemuan 3', group: 'Materi Inti', requiresIdentity: true },
  { id: 'simulasi', number: 10, label: 'Simulasi Matematika', group: 'Praktik & Evaluasi', requiresIdentity: true },
  { id: 'lkpd', number: 11, label: 'LKPD', group: 'Praktik & Evaluasi', requiresIdentity: true },
  { id: 'latihan', number: 12, label: 'Latihan Soal', group: 'Praktik & Evaluasi', requiresIdentity: true },
  { id: 'sumatif', number: 13, label: 'Asesmen Sumatif', group: 'Praktik & Evaluasi', requiresIdentity: true },
  { id: 'hasil-belajar', number: 14, label: 'Hasil Belajar', group: 'Penutup', requiresIdentity: true },
  { id: 'refleksi', number: 15, label: 'Refleksi', group: 'Penutup', requiresIdentity: true },
  { id: 'profil-guru', number: 16, label: 'Profil Guru', group: 'Penutup', requiresIdentity: false },
  { id: 'teacher-dashboard', label: 'Dashboard Guru', group: 'Penutup', requiresIdentity: false },
];

export const EMPTY_SINGLE_LKPD: SingleLkpdData = {
  completed: false,
  score: 0,
  identifikasiVariabel: '',
  modelPers1: '',
  modelPers2: '',
  modelPers3: '',
  langkahKerja: '',
  jawabanAkhirX: '',
  jawabanAkhirY: '',
  jawabanAkhirZ: '',
  kesimpulan: '',
  refleksiLkpd: '',
};

export const DEFAULT_PROGRESS: LearningProgress = {
  completedMeetings: [],
  simulationVisited: false,
  substitutionLabDone: false,
  eliminationLabDone: false,
  conceptExploration: {
    completedTasks: [],
    score: 0,
  },
  diagnostik: null,
  latihan: null,
  sumatif: null,
  lkpd: {
    completed: false,
    score: 0,
    activitiesCompleted: [],
    responses: {},
    lkpd1: { ...EMPTY_SINGLE_LKPD },
    lkpd2: { ...EMPTY_SINGLE_LKPD },
    lkpd3: { ...EMPTY_SINGLE_LKPD },
  },
  refleksi: {
    completed: false,
    ratings: {
      konsep: 4,
      pemodelan: 4,
      substitusi: 4,
      eliminasi: 4,
    },
    materiDipahami: '',
    materiBelumDipahami: '',
    kesulitanSiswa: '',
    strategiPemecahan: '',
    pengalamanBelajar: '',
  },
};

export function loadIdentity(): StudentIdentity | null {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentIdentity;
    if (parsed && parsed.namaLengkap && parsed.kelas && parsed.nomorAbsen) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveIdentity(identity: StudentIdentity): void {
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
}

export function clearIdentityAndProgress(): void {
  localStorage.removeItem(IDENTITY_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}

export function loadProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      conceptExploration: {
        ...DEFAULT_PROGRESS.conceptExploration,
        ...(parsed.conceptExploration ?? {}),
      },
      lkpd: {
        ...DEFAULT_PROGRESS.lkpd,
        ...(parsed.lkpd ?? {}),
        lkpd1: { ...EMPTY_SINGLE_LKPD, ...(parsed.lkpd?.lkpd1 ?? {}) },
        lkpd2: { ...EMPTY_SINGLE_LKPD, ...(parsed.lkpd?.lkpd2 ?? {}) },
        lkpd3: { ...EMPTY_SINGLE_LKPD, ...(parsed.lkpd?.lkpd3 ?? {}) },
      },
      refleksi: {
        ...DEFAULT_PROGRESS.refleksi,
        ...(parsed.refleksi ?? {}),
        ratings: {
          ...DEFAULT_PROGRESS.refleksi.ratings,
          ...(parsed.refleksi?.ratings ?? {}),
        },
      },
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: LearningProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function evaluateQuestionCorrectness(
  q: QuizQuestion,
  answer: number | number[] | string | undefined
): boolean {
  if (answer === undefined) return false;
  const format = q.format ?? 'pg';
  if (format === 'pg' || format === 'benar-salah') {
    return answer === q.correctIndex;
  }
  if (format === 'pg-kompleks') {
    if (!Array.isArray(answer) || !q.correctIndices) return false;
    const sortedAns = [...answer].sort((a, b) => a - b);
    const sortedExpected = [...q.correctIndices].sort((a, b) => a - b);
    if (sortedAns.length !== sortedExpected.length) return false;
    return sortedAns.every((v, idx) => v === sortedExpected[idx]);
  }
  if (format === 'uraian') {
    if (typeof answer !== 'string') return false;
    const normalized = answer.toLowerCase().replace(/\s+/g, ' ').trim();
    if (normalized.length < 4) return false;
    const keywords = q.expectedKeywords ?? [];
    if (keywords.length === 0) return normalized.length >= 10;
    const hits = keywords.filter((kw) => normalized.includes(kw.toLowerCase())).length;
    return hits >= Math.ceil(keywords.length * 0.5);
  }
  return false;
}

export function calculateOverallProgress(progress: LearningProgress): number {
  let points = 0;
  const totalMilestones = 10;
  if (progress.diagnostik?.completed) points += 1;
  if (progress.completedMeetings.includes('pertemuan-1')) points += 1;
  if (progress.completedMeetings.includes('pertemuan-2')) points += 1;
  if (progress.completedMeetings.includes('pertemuan-3')) points += 1;
  if (progress.conceptExploration.completedTasks.length >= 3) points += 1;
  if (progress.substitutionLabDone) points += 1;
  if (progress.eliminationLabDone) points += 1;
  if (progress.lkpd.completed) points += 1;
  if (progress.latihan?.completed) points += 1;
  if (progress.sumatif?.completed) points += 1;
  return Math.round((points / totalMilestones) * 100);
}

export function calculateActivityScore(progress: LearningProgress): number {
  const scores: number[] = [];
  if (progress.diagnostik?.completed) scores.push(progress.diagnostik.score);
  if (progress.conceptExploration.completedTasks.length > 0) {
    scores.push(progress.conceptExploration.score);
  }
  if (progress.lkpd.completed) scores.push(progress.lkpd.score);
  if (progress.latihan?.completed) scores.push(progress.latihan.score);
  if (progress.sumatif?.completed) scores.push(progress.sumatif.score);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length);
}

export interface GamificationProfile {
  xp: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  levelProgressPercent: number;
  stars: number;
  maxStars: number;
}

export function calculateGamification(progress: LearningProgress): GamificationProfile {
  let xp = 0;
  let stars = 0;

  // Pertemuan: 100 XP each + 1 star each (max 3 stars)
  progress.completedMeetings.forEach(() => {
    xp += 100;
    stars += 1;
  });

  // Eksplorasi konsep: up to 150 XP + 2 stars
  if (progress.conceptExploration.completedTasks.length > 0) {
    xp += progress.conceptExploration.completedTasks.length * 50;
    if (progress.conceptExploration.completedTasks.length >= 3) stars += 2;
    else stars += 1;
  }

  // Simulasi Substitusi & Eliminasi: 150 XP each + 2 stars each
  if (progress.substitutionLabDone) {
    xp += 150;
    stars += 2;
  }
  if (progress.eliminationLabDone) {
    xp += 150;
    stars += 2;
  }

  // Diagnostik: 80 XP + score bonus + 1 star
  if (progress.diagnostik?.completed) {
    xp += 80 + Math.round(progress.diagnostik.score * 0.5);
    stars += 1;
  }

  // LKPD (1, 2, 3): 80 XP per LKPD + up to 3 stars
  if (progress.lkpd.lkpd1.completed) {
    xp += 80 + Math.round(progress.lkpd.lkpd1.score * 0.4);
    stars += 1;
  }
  if (progress.lkpd.lkpd2.completed) {
    xp += 80 + Math.round(progress.lkpd.lkpd2.score * 0.4);
    stars += 1;
  }
  if (progress.lkpd.lkpd3.completed) {
    xp += 80 + Math.round(progress.lkpd.lkpd3.score * 0.4);
    stars += 1;
  }

  // Latihan HOTS: 120 XP + score + up to 3 stars
  if (progress.latihan?.completed) {
    xp += 120 + progress.latihan.score;
    stars += progress.latihan.score >= 85 ? 3 : progress.latihan.score >= 65 ? 2 : 1;
  }

  // Sumatif: 150 XP + 1.5*score + up to 3 stars
  if (progress.sumatif?.completed) {
    xp += 150 + Math.round(progress.sumatif.score * 1.5);
    stars += progress.sumatif.score >= 85 ? 3 : progress.sumatif.score >= 75 ? 2 : 1;
  }

  // Refleksi: 60 XP + 1 star
  if (progress.refleksi.completed) {
    xp += 60;
    stars += 1;
  }

  const levels = [
    { level: 1, minXp: 0, title: 'Perintis Aljabar' },
    { level: 2, minXp: 250, title: 'Penjelajah SPLTV' },
    { level: 3, minXp: 550, title: 'Analis Model SMK' },
    { level: 4, minXp: 900, title: 'Strategis Substitusi & Eliminasi' },
    { level: 5, minXp: 1300, title: 'Master SPLTV Fase E' },
  ];

  let current = levels[0];
  let nextMin = levels[1].minXp;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].minXp) {
      current = levels[i];
      nextMin = levels[i + 1]?.minXp ?? levels[i].minXp + 400;
    }
  }

  const span = Math.max(1, nextMin - current.minXp);
  const levelProgressPercent = Math.min(100, Math.round(((xp - current.minXp) / span) * 100));

  return {
    xp,
    level: current.level,
    levelTitle: current.title,
    nextLevelXp: nextMin,
    levelProgressPercent,
    stars,
    maxStars: 20,
  };
}

export interface AchievementBadge {
  id: string;
  title: string;
  criteria: string;
  earned: boolean;
}

export function getAchievementBadges(progress: LearningProgress): AchievementBadge[] {
  return [
    {
      id: 'penjelajah-spltv',
      title: 'Penjelajah SPLTV',
      criteria: 'Menyelesaikan Pertemuan 1 dan Eksplorasi Konsep SPLTV',
      earned:
        progress.completedMeetings.includes('pertemuan-1') &&
        progress.conceptExploration.completedTasks.length >= 3,
    },
    {
      id: 'ahli-pemodelan',
      title: 'Ahli Pemodelan',
      criteria: 'Menyelesaikan LKPD 1 (Definisi & Pemodelan Matematika)',
      earned: progress.lkpd.lkpd1.completed && progress.lkpd.lkpd1.score >= 70,
    },
    {
      id: 'master-substitusi',
      title: 'Master Substitusi',
      criteria: 'Menuntaskan Lab Simulasi Substitusi & Pertemuan 2',
      earned:
        progress.completedMeetings.includes('pertemuan-2') && progress.substitutionLabDone,
    },
    {
      id: 'master-eliminasi',
      title: 'Master Eliminasi',
      criteria: 'Menuntaskan Lab Simulasi Eliminasi & Pertemuan 3',
      earned:
        progress.completedMeetings.includes('pertemuan-3') && progress.eliminationLabDone,
    },
    {
      id: 'problem-solver',
      title: 'Problem Solver',
      criteria: 'Meraih skor Asesmen Sumatif ≥ 75 dan menyelesaikan Latihan HOTS',
      earned: (progress.sumatif?.score ?? 0) >= 75 && Boolean(progress.latihan?.completed),
    },
  ];
}

export interface LearningChallenge {
  id: string;
  title: string;
  rewardXp: number;
  done: boolean;
  targetMenu: MenuId;
}

export function getLearningChallenges(progress: LearningProgress): LearningChallenge[] {
  return [
    {
      id: 'chal-1',
      title: 'Tuntaskan 3 Aktivitas Eksplorasi Konsep SPLTV',
      rewardXp: 150,
      done: progress.conceptExploration.completedTasks.length >= 3,
      targetMenu: 'pertemuan-1',
    },
    {
      id: 'chal-2',
      title: 'Pecahkan Sistem di Lab Simulasi Substitusi (x=1, y=3, z=2)',
      rewardXp: 150,
      done: progress.substitutionLabDone,
      targetMenu: 'simulasi',
    },
    {
      id: 'chal-3',
      title: 'Lakukan Eliminasi Mandiri di Lab Simulasi Eliminasi',
      rewardXp: 150,
      done: progress.eliminationLabDone,
      targetMenu: 'simulasi',
    },
    {
      id: 'chal-4',
      title: 'Lengkapi LKPD 1, LKPD 2, dan LKPD 3',
      rewardXp: 240,
      done: progress.lkpd.lkpd1.completed && progress.lkpd.lkpd2.completed && progress.lkpd.lkpd3.completed,
      targetMenu: 'lkpd',
    },
    {
      id: 'chal-5',
      title: 'Raih Nilai ≥ 75 pada Asesmen Sumatif (20 Soal)',
      rewardXp: 250,
      done: (progress.sumatif?.score ?? 0) >= 75,
      targetMenu: 'sumatif',
    },
  ];
}

export function scoreToRubricCategory(score: number): RubricCategory {
  if (score >= 88) return 'Sangat Mahir';
  if (score >= 75) return 'Mahir';
  if (score >= 55) return 'Mulai Berkembang';
  return 'Belum Berkembang';
}

export function computeAssessmentRubric(progress: LearningProgress): RubricDimensionScore[] {
  const diag = progress.diagnostik?.score ?? 0;
  const eksplor = progress.conceptExploration.score ?? 0;
  const lkpd1 = progress.lkpd.lkpd1.score ?? 0;
  const lkpd2 = progress.lkpd.lkpd2.score ?? 0;
  const lkpd3 = progress.lkpd.lkpd3.score ?? 0;
  const lat = progress.latihan?.score ?? 0;
  const sum = progress.sumatif?.score ?? 0;

  const avg = (vals: number[]) => {
    const active = vals.filter((v) => v > 0);
    if (active.length === 0) return 0;
    return Math.round(active.reduce((a, b) => a + b, 0) / active.length);
  };

  const pemahamanMasalah = avg([diag, eksplor, lkpd1]);
  const ketepatanModel = avg([lkpd1, lat, sum]);
  const prosesPenyelesaian = avg([
    progress.substitutionLabDone ? 90 : 0,
    progress.eliminationLabDone ? 90 : 0,
    lkpd2,
    lkpd3,
  ]);
  const interpretasi = avg([lkpd1, lkpd2, lkpd3, sum]);
  const penalaran = avg([eksplor, lat, sum]);
  const komunikasi = avg([
    progress.lkpd.lkpd1.kesimpulan.trim().length > 12 ? 85 : lkpd1,
    progress.lkpd.lkpd2.kesimpulan.trim().length > 12 ? 85 : lkpd2,
    progress.refleksi.completed ? 90 : 0,
  ]);

  const rawDims = [
    {
      id: 'pemahaman',
      aspect: 'Pemahaman Masalah',
      description: 'Mengidentifikasi besaran, variabel, koefisien, konstanta, serta syarat SPLTV.',
      score: pemahamanMasalah,
    },
    {
      id: 'model',
      aspect: 'Ketepatan Model Matematika',
      description: 'Menerjemahkan persoalan nyata SMK ke dalam sistem tiga persamaan linear yang tepat.',
      score: ketepatanModel,
    },
    {
      id: 'proses',
      aspect: 'Proses Penyelesaian',
      description: 'Ketelitian langkah substitusi, penyamaan koefisien, dan operasi eliminasi.',
      score: prosesPenyelesaian,
    },
    {
      id: 'interpretasi',
      aspect: 'Interpretasi',
      description: 'Menafsirkan nilai $(x, y, z)$ kembali ke satuan dan konteks masalah nyata.',
      score: interpretasi,
    },
    {
      id: 'penalaran',
      aspect: 'Penalaran',
      description: 'Mengevaluasi kebenaran pernyataan HOTS, verifikasi hasil, dan analisis bukan SPLTV.',
      score: penalaran,
    },
    {
      id: 'komunikasi',
      aspect: 'Komunikasi Matematis',
      description: 'Menuliskan langkah penyelesaian, kesimpulan, serta refleksi secara runtut.',
      score: komunikasi,
    },
  ];

  return rawDims.map((d) => ({
    ...d,
    category: scoreToRubricCategory(d.score),
  }));
}

export function getMenuTitle(id: MenuId): string {
  return NAV_ITEMS.find((item) => item.id === id)?.label ?? 'SPLTV Smart Learning';
}

export function getDiagnosticRecommendation(record: AssessmentRecord | null): string {
  if (!record || !record.completed) {
    return 'Kerjakan Asesmen Diagnostik terlebih dahulu untuk mengetahui kesiapan prasyarat belajarmu.';
  }
  if (record.score >= 80) {
    return 'Kesiapan sangat baik! Kamu menguasai aljabar dasar dan SPLDV dengan kuat. Langsung lanjutkan ke Pertemuan 1 dan Eksplorasi Konsep SPLTV.';
  }
  if (record.score >= 60) {
    return 'Kesiapan cukup baik. Perhatikan kembali aturan tanda saat pemindahan ruas sebelum masuk ke Pertemuan 2 (Substitusi).';
  }
  return 'Disarankan meninjau ulang operasi penjumlahan suku sejenis, perkalian distributif, dan SPLDV sederhana sebelum melanjutkan ke materi inti SPLTV.';
}
