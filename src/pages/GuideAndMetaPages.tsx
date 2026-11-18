import React, { useState } from 'react';
import { ArrowRight, BookOpen, Compass, GraduationCap, Mail, MapPin, Target, Users } from 'lucide-react';
import { MathText } from '../components/MathText';
import { SafeImage } from '../components/SafeImage';
import { TEACHER_IMAGE_PATH } from '../data/curriculumData';
import { MenuId } from '../types/module';

interface NavProps {
  onNavigate: (menu: MenuId) => void;
}

export const PetunjukPage: React.FC<NavProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'Isi Identitas Peserta Didik',
      desc: 'Masukkan Nama Lengkap, Kelas, dan Nomor Absen pada menu Identitas Peserta Didik. Data tersimpan otomatis di perangkatmu sehingga progres belajar tetap aman saat berpindah menu.',
    },
    {
      num: '02',
      title: 'Kerjakan Asesmen Diagnostik',
      desc: 'Ukur kesiapan prasyarat belajarmu mengenai operasi aljabar dan SPLDV sebelum memulai Pertemuan 1.',
    },
    {
      num: '03',
      title: 'Pelajari Pertemuan 1, 2, dan 3 Secara Berurutan',
      desc: 'Setiap pertemuan memuat Tujuan, Pertanyaan Pemantik, Stimulus Masalah, Penjelasan Konsep, Contoh Soal & Pembahasan kontekstual SMK, serta Rangkuman. Klik tombol Lanjut di bagian bawah untuk mencatat penyelesaian materi.',
    },
    {
      num: '04',
      title: 'Eksplorasi Simulasi Matematika & Kerjakan LKPD',
      desc: 'Gunakan Simulasi Matematika untuk mengamati perpotongan tiga bidang dalam ruang 3D dan melihat langkah penyelesaian otomatis. Lanjutkan dengan LKPD interaktif untuk menguji keterampilan pemodelan dan perhitungan.',
    },
    {
      num: '05',
      title: 'Selesaikan Latihan Soal, Asesmen Sumatif & Refleksi',
      desc: 'Uji penguasaanmu di Latihan Soal dan Asesmen Sumatif, tinjau rekap nilai pada halaman Hasil Belajar, lalu isi Refleksi pembelajaran.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-mono font-semibold text-teal-700">Menu 03 · Panduan Belajar</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
          Petunjuk Penggunaan E-Modul
        </h1>
        <p className="text-sm text-slate-600 mt-1.5">
          Ikuti panduan langkah demi langkah berikut agar proses belajarmu pada platform SPLTV Smart Learning berjalan efektif.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {steps.map((step) => (
          <div key={step.num} className="p-5 sm:p-6 flex items-start gap-4">
            <span className="font-mono text-sm font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-2.5 py-1.5 shrink-0 tabular-nums">
              {step.num}
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-navy-900">{step.title}</h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-base">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <span>Petunjuk Bagi Peserta Didik</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-5">
            <li>Siapkan buku catatan dan alat tulis untuk mencoba menghitung ulang setiap contoh soal.</li>
            <li>Jangan langsung melompati langkah pengecekan hasil $(x, y, z)$ ke persamaan awal.</li>
            <li>Manfaatkan menu Simulasi Matematika untuk memeriksa kebenaran jawabanmu.</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-base">
            <Users className="w-5 h-5 text-sky-600" />
            <span>Peran Guru Fasilitator</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-5">
            <li>Membimbing diskusi kelompok saat mengerjakan LKPD dan stimulus masalah SMK.</li>
            <li>Memantau ketercapaian kompetensi melalui laporan pada menu Hasil Belajar.</li>
            <li>Memberikan penguatan konsep bagi siswa berdasarkan hasil Asesmen Diagnostik dan Refleksi.</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onNavigate('peta-konsep')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <span>Lanjut ke Peta Konsep</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface ConceptNode {
  id: string;
  label: string;
  category: string;
  description: string;
  math?: string;
  targetMenu: MenuId;
  targetLabel: string;
}

const CONCEPT_NODES: ConceptNode[] = [
  {
    id: 'pengertian',
    label: 'Pengertian SPLTV',
    category: 'Konsep Dasar · Pertemuan 1',
    description:
      'Sistem yang terdiri atas tiga persamaan linear dengan paling banyak tiga variabel berpangkat satu yang saling berkaitan.',
    targetMenu: 'pertemuan-1',
    targetLabel: 'Buka Pertemuan 1',
  },
  {
    id: 'bentuk-umum',
    label: 'Bentuk Umum',
    category: 'Notasi Matematis · Pertemuan 1',
    description:
      'Tiga persamaan linear yang membentuk satu kesatuan syarat dalam variabel $x, y,$ dan $z$.',
    math: '$$\\begin{cases} a_1x + b_1y + c_1z = d_1 \\\\ a_2x + b_2y + c_2z = d_2 \\\\ a_3x + b_3y + c_3z = d_3 \\end{cases}$$',
    targetMenu: 'pertemuan-1',
    targetLabel: 'Buka Pertemuan 1',
  },
  {
    id: 'unsur',
    label: 'Variabel, Koefisien & Konstanta',
    category: 'Anatomi Persamaan · Pertemuan 1',
    description:
      'Variabel adalah peubah ($x, y, z$), koefisien adalah bilangan pengali variabel ($a, b, c$), dan konstanta adalah nilai tetap di ruas kanan ($d$).',
    targetMenu: 'pertemuan-1',
    targetLabel: 'Cek Inspektor Unsur',
  },
  {
    id: 'pemodelan',
    label: 'Pemodelan Matematika',
    category: 'Penerjemahan Masalah · Pertemuan 1',
    description:
      'Mengubah soal cerita nyata menjadi model SPLTV melalui identifikasi besaran, pemisalan variabel, dan penyusunan tiga persamaan.',
    targetMenu: 'pertemuan-1',
    targetLabel: 'Pelajari Pemodelan',
  },
  {
    id: 'substitusi',
    label: 'Metode Substitusi',
    category: 'Teknik Penyelesaian · Pertemuan 2',
    description:
      'Mengubah satu persamaan menjadi bentuk eksplisit (misal $x = \\dots$) lalu menggantikannya ke dua persamaan lain secara bertahap.',
    targetMenu: 'pertemuan-2',
    targetLabel: 'Buka Pertemuan 2',
  },
  {
    id: 'eliminasi',
    label: 'Metode Eliminasi',
    category: 'Teknik Penyelesaian · Pertemuan 3',
    description:
      'Menyamakan koefisien salah satu variabel target, lalu menjumlahkan atau mengurangkan persamaan untuk menghilangkan variabel tersebut.',
    targetMenu: 'pertemuan-3',
    targetLabel: 'Buka Pertemuan 3',
  },
  {
    id: 'penerapan',
    label: 'Penerapan Kehidupan Sehari-hari',
    category: 'Konteks Kejuruan SMK',
    description:
      'Menghitung harga kain produksi busana, paket sembako, output tiga mesin bengkel, harga tiket, paket buah, dan pengadaan alat tulis koperasi.',
    targetMenu: 'simulasi',
    targetLabel: 'Coba di Simulasi',
  },
];

export const PetaKonsepPage: React.FC<NavProps> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<string>('pengertian');
  const activeNode = CONCEPT_NODES.find((n) => n.id === selectedId) ?? CONCEPT_NODES[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono font-semibold text-teal-700">Menu 04 · Hubungan Materi</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
          Peta Konsep SPLTV
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Klik setiap simpul pada peta konsep untuk melihat penjelasan hubungan materi dan langsung menuju pertemuannya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Interactive Concept Map Diagram */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-x-auto">
          <svg
            viewBox="0 0 820 500"
            className="w-full min-w-[640px] h-auto select-none"
            role="img"
            aria-label="Diagram Peta Konsep Hubungan Materi SPLTV"
          >
            {/* Connecting lines */}
            <g stroke="#94a3b8" strokeWidth="2" fill="none">
              {/* Root Pengertian -> Bentuk Umum, Unsur, Pemodelan */}
              <path d="M 410 78 L 410 115" />
              <path d="M 410 115 L 150 115 L 150 148" />
              <path d="M 410 115 L 410 148" />
              <path d="M 410 115 L 670 115 L 670 148" />

              {/* Pemodelan / Bentuk Umum -> Substitusi & Eliminasi */}
              <path d="M 410 212 L 410 250" />
              <path d="M 670 212 L 670 250 L 410 250" />
              <path d="M 150 212 L 150 250 L 410 250" />
              <path d="M 410 250 L 260 250 L 260 290" />
              <path d="M 410 250 L 560 250 L 560 290" />

              {/* Substitusi & Eliminasi -> Penerapan */}
              <path d="M 260 356 L 260 390 L 410 390 L 410 416" />
              <path d="M 560 356 L 560 390 L 410 390" />
            </g>

            {/* Arrowheads / Connector dots */}
            <g fill="#0d9488">
              <circle cx="150" cy="148" r="4" />
              <circle cx="410" cy="148" r="4" />
              <circle cx="670" cy="148" r="4" />
              <circle cx="260" cy="290" r="4" />
              <circle cx="560" cy="290" r="4" />
              <circle cx="410" cy="416" r="4" />
            </g>

            {/* Node 1: Pengertian SPLTV */}
            <g
              onClick={() => setSelectedId('pengertian')}
              className="cursor-pointer"
            >
              <rect
                x="280"
                y="20"
                width="260"
                height="58"
                rx="12"
                fill={selectedId === 'pengertian' ? '#0b1f3f' : '#eff6ff'}
                stroke={selectedId === 'pengertian' ? '#0d9488' : '#38bdf8'}
                strokeWidth="2"
              />
              <text
                x="410"
                y="54"
                textAnchor="middle"
                fill={selectedId === 'pengertian' ? '#ffffff' : '#0b1f3f'}
                fontSize="15"
                fontWeight="700"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Pengertian SPLTV
              </text>
            </g>

            {/* Node 2: Bentuk Umum */}
            <g onClick={() => setSelectedId('bentuk-umum')} className="cursor-pointer">
              <rect
                x="40"
                y="148"
                width="220"
                height="64"
                rx="12"
                fill={selectedId === 'bentuk-umum' ? '#0b1f3f' : '#ffffff'}
                stroke={selectedId === 'bentuk-umum' ? '#0d9488' : '#cbd5e1'}
                strokeWidth="2"
              />
              <text
                x="150"
                y="185"
                textAnchor="middle"
                fill={selectedId === 'bentuk-umum' ? '#ffffff' : '#0b1f3f'}
                fontSize="14"
                fontWeight="700"
              >
                Bentuk Umum
              </text>
            </g>

            {/* Node 3: Variabel, Koefisien, Konstanta */}
            <g onClick={() => setSelectedId('unsur')} className="cursor-pointer">
              <rect
                x="290"
                y="148"
                width="240"
                height="64"
                rx="12"
                fill={selectedId === 'unsur' ? '#0b1f3f' : '#ffffff'}
                stroke={selectedId === 'unsur' ? '#0d9488' : '#cbd5e1'}
                strokeWidth="2"
              />
              <text
                x="410"
                y="176"
                textAnchor="middle"
                fill={selectedId === 'unsur' ? '#ffffff' : '#0b1f3f'}
                fontSize="13.5"
                fontWeight="700"
              >
                Variabel, Koefisien,
              </text>
              <text
                x="410"
                y="196"
                textAnchor="middle"
                fill={selectedId === 'unsur' ? '#bae6fd' : '#334155'}
                fontSize="13.5"
                fontWeight="700"
              >
                dan Konstanta
              </text>
            </g>

            {/* Node 4: Pemodelan Matematika */}
            <g onClick={() => setSelectedId('pemodelan')} className="cursor-pointer">
              <rect
                x="560"
                y="148"
                width="220"
                height="64"
                rx="12"
                fill={selectedId === 'pemodelan' ? '#0b1f3f' : '#ffffff'}
                stroke={selectedId === 'pemodelan' ? '#0d9488' : '#cbd5e1'}
                strokeWidth="2"
              />
              <text
                x="670"
                y="185"
                textAnchor="middle"
                fill={selectedId === 'pemodelan' ? '#ffffff' : '#0b1f3f'}
                fontSize="14"
                fontWeight="700"
              >
                Pemodelan Matematika
              </text>
            </g>

            {/* Node 5: Metode Substitusi */}
            <g onClick={() => setSelectedId('substitusi')} className="cursor-pointer">
              <rect
                x="140"
                y="290"
                width="240"
                height="66"
                rx="12"
                fill={selectedId === 'substitusi' ? '#0d9488' : '#f0fdfa'}
                stroke={selectedId === 'substitusi' ? '#0b1f3f' : '#14b8a6'}
                strokeWidth="2"
              />
              <text
                x="260"
                y="328"
                textAnchor="middle"
                fill={selectedId === 'substitusi' ? '#ffffff' : '#0f766e'}
                fontSize="14.5"
                fontWeight="700"
              >
                Metode Substitusi
              </text>
            </g>

            {/* Node 6: Metode Eliminasi */}
            <g onClick={() => setSelectedId('eliminasi')} className="cursor-pointer">
              <rect
                x="440"
                y="290"
                width="240"
                height="66"
                rx="12"
                fill={selectedId === 'eliminasi' ? '#0d9488' : '#f0fdfa'}
                stroke={selectedId === 'eliminasi' ? '#0b1f3f' : '#14b8a6'}
                strokeWidth="2"
              />
              <text
                x="560"
                y="328"
                textAnchor="middle"
                fill={selectedId === 'eliminasi' ? '#ffffff' : '#0f766e'}
                fontSize="14.5"
                fontWeight="700"
              >
                Metode Eliminasi
              </text>
            </g>

            {/* Node 7: Penerapan dalam Kehidupan Sehari-hari */}
            <g onClick={() => setSelectedId('penerapan')} className="cursor-pointer">
              <rect
                x="210"
                y="416"
                width="400"
                height="64"
                rx="12"
                fill={selectedId === 'penerapan' ? '#0b1f3f' : '#e0f2fe'}
                stroke={selectedId === 'penerapan' ? '#0d9488' : '#0284c7'}
                strokeWidth="2"
              />
              <text
                x="410"
                y="453"
                textAnchor="middle"
                fill={selectedId === 'penerapan' ? '#ffffff' : '#0c4a6e'}
                fontSize="14.5"
                fontWeight="700"
              >
                Penerapan dalam Kehidupan Sehari-hari (Konteks SMK)
              </text>
            </g>
          </svg>
        </div>

        {/* Concept Detail Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
            <Compass className="w-4 h-4" />
            <span>{activeNode.category}</span>
          </div>
          <h2 className="font-display text-xl font-bold text-navy-900">{activeNode.label}</h2>
          <div className="text-sm text-slate-600 leading-relaxed">
            <MathText text={activeNode.description} />
          </div>
          {activeNode.math && (
            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-sm overflow-x-auto">
              <MathText text={activeNode.math} />
            </div>
          )}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate(activeNode.targetMenu)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <span>{activeNode.targetLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TujuanPage: React.FC<NavProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-mono font-semibold text-teal-700">Menu 05 · Kurikulum Merdeka Fase E</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
          Tujuan Pembelajaran
        </h1>
        <p className="text-sm text-slate-600 mt-1.5">
          Capaian Pembelajaran dan rincian tujuan pembelajaran Matematika SMK Kelas X pada materi SPLTV.
        </p>
      </div>

      {/* Capaian Pembelajaran Fase E */}
      <section className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 text-white p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold">
          <Target className="w-4 h-4" />
          <span>Capaian Pembelajaran (CP) Elemen Aljabar dan Fungsi — Fase E</span>
        </div>
        <p className="mt-3 text-sm sm:text-base text-slate-100 leading-relaxed">
          Di akhir Fase E, peserta didik dapat menyelesaikan masalah yang berkaitan dengan sistem
          persamaan linear tiga variabel (SPLTV) dan sistem pertidaksamaan linear dua variabel,
          termasuk memodelkan permasalahan kontekstual ke dalam bentuk matematika serta menafsirkan
          solusinya dalam konteks dunia kerja dan kehidupan sehari-hari.
        </p>
      </section>

      {/* Tujuan Per Pertemuan */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-navy-900">
          Tujuan Pembelajaran per Pertemuan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-xs font-mono font-semibold text-teal-700">Pertemuan 01</p>
            <h3 className="font-display text-base font-bold text-navy-900 mt-1">
              Definisi & Pemodelan
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-4">
              <li>Menjelaskan pengertian, bentuk umum, dan ciri-ciri SPLTV.</li>
              <li>Mengidentifikasi variabel, koefisien, dan konstanta.</li>
              <li>Membedakan contoh dan bukan contoh SPLTV.</li>
              <li>Memodelkan kasus pembelian kain, sembako, dan produksi tiga mesin.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-xs font-mono font-semibold text-teal-700">Pertemuan 02</p>
            <h3 className="font-display text-base font-bold text-navy-900 mt-1">
              Metode Substitusi
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-4">
              <li>Menjelaskan konsep perubahan bentuk persamaan eksplisit.</li>
              <li>Menerapkan langkah substitusi berjenjang pada SPLTV.</li>
              <li>Menyelesaikan masalah harga tiket dan pembelian jeruk, mangga, serta pir.</li>
              <li>Memverifikasi hasil solusi ke semua persamaan awal.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-xs font-mono font-semibold text-teal-700">Pertemuan 03</p>
            <h3 className="font-display text-base font-bold text-navy-900 mt-1">
              Metode Eliminasi
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-4">
              <li>Menyamakan koefisien variabel target menggunakan KPK.</li>
              <li>Menghilangkan variabel secara konsisten dengan operasi tambah/kurang.</li>
              <li>Menentukan himpunan penyelesaian $(x, y, z)$ dan mengecek hasil.</li>
              <li>Menyelesaikan kasus pembelian buku, pensil, dan penggaris.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onNavigate('diagnostik')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <span>Mulai Asesmen Diagnostik</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ProfilGuruPage: React.FC<NavProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-mono font-semibold text-teal-700">Menu 16 · Pengembang Modul</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
          Profil Guru Pengampu
        </h1>
        <p className="text-sm text-slate-600 mt-1.5">
          Informasi pengajar dan perancang E-Modul Matematika SMK Kelas X Fase E.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-4 bg-sky-50 min-h-[260px]">
            <SafeImage
              src={TEACHER_IMAGE_PATH}
              alt="Foto profil guru Matematika SMK pengampu e-modul SPLTV"
              fallbackTitle="Guru Matematika SMK"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <p className="text-xs font-semibold text-teal-700">
                Pendidik Matematika SMK · Kurikulum Merdeka Fase E
              </p>
              <h2 className="font-display text-2xl font-bold text-navy-900 mt-1">
                Tim Pengajar Matematika SMK
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Mengampu mata pelajaran Matematika Terapan dan Umum untuk Kelas X seluruh
                konsentrasi keahlian SMK. Berfokus pada pendekatan pembelajaran kontekstual berbasis
                masalah dunia usaha dan industri (Problem-Based Learning) dengan dukungan visualisasi
                interaktif.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-sm">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-navy-900">Bidang Keahlian</p>
                  <p className="text-slate-600 text-xs">Pendidikan Matematika & Desain Instruksional SMK</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-navy-900">Jenjang Sasaran</p>
                  <p className="text-slate-600 text-xs">SMK Kelas X · Fase E (Semester Gasal)</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:col-span-2">
                <Mail className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-navy-900">Jam Konsultasi Belajar</p>
                  <p className="text-slate-600 text-xs">
                    Senin – Jumat, pukul 07.30 – 15.00 WIB melalui Ruang Belajar Matematika atau LMS Sekolah.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('teacher-dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors"
              >
                <span>Buka Dashboard Guru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('beranda')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-navy-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
              >
                <span>Kembali ke Beranda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
