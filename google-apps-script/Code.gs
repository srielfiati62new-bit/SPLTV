/**
 * SPLTV SMART LEARNING — Google Apps Script Backend
 * Integrasi 7 Sheet Google Sheets untuk E-Modul Matematika SMK Kelas X Fase E
 */

const SHARED_SECRET = ''; // Opsional: isi sama dengan GAS_SHARED_SECRET di server jika digunakan

const SHEETS_SCHEMA = {
  PESERTA_DIDIK: {
    name: 'DATA PESERTA DIDIK',
    headers: ['Timestamp', 'ID peserta didik', 'Nama lengkap', 'Kelas', 'Nomor absen'],
  },
  DIAGNOSTIK: {
    name: 'ASESMEN DIAGNOSTIK',
    headers: ['ID peserta didik', 'Nama', 'Kelas', 'Jumlah benar', 'Jumlah salah', 'Nilai', 'Kategori kemampuan awal'],
  },
  LKPD: {
    name: 'HASIL LKPD',
    headers: ['ID peserta didik', 'Nama', 'Kelas', 'Nilai LKPD 1', 'Nilai LKPD 2', 'Nilai LKPD 3', 'Catatan guru'],
  },
  LATIHAN: {
    name: 'HASIL LATIHAN',
    headers: ['ID peserta didik', 'Nama', 'Kelas', 'Jumlah soal', 'Jawaban benar', 'Jawaban salah', 'Nilai'],
  },
  SUMATIF: {
    name: 'ASESMEN SUMATIF',
    headers: ['ID peserta didik', 'Nama', 'Kelas', 'Nilai akhir', 'Durasi pengerjaan', 'Jumlah benar', 'Jumlah salah', 'Waktu pengumpulan'],
  },
  REFLEKSI: {
    name: 'REFLEKSI',
    headers: ['ID peserta didik', 'Nama', 'Kelas', 'Tingkat pemahaman', 'Materi yang dikuasai', 'Materi yang sulit', 'Catatan refleksi'],
  },
  REKAP: {
    name: 'REKAP HASIL BELAJAR',
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
};

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEETS_SCHEMA).forEach(function (key) {
    const def = SHEETS_SCHEMA[key];
    let sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(def.headers);
      sheet.getRange(1, 1, 1, def.headers.length).setFontWeight('bold');
    }
  });
}

function getOrCreateSheet(def) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(def.name);
  if (!sheet) {
    sheet = ss.insertSheet(def.name);
    sheet.appendRow(def.headers);
    sheet.getRange(1, 1, 1, def.headers.length).setFontWeight('bold');
  }
  return sheet;
}

/**
 * Upsert baris berdasarkan ID peserta didik di kolom yang ditentukan (1-indexed),
 * sehingga pengiriman ulang tidak menghasilkan duplikasi baris.
 */
function upsertRowByStudentId(sheet, idColIndex, studentId, rowValues) {
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    const ids = sheet.getRange(2, idColIndex, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === String(studentId).trim()) {
        sheet.getRange(i + 2, 1, 1, rowValues.length).setValues([rowValues]);
        return 'updated';
      }
    }
  }
  sheet.appendRow(rowValues);
  return 'inserted';
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Payload kosong tidak diizinkan.' });
    }

    const body = JSON.parse(e.postData.contents);
    if (SHARED_SECRET && body.secret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: 'Secret tidak valid.' });
    }

    const studentId = String(body.studentId || '').trim();
    const nama = String(body.nama || '').trim();
    const kelas = String(body.kelas || '').trim();
    const activityType = String(body.activityType || '').trim();
    const payload = body.payload || {};

    if (!studentId || !nama || !kelas || !activityType) {
      return jsonResponse({
        ok: false,
        error: 'Identitas peserta didik (studentId, nama, kelas) dan jenis aktivitas wajib diisi.',
      });
    }

    const nowIso = new Date().toISOString();
    let targetSheetName = '';

    if (activityType === 'identitas') {
      const sh = getOrCreateSheet(SHEETS_SCHEMA.PESERTA_DIDIK);
      upsertRowByStudentId(sh, 2, studentId, [
        nowIso,
        studentId,
        nama,
        kelas,
        String(payload.nomorAbsen || ''),
      ]);
      targetSheetName = SHEETS_SCHEMA.PESERTA_DIDIK.name;
    } else if (activityType === 'diagnostik') {
      const sh = getOrCreateSheet(SHEETS_SCHEMA.DIAGNOSTIK);
      upsertRowByStudentId(sh, 1, studentId, [
        studentId,
        nama,
        kelas,
        Number(payload.jumlahBenar || 0),
        Number(payload.jumlahSalah || 0),
        Number(payload.nilai || 0),
        String(payload.kategori || 'Belum Diketahui'),
      ]);
      targetSheetName = SHEETS_SCHEMA.DIAGNOSTIK.name;
    } else if (activityType === 'lkpd' || activityType === 'lkpd-note') {
      const sh = getOrCreateSheet(SHEETS_SCHEMA.LKPD);
      upsertRowByStudentId(sh, 1, studentId, [
        studentId,
        nama,
        kelas,
        payload.nilaiLkpd1 !== null && payload.nilaiLkpd1 !== undefined ? Number(payload.nilaiLkpd1) : '',
        payload.nilaiLkpd2 !== null && payload.nilaiLkpd2 !== undefined ? Number(payload.nilaiLkpd2) : '',
        payload.nilaiLkpd3 !== null && payload.nilaiLkpd3 !== undefined ? Number(payload.nilaiLkpd3) : '',
        String(payload.catatanGuru || ''),
      ]);
      targetSheetName = SHEETS_SCHEMA.LKPD.name;
    } else if (activityType === 'latihan') {
      const sh = getOrCreateSheet(SHEETS_SCHEMA.LATIHAN);
      upsertRowByStudentId(sh, 1, studentId, [
        studentId,
        nama,
        kelas,
        Number(payload.jumlahSoal || 0),
        Number(payload.jawabanBenar || 0),
        Number(payload.jawabanSalah || 0),
        Number(payload.nilai || 0),
      ]);
      targetSheetName = SHEETS_SCHEMA.LATIHAN.name;
    } else if (activityType === 'sumatif') {
      const sh = getOrCreateSheet(SHEETS_SCHEMA.SUMATIF);
      upsertRowByStudentId(sh, 1, studentId, [
        studentId,
        nama,
        kelas,
        Number(payload.nilaiAkhir || 0),
        String(payload.durasiPengerjaan || '-'),
        Number(payload.jumlahBenar || 0),
        Number(payload.jumlahSalah || 0),
        String(payload.waktuPengumpulan || nowIso),
      ]);
      targetSheetName = SHEETS_SCHEMA.SUMATIF.name;
    } else if (activityType === 'refleksi') {
      const sh = getOrCreateSheet(SHEETS_SCHEMA.REFLEKSI);
      upsertRowByStudentId(sh, 1, studentId, [
        studentId,
        nama,
        kelas,
        String(payload.tingkatPemahaman || ''),
        String(payload.materiDikuasai || ''),
        String(payload.materiSulit || ''),
        String(payload.catatanRefleksi || ''),
      ]);
      targetSheetName = SHEETS_SCHEMA.REFLEKSI.name;
    }

    // Perbarui REKAP HASIL BELAJAR jika ringkasan dikirim
    if (body.rekap) {
      const shRekap = getOrCreateSheet(SHEETS_SCHEMA.REKAP);
      const r = body.rekap;
      upsertRowByStudentId(shRekap, 1, studentId, [
        studentId,
        nama,
        kelas,
        r.nilaiDiagnostik !== null && r.nilaiDiagnostik !== undefined ? Number(r.nilaiDiagnostik) : '',
        r.nilaiLkpd1 !== null && r.nilaiLkpd1 !== undefined ? Number(r.nilaiLkpd1) : '',
        r.nilaiLkpd2 !== null && r.nilaiLkpd2 !== undefined ? Number(r.nilaiLkpd2) : '',
        r.nilaiLkpd3 !== null && r.nilaiLkpd3 !== undefined ? Number(r.nilaiLkpd3) : '',
        r.nilaiLatihan !== null && r.nilaiLatihan !== undefined ? Number(r.nilaiLatihan) : '',
        r.nilaiSumatif !== null && r.nilaiSumatif !== undefined ? Number(r.nilaiSumatif) : '',
        Number(r.rataRata || 0),
        Number(r.persentasePenyelesaian || 0),
      ]);
    }

    return jsonResponse({
      ok: true,
      message: 'Data berhasil disimpan ke Google Sheets.',
      studentId: studentId,
      sheet: targetSheetName,
      timestamp: nowIso,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function readSheetRows(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(function (row) {
    const obj = {};
    headers.forEach(function (h, i) {
      obj[h] = row[i];
    });
    return obj;
  });
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    if (SHARED_SECRET && e && e.parameter && e.parameter.secret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: 'Akses ditolak.' });
    }
    if (action === 'ping') {
      return jsonResponse({ ok: true, message: 'Google Apps Script SPLTV Smart Learning aktif.' });
    }
    if (action === 'recap') {
      return jsonResponse({
        ok: true,
        pesertaDidik: readSheetRows(SHEETS_SCHEMA.PESERTA_DIDIK.name),
        diagnostik: readSheetRows(SHEETS_SCHEMA.DIAGNOSTIK.name),
        lkpd: readSheetRows(SHEETS_SCHEMA.LKPD.name),
        latihan: readSheetRows(SHEETS_SCHEMA.LATIHAN.name),
        sumatif: readSheetRows(SHEETS_SCHEMA.SUMATIF.name),
        refleksi: readSheetRows(SHEETS_SCHEMA.REFLEKSI.name),
        rekap: readSheetRows(SHEETS_SCHEMA.REKAP.name),
      });
    }
    return jsonResponse({ ok: false, error: 'Action tidak dikenali.' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}
