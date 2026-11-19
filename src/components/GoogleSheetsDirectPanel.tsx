import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FilePlus2,
  FileSpreadsheet,
  Link2,
  LogOut,
  RefreshCw,
  UploadCloud,
  X,
  XCircle,
} from 'lucide-react';
import {
  getAccessToken,
  googleLogout,
  googleSignIn,
  initAuth,
} from '../utils/googleAuth';
import {
  createSpltvSpreadsheet,
  ensureRequiredSheets,
  extractSpreadsheetId,
  fetchSheetRowCounts,
  getSpreadsheetMetadata,
  SHEETS_SCHEMA,
  SheetSyncStudentRecord,
  SpreadsheetMetadataInfo,
  syncStudentsToGoogleSheets,
} from '../utils/googleSheetsApi';
import { GoogleSignInButton } from './GoogleSignInButton';

export interface SheetsLinkConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  lastSyncedAt: string | null;
}

interface GoogleSheetsDirectPanelProps {
  teacherToken: string;
  students: SheetSyncStudentRecord[];
  sheetsConfig: SheetsLinkConfig;
  onSheetsConfigUpdated: (next: SheetsLinkConfig) => void;
}

type ConfirmAction =
  | { type: 'create'; title: string }
  | { type: 'add-tabs'; spreadsheetId: string; missingTabs: string[] }
  | { type: 'sync-all'; spreadsheetId: string; title: string; studentCount: number };

export const GoogleSheetsDirectPanel: React.FC<GoogleSheetsDirectPanelProps> = ({
  teacherToken,
  students,
  sheetsConfig,
  onSheetsConfigUpdated,
}) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasAccessToken, setHasAccessToken] = useState<boolean>(() => Boolean(getAccessToken()));
  const [authBusy, setAuthBusy] = useState(false);

  const [newSheetTitle, setNewSheetTitle] = useState('SPLTV Smart Learning - Rekap Kelas SMK');
  const [existingInput, setExistingInput] = useState(sheetsConfig.spreadsheetUrl || sheetsConfig.spreadsheetId || '');
  const [inspectedMeta, setInspectedMeta] = useState<SpreadsheetMetadataInfo | null>(null);
  const [liveRowCounts, setLiveRowCounts] = useState<Record<string, number> | null>(null);

  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    const unsub = initAuth(
      (user) => {
        setGoogleUser(user);
        setHasAccessToken(true);
      },
      () => {
        setGoogleUser(null);
        setHasAccessToken(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (sheetsConfig.spreadsheetUrl || sheetsConfig.spreadsheetId) {
      setExistingInput(sheetsConfig.spreadsheetUrl || sheetsConfig.spreadsheetId);
    }
  }, [sheetsConfig.spreadsheetId, sheetsConfig.spreadsheetUrl]);

  const persistServerSheetsConfig = async (cfg: Partial<SheetsLinkConfig>) => {
    const resp = await fetch('/api/teacher/sheets-config', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Teacher-Token': teacherToken,
      },
      body: JSON.stringify(cfg),
    });
    const data = (await resp.json()) as { ok?: boolean; sheetsConfig?: SheetsLinkConfig };
    if (resp.ok && data.ok && data.sheetsConfig) {
      onSheetsConfigUpdated(data.sheetsConfig);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthBusy(true);
    setFeedback(null);
    try {
      const res = await googleSignIn();
      setGoogleUser(res.user);
      setHasAccessToken(true);
      setFeedback({
        ok: true,
        text: `Berhasil terhubung dengan akun Google (${res.user.email || res.user.displayName || 'Aktif'}).`,
      });
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Gagal masuk dengan Google.',
      });
    } finally {
      setAuthBusy(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleLogout();
    setGoogleUser(null);
    setHasAccessToken(false);
    setInspectedMeta(null);
    setLiveRowCounts(null);
    setFeedback({ ok: true, text: 'Sesi akun Google ditutup.' });
  };

  const requireToken = (): string | null => {
    const token = getAccessToken();
    if (!token) {
      setHasAccessToken(false);
      setFeedback({
        ok: false,
        text: 'Token Google Sheets belum tersedia atau kedaluwarsa. Klik "Sign in with Google" terlebih dahulu.',
      });
      return null;
    }
    return token;
  };

  const handleInspectExisting = async () => {
    const token = requireToken();
    if (!token) return;
    const extractedId = extractSpreadsheetId(existingInput);
    if (!extractedId) {
      setFeedback({
        ok: false,
        text: 'Masukkan URL Google Spreadsheet atau Spreadsheet ID terlebih dahulu.',
      });
      return;
    }

    setBusyAction('inspect');
    setFeedback(null);
    try {
      const { meta, rowCounts } = await fetchSheetRowCounts(extractedId, token);
      setInspectedMeta(meta);
      setLiveRowCounts(rowCounts);
      await persistServerSheetsConfig({
        spreadsheetId: meta.spreadsheetId,
        spreadsheetTitle: meta.title,
        spreadsheetUrl: meta.spreadsheetUrl,
      });
      setFeedback({
        ok: true,
        text:
          meta.missingTabs.length === 0
            ? `Spreadsheet "${meta.title}" berhasil dihubungkan dan seluruh 7 sheet telah ditemukan.`
            : `Spreadsheet "${meta.title}" berhasil dihubungkan. ${meta.missingTabs.length} sheet belum tersedia dan dapat ditambahkan.`,
      });
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Gagal membaca metadata spreadsheet.',
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleRefreshLiveCounts = async () => {
    const token = requireToken();
    if (!token || !sheetsConfig.spreadsheetId) return;
    setBusyAction('refresh');
    setFeedback(null);
    try {
      const { meta, rowCounts } = await fetchSheetRowCounts(sheetsConfig.spreadsheetId, token);
      setInspectedMeta(meta);
      setLiveRowCounts(rowCounts);
      setFeedback({
        ok: true,
        text: `Data live dari "${meta.title}" berhasil dibaca.`,
      });
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Gagal membaca data Google Sheets.',
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleUnlinkSpreadsheet = async () => {
    setBusyAction('unlink');
    try {
      await persistServerSheetsConfig({
        spreadsheetId: '',
        spreadsheetTitle: '',
        spreadsheetUrl: '',
        lastSyncedAt: null,
      });
      setExistingInput('');
      setInspectedMeta(null);
      setLiveRowCounts(null);
      setFeedback({
        ok: true,
        text: 'Tautan spreadsheet pada aplikasi dilepas (file di Google Drive Anda tidak dihapus).',
      });
    } finally {
      setBusyAction(null);
    }
  };

  const executeConfirmedAction = async () => {
    if (!confirmModal) return;
    const action = confirmModal;
    setConfirmModal(null);

    const token = requireToken();
    if (!token) return;

    setBusyAction(action.type);
    setFeedback(null);
    try {
      if (action.type === 'create') {
        const meta = await createSpltvSpreadsheet(action.title, token);
        setInspectedMeta(meta);
        setExistingInput(meta.spreadsheetUrl);
        const initialCounts: Record<string, number> = {};
        SHEETS_SCHEMA.forEach((s) => {
          initialCounts[s.name] = 0;
        });
        setLiveRowCounts(initialCounts);
        await persistServerSheetsConfig({
          spreadsheetId: meta.spreadsheetId,
          spreadsheetTitle: meta.title,
          spreadsheetUrl: meta.spreadsheetUrl,
          lastSyncedAt: null,
        });
        setFeedback({
          ok: true,
          text: `Google Spreadsheet "${meta.title}" beserta 7 sheet dan header kolom berhasil dibuat & dihubungkan.`,
        });
      } else if (action.type === 'add-tabs') {
        const meta = await ensureRequiredSheets(action.spreadsheetId, token);
        const { rowCounts } = await fetchSheetRowCounts(action.spreadsheetId, token);
        setInspectedMeta(meta);
        setLiveRowCounts(rowCounts);
        setFeedback({
          ok: true,
          text: `Seluruh 7 sheet wajib SPLTV kini lengkap di spreadsheet "${meta.title}".`,
        });
      } else if (action.type === 'sync-all') {
        const res = await syncStudentsToGoogleSheets(action.spreadsheetId, students, token);
        setLiveRowCounts(res.sheetRowCounts);
        await persistServerSheetsConfig({
          lastSyncedAt: res.syncedAt,
        });
        const meta = await getSpreadsheetMetadata(action.spreadsheetId, token);
        setInspectedMeta(meta);
        setFeedback({
          ok: true,
          text: `Sinkronisasi berhasil: ${res.updatedStudents} data peserta didik diperbarui di 7 sheet tanpa duplikasi.`,
        });
      }
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Operasi Google Sheets gagal.',
      });
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-700" />
            <h2 className="font-display text-lg font-bold text-navy-900">
              Koneksi Langsung Google Sheets (Direkomendasikan)
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            Hubungkan langsung ke akun Google Anda untuk membuat spreadsheet 7 sheet secara otomatis dan menyinkronkan data nilai peserta didik tanpa perlu menulis skrip manual.
          </p>
        </div>

        {/* Auth Status / Sign in with Google */}
        <div className="shrink-0">
          {hasAccessToken && googleUser ? (
            <div className="flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <div className="text-teal-900">
                <p className="font-semibold">{googleUser.displayName || 'Akun Google Terhubung'}</p>
                {googleUser.email && <p className="text-teal-700">{googleUser.email}</p>}
              </div>
              <button
                type="button"
                onClick={() => void handleGoogleLogout()}
                className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <GoogleSignInButton
              onClick={() => void handleGoogleSignIn()}
              disabled={authBusy}
              label={authBusy ? 'Menghubungkan...' : 'Sign in with Google'}
            />
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            feedback.ok
              ? 'bg-teal-50 border-teal-200 text-teal-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Linked Spreadsheet Status Card */}
      {sheetsConfig.spreadsheetId && (
        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-teal-700">Spreadsheet Aktif Terhubung</p>
              <p className="font-display text-base font-bold text-navy-900">
                {sheetsConfig.spreadsheetTitle || 'Google Spreadsheet SPLTV'}
              </p>
              <p className="text-xs font-mono text-slate-500 mt-0.5 break-all">
                ID: {sheetsConfig.spreadsheetId}
                {sheetsConfig.lastSyncedAt
                  ? ` · Sinkron terakhir: ${new Date(sheetsConfig.lastSyncedAt).toLocaleString('id-ID')}`
                  : ' · Belum pernah disinkronkan'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={sheetsConfig.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-navy-900 text-xs font-semibold rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
                <span>Buka Google Sheets</span>
              </a>
              <button
                type="button"
                disabled={!hasAccessToken || busyAction !== null}
                onClick={() => void handleRefreshLiveCounts()}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50 border border-slate-200 text-navy-900 text-xs font-semibold rounded-xl transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${busyAction === 'refresh' ? 'animate-spin' : ''}`} />
                <span>Periksa Baris</span>
              </button>
              <button
                type="button"
                disabled={!hasAccessToken || busyAction !== null}
                onClick={() =>
                  setConfirmModal({
                    type: 'sync-all',
                    spreadsheetId: sheetsConfig.spreadsheetId,
                    title: sheetsConfig.spreadsheetTitle || 'Google Spreadsheet SPLTV',
                    studentCount: students.length,
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>
                  {busyAction === 'sync-all'
                    ? 'Menyinkronkan...'
                    : `Sinkronkan ${students.length} Siswa ke Sheets`}
                </span>
              </button>
              <button
                type="button"
                disabled={busyAction !== null}
                onClick={() => void handleUnlinkSpreadsheet()}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Lepas Tautan
              </button>
            </div>
          </div>

          {inspectedMeta && inspectedMeta.missingTabs.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
              <span>
                Sheet yang belum ada ({inspectedMeta.missingTabs.length}):{' '}
                <strong>{inspectedMeta.missingTabs.join(', ')}</strong>
              </span>
              <button
                type="button"
                disabled={!hasAccessToken || busyAction !== null}
                onClick={() =>
                  setConfirmModal({
                    type: 'add-tabs',
                    spreadsheetId: inspectedMeta.spreadsheetId,
                    missingTabs: inspectedMeta.missingTabs,
                  })
                }
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg"
              >
                Tambahkan Sheet yang Kurang
              </button>
            </div>
          )}

          {liveRowCounts && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
              {SHEETS_SCHEMA.map((sh) => (
                <div
                  key={sh.name}
                  className="p-2.5 rounded-lg bg-white border border-sky-100 text-xs"
                >
                  <p className="font-mono text-[10px] text-slate-500 truncate" title={sh.name}>
                    {sh.name}
                  </p>
                  <p className="font-mono font-bold text-navy-900 mt-0.5 tabular-nums">
                    {liveRowCounts[sh.name] ?? 0} baris
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions: Create New OR Link Existing Spreadsheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Option 1: Create New 7-Sheet Spreadsheet */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-sm">
            <FilePlus2 className="w-4 h-4 text-teal-700" />
            <span>Opsi 1: Buat Google Spreadsheet Baru (7 Sheet Otomatis)</span>
          </div>
          <p className="text-xs text-slate-600">
            Membuat file Google Spreadsheet baru langsung di akun Google Anda lengkap dengan 7 tab dan header kolom sesuai standar E-Modul SPLTV.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newSheetTitle}
              onChange={(e) => setNewSheetTitle(e.target.value)}
              placeholder="Nama spreadsheet baru"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              type="button"
              disabled={!hasAccessToken || busyAction !== null}
              onClick={() =>
                setConfirmModal({
                  type: 'create',
                  title: newSheetTitle.trim() || 'SPLTV Smart Learning - Rekap Kelas SMK',
                })
              }
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
            >
              {busyAction === 'create' ? 'Membuat...' : 'Buat Spreadsheet'}
            </button>
          </div>
        </div>

        {/* Option 2: Link Existing Spreadsheet */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-sm">
            <Link2 className="w-4 h-4 text-sky-700" />
            <span>Opsi 2: Hubungkan Spreadsheet yang Sudah Ada</span>
          </div>
          <p className="text-xs text-slate-600">
            Tempelkan URL atau Spreadsheet ID Google Sheets Anda. Sistem akan memeriksa daftar tab yang ada terlebih dahulu.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={existingInput}
              onChange={(e) => setExistingInput(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../edit"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              type="button"
              disabled={!hasAccessToken || busyAction !== null}
              onClick={() => void handleInspectExisting()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
            >
              {busyAction === 'inspect' ? 'Memeriksa...' : 'Hubungkan'}
            </button>
          </div>
        </div>
      </div>

      {!hasAccessToken && (
        <p className="text-xs text-slate-500">
          Klik tombol <strong>Sign in with Google</strong> di kanan atas untuk mengaktifkan pembuatan spreadsheet, pemeriksaan baris, dan sinkronisasi langsung ke Google Sheets.
        </p>
      )}

      {/* Explicit Confirmation Modal for All Mutating Google Sheets Operations */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 text-navy-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h3 className="font-display text-base font-bold">
                  {confirmModal.type === 'create'
                    ? 'Konfirmasi Pembuatan Google Spreadsheet'
                    : confirmModal.type === 'add-tabs'
                      ? 'Konfirmasi Penambahan Tab Sheet'
                      : 'Konfirmasi Sinkronisasi Data ke Google Sheets'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {confirmModal.type === 'create' && (
              <div className="text-sm text-slate-600 space-y-2">
                <p>
                  Aplikasi akan membuat file Google Spreadsheet baru di akun Google Anda dengan judul:
                </p>
                <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-navy-900 text-xs">
                  {confirmModal.title}
                </p>
                <p className="text-xs">
                  File akan langsung berisi 7 sheet terstruktur: {SHEETS_SCHEMA.map((s) => s.name).join(', ')}.
                </p>
              </div>
            )}

            {confirmModal.type === 'add-tabs' && (
              <div className="text-sm text-slate-600 space-y-2">
                <p>
                  Aplikasi akan menambahkan {confirmModal.missingTabs.length} tab sheet beserta baris header ke spreadsheet Anda:
                </p>
                <ul className="list-disc pl-5 text-xs text-navy-900 space-y-1">
                  {confirmModal.missingTabs.map((tab) => (
                    <li key={tab}>{tab}</li>
                  ))}
                </ul>
              </div>
            )}

            {confirmModal.type === 'sync-all' && (
              <div className="text-sm text-slate-600 space-y-2">
                <p>
                  Aplikasi akan menulis dan memperbarui data{' '}
                  <strong className="text-navy-900">{confirmModal.studentCount} peserta didik</strong>{' '}
                  ke Google Spreadsheet{' '}
                  <strong className="text-navy-900">&ldquo;{confirmModal.title}&rdquo;</strong>.
                </p>
                <p className="text-xs text-slate-500">
                  Baris yang sudah ada dengan ID peserta didik sama akan diperbarui tanpa duplikasi pada 7 sheet (DATA PESERTA DIDIK, ASESMEN DIAGNOSTIK, HASIL LKPD, HASIL LATIHAN, ASESMEN SUMATIF, REFLEKSI, dan REKAP HASIL BELAJAR).
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void executeConfirmedAction()}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors"
              >
                Konfirmasi & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
