export type MenuId =
  | 'beranda'
  | 'identitas'
  | 'dashboard'
  | 'petunjuk'
  | 'peta-konsep'
  | 'tujuan'
  | 'diagnostik'
  | 'pertemuan-1'
  | 'pertemuan-2'
  | 'pertemuan-3'
  | 'simulasi'
  | 'lkpd'
  | 'latihan'
  | 'sumatif'
  | 'hasil-belajar'
  | 'refleksi'
  | 'profil-guru'
  | 'teacher-dashboard';

export interface NavItem {
  id: MenuId;
  number?: number;
  label: string;
  group: 'Utama' | 'Persiapan' | 'Materi Inti' | 'Praktik & Evaluasi' | 'Penutup';
  requiresIdentity: boolean;
}

export interface StudentIdentity {
  namaLengkap: string;
  kelas: string;
  nomorAbsen: string;
  updatedAt: string;
}

export type QuestionFormat = 'pg' | 'pg-kompleks' | 'benar-salah' | 'uraian';

export interface QuizQuestion {
  id: string;
  format?: QuestionFormat;
  topic: string;
  context?: string;
  question: string;
  options: string[];
  correctIndex: number; // used for 'pg' and 'benar-salah' (0=Benar, 1=Salah)
  correctIndices?: number[]; // used for 'pg-kompleks'
  expectedKeywords?: string[]; // used for 'uraian' auto-check
  sampleAnswer?: string; // used for 'uraian'
  explanation: string;
}

export type AnswerValue = number | number[] | string;

export interface AssessmentRecord {
  completed: boolean;
  score: number;
  correctCount: number;
  totalQuestions: number;
  answers: Record<string, AnswerValue>;
  completedAt: string;
  startedAt?: string;
  remainingSeconds?: number;
}

export interface SingleLkpdData {
  completed: boolean;
  score: number;
  identifikasiVariabel: string;
  modelPers1: string;
  modelPers2: string;
  modelPers3: string;
  langkahKerja: string;
  jawabanAkhirX: string;
  jawabanAkhirY: string;
  jawabanAkhirZ: string;
  kesimpulan: string;
  refleksiLkpd: string;
  updatedAt?: string;
}

export interface LkpdRecord {
  completed: boolean;
  score: number;
  activitiesCompleted: number[];
  responses: Record<string, string>;
  lkpd1: SingleLkpdData;
  lkpd2: SingleLkpdData;
  lkpd3: SingleLkpdData;
  completedAt?: string;
}

export interface ConceptExplorationRecord {
  completedTasks: string[];
  score: number;
}

export interface ReflectionRecord {
  completed: boolean;
  ratings: {
    konsep: number;
    pemodelan: number;
    substitusi: number;
    eliminasi: number;
  };
  materiDipahami: string;
  materiBelumDipahami: string;
  kesulitanSiswa: string;
  strategiPemecahan: string;
  pengalamanBelajar: string;
  submittedAt?: string;
}

export interface LearningProgress {
  completedMeetings: ('pertemuan-1' | 'pertemuan-2' | 'pertemuan-3')[];
  simulationVisited: boolean;
  substitutionLabDone: boolean;
  eliminationLabDone: boolean;
  conceptExploration: ConceptExplorationRecord;
  diagnostik: AssessmentRecord | null;
  latihan: AssessmentRecord | null;
  sumatif: AssessmentRecord | null;
  lkpd: LkpdRecord;
  refleksi: ReflectionRecord;
}

export interface CaseStudy {
  id: string;
  title: string;
  contextTag: string;
  problemText: string;
  givenInfo: string[];
  variables: string[];
  steps: {
    stepTitle: string;
    description: string;
    math?: string;
  }[];
  conclusion: string;
  verification?: string[];
}

export interface MeetingLessonData {
  id: 'pertemuan-1' | 'pertemuan-2' | 'pertemuan-3';
  meetingNumber: number;
  title: string;
  subtitle: string;
  duration: string;
  tujuan: string[];
  pertanyaanPemantik: string;
  stimulus: {
    title: string;
    scenario: string;
    promptQuestion: string;
  };
  konsepSections: {
    id: string;
    title: string;
    body: string;
    mathBlocks?: string[];
    bullets?: string[];
  }[];
  caseStudies: CaseStudy[];
  rangkuman: string[];
  nextMenuId: MenuId;
  nextButtonLabel: string;
}

export type RubricCategory =
  | 'Belum Berkembang'
  | 'Mulai Berkembang'
  | 'Mahir'
  | 'Sangat Mahir';

export interface RubricDimensionScore {
  id: string;
  aspect: string;
  description: string;
  score: number;
  category: RubricCategory;
}
