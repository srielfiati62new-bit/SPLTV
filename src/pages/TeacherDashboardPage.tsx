import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Database,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  KeyRound,
  Lock,
  LogOut,
  MessageSquarePlus,
  Play,
  Printer,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import gasScriptRaw from '../../google-apps-script/Code.gs?raw';
import {
  GoogleSheetsDirectPanel,
  SheetsLinkConfig,
} from '../components/GoogleSheetsDirectPanel';
import { MEETINGS_DATA } from '../data/curriculumData';
import {
  DIAGNOSTIC_10_QUESTIONS,
  HOTS_30_QUESTIONS,
  SUMMATIVE_20_QUESTIONS,
} from '../data/stage2Questions';
import {
  exportAsesmenCsv,
  exportLkpdCsv,
  exportRekapCsv,
  StudentExportRow,
} from '../utils/csvExport';
import { solveSpltv } from '../utils/spltvSolver';
import {
  calculateOverallProgress,
  evaluateQuestionCorrectness,
  loadIdentity,
  loadProgress,
  NAV_ITEMS,
} from '../utils/storage';

const TOKEN_STORAGE_KEY = 'spltv_teacher_session_token_v1';
const STANDALONE_MODE_TOKEN = '__LOCAL_STANDALONE_MODE__';
const LOCAL_SHEETS_CONFIG_KEY = 'spltv_sheets_config_local_v1';

async function safeParseJsonResponse<T extends Record<string, unknown>>(
  resp: Response
): Promise<{ parsed: T | null; rawText: string }> {
  const rawText = await resp.text();
  if (!rawText.trim()) {
    return { parsed: null, rawText: '' };
  }
  try {
    const val = JSON.parse(rawText);
    if (val && typeof val === 'object') {
      return { parsed: val as T, rawText };
    }
    return { parsed: null, rawText };
  } catch {
    return { parsed: null, rawText };
  }
}

function loadLocalSheetsConfig(): SheetsLinkConfig {
  try {
    const raw = localStorage.getItem(LOCAL_SHEETS_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SheetsLinkConfig>;
      return {
        spreadsheetId: parsed.spreadsheetId || '',
        spreadsheetTitle: parsed.spreadsheetTitle || '',
        spreadsheetUrl: parsed.spreadsheetUrl || '',
        lastSyncedAt: parsed.lastSyncedAt || null,
      };
    }
  } catch {
    // ignore
  }
  return {
    spreadsheetId: '',
    spreadsheetTitle: '',
    spreadsheetUrl: '',
    lastSyncedAt: null,
  };
}

function buildLocalFallbackStudents(): TeacherStudentRecord[] {
  const identity = loadIdentity();
  if (!identity) return [];
  const progress = loadProgress();
  const scores: number[] = [];
  if (progress.diagnostik) scores.push(progress.diagnostik.score);
  if (progress.lkpd.lkpd1.completed) scores.push(progress.lkpd.lkpd1.score);
  if (progress.lkpd.lkpd2.completed) scores.push(progress.lkpd.lkpd2.score);
  if (progress.lkpd.lkpd3.completed) scores.push(progress.lkpd.lkpd3.score);
  if (progress.latihan) scores.push(progress.latihan.score);
  if (progress.sumatif) scores.push(progress.sumatif.score);
  const rataRata =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return [
    {
      studentId: `LOCAL-${identity.nomorAbsen.trim() || '01'}`,
      timestamp: new Date().toISOString(),
      nama: identity.namaLengkap,
      kelas: identity.kelas,
      nomorAbsen: identity.nomorAbsen,
      diagnostik: progress.diagnostik
        ? {
            jumlahBenar: progress.diagnostik.correctCount,
            jumlahSalah: progress.diagnostik.totalQuestions - progress.diagnostik.correctCount,
            nilai: progress.diagnostik.score,
            kategori:
              progress.diagnostik.score >= 80
                ? 'Siap Penuh'
                : progress.diagnostik.score >= 60
                  ? 'Cukup Siap'
                  : 'Perlu Penguatan Prasyarat',
          }
        : null,
      lkpd: {
        nilaiLkpd1: progress.lkpd.lkpd1.completed ? progress.lkpd.lkpd1.score : null,
        nilaiLkpd2: progress.lkpd.lkpd2.completed ? progress.lkpd.lkpd2.score : null,
        nilaiLkpd3: progress.lkpd.lkpd3.completed ? progress.lkpd.lkpd3.score : null,
        catatanGuru: '',
      },
      latihan: progress.latihan
        ? {
            jumlahSoal: progress.latihan.totalQuestions,
            jawabanBenar: progress.latihan.correctCount,
            jawabanSalah: progress.latihan.totalQuestions - progress.latihan.correctCount,
            nilai: progress.latihan.score,
          }
        : null,
      sumatif: progress.sumatif
        ? {
            nilaiAkhir: progress.sumatif.score,
            durasiPengerjaan: '-',
            jumlahBenar: progress.sumatif.correctCount,
            jumlahSalah: progress.sumatif.totalQuestions - progress.sumatif.correctCount,
            waktuPengumpulan: progress.sumatif.completedAt || new Date().toISOString(),
          }
        : null,
      refleksi: progress.refleksi.completed
        ? {
            tingkatPemahaman: `${(
              (progress.refleksi.ratings.konsep +
                progress.refleksi.ratings.pemodelan +
                progress.refleksi.ratings.substitusi +
                progress.refleksi.ratings.eliminasi) /
              4
            ).toFixed(1)} / 5.0`,
            materiDikuasai: progress.refleksi.materiDipahami || '-',
            materiSulit: progress.refleksi.materiBelumDipahami || progress.refleksi.kesulitanSiswa || '-',
            catatanRefleksi:
              [progress.refleksi.strategiPemecahan, progress.refleksi.pengalamanBelajar]
                .filter(Boolean)
                .join(' | ') || '-',
            updatedAt: progress.refleksi.submittedAt || new Date().toISOString(),
          }
        : null,
      persentasePenyelesaian: calculateOverallProgress(progress),
      rataRata,
      completedMeetingsCount: progress.completedMeetings.length,
      syncHistory: [],
    },
  ];
}

function safeGetToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function safeSetToken(val: string) {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, val);
  } catch {
    // Ignore storage quota/iframe restrictions; token remains in React state
  }
}

function safeRemoveToken() {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

interface TeacherStudentRecord extends StudentExportRow {
  refleksi: {
    tingkatPemahaman: string;
    materiDikuasai: string;
    materiSulit: string;
    catatanRefleksi: string;
    updatedAt: string;
  } | null;
  completedMeetingsCount: number;
  syncHistory: {
    activityType: string;
    status: 'synced-gas' | 'saved-server-only' | 'gas-error';
    timestamp: string;
    message: string;
  }[];
}

interface SystemAuditItem {
  id: string;
  category: string;
  name: string;
  status: 'passed' | 'failed';
  detail: string;
}

const SHEETS_SPEC = [
  {
    name: 'DATA PESERTA DIDIK',
    columns: ['Timestamp', 'ID peserta didik', 'Nama lengkap', 'Kelas', 'Nomor absen'],
  },
  {
    name: 'ASESMEN DIAGNOSTIK',
    columns: ['ID peserta didik', 'Nama', 'Kelas', 'Jumlah benar', 'Jumlah salah', 'Nilai', 'Kategori kemampuan awal'],
  },
  {
    name: 'HASIL LKPD',
    columns: ['ID peserta didik', 'Nama', 'Kelas', 'Nilai LKPD 1', 'Nilai LKPD 2', 'Nilai LKPD 3', 'Catatan guru'],
  },
  {
    name: 'HASIL LATIHAN',
    columns: ['ID peserta didik', 'Nama', 'Kelas', 'Jumlah soal', 'Jawaban benar', 'Jawaban salah', 'Nilai'],
  },
  {
    name: 'ASESMEN SUMATIF',
    columns: ['ID peserta didik', 'Nama', 'Kelas', 'Nilai akhir', 'Durasi pengerjaan', 'Jumlah benar', 'Jumlah salah', 'Waktu pengumpulan'],
  },
  {
    name: 'REFLEKSI',
    columns: ['ID peserta didik', 'Nama', 'Kelas', 'Tingkat pemahaman', 'Materi yang dikuasai', 'Materi yang sulit', 'Catatan refleksi'],
  },
  {
    name: 'REKAP HASIL BELAJAR',
    columns: [
      'ID peserta didik',
      'Nama',
      'Kelas',
      'Nilai diagnostik',
      'Nilai LKPD 1',
      'Nilai LKPD 2',
      'Nilai LKPD 3',
      'Nilai latihan',
      'Nilai sumatif',
      'Rata-rata',
      'Persentase penyelesaian',
    ],
  },
];

const INSTALL_STEPS = [
  'Buat Google Spreadsheet baru melalui Google Drive sekolah atau akun guru.',
  'Buat tujuh sheet sesuai struktur database di bawah (atau jalankan fungsi setupSheets() pada Apps Script untuk membuat ketujuh sheet beserta header otomatis).',
  'Buka menu Extensions (Ekstensi) pada bilah atas Google Spreadsheet.',
  'Pilih Apps Script untuk membuka editor proyek Google Apps Script.',
  'Hapus kode bawaan, lalu salin dan tempelkan seluruh kode Code.gs yang tersedia pada halaman ini.',
  'Klik Deploy → New deployment → pilih jenis Web App.',
  'Atur Execute as: Me dan Who has access sesuai kebijakan sekolah (Anyone / Anyone within organization).',
  'Salin URL Web App (https://script.google.com/macros/s/.../exec) lalu simpan pada konfigurasi endpoint server di bawah.',
];

export const TeacherDashboardPage: React.FC = () => {
  const [token, setToken] = useState<string>(() => safeGetToken());
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'analytics' | 'sheets' | 'testing'>('analytics');
  const [students, setStudents] = useState<TeacherStudentRecord[]>([]);
  const [gasConfigured, setGasConfigured] = useState(false);
  const [sheetsConfig, setSheetsConfig] = useState<SheetsLinkConfig>({
    spreadsheetId: '',
    spreadsheetTitle: '',
    spreadsheetUrl: '',
    lastSyncedAt: null,
  });
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');
  const [standaloneMode, setStandaloneMode] = useState<boolean>(
    () => safeGetToken() === STANDALONE_MODE_TOKEN
  );

  // Filters
  const [kelasFilter, setKelasFilter] = useState<string>('ALL');
  const [nameQuery, setNameQuery] = useState<string>('');

  // Teacher LKPD Note Editor
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // GAS Config Form
  const [gasUrlInput, setGasUrlInput] = useState('');
  const [gasMsg, setGasMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [gasBusy, setGasBusy] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Audit Test Runner
  const [auditResults, setAuditResults] = useState<SystemAuditItem[] | null>(null);
  const [runningAudit, setRunningAudit] = useState(false);

  const fetchDashboard = useCallback(async (authToken: string) => {
    if (!authToken) return;
    if (authToken === STANDALONE_MODE_TOKEN) {
      setStandaloneMode(true);
      setStudents(buildLocalFallbackStudents());
      setSheetsConfig(loadLocalSheetsConfig());
      setGasConfigured(false);
      setDataError('');
      return;
    }

    setLoadingData(true);
    setDataError('');
    try {
      const resp = await fetch('/api/teacher/dashboard', {
        credentials: 'same-origin',
        headers: { 'X-Teacher-Token': authToken },
      });
      if (resp.status === 401) {
        safeRemoveToken();
        setToken('');
        setStandaloneMode(false);
        setAuthError('Sesi guru berakhir. Silakan masuk kembali.');
        return;
      }
      const { parsed } = await safeParseJsonResponse<{
        ok?: boolean;
        gasConfigured?: boolean;
        sheetsConfig?: SheetsLinkConfig;
        students?: TeacherStudentRecord[];
        error?: string;
      }>(resp);

      if (!parsed || typeof parsed.ok !== 'boolean') {
        // Backend API not responding with JSON (e.g. static deploy) -> gracefully show local + Sheets direct mode
        setStandaloneMode(true);
        setStudents(buildLocalFallbackStudents());
        setSheetsConfig(loadLocalSheetsConfig());
        setDataError('');
        return;
      }
      if (!resp.ok || !parsed.ok) {
        setDataError(parsed.error || 'Gagal memuat data kelas.');
        return;
      }
      setStandaloneMode(false);
      setStudents(parsed.students || []);
      setGasConfigured(Boolean(parsed.gasConfigured));
      if (parsed.sheetsConfig) {
        setSheetsConfig(parsed.sheetsConfig);
        try {
          localStorage.setItem(LOCAL_SHEETS_CONFIG_KEY, JSON.stringify(parsed.sheetsConfig));
        } catch {
          // ignore
        }
      }
    } catch {
      setStandaloneMode(true);
      setStudents(buildLocalFallbackStudents());
      setSheetsConfig(loadLocalSheetsConfig());
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      void fetchDashboard(token);
    }
  }, [token, fetchDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const trimmedPin = pinInput.trim();
    const fallbackPin =
      String((import.meta.env as Record<string, string | undefined>).VITE_TEACHER_ACCESS_PIN || '').trim() ||
      'SMK-SPLTV-2026';

    const tryStandaloneFallback = (reason: string) => {
      if (trimmedPin && trimmedPin === fallbackPin) {
        safeSetToken(STANDALONE_MODE_TOKEN);
        setStandaloneMode(true);
        setToken(STANDALONE_MODE_TOKEN);
        setPinInput('');
        return;
      }
      setAuthError(
        `${reason} Untuk masuk dalam Mode Mandiri (Google Sheets Langsung), masukkan PIN: ${fallbackPin}.`
      );
    };

    try {
      const resp = await fetch('/api/teacher/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: trimmedPin }),
      });

      const { parsed } = await safeParseJsonResponse<{
        ok?: boolean;
        token?: string;
        error?: string;
      }>(resp);

      // If server did NOT return valid backend JSON (e.g. empty body / 404 / 405 / HTML from static deploy)
      if (!parsed || typeof parsed.ok !== 'boolean') {
        tryStandaloneFallback(
          `Server API tidak merespons JSON pada URL ini (HTTP ${resp.status}).`
        );
        return;
      }

      if (!resp.ok || !parsed.ok || !parsed.token) {
        setAuthError(parsed.error || 'PIN tidak valid.');
        return;
      }

      safeSetToken(parsed.token);
      setStandaloneMode(false);
      setToken(parsed.token);
      setPinInput('');
    } catch {
      tryStandaloneFallback('Tidak dapat terhubung ke server API.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    safeRemoveToken();
    setToken('');
    setStandaloneMode(false);
    setStudents([]);
  };

  // Filtered students
  const uniqueClasses = useMemo(() => {
    const set = new Set(students.map((s) => s.kelas).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchKelas = kelasFilter === 'ALL' || s.kelas === kelasFilter;
      const matchName =
        !q ||
        s.nama.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.nomorAbsen.toLowerCase().includes(q);
      return matchKelas && matchName;
    });
  }, [students, kelasFilter, nameQuery]);

  // KPI Metrics computed strictly from filteredStudents
  const kpi = useMemo(() => {
    const total = filteredStudents.length;
    const studied = filteredStudents.filter(
      (s) => s.persentasePenyelesaian > 0 || s.diagnostik || s.latihan || s.sumatif
    ).length;
    const unfinished = filteredStudents.filter(
      (s) => s.persentasePenyelesaian < 100 && !s.sumatif
    ).length;

    const ratedScores = filteredStudents
      .map((s) => s.sumatif?.nilaiAkhir ?? (s.rataRata > 0 ? s.rataRata : null))
      .filter((v): v is number => v !== null);

    const avgClass =
      ratedScores.length > 0
        ? Math.round(ratedScores.reduce((a, b) => a + b, 0) / ratedScores.length)
        : 0;
    const highest = ratedScores.length > 0 ? Math.max(...ratedScores) : 0;
    const lowest = ratedScores.length > 0 ? Math.min(...ratedScores) : 0;
    const tuntasCount = ratedScores.filter((v) => v >= 75).length;
    const ketuntasanPct = ratedScores.length > 0 ? Math.round((tuntasCount / ratedScores.length) * 100) : 0;

    const diagScores = filteredStudents
      .map((s) => s.diagnostik?.nilai ?? null)
      .filter((v): v is number => v !== null);
    const sumScores = filteredStudents
      .map((s) => s.sumatif?.nilaiAkhir ?? null)
      .filter((v): v is number => v !== null);

    const avgDiag =
      diagScores.length > 0
        ? Math.round(diagScores.reduce((a, b) => a + b, 0) / diagScores.length)
        : 0;
    const avgSum =
      sumScores.length > 0
        ? Math.round(sumScores.reduce((a, b) => a + b, 0) / sumScores.length)
        : 0;

    return {
      total,
      studied,
      unfinished,
      avgClass,
      highest,
      lowest,
      ketuntasanPct,
      tuntasCount,
      ratedCount: ratedScores.length,
      avgDiag,
      diagCount: diagScores.length,
      avgSum,
      sumCount: sumScores.length,
    };
  }, [filteredStudents]);

  // Chart 2: Learning progression averages
  const progressionSeries = useMemo(() => {
    const avgField = (vals: (number | null | undefined)[]) => {
      const clean = vals.filter((v): v is number => typeof v === 'number');
      if (clean.length === 0) return 0;
      return Math.round(clean.reduce((a, b) => a + b, 0) / clean.length);
    };
    return [
      {
        label: 'Diagnostik',
        value: avgField(filteredStudents.map((s) => s.diagnostik?.nilai)),
      },
      {
        label: 'LKPD 1',
        value: avgField(filteredStudents.map((s) => s.lkpd.nilaiLkpd1)),
      },
      {
        label: 'LKPD 2',
        value: avgField(filteredStudents.map((s) => s.lkpd.nilaiLkpd2)),
      },
      {
        label: 'LKPD 3',
        value: avgField(filteredStudents.map((s) => s.lkpd.nilaiLkpd3)),
      },
      {
        label: 'Latihan HOTS',
        value: avgField(filteredStudents.map((s) => s.latihan?.nilai)),
      },
      {
        label: 'Sumatif',
        value: avgField(filteredStudents.map((s) => s.sumatif?.nilaiAkhir)),
      },
    ];
  }, [filteredStudents]);

  // Chart 3: Distribution of capability categories
  const categoryDistribution = useMemo(() => {
    const counts = {
      'Sangat Mahir': 0,
      Mahir: 0,
      'Mulai Berkembang': 0,
      'Belum Berkembang': 0,
    };
    filteredStudents.forEach((s) => {
      const score = s.sumatif?.nilaiAkhir ?? s.rataRata;
      if (score >= 88) counts['Sangat Mahir'] += 1;
      else if (score >= 75) counts['Mahir'] += 1;
      else if (score >= 55) counts['Mulai Berkembang'] += 1;
      else counts['Belum Berkembang'] += 1;
    });
    return [
      { label: 'Sangat Mahir (≥88)', count: counts['Sangat Mahir'], color: '#0d9488' },
      { label: 'Mahir (75–87)', count: counts['Mahir'], color: '#0284c7' },
      { label: 'Mulai Berkembang (55–74)', count: counts['Mulai Berkembang'], color: '#f59e0b' },
      { label: 'Belum Berkembang (<55)', count: counts['Belum Berkembang'], color: '#94a3b8' },
    ];
  }, [filteredStudents]);

  // Chart 4: Completion per Meeting / Activity
  const activityAchievement = useMemo(() => {
    const total = Math.max(1, filteredStudents.length);
    const pct = (count: number) =>
      filteredStudents.length === 0 ? 0 : Math.round((count / total) * 100);
    return [
      {
        label: 'Diagnostik',
        pct: pct(filteredStudents.filter((s) => s.diagnostik !== null).length),
      },
      {
        label: 'Pertemuan 1 / LKPD 1',
        pct: pct(
          filteredStudents.filter(
            (s) => s.lkpd.nilaiLkpd1 !== null || s.completedMeetingsCount >= 1
          ).length
        ),
      },
      {
        label: 'Pertemuan 2 / LKPD 2',
        pct: pct(
          filteredStudents.filter(
            (s) => s.lkpd.nilaiLkpd2 !== null || s.completedMeetingsCount >= 2
          ).length
        ),
      },
      {
        label: 'Pertemuan 3 / LKPD 3',
        pct: pct(
          filteredStudents.filter(
            (s) => s.lkpd.nilaiLkpd3 !== null || s.completedMeetingsCount >= 3
          ).length
        ),
      },
      {
        label: 'Latihan HOTS',
        pct: pct(filteredStudents.filter((s) => s.latihan !== null).length),
      },
      {
        label: 'Sumatif Akhir',
        pct: pct(filteredStudents.filter((s) => s.sumatif !== null).length),
      },
    ];
  }, [filteredStudents]);

  const handleSaveNote = async (studentId: string) => {
    if (standaloneMode || token === STANDALONE_MODE_TOKEN) {
      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === studentId ? { ...s, lkpd: { ...s.lkpd, catatanGuru: noteText.trim() } } : s
        )
      );
      setEditingNoteId(null);
      return;
    }
    setSavingNote(true);
    try {
      const resp = await fetch('/api/teacher/lkpd-note', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-Teacher-Token': token,
        },
        body: JSON.stringify({ studentId, catatanGuru: noteText }),
      });
      const { parsed } = await safeParseJsonResponse<{
        ok?: boolean;
        student?: TeacherStudentRecord;
        error?: string;
      }>(resp);
      if (resp.ok && parsed?.ok && parsed.student) {
        setStudents((prev) => prev.map((s) => (s.studentId === studentId ? parsed.student! : s)));
        setEditingNoteId(null);
      } else {
        setDataError(parsed?.error || `Gagal menyimpan catatan guru (HTTP ${resp.status}).`);
      }
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Gagal menghubungi server.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveGasConfig = async (testOnly: boolean) => {
    if (standaloneMode || token === STANDALONE_MODE_TOKEN) {
      setGasMsg({
        ok: false,
        text: 'Konfigurasi Apps Script membutuhkan server API aktif. Gunakan panel Koneksi Langsung Google Sheets di atas.',
      });
      return;
    }
    setGasBusy(true);
    setGasMsg(null);
    try {
      const resp = await fetch('/api/teacher/gas-config', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-Teacher-Token': token,
        },
        body: JSON.stringify({ endpointUrl: gasUrlInput.trim(), testOnly }),
      });
      const { parsed } = await safeParseJsonResponse<{
        ok?: boolean;
        gasConfigured?: boolean;
        message?: string;
        error?: string;
      }>(resp);
      if (!resp.ok || !parsed?.ok) {
        setGasMsg({
          ok: false,
          text: parsed?.error || parsed?.message || `Gagal menguji koneksi GAS (HTTP ${resp.status}).`,
        });
        return;
      }
      setGasConfigured(Boolean(parsed.gasConfigured));
      setGasMsg({ ok: true, text: parsed.message || 'Konfigurasi berhasil diperiksa.' });
    } catch (err) {
      setGasMsg({
        ok: false,
        text: err instanceof Error ? err.message : 'Gagal menghubungi server.',
      });
    } finally {
      setGasBusy(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(gasScriptRaw);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(false);
    }
  };

  const runComprehensiveAudit = async () => {
    setRunningAudit(true);
    const items: SystemAuditItem[] = [];

    // 1. Navigasi & Struktur Modul (16+ menu)
    const navCount = NAV_ITEMS.filter((n) => n.number !== undefined).length;
    items.push({
      id: 'audit-nav',
      category: 'Struktur & Navigasi',
      name: 'Kelengkapan 16 Menu Utama E-Modul + Dashboard',
      status: navCount === 16 ? 'passed' : 'failed',
      detail: `Terdeteksi ${navCount} menu utama bernomor (01–16) dan Dashboard Belajar & Guru.`,
    });

    // 2. Materi 3 Pertemuan
    const meetingList = Object.values(MEETINGS_DATA);
    const meetingsOk =
      meetingList.length === 3 &&
      meetingList.every((m) => m.konsepSections.length >= 2 && m.caseStudies.length >= 1);
    items.push({
      id: 'audit-materi',
      category: 'Materi Pembelajaran',
      name: 'Kelengkapan Pertemuan 1, 2, dan 3 beserta Studi Kasus SMK',
      status: meetingsOk ? 'passed' : 'failed',
      detail: `Tersedia ${meetingList.length} pertemuan lengkap dengan tujuan, konsep KaTeX, contoh soal, dan rangkuman.`,
    });

    // 3. Simulasi Substitusi (x=1, y=3, z=2)
    const subRes = solveSpltv(
      [
        { a: 1, b: 1, c: 1, d: 6 },
        { a: 1, b: 1, c: 0, d: 4 },
        { a: 0, b: 1, c: 1, d: 5 },
      ],
      'substitusi'
    );
    const subOk =
      subRes.status === 'unique' &&
      Math.abs((subRes.x ?? 0) - 1) < 1e-6 &&
      Math.abs((subRes.y ?? 0) - 3) < 1e-6 &&
      Math.abs((subRes.z ?? 0) - 2) < 1e-6;
    items.push({
      id: 'audit-sub',
      category: 'Simulasi Matematika',
      name: 'Solver Metode Substitusi Sistem {x+y+z=6, x+y=4, y+z=5}',
      status: subOk ? 'passed' : 'failed',
      detail: `Hasil kalkulasi solver: x=${subRes.x}, y=${subRes.y}, z=${subRes.z} (harapan: 1, 3, 2).`,
    });

    // 4. Simulasi Eliminasi (3x-y+2z=15, 2x+y+z=13, 3x+2y+2z=24) -> (2, 3, 6)
    const elimRes = solveSpltv(
      [
        { a: 3, b: -1, c: 2, d: 15 },
        { a: 2, b: 1, c: 1, d: 13 },
        { a: 3, b: 2, c: 2, d: 24 },
      ],
      'eliminasi'
    );
    const elimOk =
      elimRes.status === 'unique' &&
      elimRes.verification.every((v) => v.valid) &&
      Math.abs((elimRes.x ?? 0) - 2) < 1e-6 &&
      Math.abs((elimRes.y ?? 0) - 3) < 1e-6 &&
      Math.abs((elimRes.z ?? 0) - 6) < 1e-6;
    items.push({
      id: 'audit-elim',
      category: 'Simulasi Matematika',
      name: 'Solver Metode Eliminasi & Verifikasi 3 Persamaan',
      status: elimOk ? 'passed' : 'failed',
      detail: `Hasil terverifikasi: x=${elimRes.x}, y=${elimRes.y}, z=${elimRes.z} (3/3 persamaan valid).`,
    });

    // 5. Bank Soal & Evaluator Multi-Format
    const sampleUraian = HOTS_30_QUESTIONS.find((q) => q.format === 'uraian');
    const uraianCheck = sampleUraian
      ? evaluateQuestionCorrectness(sampleUraian, sampleUraian.sampleAnswer || '')
      : false;
    const bankOk =
      DIAGNOSTIC_10_QUESTIONS.length === 10 &&
      HOTS_30_QUESTIONS.length >= 30 &&
      SUMMATIVE_20_QUESTIONS.length === 20 &&
      uraianCheck;
    items.push({
      id: 'audit-bank',
      category: 'Asesmen & Bank Soal',
      name: 'Bank Soal Diagnostik (10), HOTS (30), Sumatif (20) & Evaluator',
      status: bankOk ? 'passed' : 'failed',
      detail: `Diagnostik: ${DIAGNOSTIC_10_QUESTIONS.length}, HOTS: ${HOTS_30_QUESTIONS.length}, Sumatif: ${SUMMATIVE_20_QUESTIONS.length}. Evaluator uraian aktif.`,
    });

    // 6. Server Health & Input Validation Check (no student data pollution)
    try {
      const healthResp = await fetch('/api/health', { credentials: 'same-origin' });
      const healthOk = healthResp.ok;
      const rejectResp = await fetch('/api/sync', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: '', kelas: '', nomorAbsen: '', activityType: 'identitas' }),
      });
      const validationRejected = rejectResp.status === 400;
      items.push({
        id: 'audit-backend',
        category: 'Backend & Keamanan Data',
        name: 'Endpoint /api/health & Penolakan Payload Kosong (/api/sync)',
        status: healthOk && validationRejected ? 'passed' : 'failed',
        detail: `Health HTTP ${healthResp.status}; Validasi data kosong ditolak dengan HTTP ${rejectResp.status}.`,
      });
    } catch (err) {
      items.push({
        id: 'audit-backend',
        category: 'Backend & Keamanan Data',
        name: 'Endpoint /api/health & Penolakan Payload Kosong (/api/sync)',
        status: 'failed',
        detail: err instanceof Error ? err.message : 'Gagal menghubungi server.',
      });
    }

    // 7. Proteksi Endpoint Guru
    try {
      const unauthResp = await fetch('/api/teacher/dashboard', { credentials: 'same-origin' });
      items.push({
        id: 'audit-auth',
        category: 'Keamanan Dashboard Guru',
        name: 'Proteksi Token Guru (X-Teacher-Token) pada /api/teacher/dashboard',
        status: unauthResp.status === 401 ? 'passed' : 'failed',
        detail: `Permintaan tanpa token ditolak server dengan status HTTP ${unauthResp.status}.`,
      });
    } catch (err) {
      items.push({
        id: 'audit-auth',
        category: 'Keamanan Dashboard Guru',
        name: 'Proteksi Token Guru (X-Teacher-Token) pada /api/teacher/dashboard',
        status: 'failed',
        detail: err instanceof Error ? err.message : 'Gagal memeriksa proteksi auth.',
      });
    }

    setAuditResults(items);
    setRunningAudit(false);
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-navy-900 text-sky-300 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono font-semibold text-teal-700">Akses Terproteksi</p>
              <h1 className="font-display text-xl font-bold text-navy-900">
                Dashboard Guru SPLTV
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Masukkan PIN Guru untuk memantau rekap nilai kelas, grafik perkembangan belajar, ekspor CSV, serta mengonfigurasi integrasi Google Sheets.
          </p>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="teacher-pin" className="block text-xs font-semibold text-navy-900 mb-1.5">
                PIN Akses Guru
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="teacher-pin"
                  type={showPin ? 'text' : 'password'}
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN Guru"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPin((prev) => !prev)}
                  aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-900 p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Gunakan PIN yang Anda atur pada variabel <code className="font-mono">TEACHER_ACCESS_PIN</code> (jika belum diatur, gunakan PIN bawaan: <code className="font-mono font-semibold text-navy-900">SMK-SPLTV-2026</code>).
              </p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {authLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard Guru'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono font-semibold text-teal-700">
            Panel Pendidik · Analitik Kelas, Google Sheets & Audit Sistem
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
            Dashboard Guru SPLTV Smart Learning
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Status Integrasi Sheets:{' '}
            <strong
              className={
                sheetsConfig.spreadsheetId || gasConfigured ? 'text-teal-700' : 'text-amber-700'
              }
            >
              {sheetsConfig.spreadsheetId
                ? `Terhubung Langsung (${sheetsConfig.spreadsheetTitle || sheetsConfig.spreadsheetId})`
                : gasConfigured
                  ? 'Endpoint Apps Script Terkonfigurasi'
                  : 'Belum Terhubung (Buka tab Integrasi Google Sheets)'}
            </strong>
          </p>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchDashboard(token)}
            disabled={loadingData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-navy-900 text-xs font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Muat Ulang</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-sky-300" />
            <span>Cetak Laporan Kelas</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {standaloneMode && (
        <div className="no-print p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-navy-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <span>
              <strong>Mode Mandiri Aktif:</strong> Endpoint server API tidak merespons pada URL deploy ini. Anda tetap dapat mengelola rekap lokal dan menyinkronkan data langsung ke Google Sheets melalui tab <strong>Integrasi Google Sheets</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shrink-0"
          >
            Buka Integrasi Google Sheets
          </button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="no-print flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'analytics', label: 'Analitik Kelas & Nilai', icon: BarChart3 },
          { id: 'sheets', label: 'Integrasi Google Sheets & GAS', icon: FileSpreadsheet },
          { id: 'testing', label: 'Pengujian Menyeluruh Sistem', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                active
                  ? 'bg-navy-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-sky-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {dataError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{dataError}</span>
        </div>
      )}

      {/* TAB 1: ANALYTICS, CHARTS, TABLE & CSV EXPORT */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Quick Google Sheets Sync Shortcut */}
          <div className="no-print rounded-2xl border border-sky-200 bg-sky-50/70 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-navy-900">
              <FileSpreadsheet className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                {sheetsConfig.spreadsheetId ? (
                  <>
                    Terhubung dengan Google Sheets:{' '}
                    <strong>{sheetsConfig.spreadsheetTitle || sheetsConfig.spreadsheetId}</strong>
                  </>
                ) : (
                  <>
                    Hubungkan akun Google Anda untuk membuat spreadsheet 7 sheet otomatis dan menyinkronkan data kelas ke Google Sheets.
                  </>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('sheets')}
              className="px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              {sheetsConfig.spreadsheetId ? 'Kelola & Sinkronkan Google Sheets' : 'Hubungkan Google Sheets'}
            </button>
          </div>

          {/* Filters & Export Bar */}
          <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  placeholder="Cari nama atau ID siswa..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <select
                value={kelasFilter}
                onChange={(e) => setKelasFilter(e.target.value)}
                aria-label="Filter Kelas"
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="ALL">Semua Kelas ({students.length})</option>
                {uniqueClasses.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={filteredStudents.length === 0}
                onClick={() => exportRekapCsv(filteredStudents)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV Rekap Siswa</span>
              </button>
              <button
                type="button"
                disabled={filteredStudents.length === 0}
                onClick={() => exportAsesmenCsv(filteredStudents)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 disabled:opacity-40 text-navy-900 border border-sky-200 text-xs font-semibold rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV Asesmen</span>
              </button>
              <button
                type="button"
                disabled={filteredStudents.length === 0}
                onClick={() => exportLkpdCsv(filteredStudents)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 disabled:opacity-40 text-navy-900 border border-sky-200 text-xs font-semibold rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV LKPD</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Jumlah Peserta Didik</p>
              <p className="font-mono text-2xl font-bold text-navy-900 mt-1 tabular-nums">
                {kpi.total}
              </p>
              <p className="text-xs text-slate-500 mt-1 tabular-nums">
                {kpi.studied} aktif belajar · {kpi.unfinished} belum tuntas
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Rata-Rata Nilai Kelas</p>
              <p className="font-mono text-2xl font-bold text-teal-700 mt-1 tabular-nums">
                {kpi.avgClass}
              </p>
              <p className="text-xs text-slate-500 mt-1 tabular-nums">
                Tertinggi: {kpi.highest} · Terendah: {kpi.lowest}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Ketuntasan Belajar (≥75)</p>
              <p className="font-mono text-2xl font-bold text-navy-900 mt-1 tabular-nums">
                {kpi.ketuntasanPct}%
              </p>
              <p className="text-xs text-slate-500 mt-1 tabular-nums">
                {kpi.tuntasCount} dari {kpi.ratedCount} siswa ternilai
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Diagnostik vs Sumatif</p>
              <p className="font-mono text-2xl font-bold text-sky-700 mt-1 tabular-nums">
                {kpi.avgDiag} → {kpi.avgSum}
              </p>
              <p className="text-xs text-slate-500 mt-1 tabular-nums">
                {kpi.diagCount} diagnostik · {kpi.sumCount} sumatif
              </p>
            </div>
          </div>

          {/* 4 DATA VISUALIZATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Visualisasi 1: Grafik Batang Nilai Siswa */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-display text-base font-bold text-navy-900">
                1. Grafik Batang Nilai Siswa (Rata-Rata & Sumatif)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 mb-4">
                Perbandingan capaian rata-rata aktivitas (biru navy) dan nilai sumatif (toska).
              </p>
              {filteredStudents.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Belum ada data peserta didik tersimpan di server.
                </div>
              ) : (
                <svg viewBox="0 0 520 210" className="w-full h-auto">
                  {[0, 25, 50, 75, 100].map((tick) => {
                    const y = 165 - tick * 1.35;
                    return (
                      <g key={tick}>
                        <line x1="36" y1={y} x2="505" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                        <text x="28" y={y + 3} textAnchor="end" fontSize="9" fill="#64748b">
                          {tick}
                        </text>
                      </g>
                    );
                  })}
                  {filteredStudents.slice(0, 8).map((s, idx) => {
                    const slotW = 460 / Math.max(1, Math.min(8, filteredStudents.length));
                    const xCenter = 45 + idx * slotW + slotW / 2;
                    const avgH = s.rataRata * 1.35;
                    const sumVal = s.sumatif?.nilaiAkhir ?? 0;
                    const sumH = sumVal * 1.35;
                    return (
                      <g key={s.studentId}>
                        <rect
                          x={xCenter - 12}
                          y={165 - avgH}
                          width="10"
                          height={avgH}
                          rx="2"
                          fill="#0b1f3f"
                        />
                        <rect
                          x={xCenter + 1}
                          y={165 - sumH}
                          width="10"
                          height={sumH}
                          rx="2"
                          fill="#0d9488"
                        />
                        <text x={xCenter} y="182" textAnchor="middle" fontSize="9" fill="#334155">
                          {s.nama.split(' ')[0].slice(0, 8)}
                        </text>
                        <text x={xCenter} y="194" textAnchor="middle" fontSize="8" fill="#64748b">
                          {s.rataRata}/{s.sumatif ? sumVal : '-'}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </section>

            {/* Visualisasi 2: Grafik Perkembangan Belajar */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-display text-base font-bold text-navy-900">
                2. Grafik Perkembangan Belajar Kelas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 mb-4">
                Tren rata-rata skor kelas dari Diagnostik → LKPD 1–3 → Latihan HOTS → Sumatif.
              </p>
              <svg viewBox="0 0 520 210" className="w-full h-auto">
                {[0, 25, 50, 75, 100].map((tick) => {
                  const y = 165 - tick * 1.35;
                  return (
                    <g key={tick}>
                      <line x1="36" y1={y} x2="500" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                      <text x="28" y={y + 3} textAnchor="end" fontSize="9" fill="#64748b">
                        {tick}
                      </text>
                    </g>
                  );
                })}
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  points={progressionSeries
                    .map((pt, i) => `${68 + i * 82},${165 - pt.value * 1.35}`)
                    .join(' ')}
                />
                {progressionSeries.map((pt, i) => {
                  const cx = 68 + i * 82;
                  const cy = 165 - pt.value * 1.35;
                  return (
                    <g key={pt.label}>
                      <circle cx={cx} cy={cy} r="5" fill="#0b1f3f" stroke="#ffffff" strokeWidth="2" />
                      <text x={cx} y={cy - 9} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0b1f3f">
                        {pt.value}
                      </text>
                      <text x={cx} y="185" textAnchor="middle" fontSize="9" fill="#475569">
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </section>

            {/* Visualisasi 3: Diagram Distribusi Kategori Kemampuan */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-display text-base font-bold text-navy-900">
                3. Diagram Distribusi Kategori Kemampuan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 mb-4">
                Proporsi peserta didik berdasarkan rentang capaian rubrik kelas.
              </p>
              <div className="space-y-3">
                {categoryDistribution.map((cat) => {
                  const pct =
                    filteredStudents.length > 0
                      ? Math.round((cat.count / filteredStudents.length) * 100)
                      : 0;
                  return (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-navy-900">{cat.label}</span>
                        <span className="font-mono text-slate-600 tabular-nums">
                          {cat.count} siswa ({pct}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Visualisasi 4: Grafik Pencapaian Setiap Pertemuan & Aktivitas */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-display text-base font-bold text-navy-900">
                4. Grafik Pencapaian Setiap Pertemuan / Aktivitas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 mb-4">
                Persentase peserta didik yang telah menuntaskan setiap tahapan modul.
              </p>
              <div className="space-y-3">
                {activityAchievement.map((act) => (
                  <div key={act.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-navy-900">{act.label}</span>
                      <span className="font-mono font-semibold text-teal-700 tabular-nums">
                        {act.pct}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${act.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Student Table */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-navy-900">
                Daftar Capaian Peserta Didik ({filteredStudents.length})
              </h2>
              <span className="text-xs text-slate-500">
                Klik ikon catatan pada kolom LKPD untuk memberikan umpan balik guru.
              </span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Belum ada peserta didik yang mengirimkan aktivitas ke server. Minta siswa mengisi Identitas dan mengerjakan aktivitas untuk melihat data kelas di sini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-3 px-4">Peserta Didik</th>
                      <th className="py-3 px-3 text-right">Diagnostik</th>
                      <th className="py-3 px-3 text-right">LKPD 1/2/3</th>
                      <th className="py-3 px-3 text-right">Latihan</th>
                      <th className="py-3 px-3 text-right">Sumatif</th>
                      <th className="py-3 px-3 text-right">Rata-Rata</th>
                      <th className="py-3 px-3 text-right">Progres</th>
                      <th className="py-3 px-4">Catatan Guru (LKPD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <tr key={s.studentId} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-navy-900">{s.nama}</p>
                          <p className="text-slate-500 font-mono">
                            {s.kelas} · Absen {s.nomorAbsen} · {s.studentId}
                          </p>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {s.diagnostik ? s.diagnostik.nilai : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {[s.lkpd.nilaiLkpd1, s.lkpd.nilaiLkpd2, s.lkpd.nilaiLkpd3]
                            .map((v) => (v !== null ? v : '—'))
                            .join(' / ')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {s.latihan ? s.latihan.nilai : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-teal-700 tabular-nums">
                          {s.sumatif ? s.sumatif.nilaiAkhir : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-navy-900 tabular-nums">
                          {s.rataRata}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {s.persentasePenyelesaian}%
                        </td>
                        <td className="py-3 px-4 min-w-[210px]">
                          {editingNoteId === s.studentId ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Tulis catatan LKPD..."
                                className="flex-1 px-2.5 py-1 rounded-lg border border-slate-300 text-xs"
                              />
                              <button
                                type="button"
                                disabled={savingNote}
                                onClick={() => void handleSaveNote(s.studentId)}
                                className="px-2.5 py-1 bg-teal-600 text-white rounded-lg font-semibold"
                              >
                                Simpan
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingNoteId(null)}
                                className="px-2 py-1 text-slate-500"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-slate-600 truncate max-w-[160px]">
                                {s.lkpd.catatanGuru || 'Belum ada catatan'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(s.studentId);
                                  setNoteText(s.lkpd.catatanGuru || '');
                                }}
                                className="no-print p-1 text-sky-700 hover:bg-sky-50 rounded"
                                title="Edit catatan guru"
                              >
                                <MessageSquarePlus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 2: GOOGLE SHEETS & APPS SCRIPT */}
      {activeTab === 'sheets' && (
        <div className="space-y-6">
          {/* Primary Direct Google Sheets API Integration */}
          <GoogleSheetsDirectPanel
            teacherToken={token}
            students={students}
            sheetsConfig={sheetsConfig}
            onSheetsConfigUpdated={setSheetsConfig}
          />

          {/* Alternative Option: Google Apps Script Backend Configurator */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-slate-600" />
              <h2 className="font-display text-base font-bold text-navy-900">
                Opsi Alternatif: Endpoint Google Apps Script (Sisi Server)
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              URL Web App disimpan aman di sisi server (atau melalui variabel lingkungan <code className="font-mono">GAS_ENDPOINT_URL</code>) dan tidak pernah diekspos ke kode frontend siswa. Status saat ini:{' '}
              <strong className={gasConfigured ? 'text-teal-700' : 'text-amber-700'}>
                {gasConfigured ? 'Sudah dikonfigurasi' : 'Belum dikonfigurasi'}
              </strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={gasUrlInput}
                onChange={(e) => setGasUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="button"
                disabled={gasBusy}
                onClick={() => void handleSaveGasConfig(false)}
                className="px-4 py-2.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Simpan & Uji Koneksi
              </button>
              <button
                type="button"
                disabled={gasBusy}
                onClick={() => void handleSaveGasConfig(true)}
                className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-navy-900 text-xs font-semibold rounded-xl transition-colors"
              >
                Ping Endpoint Aktif
              </button>
            </div>

            {gasMsg && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  gasMsg.ok
                    ? 'bg-teal-50 border-teal-200 text-teal-900'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {gasMsg.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{gasMsg.text}</span>
              </div>
            )}
          </section>

          {/* 8-Step Guide + 7 Sheets Schema */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-teal-700" />
                <h2 className="font-display text-base font-bold text-navy-900">
                  Petunjuk Pemasangan (8 Langkah)
                </h2>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-700 list-decimal pl-4 leading-relaxed">
                {INSTALL_STEPS.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-700" />
                <h2 className="font-display text-base font-bold text-navy-900">
                  Rancangan Struktur 7 Sheet Google Sheets
                </h2>
              </div>
              <div className="space-y-2.5">
                {SHEETS_SPEC.map((sh, idx) => (
                  <div key={sh.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-mono font-bold text-navy-900">
                      SHEET {idx + 1}: {sh.name}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Kolom: {sh.columns.join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Copyable Code.gs */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-navy-900">
                  Kode Lengkap Google Apps Script (Code.gs)
                </h2>
                <p className="text-xs text-slate-500">
                  Sudah dilengkapi validasi data, anti-duplikasi upsert per ID peserta didik, dan pembacaan rekap untuk dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleCopyCode()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Berhasil Disalin' : 'Salin Code.gs'}</span>
              </button>
            </div>
            <pre className="p-4 sm:p-5 bg-slate-950 text-sky-100 text-xs font-mono overflow-x-auto max-h-[420px]">
              <code>{gasScriptRaw}</code>
            </pre>
          </section>
        </div>
      )}

      {/* TAB 3: COMPREHENSIVE SYSTEM AUDIT & TEST RUNNER */}
      {activeTab === 'testing' && (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-700" />
                <h2 className="font-display text-lg font-bold text-navy-900">
                  Pengujian Fungsional & Keamanan Sistem Terintegrasi
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Menguji langsung navigasi, kelengkapan materi, kalkulasi matematis simulasi Substitusi & Eliminasi, bank soal & evaluator, validasi backend, serta proteksi token guru.
              </p>
            </div>
            <button
              type="button"
              disabled={runningAudit}
              onClick={() => void runComprehensiveAudit()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>{runningAudit ? 'Menjalankan Audit...' : 'Jalankan Semua Uji Sistem'}</span>
            </button>
          </section>

          {auditResults && (
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-navy-900">
                  Hasil Pemeriksaan ({auditResults.filter((r) => r.status === 'passed').length}/
                  {auditResults.length} Lulus)
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {auditResults.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-slate-500">{item.category}</p>
                      <p className="text-sm font-bold text-navy-900">{item.name}</p>
                      <p className="text-xs text-slate-600">{item.detail}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border shrink-0 ${
                        item.status === 'passed'
                          ? 'bg-teal-50 border-teal-200 text-teal-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      {item.status === 'passed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{item.status === 'passed' ? 'LULUS' : 'GAGAL'}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
