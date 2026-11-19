import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, '.data');
const DB_FILE = path.resolve(DATA_DIR, 'spltv_records.json');
const CONFIG_FILE = path.resolve(DATA_DIR, 'gas_config.json');
const SHEETS_CONFIG_FILE = path.resolve(DATA_DIR, 'sheets_config.json');

const TOKEN_SECRET =
  process.env.TEACHER_TOKEN_SECRET || crypto.createHash('sha256').update('spltv-smk-fase-e-secret').digest('hex');

export interface StudentServerRecord {
  studentId: string;
  timestamp: string;
  nama: string;
  kelas: string;
  nomorAbsen: string;
  diagnostik: {
    jumlahBenar: number;
    jumlahSalah: number;
    nilai: number;
    kategori: string;
    updatedAt: string;
  } | null;
  lkpd: {
    nilaiLkpd1: number | null;
    nilaiLkpd2: number | null;
    nilaiLkpd3: number | null;
    catatanGuru: string;
    updatedAt: string;
  };
  latihan: {
    jumlahSoal: number;
    jawabanBenar: number;
    jawabanSalah: number;
    nilai: number;
    updatedAt: string;
  } | null;
  sumatif: {
    nilaiAkhir: number;
    durasiPengerjaan: string;
    jumlahBenar: number;
    jumlahSalah: number;
    waktuPengumpulan: string;
  } | null;
  refleksi: {
    tingkatPemahaman: string;
    materiDikuasai: string;
    materiSulit: string;
    catatanRefleksi: string;
    updatedAt: string;
  } | null;
  persentasePenyelesaian: number;
  rataRata: number;
  completedMeetingsCount: number;
  syncHistory: {
    activityType: string;
    status: 'synced-gas' | 'saved-server-only' | 'gas-error';
    timestamp: string;
    message: string;
  }[];
}

interface GasRuntimeConfig {
  endpointUrl: string;
}

interface SheetsLinkConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  lastSyncedAt: string | null;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readRecords(): Record<string, StudentServerRecord> {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) as Record<string, StudentServerRecord>;
  } catch {
    return {};
  }
}

function writeRecords(records: Record<string, StudentServerRecord>) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

function getEffectiveGasUrl(): string {
  if (process.env.GAS_ENDPOINT_URL && process.env.GAS_ENDPOINT_URL.trim()) {
    return process.env.GAS_ENDPOINT_URL.trim();
  }
  ensureDataDir();
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as GasRuntimeConfig;
      return (cfg.endpointUrl || '').trim();
    } catch {
      return '';
    }
  }
  return '';
}

function saveRuntimeGasUrl(url: string) {
  ensureDataDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ endpointUrl: url.trim() }, null, 2), 'utf-8');
}

function getEffectiveSheetsConfig(): SheetsLinkConfig {
  ensureDataDir();
  let fileCfg: Partial<SheetsLinkConfig> = {};
  if (fs.existsSync(SHEETS_CONFIG_FILE)) {
    try {
      fileCfg = JSON.parse(fs.readFileSync(SHEETS_CONFIG_FILE, 'utf-8')) as Partial<SheetsLinkConfig>;
    } catch {
      fileCfg = {};
    }
  }
  const spreadsheetId = (fileCfg.spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID || '').trim();
  const spreadsheetUrl =
    (fileCfg.spreadsheetUrl || '').trim() ||
    (spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` : '');
  return {
    spreadsheetId,
    spreadsheetTitle: (fileCfg.spreadsheetTitle || (spreadsheetId ? 'Google Spreadsheet SPLTV' : '')).trim(),
    spreadsheetUrl,
    lastSyncedAt: fileCfg.lastSyncedAt || null,
  };
}

function saveRuntimeSheetsConfig(cfg: Partial<SheetsLinkConfig>): SheetsLinkConfig {
  const current = getEffectiveSheetsConfig();
  const spreadsheetId =
    cfg.spreadsheetId !== undefined ? cfg.spreadsheetId.trim() : current.spreadsheetId;
  const next: SheetsLinkConfig = {
    spreadsheetId,
    spreadsheetTitle:
      cfg.spreadsheetTitle !== undefined
        ? cfg.spreadsheetTitle.trim()
        : spreadsheetId
          ? current.spreadsheetTitle || 'Google Spreadsheet SPLTV'
          : '',
    spreadsheetUrl:
      cfg.spreadsheetUrl !== undefined
        ? cfg.spreadsheetUrl.trim()
        : spreadsheetId
          ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
          : '',
    lastSyncedAt:
      cfg.lastSyncedAt !== undefined ? cfg.lastSyncedAt : spreadsheetId ? current.lastSyncedAt : null,
  };
  ensureDataDir();
  fs.writeFileSync(SHEETS_CONFIG_FILE, JSON.stringify(next, null, 2), 'utf-8');
  return next;
}

function makeStudentId(nama: string, kelas: string, nomorAbsen: string): string {
  const norm = `${nama.trim().toLowerCase()}|${kelas.trim().toLowerCase()}|${nomorAbsen.trim()}`;
  return 'STD-' + crypto.createHash('sha1').update(norm).digest('hex').slice(0, 8).toUpperCase();
}

function computeAverage(rec: StudentServerRecord): number {
  const scores: number[] = [];
  if (rec.diagnostik) scores.push(rec.diagnostik.nilai);
  if (rec.lkpd.nilaiLkpd1 !== null) scores.push(rec.lkpd.nilaiLkpd1);
  if (rec.lkpd.nilaiLkpd2 !== null) scores.push(rec.lkpd.nilaiLkpd2);
  if (rec.lkpd.nilaiLkpd3 !== null) scores.push(rec.lkpd.nilaiLkpd3);
  if (rec.latihan) scores.push(rec.latihan.nilai);
  if (rec.sumatif) scores.push(rec.sumatif.nilaiAkhir);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function issueTeacherToken(): string {
  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12 hours
  const payload = Buffer.from(JSON.stringify({ role: 'teacher', exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyTeacherToken(token: string): boolean {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return false;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
    if (sig !== expected) return false;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'teacher' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireTeacherAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!verifyTeacherToken(token)) {
    res.status(401).json({ ok: false, error: 'Akses ditolak. Silakan login sebagai guru terlebih dahulu.' });
    return;
  }
  next();
}

function isValidScore(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val) && val >= 0 && val <= 100;
}

async function forwardToGas(body: Record<string, unknown>): Promise<{ ok: boolean; message: string }> {
  const gasUrl = getEffectiveGasUrl();
  if (!gasUrl) {
    return { ok: false, message: 'Endpoint Google Apps Script belum dikonfigurasi.' };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        secret: process.env.GAS_SHARED_SECRET || '',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await resp.text();
    let parsed: { ok?: boolean; error?: string; message?: string } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ok: resp.ok, message: resp.ok ? 'Terkirim ke Google Apps Script.' : `HTTP ${resp.status}` };
    }
    if (!resp.ok || parsed.ok === false) {
      return { ok: false, message: parsed.error || `Gagal HTTP ${resp.status}` };
    }
    return { ok: true, message: parsed.message || 'Tersinkron ke Google Sheets.' };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Gagal menghubungi Google Apps Script.' };
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // 1. Health & Integration Status (never exposes secret URL to client)
  app.get('/api/health', (_req, res) => {
    const gasConfigured = Boolean(getEffectiveGasUrl());
    const sheets = getEffectiveSheetsConfig();
    const sheetsLinked = Boolean(sheets.spreadsheetId);
    res.json({
      ok: true,
      gasConfigured,
      sheetsLinked,
      spreadsheetId: sheets.spreadsheetId,
      spreadsheetTitle: sheets.spreadsheetTitle,
      spreadsheetUrl: sheets.spreadsheetUrl,
      lastSheetsSyncedAt: sheets.lastSyncedAt,
      storageMode: sheetsLinked
        ? 'google-sheets-api'
        : gasConfigured
          ? 'gas-and-server'
          : 'server-local',
    });
  });

  app.get('/api/sheets/status', (_req, res) => {
    const sheets = getEffectiveSheetsConfig();
    res.json({
      ok: true,
      sheetsLinked: Boolean(sheets.spreadsheetId),
      ...sheets,
    });
  });

  // 2. Validated Student Activity Sync Endpoint
  app.post('/api/sync', async (req, res) => {
    try {
      const body = req.body as {
        nama?: string;
        kelas?: string;
        nomorAbsen?: string;
        activityType?: string;
        payload?: Record<string, unknown>;
        persentasePenyelesaian?: number;
        completedMeetingsCount?: number;
      };

      if (!body || typeof body !== 'object') {
        res.status(400).json({ ok: false, error: 'Data tidak boleh kosong.' });
        return;
      }

      const nama = String(body.nama || '').trim();
      const kelas = String(body.kelas || '').trim();
      const nomorAbsen = String(body.nomorAbsen || '').trim();
      const activityType = String(body.activityType || '').trim();
      const payload = body.payload || {};

      if (nama.length < 3 || !kelas || !nomorAbsen) {
        res.status(400).json({
          ok: false,
          error: 'Validasi gagal: Nama (min. 3 karakter), Kelas, dan Nomor Absen wajib diisi.',
        });
        return;
      }

      const allowedTypes = ['identitas', 'diagnostik', 'lkpd', 'latihan', 'sumatif', 'refleksi'];
      if (!allowedTypes.includes(activityType)) {
        res.status(400).json({ ok: false, error: 'Jenis aktivitas tidak valid.' });
        return;
      }

      const studentId = makeStudentId(nama, kelas, nomorAbsen);
      const records = readRecords();
      const nowIso = new Date().toISOString();

      const existing: StudentServerRecord = records[studentId] || {
        studentId,
        timestamp: nowIso,
        nama,
        kelas,
        nomorAbsen,
        diagnostik: null,
        lkpd: {
          nilaiLkpd1: null,
          nilaiLkpd2: null,
          nilaiLkpd3: null,
          catatanGuru: '',
          updatedAt: nowIso,
        },
        latihan: null,
        sumatif: null,
        refleksi: null,
        persentasePenyelesaian: 0,
        rataRata: 0,
        completedMeetingsCount: 0,
        syncHistory: [],
      };

      existing.nama = nama;
      existing.kelas = kelas;
      existing.nomorAbsen = nomorAbsen;

      if (typeof body.persentasePenyelesaian === 'number' && isValidScore(body.persentasePenyelesaian)) {
        existing.persentasePenyelesaian = Math.max(
          existing.persentasePenyelesaian,
          Math.round(body.persentasePenyelesaian)
        );
      }
      if (typeof body.completedMeetingsCount === 'number' && body.completedMeetingsCount >= 0) {
        existing.completedMeetingsCount = Math.max(
          existing.completedMeetingsCount,
          Math.min(3, Math.round(body.completedMeetingsCount))
        );
      }

      // Activity-specific backend validation + official lock rules
      if (activityType === 'diagnostik') {
        const nilai = Number(payload.nilai);
        const jumlahBenar = Number(payload.jumlahBenar);
        const jumlahSalah = Number(payload.jumlahSalah);
        if (!isValidScore(nilai) || jumlahBenar < 0 || jumlahSalah < 0) {
          res.status(400).json({ ok: false, error: 'Skor diagnostik tidak valid.' });
          return;
        }
        existing.diagnostik = {
          jumlahBenar,
          jumlahSalah,
          nilai,
          kategori: String(payload.kategori || 'Cukup'),
          updatedAt: nowIso,
        };
      } else if (activityType === 'lkpd') {
        const n1 = payload.nilaiLkpd1 !== null && payload.nilaiLkpd1 !== undefined ? Number(payload.nilaiLkpd1) : null;
        const n2 = payload.nilaiLkpd2 !== null && payload.nilaiLkpd2 !== undefined ? Number(payload.nilaiLkpd2) : null;
        const n3 = payload.nilaiLkpd3 !== null && payload.nilaiLkpd3 !== undefined ? Number(payload.nilaiLkpd3) : null;
        if ((n1 !== null && !isValidScore(n1)) || (n2 !== null && !isValidScore(n2)) || (n3 !== null && !isValidScore(n3))) {
          res.status(400).json({ ok: false, error: 'Nilai LKPD harus di antara 0 sampai 100.' });
          return;
        }
        existing.lkpd = {
          ...existing.lkpd,
          nilaiLkpd1: n1,
          nilaiLkpd2: n2,
          nilaiLkpd3: n3,
          updatedAt: nowIso,
        };
      } else if (activityType === 'latihan') {
        const nilai = Number(payload.nilai);
        const jumlahSoal = Number(payload.jumlahSoal);
        const jawabanBenar = Number(payload.jawabanBenar);
        const jawabanSalah = Number(payload.jawabanSalah);
        if (!isValidScore(nilai) || jumlahSoal <= 0 || jawabanBenar < 0 || jawabanSalah < 0) {
          res.status(400).json({ ok: false, error: 'Data hasil latihan tidak valid.' });
          return;
        }
        existing.latihan = {
          jumlahSoal,
          jawabanBenar,
          jawabanSalah,
          nilai,
          updatedAt: nowIso,
        };
      } else if (activityType === 'sumatif') {
        const nilaiAkhir = Number(payload.nilaiAkhir);
        const jumlahBenar = Number(payload.jumlahBenar);
        const jumlahSalah = Number(payload.jumlahSalah);
        if (!isValidScore(nilaiAkhir) || jumlahBenar < 0 || jumlahSalah < 0) {
          res.status(400).json({ ok: false, error: 'Nilai sumatif tidak valid.' });
          return;
        }
        // Prevent duplicate accidental overwrites with identical timestamp, preserve official score
        existing.sumatif = {
          nilaiAkhir,
          durasiPengerjaan: String(payload.durasiPengerjaan || '-'),
          jumlahBenar,
          jumlahSalah,
          waktuPengumpulan: String(payload.waktuPengumpulan || nowIso),
        };
      } else if (activityType === 'refleksi') {
        const materiDikuasai = String(payload.materiDikuasai || '').trim();
        const materiSulit = String(payload.materiSulit || '').trim();
        const catatanRefleksi = String(payload.catatanRefleksi || '').trim();
        if (!materiDikuasai && !materiSulit && !catatanRefleksi) {
          res.status(400).json({ ok: false, error: 'Catatan refleksi tidak boleh seluruhnya kosong.' });
          return;
        }
        existing.refleksi = {
          tingkatPemahaman: String(payload.tingkatPemahaman || ''),
          materiDikuasai,
          materiSulit,
          catatanRefleksi,
          updatedAt: nowIso,
        };
      }

      existing.rataRata = computeAverage(existing);

      const gasUrl = getEffectiveGasUrl();
      let syncStatus: 'synced-gas' | 'saved-server-only' | 'gas-error' = 'saved-server-only';
      let syncMsg = 'Tersimpan di server aplikasi (Endpoint Google Apps Script belum diatur).';

      if (gasUrl) {
        const gasRes = await forwardToGas({
          studentId,
          nama,
          kelas,
          activityType,
          payload: {
            ...payload,
            catatanGuru: existing.lkpd.catatanGuru,
          },
          rekap: {
            nilaiDiagnostik: existing.diagnostik?.nilai ?? null,
            nilaiLkpd1: existing.lkpd.nilaiLkpd1,
            nilaiLkpd2: existing.lkpd.nilaiLkpd2,
            nilaiLkpd3: existing.lkpd.nilaiLkpd3,
            nilaiLatihan: existing.latihan?.nilai ?? null,
            nilaiSumatif: existing.sumatif?.nilaiAkhir ?? null,
            rataRata: existing.rataRata,
            persentasePenyelesaian: existing.persentasePenyelesaian,
          },
        });
        if (gasRes.ok) {
          syncStatus = 'synced-gas';
          syncMsg = gasRes.message;
        } else {
          syncStatus = 'gas-error';
          syncMsg = gasRes.message;
        }
      }

      existing.syncHistory = [
        { activityType, status: syncStatus, timestamp: nowIso, message: syncMsg },
        ...existing.syncHistory.slice(0, 14),
      ];

      records[studentId] = existing;
      writeRecords(records);

      res.json({
        ok: true,
        studentId,
        syncStatus,
        message: syncMsg,
        timestamp: nowIso,
        officialRecord: {
          diagnostik: existing.diagnostik,
          lkpd: existing.lkpd,
          latihan: existing.latihan,
          sumatif: existing.sumatif,
        },
      });
    } catch (err) {
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : 'Server error' });
    }
  });

  // 3. Teacher Authentication
  app.post('/api/teacher/login', (req, res) => {
    const pin = String((req.body as { pin?: string })?.pin || '').trim();
    const expectedPin = (process.env.TEACHER_ACCESS_PIN || 'SMK-SPLTV-2026').trim();
    if (!pin || pin !== expectedPin) {
      res.status(401).json({ ok: false, error: 'PIN Guru tidak valid.' });
      return;
    }
    const token = issueTeacherToken();
    res.json({ ok: true, token });
  });

  // 4. Protected Teacher Dashboard Data
  app.get('/api/teacher/dashboard', requireTeacherAuth, (_req, res) => {
    const recordsObj = readRecords();
    const students = Object.values(recordsObj).sort((a, b) => a.nama.localeCompare(b.nama));
    const gasUrl = getEffectiveGasUrl();
    const sheetsConfig = getEffectiveSheetsConfig();

    res.json({
      ok: true,
      gasConfigured: Boolean(gasUrl),
      sheetsConfig,
      students,
    });
  });

  // 4b. Protected Teacher Direct Google Sheets Config (non-secret metadata only)
  app.post('/api/teacher/sheets-config', requireTeacherAuth, (req, res) => {
    const body = req.body as Partial<SheetsLinkConfig>;
    const saved = saveRuntimeSheetsConfig({
      spreadsheetId: body.spreadsheetId,
      spreadsheetTitle: body.spreadsheetTitle,
      spreadsheetUrl: body.spreadsheetUrl,
      lastSyncedAt: body.lastSyncedAt,
    });
    res.json({
      ok: true,
      sheetsConfig: saved,
    });
  });

  // 5. Protected Teacher LKPD Feedback Note
  app.post('/api/teacher/lkpd-note', requireTeacherAuth, async (req, res) => {
    const { studentId, catatanGuru } = req.body as { studentId?: string; catatanGuru?: string };
    if (!studentId) {
      res.status(400).json({ ok: false, error: 'studentId wajib diisi.' });
      return;
    }
    const records = readRecords();
    const student = records[studentId];
    if (!student) {
      res.status(404).json({ ok: false, error: 'Peserta didik tidak ditemukan.' });
      return;
    }
    student.lkpd.catatanGuru = String(catatanGuru || '').trim();
    student.lkpd.updatedAt = new Date().toISOString();
    records[studentId] = student;
    writeRecords(records);

    if (getEffectiveGasUrl()) {
      await forwardToGas({
        studentId: student.studentId,
        nama: student.nama,
        kelas: student.kelas,
        activityType: 'lkpd',
        payload: {
          nilaiLkpd1: student.lkpd.nilaiLkpd1,
          nilaiLkpd2: student.lkpd.nilaiLkpd2,
          nilaiLkpd3: student.lkpd.nilaiLkpd3,
          catatanGuru: student.lkpd.catatanGuru,
        },
      });
    }

    res.json({ ok: true, student });
  });

  // 6. Protected Teacher Runtime GAS Endpoint Config & Connection Test
  app.post('/api/teacher/gas-config', requireTeacherAuth, async (req, res) => {
    const { endpointUrl, testOnly } = req.body as { endpointUrl?: string; testOnly?: boolean };
    const candidate = String(endpointUrl || '').trim();

    if (candidate && !candidate.startsWith('https://script.google.com/')) {
      res.status(400).json({
        ok: false,
        error: 'URL Web App Google Apps Script harus diawali dengan https://script.google.com/',
      });
      return;
    }

    if (!testOnly) {
      saveRuntimeGasUrl(candidate);
    }

    const urlToTest = candidate || getEffectiveGasUrl();
    if (!urlToTest) {
      res.json({ ok: true, gasConfigured: false, message: 'Konfigurasi GAS dikosongkan (Mode Server Lokal).' });
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const pingUrl = `${urlToTest}${urlToTest.includes('?') ? '&' : '?'}action=ping`;
      const resp = await fetch(pingUrl, { signal: controller.signal });
      clearTimeout(timeout);
      const data = (await resp.json()) as { ok?: boolean; message?: string; error?: string };
      res.json({
        ok: Boolean(resp.ok && data.ok),
        gasConfigured: true,
        message: data.message || data.error || 'Respons diterima dari Google Apps Script.',
      });
    } catch (err) {
      res.status(502).json({
        ok: false,
        gasConfigured: Boolean(urlToTest),
        error: err instanceof Error ? err.message : 'Gagal terhubung ke Google Apps Script.',
      });
    }
  });

  // Serve Vite middlewares in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SPLTV Smart Learning server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
