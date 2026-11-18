export interface StudentExportRow {
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
  } | null;
  lkpd: {
    nilaiLkpd1: number | null;
    nilaiLkpd2: number | null;
    nilaiLkpd3: number | null;
    catatanGuru: string;
  };
  latihan: {
    jumlahSoal: number;
    jawabanBenar: number;
    jawabanSalah: number;
    nilai: number;
  } | null;
  sumatif: {
    nilaiAkhir: number;
    durasiPengerjaan: string;
    jumlahBenar: number;
    jumlahSalah: number;
    waktuPengumpulan: string;
  } | null;
  persentasePenyelesaian: number;
  rataRata: number;
}

function csvCell(val: unknown): string {
  const s = val === null || val === undefined ? '' : String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadCsvFile(filename: string, headers: string[], rows: unknown[][]) {
  const lines = [
    headers.map(csvCell).join(','),
    ...rows.map((r) => r.map(csvCell).join(',')),
  ];
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRekapCsv(students: StudentExportRow[]) {
  const headers = [
    'ID Peserta Didik',
    'Nama',
    'Kelas',
    'Nomor Absen',
    'Nilai Diagnostik',
    'Nilai LKPD 1',
    'Nilai LKPD 2',
    'Nilai LKPD 3',
    'Nilai Latihan',
    'Nilai Sumatif',
    'Rata-Rata',
    'Persentase Penyelesaian (%)',
  ];
  const rows = students.map((s) => [
    s.studentId,
    s.nama,
    s.kelas,
    s.nomorAbsen,
    s.diagnostik?.nilai ?? '',
    s.lkpd.nilaiLkpd1 ?? '',
    s.lkpd.nilaiLkpd2 ?? '',
    s.lkpd.nilaiLkpd3 ?? '',
    s.latihan?.nilai ?? '',
    s.sumatif?.nilaiAkhir ?? '',
    s.rataRata,
    s.persentasePenyelesaian,
  ]);
  downloadCsvFile('rekap_hasil_belajar_spltv.csv', headers, rows);
}

export function exportAsesmenCsv(students: StudentExportRow[]) {
  const headers = [
    'ID Peserta Didik',
    'Nama',
    'Kelas',
    'Diagnostik Benar',
    'Diagnostik Salah',
    'Nilai Diagnostik',
    'Kategori Kemampuan Awal',
    'Sumatif Benar',
    'Sumatif Salah',
    'Nilai Sumatif',
    'Durasi Sumatif',
    'Waktu Pengumpulan Sumatif',
  ];
  const rows = students.map((s) => [
    s.studentId,
    s.nama,
    s.kelas,
    s.diagnostik?.jumlahBenar ?? '',
    s.diagnostik?.jumlahSalah ?? '',
    s.diagnostik?.nilai ?? '',
    s.diagnostik?.kategori ?? '',
    s.sumatif?.jumlahBenar ?? '',
    s.sumatif?.jumlahSalah ?? '',
    s.sumatif?.nilaiAkhir ?? '',
    s.sumatif?.durasiPengerjaan ?? '',
    s.sumatif?.waktuPengumpulan ?? '',
  ]);
  downloadCsvFile('hasil_asesmen_spltv.csv', headers, rows);
}

export function exportLkpdCsv(students: StudentExportRow[]) {
  const headers = [
    'ID Peserta Didik',
    'Nama',
    'Kelas',
    'Nilai LKPD 1',
    'Nilai LKPD 2',
    'Nilai LKPD 3',
    'Catatan Guru',
  ];
  const rows = students.map((s) => [
    s.studentId,
    s.nama,
    s.kelas,
    s.lkpd.nilaiLkpd1 ?? '',
    s.lkpd.nilaiLkpd2 ?? '',
    s.lkpd.nilaiLkpd3 ?? '',
    s.lkpd.catatanGuru || '',
  ]);
  downloadCsvFile('hasil_lkpd_spltv.csv', headers, rows);
}
