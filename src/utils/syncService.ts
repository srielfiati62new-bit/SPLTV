import {
  AssessmentRecord,
  LearningProgress,
  LkpdRecord,
  ReflectionRecord,
  StudentIdentity,
} from '../types/module';
import { calculateOverallProgress } from './storage';

const SYNC_QUEUE_KEY = 'spltv_smart_sync_queue_v1';
const SYNC_META_KEY = 'spltv_smart_sync_meta_v1';

export type SyncActivityType =
  | 'identitas'
  | 'diagnostik'
  | 'lkpd'
  | 'latihan'
  | 'sumatif'
  | 'refleksi';

export interface SyncQueueItem {
  id: string;
  activityType: SyncActivityType;
  nama: string;
  kelas: string;
  nomorAbsen: string;
  payload: Record<string, unknown>;
  persentasePenyelesaian: number;
  completedMeetingsCount: number;
  status: 'pending' | 'failed';
  lastError?: string;
  createdAt: string;
}

export interface SyncStatusSummary {
  state: 'idle' | 'syncing' | 'synced-gas' | 'saved-server' | 'failed';
  lastSyncedAt: string | null;
  lastMessage: string;
  pendingOrFailedCount: number;
  gasConfigured: boolean;
  sheetsLinked?: boolean;
  spreadsheetId?: string;
  spreadsheetTitle?: string;
  spreadsheetUrl?: string;
}

export function loadSyncQueue(): SyncQueueItem[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? (JSON.parse(raw) as SyncQueueItem[]) : [];
  } catch {
    return [];
  }
}

function saveSyncQueue(queue: SyncQueueItem[]) {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export function loadSyncMeta(): SyncStatusSummary {
  const queue = loadSyncQueue();
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<SyncStatusSummary>) : {};
    return {
      state: queue.length > 0 ? 'failed' : parsed.state || 'idle',
      lastSyncedAt: parsed.lastSyncedAt || null,
      lastMessage: parsed.lastMessage || 'Belum ada data disinkronkan.',
      pendingOrFailedCount: queue.length,
      gasConfigured: Boolean(parsed.gasConfigured),
      sheetsLinked: Boolean(parsed.sheetsLinked),
      spreadsheetId: parsed.spreadsheetId || '',
      spreadsheetTitle: parsed.spreadsheetTitle || '',
      spreadsheetUrl: parsed.spreadsheetUrl || '',
    };
  } catch {
    return {
      state: queue.length > 0 ? 'failed' : 'idle',
      lastSyncedAt: null,
      lastMessage: 'Belum ada data disinkronkan.',
      pendingOrFailedCount: queue.length,
      gasConfigured: false,
      sheetsLinked: false,
      spreadsheetId: '',
      spreadsheetTitle: '',
      spreadsheetUrl: '',
    };
  }
}

function saveSyncMeta(meta: SyncStatusSummary) {
  localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
}

export async function checkBackendHealth(): Promise<{
  ok: boolean;
  gasConfigured: boolean;
  sheetsLinked: boolean;
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
}> {
  try {
    const resp = await fetch('/api/health');
    if (!resp.ok) {
      return {
        ok: false,
        gasConfigured: false,
        sheetsLinked: false,
        spreadsheetId: '',
        spreadsheetTitle: '',
        spreadsheetUrl: '',
      };
    }
    const data = (await resp.json()) as {
      ok?: boolean;
      gasConfigured?: boolean;
      sheetsLinked?: boolean;
      spreadsheetId?: string;
      spreadsheetTitle?: string;
      spreadsheetUrl?: string;
    };
    return {
      ok: Boolean(data.ok),
      gasConfigured: Boolean(data.gasConfigured),
      sheetsLinked: Boolean(data.sheetsLinked),
      spreadsheetId: data.spreadsheetId || '',
      spreadsheetTitle: data.spreadsheetTitle || '',
      spreadsheetUrl: data.spreadsheetUrl || '',
    };
  } catch {
    return {
      ok: false,
      gasConfigured: false,
      sheetsLinked: false,
      spreadsheetId: '',
      spreadsheetTitle: '',
      spreadsheetUrl: '',
    };
  }
}

async function sendItemToServer(item: SyncQueueItem): Promise<{
  ok: boolean;
  syncStatus?: 'synced-gas' | 'saved-server-only' | 'gas-error';
  message: string;
  timestamp?: string;
}> {
  try {
    const resp = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: item.nama,
        kelas: item.kelas,
        nomorAbsen: item.nomorAbsen,
        activityType: item.activityType,
        payload: item.payload,
        persentasePenyelesaian: item.persentasePenyelesaian,
        completedMeetingsCount: item.completedMeetingsCount,
      }),
    });
    const data = (await resp.json()) as {
      ok?: boolean;
      error?: string;
      syncStatus?: 'synced-gas' | 'saved-server-only' | 'gas-error';
      message?: string;
      timestamp?: string;
    };
    if (!resp.ok || !data.ok) {
      return { ok: false, message: data.error || `Gagal HTTP ${resp.status}` };
    }
    return {
      ok: true,
      syncStatus: data.syncStatus,
      message: data.message || 'Tersinkron ke server.',
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Koneksi terputus saat mengirim data.',
    };
  }
}

export async function syncActivity(
  identity: StudentIdentity,
  progress: LearningProgress,
  activityType: SyncActivityType,
  payload: Record<string, unknown>
): Promise<SyncStatusSummary> {
  const queue = loadSyncQueue().filter((q) => q.activityType !== activityType);
  const newItem: SyncQueueItem = {
    id: `${activityType}-${Date.now()}`,
    activityType,
    nama: identity.namaLengkap,
    kelas: identity.kelas,
    nomorAbsen: identity.nomorAbsen,
    payload,
    persentasePenyelesaian: calculateOverallProgress(progress),
    completedMeetingsCount: progress.completedMeetings.length,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const result = await sendItemToServer(newItem);
  if (!result.ok || result.syncStatus === 'gas-error') {
    const failedItem: SyncQueueItem = {
      ...newItem,
      status: 'failed',
      lastError: result.message,
    };
    const nextQueue = [...queue, failedItem];
    saveSyncQueue(nextQueue);
    const meta: SyncStatusSummary = {
      state: 'failed',
      lastSyncedAt: loadSyncMeta().lastSyncedAt,
      lastMessage: result.message,
      pendingOrFailedCount: nextQueue.length,
      gasConfigured: result.syncStatus === 'gas-error',
    };
    saveSyncMeta(meta);
    return meta;
  }

  saveSyncQueue(queue);
  const prevMeta = loadSyncMeta();
  const meta: SyncStatusSummary = {
    ...prevMeta,
    state: result.syncStatus === 'synced-gas' ? 'synced-gas' : 'saved-server',
    lastSyncedAt: result.timestamp || new Date().toISOString(),
    lastMessage: result.message,
    pendingOrFailedCount: queue.length,
    gasConfigured: result.syncStatus === 'synced-gas',
  };
  saveSyncMeta(meta);
  return meta;
}

export async function retryFailedSyncs(): Promise<SyncStatusSummary> {
  const queue = loadSyncQueue();
  if (queue.length === 0) {
    return loadSyncMeta();
  }

  const remaining: SyncQueueItem[] = [];
  let lastMsg = 'Sinkronisasi ulang selesai.';
  let lastSyncTime = loadSyncMeta().lastSyncedAt;
  let gasConfigured = false;

  for (const item of queue) {
    const res = await sendItemToServer(item);
    if (!res.ok || res.syncStatus === 'gas-error') {
      remaining.push({ ...item, status: 'failed', lastError: res.message });
      lastMsg = res.message;
      if (res.syncStatus === 'gas-error') gasConfigured = true;
    } else {
      lastMsg = res.message;
      lastSyncTime = res.timestamp || new Date().toISOString();
      if (res.syncStatus === 'synced-gas') gasConfigured = true;
    }
  }

  saveSyncQueue(remaining);
  const meta: SyncStatusSummary = {
    state: remaining.length > 0 ? 'failed' : gasConfigured ? 'synced-gas' : 'saved-server',
    lastSyncedAt: lastSyncTime,
    lastMessage: lastMsg,
    pendingOrFailedCount: remaining.length,
    gasConfigured,
  };
  saveSyncMeta(meta);
  return meta;
}

export function buildDiagnostikPayload(rec: AssessmentRecord) {
  const kategori =
    rec.score >= 80 ? 'Siap Penuh' : rec.score >= 60 ? 'Cukup Siap' : 'Perlu Penguatan Prasyarat';
  return {
    jumlahBenar: rec.correctCount,
    jumlahSalah: rec.totalQuestions - rec.correctCount,
    nilai: rec.score,
    kategori,
  };
}

export function buildLkpdPayload(lkpd: LkpdRecord) {
  return {
    nilaiLkpd1: lkpd.lkpd1.completed ? lkpd.lkpd1.score : null,
    nilaiLkpd2: lkpd.lkpd2.completed ? lkpd.lkpd2.score : null,
    nilaiLkpd3: lkpd.lkpd3.completed ? lkpd.lkpd3.score : null,
  };
}

export function buildLatihanPayload(rec: AssessmentRecord) {
  return {
    jumlahSoal: rec.totalQuestions,
    jawabanBenar: rec.correctCount,
    jawabanSalah: rec.totalQuestions - rec.correctCount,
    nilai: rec.score,
  };
}

export function buildSumatifPayload(rec: AssessmentRecord) {
  const elapsedSec =
    rec.remainingSeconds !== undefined ? Math.max(0, 40 * 60 - rec.remainingSeconds) : 0;
  const mins = Math.floor(elapsedSec / 60);
  const secs = elapsedSec % 60;
  return {
    nilaiAkhir: rec.score,
    durasiPengerjaan: `${mins} menit ${secs} detik`,
    jumlahBenar: rec.correctCount,
    jumlahSalah: rec.totalQuestions - rec.correctCount,
    waktuPengumpulan: rec.completedAt || new Date().toISOString(),
  };
}

export function buildRefleksiPayload(ref: ReflectionRecord) {
  const avgRating = (
    (ref.ratings.konsep + ref.ratings.pemodelan + ref.ratings.substitusi + ref.ratings.eliminasi) /
    4
  ).toFixed(1);
  return {
    tingkatPemahaman: `${avgRating} / 5.0`,
    materiDikuasai: ref.materiDipahami || '-',
    materiSulit: ref.materiBelumDipahami || ref.kesulitanSiswa || '-',
    catatanRefleksi: [ref.strategiPemecahan, ref.pengalamanBelajar].filter(Boolean).join(' | ') || '-',
  };
}
