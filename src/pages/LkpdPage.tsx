import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, FileSpreadsheet, HelpCircle } from 'lucide-react';
import { MathBlock, MathText } from '../components/MathText';
import { SmartTutorPanel, TutorScaffolding } from '../components/SmartTutorPanel';
import { LkpdRecord, MenuId, SingleLkpdData, StudentIdentity } from '../types/module';

interface LkpdPageProps {
  identity: StudentIdentity;
  lkpd: LkpdRecord;
  onSaveLkpd: (record: LkpdRecord) => void;
  onNavigate: (menu: MenuId) => void;
}

interface LkpdConfig {
  key: 'lkpd1' | 'lkpd2' | 'lkpd3';
  numberLabel: string;
  title: string;
  subtitle: string;
  stimulus: string;
  diketahui: string[];
  pertanyaan: string;
  expectedModels: [string, string, string];
  expectedSolution: [string, string, string];
  modelPlaceholders: [string, string, string];
  tutor: TutorScaffolding;
}

const LKPD_CONFIGS: LkpdConfig[] = [
  {
    key: 'lkpd1',
    numberLabel: 'LKPD 1',
    title: 'Definisi, Konsep, dan Pemodelan SPLTV',
    subtitle: 'Menentukan variabel, koefisien, konstanta, dan model matematika kasus pembelian kain SMK',
    stimulus:
      'Unit Produksi Tata Busana SMK memesan tiga jenis kain (katun, satin, linen) dalam ribuan rupiah per meter. Nota A: 2 m katun, 3 m satin, 1 m linen seharga Rp285.000. Nota B: 4 m katun, 1 m satin, 2 m linen seharga Rp320.000. Nota C: 1 m katun, 2 m satin, 3 m linen seharga Rp330.000.',
    diketahui: [
      'Nota A: 2 katun + 3 satin + 1 linen = 285 (ribu rupiah)',
      'Nota B: 4 katun + 1 satin + 2 linen = 320 (ribu rupiah)',
      'Nota C: 1 katun + 2 satin + 3 linen = 330 (ribu rupiah)',
    ],
    pertanyaan:
      'Susunlah identifikasi variabel, model matematika SPLTV dalam ribuan rupiah, dan ujilah apakah $(x, y, z) = (35, 50, 65)$ memenuhi ketiga persamaan tersebut!',
    expectedModels: ['2x+3y+z=285', '4x+y+2z=320', 'x+2y+3z=330'],
    expectedSolution: ['35', '50', '65'],
    modelPlaceholders: ['Misal: 2x + 3y + z = 285', 'Misal: 4x + y + 2z = 320', 'Misal: x + 2y + 3z = 330'],
    tutor: {
      topicTitle: 'LKPD 1 · Pemodelan',
      konsepHint: 'Tetapkan $x$ untuk kain katun, $y$ untuk satin, dan $z$ untuk linen (dalam ribuan rupiah).',
      prosesHint: 'Kalikan panjang masing-masing kain dengan variabelnya, lalu samakan dengan total biaya tiap nota.',
      perhitunganHint: 'Untuk mengecek $(35, 50, 65)$, hitung $2(35) + 3(50) + 1(65)$ dan pastikan hasilnya $285$.',
    },
  },
  {
    key: 'lkpd2',
    numberLabel: 'LKPD 2',
    title: 'Penyelesaian SPLTV dengan Metode Substitusi',
    subtitle: 'Mengubah bentuk persamaan dan menyulihkan variabel pada kasus pembelian buah kantin SMK',
    stimulus:
      'Kantin Sehat Agribisnis SMK membeli tiga paket buah (dalam ribuan rupiah/kg): Paket 1 (1 kg jeruk, 2 kg mangga, 1 kg pir = Rp86.000), Paket 2 (2 kg jeruk, 1 kg mangga, 2 kg pir = Rp118.000), dan Paket 3 (3 kg jeruk, 2 kg mangga, 1 kg pir = Rp126.000).',
    diketahui: [
      'Paket 1: 1 jeruk + 2 mangga + 1 pir = 86',
      'Paket 2: 2 jeruk + 1 mangga + 2 pir = 118',
      'Paket 3: 3 jeruk + 2 mangga + 1 pir = 126',
    ],
    pertanyaan:
      'Tuliskan model SPLTV-nya, uraikan langkah perubahan bentuk persamaan $x = 86 - 2y - z$ dan substitusinya hingga memperoleh harga tiap kilogram jeruk ($x$), mangga ($y$), dan pir ($z$)!',
    expectedModels: ['x+2y+z=86', '2x+y+2z=118', '3x+2y+z=126'],
    expectedSolution: ['20', '18', '30'],
    modelPlaceholders: ['Misal: x + 2y + z = 86', 'Misal: 2x + y + 2z = 118', 'Misal: 3x + 2y + z = 126'],
    tutor: {
      topicTitle: 'LKPD 2 · Metode Substitusi',
      konsepHint: 'Pilih Persamaan (1) karena koefisien $x$ adalah $1$, lalu nyatakan $x = 86 - 2y - z$.',
      prosesHint: 'Substitusikan bentuk $x$ tersebut ke Persamaan (2) sehingga $-3y = -54$ dan diperoleh nilai $y$.',
      perhitunganHint: 'Setelah $y$ ketemu, ganti $y$ pada bentuk $x$ lalu masukkan ke Persamaan (3) untuk menemukan $z$, kemudian hitung $x$.',
    },
  },
  {
    key: 'lkpd3',
    numberLabel: 'LKPD 3',
    title: 'Penyelesaian SPLTV dengan Metode Eliminasi',
    subtitle: 'Menyamakan koefisien dan menghilangkan variabel pada kasus pengadaan alat tulis koperasi SMK',
    stimulus:
      'Koperasi siswa mencatat tiga transaksi pembelian buku tulis ($x$), pensil ($y$), dan penggaris ($z$) dalam ribuan rupiah. Transaksi 1: 2 buku, 3 pensil, 2 penggaris = Rp27.000. Transaksi 2: 3 buku, 2 pensil, 3 penggaris = Rp33.000. Transaksi 3: 4 buku, 5 pensil, 2 penggaris = Rp43.000.',
    diketahui: [
      'Transaksi 1: 2x + 3y + 2z = 27',
      'Transaksi 2: 3x + 2y + 3z = 33',
      'Transaksi 3: 4x + 5y + 2z = 43',
    ],
    pertanyaan:
      'Susun model matematika, lakukan eliminasi variabel $z$ pada pasangan (1) & (3) serta (1) & (2), tentukan $(x, y, z)$, dan tuliskan kesimpulan harga satuannya!',
    expectedModels: ['2x+3y+2z=27', '3x+2y+3z=33', '4x+5y+2z=43'],
    expectedSolution: ['5', '3', '4'],
    modelPlaceholders: ['Misal: 2x + 3y + 2z = 27', 'Misal: 3x + 2y + 3z = 33', 'Misal: 4x + 5y + 2z = 43'],
    tutor: {
      topicTitle: 'LKPD 3 · Metode Eliminasi',
      konsepHint: 'Perhatikan koefisien $z$ pada Persamaan (1) dan (3) sudah sama-sama $+2$!',
      prosesHint: 'Kurangkan Persamaan (3) dengan (1) untuk memperoleh $2x + 2y = 16$ atau $x + y = 8$. Lalu kalikan Pers.(1) dengan $3$ dan Pers.(2) dengan $2$ untuk mengeliminasi $z$.',
      perhitunganHint: 'Dari eliminasi (1)×3 dan (2)×2 diperoleh $5y = 15$, sehingga $y$ langsung ketemu.',
    },
  },
];

function normalizeEquation(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\.000/g, '')
    .replace(/^1([xyz])/, '$1')
    .replace(/([+-])1([xyz])/g, '$1$2');
}

function scoreSingleLkpd(data: SingleLkpdData, cfg: LkpdConfig): number {
  let points = 0;
  const totalChecks = 8;

  if (data.identifikasiVariabel.trim().length >= 8) points += 1;
  if (normalizeEquation(data.modelPers1) === cfg.expectedModels[0]) points += 1;
  if (normalizeEquation(data.modelPers2) === cfg.expectedModels[1]) points += 1;
  if (normalizeEquation(data.modelPers3) === cfg.expectedModels[2]) points += 1;
  if (data.langkahKerja.trim().length >= 15) points += 1;
  if (data.jawabanAkhirX.trim() === cfg.expectedSolution[0]) points += 1;
  if (data.jawabanAkhirY.trim() === cfg.expectedSolution[1]) points += 1;
  if (
    data.jawabanAkhirZ.trim() === cfg.expectedSolution[2] &&
    data.kesimpulan.trim().length >= 10
  ) {
    points += 1;
  }

  return Math.round((points / totalChecks) * 100);
}

export const LkpdPage: React.FC<LkpdPageProps> = ({
  identity,
  lkpd,
  onSaveLkpd,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'lkpd1' | 'lkpd2' | 'lkpd3'>('lkpd1');
  const [showTutor, setShowTutor] = useState(false);

  const cfg = LKPD_CONFIGS.find((c) => c.key === activeTab) ?? LKPD_CONFIGS[0];
  const currentData = lkpd[activeTab];

  const updateField = (field: keyof SingleLkpdData, value: string) => {
    const updatedSingle: SingleLkpdData = {
      ...currentData,
      [field]: value,
      updatedAt: new Date().toISOString(),
    };

    const nextLkpd: LkpdRecord = {
      ...lkpd,
      [activeTab]: updatedSingle,
    };
    onSaveLkpd(nextLkpd);
  };

  const handleValidateActiveLkpd = () => {
    const computedScore = scoreSingleLkpd(currentData, cfg);
    const updatedSingle: SingleLkpdData = {
      ...currentData,
      completed: true,
      score: computedScore,
      updatedAt: new Date().toISOString(),
    };

    const nextLkpd: LkpdRecord = {
      ...lkpd,
      [activeTab]: updatedSingle,
    };

    const allScores = [
      nextLkpd.lkpd1.completed ? nextLkpd.lkpd1.score : 0,
      nextLkpd.lkpd2.completed ? nextLkpd.lkpd2.score : 0,
      nextLkpd.lkpd3.completed ? nextLkpd.lkpd3.score : 0,
    ];
    const completedCount = [
      nextLkpd.lkpd1.completed,
      nextLkpd.lkpd2.completed,
      nextLkpd.lkpd3.completed,
    ].filter(Boolean).length;

    const avgScore =
      completedCount > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / completedCount)
        : 0;

    const activitiesCompleted: number[] = [];
    if (nextLkpd.lkpd1.completed) activitiesCompleted.push(1);
    if (nextLkpd.lkpd2.completed) activitiesCompleted.push(2);
    if (nextLkpd.lkpd3.completed) activitiesCompleted.push(3);

    onSaveLkpd({
      ...nextLkpd,
      completed: completedCount > 0,
      score: avgScore,
      activitiesCompleted,
      completedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono font-semibold text-teal-700">
            Menu 11 · Lembar Kerja Peserta Didik Digital
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
            LKPD Interaktif (LKPD 1, 2, dan 3)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Seluruh jawaban tersimpan otomatis saat kamu mengetik dan terhubung dengan identitasmu.
          </p>
        </div>
        <div className="px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs sm:text-sm">
          Rata-rata Skor LKPD:{' '}
          <strong className="font-mono text-teal-300 tabular-nums">{lkpd.score}</strong> / 100
        </div>
      </div>

      {/* 3 LKPD Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-slate-200/70 rounded-xl">
        {LKPD_CONFIGS.map((item) => {
          const isDone = lkpd[item.key].completed;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveTab(item.key);
                setShowTutor(false);
              }}
              className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between gap-2 ${
                isActive ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <span>{item.numberLabel}: {item.key === 'lkpd1' ? 'Konsep' : item.key === 'lkpd2' ? 'Substitusi' : 'Eliminasi'}</span>
              {isDone && (
                <span className="inline-flex items-center gap-1 text-teal-700 font-mono text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  {lkpd[item.key].score}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active LKPD Sheet */}
      <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* 1. Identitas Siswa */}
        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div>
            <p className="font-bold text-navy-900">
              {cfg.numberLabel} — {cfg.title}
            </p>
            <p className="text-slate-600 mt-0.5">{cfg.subtitle}</p>
          </div>
          <div className="text-right font-medium text-navy-900">
            <p>{identity.namaLengkap}</p>
            <p className="text-xs text-slate-600">
              {identity.kelas} · No. Absen {identity.nomorAbsen}
            </p>
          </div>
        </div>

        {/* 2. Stimulus Kontekstual & 3. Informasi Diketahui & 4. Pertanyaan */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-base">
              <FileSpreadsheet className="w-4 h-4 text-teal-700" />
              <h2>A. Stimulus Kontekstual</h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">{cfg.stimulus}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-navy-900 mb-1.5">B. Informasi Diketahui</p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700 list-disc pl-4">
                {cfg.diketahui.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200">
              <p className="text-xs font-bold text-navy-900 mb-1.5">C. Pertanyaan Penuntun</p>
              <p className="text-xs sm:text-sm text-navy-900 leading-relaxed">
                <MathText text={cfg.pertanyaan} />
              </p>
            </div>
          </div>
        </div>

        {/* Tutor Help Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowTutor((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showTutor ? 'Tutup Tutor Cerdas' : 'Butuh Petunjuk? Buka Tutor Pembelajaran Cerdas'}</span>
          </button>
          {showTutor && (
            <div className="mt-3">
              <SmartTutorPanel scaffolding={cfg.tutor} />
            </div>
          )}
        </div>

        {/* 5. Identifikasi Variabel */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-navy-900">
            D. Identifikasi Variabel (Pemisalan $x, y, z$)
          </label>
          <textarea
            rows={2}
            value={currentData.identifikasiVariabel}
            onChange={(e) => updateField('identifikasiVariabel', e.target.value)}
            placeholder="Tuliskan pemisalan variabel x, y, dan z lengkap dengan satuannya..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* 6. Model Matematika */}
        <div className="space-y-2.5">
          <p className="text-sm font-bold text-navy-900">
            E. Model Matematika SPLTV (dalam ribuan rupiah, contoh: <span className="font-mono">2x + 3y + z = 285</span>)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['modelPers1', 'modelPers2', 'modelPers3'] as const).map((field, idx) => {
              const val = currentData[field];
              const isMatched =
                currentData.completed &&
                normalizeEquation(val) === cfg.expectedModels[idx];
              return (
                <label key={field} className="block">
                  <span className="block text-xs font-semibold text-slate-600 mb-1">
                    Persamaan ({idx + 1})
                  </span>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => updateField(field, e.target.value)}
                    placeholder={cfg.modelPlaceholders[idx]}
                    className={`w-full px-3 py-2 rounded-lg border font-mono text-xs sm:text-sm ${
                      currentData.completed
                        ? isMatched
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-amber-400 bg-amber-50'
                        : 'border-slate-300 bg-white'
                    }`}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* 7. Langkah Penyelesaian */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-navy-900">
            F. Ruang Kerja Langkah Penyelesaian
          </label>
          <textarea
            rows={4}
            value={currentData.langkahKerja}
            onChange={(e) => updateField('langkahKerja', e.target.value)}
            placeholder="Uraikan langkah substitusi / eliminasi / pengecekan persamaan yang kamu lakukan..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <div className="grid grid-cols-3 gap-3 pt-1">
            {(
              [
                { field: 'jawabanAkhirX' as const, label: 'Nilai x (ribu) =', idx: 0 },
                { field: 'jawabanAkhirY' as const, label: 'Nilai y (ribu) =', idx: 1 },
                { field: 'jawabanAkhirZ' as const, label: 'Nilai z (ribu) =', idx: 2 },
              ] as const
            ).map((item) => {
              const ok =
                currentData.completed &&
                currentData[item.field].trim() === cfg.expectedSolution[item.idx];
              return (
                <label key={item.field} className="block">
                  <span className="block text-xs font-semibold text-navy-900 mb-1">
                    {item.label}
                  </span>
                  <input
                    type="number"
                    value={currentData[item.field]}
                    onChange={(e) => updateField(item.field, e.target.value)}
                    placeholder="?"
                    className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                      currentData.completed
                        ? ok
                          ? 'border-teal-500 bg-teal-50 font-bold'
                          : 'border-rose-400 bg-rose-50'
                        : 'border-slate-300 bg-white'
                    }`}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* 8. Kesimpulan */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-navy-900">
            G. Kesimpulan Kontekstual
          </label>
          <textarea
            rows={2}
            value={currentData.kesimpulan}
            onChange={(e) => updateField('kesimpulan', e.target.value)}
            placeholder="Tuliskan kesimpulan jawaban akhir dalam kalimat sehari-hari lengkap dengan satuan rupiah..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* 9. Refleksi LKPD */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-navy-900">
            H. Refleksi Singkat {cfg.numberLabel}
          </label>
          <textarea
            rows={2}
            value={currentData.refleksiLkpd}
            onChange={(e) => updateField('refleksiLkpd', e.target.value)}
            placeholder="Apa hal baru yang kamu pelajari atau bagian yang masih perlu diperiksa ulang?"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleValidateActiveLkpd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-300" />
            <span>Periksa & Simpan {cfg.numberLabel}</span>
          </button>

          {currentData.completed && (
            <span className="text-xs sm:text-sm font-semibold text-teal-700">
              {cfg.numberLabel} tersimpan · Skor: <span className="font-mono">{currentData.score}/100</span>
            </span>
          )}
        </div>
      </article>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onNavigate('latihan')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <span>Lanjut ke Latihan HOTS (30 Soal)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
