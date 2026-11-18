import { DIAGNOSTIC_10_QUESTIONS, HOTS_30_QUESTIONS, SUMMATIVE_20_QUESTIONS } from '../data/stage2Questions';
import { LearningProgress, QuizQuestion } from '../types/module';
import { evaluateQuestionCorrectness } from './storage';

export interface CompetencyAnalysisItem {
  id: string;
  code: string;
  name: string;
  score: number | null; // null if no evidence yet
  mastered: boolean;
  evidenceSummary: string;
  remedialRecommendation: string;
  enrichmentRecommendation: string;
}

export interface FullLearningAnalysis {
  competencies: CompetencyAnalysisItem[];
  masteredList: CompetencyAnalysisItem[];
  unmasteredList: CompetencyAnalysisItem[];
  overallRemedial: string;
  overallEnrichment: string;
}

function topicMatchAccuracy(
  questions: QuizQuestion[],
  answers: Record<string, unknown> | undefined,
  matcher: (q: QuizQuestion) => boolean
): { count: number; pct: number | null } {
  if (!answers) return { count: 0, pct: null };
  const subset = questions.filter(matcher);
  if (subset.length === 0) return { count: 0, pct: null };
  const correct = subset.filter((q) =>
    evaluateQuestionCorrectness(q, answers[q.id] as number | number[] | string | undefined)
  ).length;
  return { count: subset.length, pct: Math.round((correct / subset.length) * 100) };
}

function avgValid(vals: (number | null | undefined)[]): number | null {
  const clean = vals.filter((v): v is number => typeof v === 'number');
  if (clean.length === 0) return null;
  return Math.round(clean.reduce((a, b) => a + b, 0) / clean.length);
}

export function analyzeStudentCompetencies(progress: LearningProgress): FullLearningAnalysis {
  const latAns = progress.latihan?.completed ? progress.latihan.answers : undefined;
  const sumAns = progress.sumatif?.completed ? progress.sumatif.answers : undefined;

  // Kompetensi 1: Pemahaman konsep SPLTV
  const k1Diag = progress.diagnostik?.completed ? progress.diagnostik.score : null;
  const k1Eksplor =
    progress.conceptExploration.completedTasks.length > 0
      ? progress.conceptExploration.score
      : null;
  const k1Sum = topicMatchAccuracy(
    SUMMATIVE_20_QUESTIONS,
    sumAns,
    (q) =>
      q.topic.includes('Definisi') ||
      q.topic.includes('Unsur') ||
      q.topic.includes('Bukan Contoh') ||
      q.topic.includes('Ciri SPLTV')
  ).pct;
  const k1Score = avgValid([k1Diag, k1Eksplor, k1Sum]);

  // Kompetensi 2: Pemodelan matematika
  const k2Lkpd1 = progress.lkpd.lkpd1.completed ? progress.lkpd.lkpd1.score : null;
  const k2Lat = topicMatchAccuracy(
    HOTS_30_QUESTIONS,
    latAns,
    (q) => q.topic.includes('Pemodelan') || q.topic.includes('Strategi')
  ).pct;
  const k2Sum = topicMatchAccuracy(
    SUMMATIVE_20_QUESTIONS,
    sumAns,
    (q) => q.topic.includes('Pemodelan') || q.topic.includes('Perubahan Bentuk')
  ).pct;
  const k2Score = avgValid([k2Lkpd1, k2Lat, k2Sum]);

  // Kompetensi 3: Metode substitusi
  const k3Lab = progress.substitutionLabDone ? 95 : null;
  const k3Lkpd2 = progress.lkpd.lkpd2.completed ? progress.lkpd.lkpd2.score : null;
  const k3Sum = topicMatchAccuracy(
    SUMMATIVE_20_QUESTIONS,
    sumAns,
    (q) => q.topic.includes('Substitusi')
  ).pct;
  const k3Score = avgValid([k3Lab, k3Lkpd2, k3Sum]);

  // Kompetensi 4: Metode eliminasi
  const k4Lab = progress.eliminationLabDone ? 95 : null;
  const k4Lkpd3 = progress.lkpd.lkpd3.completed ? progress.lkpd.lkpd3.score : null;
  const k4Sum = topicMatchAccuracy(
    SUMMATIVE_20_QUESTIONS,
    sumAns,
    (q) => q.topic.includes('Eliminasi')
  ).pct;
  const k4Score = avgValid([k4Lab, k4Lkpd3, k4Sum]);

  // Kompetensi 5: Pemecahan masalah kontekstual
  const k5Lat = progress.latihan?.completed ? progress.latihan.score : null;
  const k5Sum = topicMatchAccuracy(
    SUMMATIVE_20_QUESTIONS,
    sumAns,
    (q) =>
      q.topic.includes('Aplikasi') ||
      q.topic.includes('Buah') ||
      q.topic.includes('Alat Tulis') ||
      q.topic.includes('Penyelesaian')
  ).pct;
  const k5Score = avgValid([k5Lat, k5Sum]);

  const competencies: CompetencyAnalysisItem[] = [
    {
      id: 'k1',
      code: 'Kompetensi 1',
      name: 'Pemahaman Konsep SPLTV',
      score: k1Score,
      mastered: (k1Score ?? 0) >= 75,
      evidenceSummary:
        k1Score !== null
          ? `Skor terukur ${k1Score}/100 dari Diagnostik, Eksplorasi Konsep, dan Sumatif.`
          : 'Belum ada data evaluasi konsep yang dikerjakan.',
      remedialRecommendation:
        'Pelajari kembali Pertemuan 1 bagian Ciri-ciri & Unsur Persamaan, lalu selesaikan 3 aktivitas Drag & Drop pada Eksplorasi Konsep.',
      enrichmentRecommendation:
        'Eksplorasi sistem persamaan inkonsisten dan tak hingga solusi pada tab Visualisasi 3D di Simulasi Matematika.',
    },
    {
      id: 'k2',
      code: 'Kompetensi 2',
      name: 'Pemodelan Matematika',
      score: k2Score,
      mastered: (k2Score ?? 0) >= 75,
      evidenceSummary:
        k2Score !== null
          ? `Skor terukur ${k2Score}/100 dari LKPD 1, Latihan HOTS, dan Sumatif.`
          : 'Belum ada data LKPD 1 atau soal pemodelan.',
      remedialRecommendation:
        'Ulangi langkah identifikasi besaran dan pemisalan variabel (x, y, z) pada LKPD 1 serta contoh kasus pembelian kain dan paket sembako.',
      enrichmentRecommendation:
        'Rancang model SPLTV mandiri dari transaksi nyata di unit produksi jurusan SMK-mu dan uji hasilnya di Solver Bebas.',
    },
    {
      id: 'k3',
      code: 'Kompetensi 3',
      name: 'Metode Substitusi',
      score: k3Score,
      mastered: (k3Score ?? 0) >= 75,
      evidenceSummary:
        k3Score !== null
          ? `Skor terukur ${k3Score}/100 dari Lab Substitusi, LKPD 2, dan Sumatif.`
          : 'Belum ada bukti penyelesaian Lab Substitusi atau LKPD 2.',
      remedialRecommendation:
        'Kerjakan ulang Lab Substitusi Terbimbing dan perhatikan perubahan tanda saat memindahkan suku antar ruas.',
      enrichmentRecommendation:
        'Terapkan metode substitusi pada sistem dengan koefisien bukan 1 di Simulasi Solver Bebas.',
    },
    {
      id: 'k4',
      code: 'Kompetensi 4',
      name: 'Metode Eliminasi',
      score: k4Score,
      mastered: (k4Score ?? 0) >= 75,
      evidenceSummary:
        k4Score !== null
          ? `Skor terukur ${k4Score}/100 dari Lab Eliminasi, LKPD 3, dan Sumatif.`
          : 'Belum ada bukti penyelesaian Lab Eliminasi atau LKPD 3.',
      remedialRecommendation:
        'Latih kembali penyamaan koefisien dengan KPK serta aturan operasi (+) untuk tanda berlawanan dan (−) untuk tanda sama pada Pertemuan 3.',
      enrichmentRecommendation:
        'Bandingkan efisiensi jumlah langkah antara metode eliminasi murni dengan metode gabungan pada kasus 3 mesin bengkel.',
    },
    {
      id: 'k5',
      code: 'Kompetensi 5',
      name: 'Pemecahan Masalah Kontekstual',
      score: k5Score,
      mastered: (k5Score ?? 0) >= 75,
      evidenceSummary:
        k5Score !== null
          ? `Skor terukur ${k5Score}/100 dari Latihan HOTS (30 Soal) dan soal aplikasi Sumatif.`
          : 'Belum mengerjakan Latihan HOTS maupun Asesmen Sumatif.',
      remedialRecommendation:
        'Biasakan selalu melakukan pengecekan balik nilai (x, y, z) ke tiga persamaan awal dan menafsirkan satuan rupiah/unit pada soal cerita.',
      enrichmentRecommendation:
        'Selesaikan seluruh 5 soal Uraian HOTS bertema kewirausahaan dan produksi SMK dengan skor sempurna.',
    },
  ];

  // Ensure DIAGNOSTIC_10_QUESTIONS import is cleanly leveraged if needed for diagnostic drilldown
  void DIAGNOSTIC_10_QUESTIONS;

  const masteredList = competencies.filter((c) => c.mastered);
  const unmasteredList = competencies.filter((c) => !c.mastered);

  const overallRemedial =
    unmasteredList.length === 0
      ? 'Tidak ada kompetensi yang memerlukan remedial wajib. Pertahankan ketelitian verifikasi solusi.'
      : `Fokuskan pendalaman pada: ${unmasteredList.map((u) => u.name).join(', ')}. Gunakan fitur Tutor Pembelajaran Cerdas pada Simulasi dan LKPD untuk bimbingan bertahap.`;

  const overallEnrichment =
    masteredList.length >= 4
      ? 'Siap mengikuti pengayaan: selesaikan tantangan optimasi anggaran bisnis SMK dan uji model sistem tiga variabel kustom di Simulator 3D.'
      : 'Setelah menuntaskan KKTP (≥75) pada kompetensi yang tertunda, lanjutkan ke soal Uraian HOTS untuk menguatkan penalaran kontekstual.';

  return {
    competencies,
    masteredList,
    unmasteredList,
    overallRemedial,
    overallEnrichment,
  };
}
