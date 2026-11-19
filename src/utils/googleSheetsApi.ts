import { StudentExportRow } from './csvExport';

export interface SheetSyncStudentRecord extends StudentExportRow {
  refleksi?: {
    tingkatPemahaman: string;
    materiDikuasai: string;
    materiSulit: string;
    catatanRefleksi: string;
    updatedAt?: string;
  } | null;
}

export interface SheetTabSchema {
  key: 'pesertaDidik' | 'diagnostik' | 'lkpd' | 'latihan' | 'sumatif' | 'refleksi' | 'rekap';
  name: string;
  idColIndex: number; // 0-indexed column holding ID peserta didik
  headers: string[];
}

export const SHEETS_SCHEMA: SheetTabSchema[] = [
  {
    key: 'pesertaDidik',
    name: 'DATA PESERTA DIDIK',
    idColIndex: 1,
    headers: ['Timestamp', 'ID peserta didik', 'Nama lengkap', 'Kelas', 'Nomor absen'],
  },
  {
    key: 'diagnostik',
    name: 'ASESMEN DIAGNOSTIK',
    idColIndex: 0,
    headers: [
      'ID peserta didik',
      'Nama',
      'Kelas',
      'Jumlah benar',
      'Jumlah salah',
      'Nilai',
      'Kategori kemampuan awal',
    ],
  },
  {
    key: 'lkpd',
    name: 'HASIL LKPD',
    idColIndex: 0,
    headers: [
      'ID peserta didik',
      'Nama',
      'Kelas',
      'Nilai LKPD 1',
      'Nilai LKPD 2',
      'Nilai LKPD 3',
      'Catatan guru',
    ],
  },
  {
    key: 'latihan',
    name: 'HASIL LATIHAN',
    idColIndex: 0,
    headers: [
      'ID peserta didik',
      'Nama',
      'Kelas',
      'Jumlah soal',
      'Jawaban benar',
      'Jawaban salah',
      'Nilai',
    ],
  },
  {
    key: 'sumatif',
    name: 'ASESMEN SUMATIF',
    idColIndex: 0,
    headers: [
      'ID peserta didik',
      'Nama',
      'Kelas',
      'Nilai akhir',
      'Durasi pengerjaan',
      'Jumlah benar',
      'Jumlah salah',
      'Waktu pengumpulan',
    ],
  },
  {
    key: 'refleksi',
    name: 'REFLEKSI',
    idColIndex: 0,
    headers: [
      'ID peserta didik',
      'Nama',
      'Kelas',
      'Tingkat pemahaman',
      'Materi yang dikuasai',
      'Materi yang sulit',
      'Catatan refleksi',
    ],
  },
  {
    key: 'rekap',
    name: 'REKAP HASIL BELAJAR',
    idColIndex: 0,
    headers: [
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

export interface SpreadsheetMetadataInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  existingTabs: string[];
  missingTabs: string[];
}

export interface SheetSyncResult {
  syncedAt: string;
  updatedStudents: number;
  sheetRowCounts: Record<string, number>;
}

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export function extractSpreadsheetId(rawInput: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  return trimmed;
}

async function sheetsFetch<T>(url: string, accessToken: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  const text = await resp.text();
  let data: unknown = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Respons tidak valid dari Google Sheets (HTTP ${resp.status}).`);
  }
  if (!resp.ok) {
    const errObj = data as { error?: { message?: string; status?: string } };
    if (resp.status === 401) {
      throw new Error('Sesi Google berakhir. Silakan Sign in with Google kembali.');
    }
    if (resp.status === 403) {
      throw new Error(
        errObj.error?.message ||
          'Akses ke Google Sheets ditolak. Pastikan akun Google memiliki izin edit pada spreadsheet ini.'
      );
    }
    throw new Error(errObj.error?.message || `Gagal mengakses Google Sheets (HTTP ${resp.status}).`);
  }
  return data as T;
}

export async function getSpreadsheetMetadata(
  spreadsheetId: string,
  accessToken: string
): Promise<SpreadsheetMetadataInfo> {
  const url = `${SHEETS_API_BASE}/${encodeURIComponent(
    spreadsheetId
  )}?fields=spreadsheetId,spreadsheetUrl,properties.title,sheets.properties(sheetId,title)`;

  const data = await sheetsFetch<{
    spreadsheetId: string;
    spreadsheetUrl: string;
    properties?: { title?: string };
    sheets?: { properties?: { title?: string } }[];
  }>(url, accessToken);

  const existingTabs = (data.sheets || [])
    .map((s) => s.properties?.title || '')
    .filter(Boolean);
  const missingTabs = SHEETS_SCHEMA.map((s) => s.name).filter(
    (name) => !existingTabs.includes(name)
  );

  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl:
      data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    title: data.properties?.title || 'Google Spreadsheet',
    existingTabs,
    missingTabs,
  };
}

export async function createSpltvSpreadsheet(
  title: string,
  accessToken: string
): Promise<SpreadsheetMetadataInfo> {
  const created = await sheetsFetch<{
    spreadsheetId: string;
    spreadsheetUrl: string;
    properties?: { title?: string };
    sheets?: { properties?: { sheetId?: number; title?: string } }[];
  }>(SHEETS_API_BASE, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      properties: { title: title.trim() || 'SPLTV Smart Learning - Rekap Kelas SMK' },
      sheets: SHEETS_SCHEMA.map((s) => ({
        properties: {
          title: s.name,
          gridProperties: { frozenRowCount: 1 },
        },
      })),
    }),
  });

  // Write headers to all 7 sheets
  await sheetsFetch(
    `${SHEETS_API_BASE}/${encodeURIComponent(created.spreadsheetId)}/values:batchUpdate`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: SHEETS_SCHEMA.map((s) => ({
          range: `'${s.name}'!A1`,
          values: [s.headers],
        })),
      }),
    }
  );

  // Format header rows bold with light blue background
  const formatRequests = (created.sheets || [])
    .map((sh) => sh.properties?.sheetId)
    .filter((id): id is number => typeof id === 'number')
    .map((sheetId) => ({
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.043, green: 0.122, blue: 0.247 },
            textFormat: {
              bold: true,
              foregroundColor: { red: 1, green: 1, blue: 1 },
            },
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)',
      },
    }));

  if (formatRequests.length > 0) {
    await sheetsFetch(
      `${SHEETS_API_BASE}/${encodeURIComponent(created.spreadsheetId)}:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({ requests: formatRequests }),
      }
    );
  }

  return {
    spreadsheetId: created.spreadsheetId,
    spreadsheetUrl:
      created.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${created.spreadsheetId}/edit`,
    title: created.properties?.title || title,
    existingTabs: SHEETS_SCHEMA.map((s) => s.name),
    missingTabs: [],
  };
}

export async function ensureRequiredSheets(
  spreadsheetId: string,
  accessToken: string
): Promise<SpreadsheetMetadataInfo> {
  const meta = await getSpreadsheetMetadata(spreadsheetId, accessToken);
  if (meta.missingTabs.length > 0) {
    await sheetsFetch(
      `${SHEETS_API_BASE}/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: meta.missingTabs.map((tabName) => ({
            addSheet: {
              properties: {
                title: tabName,
                gridProperties: { frozenRowCount: 1 },
              },
            },
          })),
        }),
      }
    );

    const addedSchemas = SHEETS_SCHEMA.filter((s) => meta.missingTabs.includes(s.name));
    await sheetsFetch(
      `${SHEETS_API_BASE}/${encodeURIComponent(spreadsheetId)}/values:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: addedSchemas.map((s) => ({
            range: `'${s.name}'!A1`,
            values: [s.headers],
          })),
        }),
      }
    );
  }
  return getSpreadsheetMetadata(spreadsheetId, accessToken);
}

function buildRowsForTab(
  tabKey: SheetTabSchema['key'],
  students: SheetSyncStudentRecord[]
): (string | number)[][] {
  const rows: (string | number)[][] = [];
  for (const s of students) {
    if (tabKey === 'pesertaDidik') {
      rows.push([s.timestamp || new Date().toISOString(), s.studentId, s.nama, s.kelas, s.nomorAbsen]);
    } else if (tabKey === 'diagnostik' && s.diagnostik) {
      rows.push([
        s.studentId,
        s.nama,
        s.kelas,
        s.diagnostik.jumlahBenar,
        s.diagnostik.jumlahSalah,
        s.diagnostik.nilai,
        s.diagnostik.kategori,
      ]);
    } else if (
      tabKey === 'lkpd' &&
      (s.lkpd.nilaiLkpd1 !== null ||
        s.lkpd.nilaiLkpd2 !== null ||
        s.lkpd.nilaiLkpd3 !== null ||
        Boolean(s.lkpd.catatanGuru))
    ) {
      rows.push([
        s.studentId,
        s.nama,
        s.kelas,
        s.lkpd.nilaiLkpd1 ?? '',
        s.lkpd.nilaiLkpd2 ?? '',
        s.lkpd.nilaiLkpd3 ?? '',
        s.lkpd.catatanGuru || '',
      ]);
    } else if (tabKey === 'latihan' && s.latihan) {
      rows.push([
        s.studentId,
        s.nama,
        s.kelas,
        s.latihan.jumlahSoal,
        s.latihan.jawabanBenar,
        s.latihan.jawabanSalah,
        s.latihan.nilai,
      ]);
    } else if (tabKey === 'sumatif' && s.sumatif) {
      rows.push([
        s.studentId,
        s.nama,
        s.kelas,
        s.sumatif.nilaiAkhir,
        s.sumatif.durasiPengerjaan,
        s.sumatif.jumlahBenar,
        s.sumatif.jumlahSalah,
        s.sumatif.waktuPengumpulan,
      ]);
    } else if (tabKey === 'refleksi' && s.refleksi) {
      rows.push([
        s.studentId,
        s.nama,
        s.kelas,
        s.refleksi.tingkatPemahaman || '',
        s.refleksi.materiDikuasai || '',
        s.refleksi.materiSulit || '',
        s.refleksi.catatanRefleksi || '',
      ]);
    } else if (tabKey === 'rekap') {
      rows.push([
        s.studentId,
        s.nama,
        s.kelas,
        s.diagnostik?.nilai ?? '',
        s.lkpd.nilaiLkpd1 ?? '',
        s.lkpd.nilaiLkpd2 ?? '',
        s.lkpd.nilaiLkpd3 ?? '',
        s.latihan?.nilai ?? '',
        s.sumatif?.nilaiAkhir ?? '',
        s.rataRata,
        s.persentasePenyelesaian,
      ]);
    }
  }
  return rows;
}

function mergeRowsByStudentId(
  headers: string[],
  idColIndex: number,
  existingValues: string[][] | undefined,
  incomingRows: (string | number)[][]
): (string | number)[][] {
  const existingDataRows =
    existingValues && existingValues.length > 1 ? existingValues.slice(1) : [];

  const orderedIds: string[] = [];
  const rowMap = new Map<string, (string | number)[]>();

  for (const rawRow of existingDataRows) {
    const id = String(rawRow[idColIndex] || '').trim();
    if (!id) continue;
    const padded = headers.map((_, idx) => rawRow[idx] ?? '');
    if (!rowMap.has(id)) orderedIds.push(id);
    rowMap.set(id, padded);
  }

  for (const row of incomingRows) {
    const id = String(row[idColIndex] || '').trim();
    if (!id) continue;
    if (!rowMap.has(id)) orderedIds.push(id);
    rowMap.set(id, row);
  }

  return [headers, ...orderedIds.map((id) => rowMap.get(id)!)];
}

export async function syncStudentsToGoogleSheets(
  spreadsheetId: string,
  students: SheetSyncStudentRecord[],
  accessToken: string
): Promise<SheetSyncResult> {
  // Ensure all 7 sheets exist before reading/writing
  await ensureRequiredSheets(spreadsheetId, accessToken);

  // Batch read current values from all 7 sheets to perform deduplicated upsert
  const rangeParams = SHEETS_SCHEMA.map(
    (s) => `ranges=${encodeURIComponent(`'${s.name}'!A1:K1000`)}`
  ).join('&');

  const existingBatch = await sheetsFetch<{
    valueRanges?: { range?: string; values?: string[][] }[];
  }>(`${SHEETS_API_BASE}/${encodeURIComponent(spreadsheetId)}/values:batchGet?${rangeParams}`, accessToken);

  const valueRanges = existingBatch.valueRanges || [];
  const batchUpdates: { range: string; values: (string | number)[][] }[] = [];
  const sheetRowCounts: Record<string, number> = {};

  SHEETS_SCHEMA.forEach((schema, idx) => {
    const existingVals = valueRanges[idx]?.values;
    const incomingRows = buildRowsForTab(schema.key, students);
    const merged = mergeRowsByStudentId(schema.headers, schema.idColIndex, existingVals, incomingRows);
    batchUpdates.push({
      range: `'${schema.name}'!A1`,
      values: merged,
    });
    sheetRowCounts[schema.name] = Math.max(0, merged.length - 1);
  });

  await sheetsFetch(
    `${SHEETS_API_BASE}/${encodeURIComponent(spreadsheetId)}/values:batchUpdate`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: batchUpdates,
      }),
    }
  );

  return {
    syncedAt: new Date().toISOString(),
    updatedStudents: students.length,
    sheetRowCounts,
  };
}

export async function fetchSheetRowCounts(
  spreadsheetId: string,
  accessToken: string
): Promise<{ meta: SpreadsheetMetadataInfo; rowCounts: Record<string, number> }> {
  const meta = await getSpreadsheetMetadata(spreadsheetId, accessToken);
  const presentSchemas = SHEETS_SCHEMA.filter((s) => meta.existingTabs.includes(s.name));
  const rowCounts: Record<string, number> = {};

  if (presentSchemas.length > 0) {
    const rangeParams = presentSchemas
      .map((s) => `ranges=${encodeURIComponent(`'${s.name}'!A1:K1000`)}`)
      .join('&');
    const resp = await sheetsFetch<{ valueRanges?: { values?: string[][] }[] }>(
      `${SHEETS_API_BASE}/${encodeURIComponent(spreadsheetId)}/values:batchGet?${rangeParams}`,
      accessToken
    );
    presentSchemas.forEach((schema, idx) => {
      const vals = resp.valueRanges?.[idx]?.values || [];
      rowCounts[schema.name] = Math.max(0, vals.length - 1);
    });
  }

  return { meta, rowCounts };
}
