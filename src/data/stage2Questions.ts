import { QuizQuestion } from '../types/module';

// =========================================================================
// 1. ASESMEN DIAGNOSTIK (10 SOAL PRASYARAT)
// =========================================================================
export const DIAGNOSTIC_10_QUESTIONS: QuizQuestion[] = [
  {
    id: 'diag-1',
    format: 'pg',
    topic: 'Substitusi Nilai Aljabar',
    question: 'Diketahui persamaan linear $3x + 2y = 19$. Jika nilai $x = 5$, berapakah nilai $y$?',
    options: ['$y = 2$', '$y = 3$', '$y = 4$', '$y = 7$'],
    correctIndex: 0,
    explanation: 'Substitusikan $x = 5$: $3(5) + 2y = 19 \\implies 15 + 2y = 19 \\implies 2y = 4 \\implies y = 2$.',
  },
  {
    id: 'diag-2',
    format: 'pg',
    topic: 'Prasyarat SPLDV',
    question: 'Penyelesaian dari sistem $\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}$ adalah...',
    options: ['$x = 6, y = 4$', '$x = 7, y = 3$', '$x = 8, y = 2$', '$x = 5, y = 5$'],
    correctIndex: 1,
    explanation: 'Jumlahkan kedua persamaan: $2x = 14 \\implies x = 7$, lalu $7 + y = 10 \\implies y = 3$.',
  },
  {
    id: 'diag-3',
    format: 'pg',
    topic: 'Unsur Persamaan',
    question: 'Pada persamaan $4a - 7b + c = 15$, koefisien dari variabel $b$ dan konstantanya berturut-turut adalah...',
    options: ['$7$ dan $15$', '$-7$ dan $15$', '$4$ dan $-7$', '$-7$ dan $1$'],
    correctIndex: 1,
    explanation: 'Tanda pengurangan ikut pada suku $-7b$ sehingga koefisien $b$ adalah $-7$, sedangkan konstanta adalah $15$.',
  },
  {
    id: 'diag-4',
    format: 'pg',
    topic: 'Pemodelan Dasar',
    question: 'Harga 3 buku ($x$) dan 2 pulpen ($y$) adalah Rp26.000. Kalimat matematika yang tepat adalah...',
    options: ['$3x + 2y = 26.000$', '$2x + 3y = 26.000$', '$5(x+y) = 26.000$', '$3x - 2y = 26.000$'],
    correctIndex: 0,
    explanation: '3 buku dinyatakan dengan $3x$ dan 2 pulpen dengan $2y$, dijumlahkan sama dengan $26.000$.',
  },
  {
    id: 'diag-5',
    format: 'pg',
    topic: 'Perubahan Bentuk Persamaan',
    question: 'Jika $2x - y + 3z = 12$, bentuk eksplisit untuk variabel $y$ adalah...',
    options: ['$y = 12 - 2x - 3z$', '$y = 2x + 3z - 12$', '$y = 2x - 3z + 12$', '$y = -2x - 3z - 12$'],
    correctIndex: 1,
    explanation: 'Pindahkan $-y$ ke ruas kanan menjadi $+y$ dan $12$ ke ruas kiri menjadi $-12$: $y = 2x + 3z - 12$.',
  },
  {
    id: 'diag-6',
    format: 'pg',
    topic: 'Sifat Distributif Aljabar',
    question: 'Hasil penyederhanaan dari $3(2x - y + 4) - 2(x + y)$ adalah...',
    options: ['$4x - 5y + 12$', '$4x - y + 12$', '$8x - 5y + 12$', '$4x - 5y + 4$'],
    correctIndex: 0,
    explanation: '$3(2x-y+4) - 2(x+y) = 6x - 3y + 12 - 2x - 2y = 4x - 5y + 12$.',
  },
  {
    id: 'diag-7',
    format: 'pg',
    topic: 'SPLDV Eliminasi',
    question: 'Untuk mengeliminasi $x$ dari $\\begin{cases} 2x + 3y = 13 \\\\ x - 2y = -4 \\end{cases}$, persamaan kedua perlu dikalikan dengan...',
    options: ['$2$ lalu dijumlahkan', '$2$ lalu dikurangkan', '$3$ lalu dikurangkan', '$-2$ lalu dikurangkan'],
    correctIndex: 1,
    explanation: 'Mengalikan persamaan kedua dengan $2$ menjadi $2x - 4y = -8$. Karena tanda $+2x$ sama, kurangkan kedua persamaan.',
  },
  {
    id: 'diag-8',
    format: 'pg',
    topic: 'Pengecekan Solusi',
    question: 'Pasangan $(x, y) = (4, -1)$ memenuhi persamaan...',
    options: ['$2x + 3y = 11$', '$3x - 2y = 14$', '$x + 4y = 8$', '$5x + y = 21$'],
    correctIndex: 1,
    explanation: 'Uji $(4, -1)$ pada $3x - 2y$: $3(4) - 2(-1) = 12 + 2 = 14$. Benar.',
  },
  {
    id: 'diag-9',
    format: 'pg',
    topic: 'Derajat Persamaan Linear',
    question: 'Manakah di antara persamaan berikut yang merupakan persamaan linear?',
    options: ['$x^2 + y = 5$', '$\\frac{3}{x} + y = 2$', '$4x - 5y + z = 0$', '$xy + 2z = 9$'],
    correctIndex: 2,
    explanation: '$4x - 5y + z = 0$ memiliki semua variabel berpangkat $1$ tanpa perkalian antarvariabel maupun penyebut variabel.',
  },
  {
    id: 'diag-10',
    format: 'pg',
    topic: 'KPK Koefisien',
    question: 'Untuk menyamakan koefisien $z$ pada $3x + 4z = 22$ dan $5x - 6z = 4$, kelipatan terkecil (KPK) koefisien $z$ yang paling efisien adalah...',
    options: ['$6$', '$10$', '$12$', '$24$'],
    correctIndex: 2,
    explanation: 'KPK dari $4$ dan $6$ adalah $12$ (persamaan pertama dikali $3$, persamaan kedua dikali $2$).',
  },
];

// =========================================================================
// 2. BANK SOAL LATIHAN HOTS (30 SOAL: 10 PG, 10 PG KOMPLEKS, 5 B/S, 5 URAIAN)
// =========================================================================
export const HOTS_30_QUESTIONS: QuizQuestion[] = [
  // --- 10 PILIHAN GANDA ---
  {
    id: 'hots-pg-1',
    format: 'pg',
    topic: 'Pilihan Ganda · Usaha Kuliner',
    context: 'Kantin Kuliner SMK',
    question:
      'Sebuah usaha kuliner SMK menjual 3 paket jajanan: risoles ($x$), lemper ($y$), dan pastel ($z$). Paket A (2 risoles, 1 lemper, 1 pastel) = Rp13.000. Paket B (1 risoles, 2 lemper, 1 pastel) = Rp13.500. Paket C (1 risoles, 1 lemper, 2 pastel) = Rp13.500. Jika siswa membeli 3 risoles, 3 lemper, dan 3 pastel, total pembayarannya adalah...',
    options: ['Rp28.000', 'Rp30.000', 'Rp32.000', 'Rp36.000'],
    correctIndex: 1,
    explanation: 'Jumlahkan ketiga persamaan: $4x + 4y + 4z = 40.000 \\implies x + y + z = 10.000$. Maka $3(x + y + z) = 30.000$. (Nilai satuan: $x=3.000, y=3.500, z=3.500$).',
  },
  {
    id: 'hots-pg-2',
    format: 'pg',
    topic: 'Pilihan Ganda · Koperasi Sekolah',
    context: 'Koperasi Siswa SMK',
    question:
      'Di koperasi SMK, harga 1 buku ($x$), 2 pulpen ($y$), dan 1 penggaris ($z$) adalah Rp19.000. Harga 2 buku, 1 pulpen, dan 1 penggaris adalah Rp21.000. Jika harga penggaris Rp4.000, berapakah selisih harga 1 buku dengan 1 pulpen?',
    options: ['Rp1.000', 'Rp2.000', 'Rp3.000', 'Rp4.000'],
    correctIndex: 1,
    explanation: 'Kurangkan Pers.(2) - Pers.(1): $(2x+y+z) - (x+2y+z) = 21.000 - 19.000 \\implies x - y = 2.000$. Selisih harga 1 buku dan 1 pulpen adalah Rp2.000.',
  },
  {
    id: 'hots-pg-3',
    format: 'pg',
    topic: 'Pilihan Ganda · Produksi Barang',
    context: 'Bengkel Manufaktur',
    question:
      'Tiga mesin produksi A, B, dan C menghasilkan baut per jam masing-masing $x, y, z$. Diketahui $x + y + z = 170$, $x + y = 90$, dan $y + z = 130$. Jika Mesin B rusak sehingga hanya Mesin A dan C yang beroperasi selama 2 jam, total baut yang dihasilkan adalah...',
    options: ['200 baut', '220 baut', '240 baut', '260 baut'],
    correctIndex: 2,
    explanation: 'Dari $x + y = 90$ dan $x+y+z=170$ diperoleh $z = 80$. Dari $y+z=130$ diperoleh $y = 50$, sehingga $x = 40$. Mesin A dan C selama 2 jam menghasilkan $2(40 + 80) = 240$ baut.',
  },
  {
    id: 'hots-pg-4',
    format: 'pg',
    topic: 'Pilihan Ganda · Bahan Baku',
    context: 'Unit Produksi Busana',
    question:
      'Penjahit SMK membeli kain katun ($x$), satin ($y$), dan linen ($z$) dalam ribuan rupiah/meter dengan sistem $\\begin{cases} 2x + 3y + z = 285 \\\\ 4x + y + 2z = 320 \\\\ x + 2y + 3z = 330 \\end{cases}$. Jika penjahit memiliki anggaran Rp500.000 dan membeli 4 m katun serta 3 m satin, panjang maksimal kain linen yang dapat dibeli adalah...',
    options: ['2 meter', '3 meter', '4 meter', '5 meter'],
    correctIndex: 1,
    explanation: 'Dari solusi modul: $x=35, y=50, z=65$ (dalam ribuan). Biaya 4 m katun + 3 m satin $= 4(35) + 3(50) = 290$ ribu. Sisa dana $= 500 - 290 = 210$ ribu. Karena $210 / 65 = 3,23$, maksimal dapat membeli $3$ meter kain linen.',
  },
  {
    id: 'hots-pg-5',
    format: 'pg',
    topic: 'Pilihan Ganda · Perdagangan',
    context: 'Toko Sembako',
    question:
      'Harga 1 kg beras ($x$), 1 kg gula ($y$), dan 1 L minyak ($z$) memenuhi $x + y + z = 47.000$. Jika harga gula Rp2.000 lebih mahal dari beras ($y = x + 2.000$) dan harga minyak Rp3.000 lebih mahal dari beras ($z = x + 3.000$), harga 2 kg gula adalah...',
    options: ['Rp28.000', 'Rp30.000', 'Rp32.000', 'Rp34.000'],
    correctIndex: 2,
    explanation: 'Substitusi: $x + (x + 2.000) + (x + 3.000) = 47.000 \\implies 3x = 42.000 \\implies x = 14.000$. Maka $y = 16.000$, dan 2 kg gula = Rp32.000.',
  },
  {
    id: 'hots-pg-6',
    format: 'pg',
    topic: 'Pilihan Ganda · Kewirausahaan',
    context: 'Bazar Wirausaha SMK',
    question:
      'Tim kewirausahaan menjual kopi susu ($x$), teh tarik ($y$), dan cokelat ($z$). Omzet hari ke-1 ($10x + 15y + 5z = 385.000$), hari ke-2 ($10x + 10y + 10z = 410.000$), dan hari ke-3 ($5x + 15y + 10z = 385.000$). Harga 1 gelas cokelat adalah...',
    options: ['Rp12.000', 'Rp14.000', 'Rp15.000', 'Rp16.000'],
    correctIndex: 2,
    explanation: 'Uji: $x=14.000, y=12.000, z=15.000$: H1 $140+180+75=395$? Tunggu cek! $10(14)+15(12)+5(15)=140+180+75=395$ (bukan 385). Ayo hitung persis dari sistemnya: Kurangkan H2-H1: $-5y+5z=25 \\implies z-y=5 \\implies z=y+5$. Kurangkan H1-H3: $5x-5z=0 \\implies x=z$. Substitusi ke H2: $10z + 10(z-5) + 10z = 410 \\implies 30z - 50 = 410 \\implies 30z = 460$? Tidak bulat! Mari perbaiki soal HOTS PG-6 agar bulat sempurna: jika $x=15.000, y=12.000, z=15.000$ atau $x=14, y=12, z=16$: H1 $10(14)+15(12)+5(16)=140+180+80=400$, H2 $10(14+12+16)=420$, H3 $5(14)+15(12)+10(16)=70+180+160=410$. Cek det: $x=14,y=12,z=16$! Kita ganti angka omzet PG-6 menjadi 400.000, 420.000, 410.000 dan opsi benar Rp16.000!',
  },
  {
    id: 'hots-pg-7',
    format: 'pg',
    topic: 'Pilihan Ganda · Perdagangan Buah',
    context: 'Agribisnis SMK',
    question:
      'Diketahui harga per kg jeruk $x = 20.000$, mangga $y = 18.000$, dan pir $z = 30.000$. Seorang pelanggan hanya membawa uang Rp150.000 untuk membeli 2 kg jeruk dan 2 kg mangga, serta sisa uangnya dibelikan pir sebanyak mungkin. Berapa maksimal kg pir yang dapat dibeli?',
    options: ['1 kg', '2 kg', '3 kg', '4 kg'],
    correctIndex: 1,
    explanation: 'Biaya 2 kg jeruk + 2 kg mangga $= 2(20.000) + 2(18.000) = 76.000$. Sisa uang $= 150.000 - 76.000 = 74.000$. Karena $74.000 / 30.000 = 2,47$, maksimal pir yang terbeli adalah $2$ kg.',
  },
  {
    id: 'hots-pg-8',
    format: 'pg',
    topic: 'Pilihan Ganda · Jasa Cetak DKV',
    context: 'Unit Produksi DKV',
    question:
      'Unit produksi DKV mencetak brosur A ($x$), poster B ($y$), dan stiker C ($z$). Pesanan 1: $x + 2y + z = 55.000$. Pesanan 2: $2x + y + 2z = 75.000$. Pesanan 3: $x + y + z = 40.000$. Berapakah biaya mencetak 1 poster B ($y$)?',
    options: ['Rp10.000', 'Rp12.000', 'Rp15.000', 'Rp20.000'],
    correctIndex: 2,
    explanation: 'Kurangkan Pesanan 1 dengan Pesanan 3: $(x + 2y + z) - (x + y + z) = 55.000 - 40.000 \\implies y = 15.000$.',
  },
  {
    id: 'hots-pg-9',
    format: 'pg',
    topic: 'Pilihan Ganda · Analisis Sistem',
    context: 'Kewirausahaan Jasa',
    question:
      'Perhatikan sistem $\\begin{cases} 2x + 4y - 2z = 10 \\\\ x + 2y - z = 5 \\\\ 3x + 6y - 3z = 15 \\end{cases}$. Mengapa sistem ini TIDAK dapat menghasilkan satu harga unik untuk masing-masing barang $x, y, z$?',
    options: [
      'Karena koefisien $z$ bernilai negatif',
      'Karena ketiga persamaan sebenarnya merupakan kelipatan dari satu persamaan yang sama',
      'Karena konstantanya terlalu kecil',
      'Karena variabelnya bukan bilangan bulat',
    ],
    correctIndex: 1,
    explanation: 'Persamaan pertama ($\\times 2$) dan ketiga ($\\times 3$) adalah kelipatan persamaan kedua, sehingga hanya ada 1 informasi bebas dan solusinya tak hingga.',
  },
  {
    id: 'hots-pg-10',
    format: 'pg',
    topic: 'Pilihan Ganda · Event Sekolah',
    context: 'OSIS & Pemasaran',
    question:
      'Pada penjualan tiket pentas seni SMK (Pelajar $x=15.000$, Mahasiswa $y=25.000$, Umum $z=40.000$), panitia menargetkan pemasukan Rp450.000 dari tepat 10 tiket pelajar, $k$ tiket mahasiswa, dan 5 tiket umum. Nilai $k$ adalah...',
    options: ['3 tiket', '4 tiket', '5 tiket', '6 tiket'],
    correctIndex: 1,
    explanation: '$10(15.000) + k(25.000) + 5(40.000) = 450.000 \\implies 150.000 + 25.000k + 200.000 = 450.000 \\implies 25.000k = 100.000 \\implies k = 4$.',
  },

  // --- 10 PILIHAN GANDA KOMPLEKS (MULTI-SELECT) ---
  {
    id: 'hots-pgk-1',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Identifikasi SPLTV',
    context: 'Konsep Aljabar',
    question: 'Manakah sistem di bawah ini yang TERMASUK SPLTV? (Pilih semua yang benar)',
    options: [
      '$\\begin{cases} x + y + z = 6 \\\\ 2x - z = 3 \\\\ y + 4z = 10 \\end{cases}$',
      '$\\begin{cases} a^2 + b + c = 9 \\\\ a + b - c = 2 \\\\ 2a - b + c = 5 \\end{cases}$',
      '$\\begin{cases} 3p - 2q + r = 12 \\\\ p + q - 4r = -2 \\\\ 5p + 3q + 2r = 19 \\end{cases}$',
      '$\\begin{cases} 2x + 3y = 14 \\\\ x - y = 2 \\\\ 4x + y = 18 \\end{cases}$',
    ],
    correctIndex: 0,
    correctIndices: [0, 2],
    explanation: 'Pilihan A dan C memuat 3 variabel yang masing-masing berpangkat $1$. Pilihan B memuat $a^2$ (kuadrat) dan pilihan D hanya memiliki 2 variabel ($x, y$).',
  },
  {
    id: 'hots-pgk-2',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Usaha Kuliner',
    context: 'Usaha Catering SMK',
    question:
      'Sebuah katering mencatat: 2 nasi kotak A, 1 kotak B, 1 kotak C = Rp75.000; 1 A, 2 B, 1 C = Rp80.000; 1 A, 1 B, 2 C = Rp85.000. Jika harga masing-masing adalah $x=15.000$, $y=20.000$, $z=25.000$, pernyataan mana sajakah yang BENAR?',
    options: [
      'Harga 1 kotak A + 1 kotak B + 1 kotak C = Rp60.000',
      'Kotak C lebih mahal Rp10.000 dibanding kotak A',
      'Membeli 2 kotak A lebih mahal daripada 1 kotak C',
      'Total biaya 3 kotak B adalah Rp60.000',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2, 3],
    explanation: 'Cek: $x+y+z=15+20+25=60$ rb (A benar); $25-15=10$ rb (B benar); $2(15)=30 > 25$ (C benar); $3(20)=60$ rb (D benar).',
  },
  {
    id: 'hots-pgk-3',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Strategi Substitusi',
    context: 'Pemodelan Koperasi',
    question:
      'Diketahui sistem $\\begin{cases} 2x + 3y - z = 11 \\\\ x - y + 2z = 9 \\\\ 3x + 2y + 4z = 27 \\end{cases}$. Langkah perubahan bentuk persamaan yang BENAR dan bebas pecahan untuk memulai substitusi adalah...',
    options: [
      'Dari Pers.(1): $z = 2x + 3y - 11$',
      'Dari Pers.(2): $x = 9 + y - 2z$',
      'Dari Pers.(2): $y = x + 2z - 9$',
      'Dari Pers.(3): $x = 27 - 2y - 4z$',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'A, B, dan C benar memindahkan ruas secara tepat dari variabel berkoefisien $\\pm 1$. D salah karena lupa membagi ruas kanan dengan $3$.',
  },
  {
    id: 'hots-pgk-4',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Strategi Eliminasi',
    context: 'Produksi Barang',
    question:
      'Diketahui Pers.(1) $3x + 2y - z = 14$ dan Pers.(2) $2x - 4y + 3z = 1$. Manakah operasi eliminasi di bawah ini yang BENAR-BENAR menghilangkan salah satu variabel?',
    options: [
      'Kalikan (1) dengan $2$, lalu jumlahkan dengan (2) untuk menghilangkan $y$',
      'Kalikan (1) dengan $3$, lalu jumlahkan dengan (2) untuk menghilangkan $z$',
      'Kalikan (1) dengan $2$ dan (2) dengan $3$, lalu kurangkan untuk menghilangkan $x$',
      'Kalikan (1) dengan $2$, lalu kurangkan dengan (2) untuk menghilangkan $y$',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'A: $+4y + (-4y) = 0$; B: $-3z + 3z = 0$; C: $6x - 6x = 0$. D salah karena $+4y - (-4y) = 8y \\neq 0$.',
  },
  {
    id: 'hots-pgk-5',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Bahan Baku Kuliner',
    context: 'Bakery SMK',
    question:
      'Toko roti SMK membeli tepung ($x$), mentega ($y$), dan gula ($z$) dalam ribuan/kg dengan solusi $(x, y, z) = (12, 35, 16)$. Manakah paket belanja yang dapat dibeli dengan uang pas Rp150.000?',
    options: [
      '$5\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $1\\text{ kg}$ gula? ($60+70+16=146$)',
      '$2\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $3\\text{ kg}$ gula ($24+70+48=142$)',
      '$3\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $2\\text{ kg}$ gula? ($36+70+32=138$)',
      '$4\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $2\\text{ kg}$ gula ($48+70+32=150$)',
    ],
    correctIndex: 0,
    correctIndices: [3],
    explanation: 'Mari pastikan kita pilih beberapa opsi yang tepat Rp150.000 atau pertanyaannya "biaya $\\le$ Rp145.000"! Cek di bawah kita buat soal super jelas.',
  },
  {
    id: 'hots-pgk-6',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Koperasi Sekolah',
    context: 'Pengadaan Alat Tulis',
    question:
      'Diketahui harga buku $x = 5.000$, pensil $y = 3.000$, dan penggaris $z = 4.000$. Pernyataan manakah yang BENAR tentang kombinasi pembelian berikut?',
    options: [
      '4 buku + 2 pensil + 1 penggaris = Rp30.000',
      '2 buku + 4 pensil + 2 penggaris = Rp30.000',
      '3 buku + 3 pensil + 3 penggaris = Rp36.000',
      '5 buku + 1 pensil + 2 penggaris = Rp34.000',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'A: $20+6+4=30$ rb (Benar); B: $10+12+8=30$ rb (Benar); C: $15+9+12=36$ rb (Benar); D: $25+3+8=36 \\neq 34$ rb (Salah).',
  },
  {
    id: 'hots-pgk-7',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Produksi Tiga Mesin',
    context: 'Workshop Pemesinan',
    question:
      'Kapasitas produksi Mesin A ($x=40$), Mesin B ($y=50$), dan Mesin C ($z=80$) unit/jam. Agar target minimal 400 unit tercapai dalam 2 jam kerja gabungan, kombinasi jadwal manakah yang MEMENUHI target?',
    options: [
      'Mesin A 2 jam + Mesin B 2 jam + Mesin C 2 jam',
      'Mesin A 3 jam + Mesin B 2 jam + Mesin C 2 jam',
      'Mesin A 1 jam + Mesin B 3 jam + Mesin C 3 jam',
      'Mesin A 4 jam + Mesin B 3 jam + Mesin C 1 jam',
    ],
    correctIndex: 0,
    correctIndices: [1, 2],
    explanation: 'A: $80+100+160=340$ (<400); B: $120+100+160=380$? Tunggu! $3(40)+2(50)+2(80)=120+100+160=380 < 400$! Cek C: $40+150+240=430 \\ge 400$. Cek D: $160+150+80=390 < 400$. Agar ada 2 jawaban benar, kita atur target minimal 380 unit sehingga B ($380$) dan C ($430$) dan D ($390$) memenuhi, atau kita perbaiki angkanya di bawah!',
  },
  {
    id: 'hots-pgk-8',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Kewirausahaan Kain',
    context: 'Butik SMK',
    question:
      'Dengan harga kain katun $x = 35.000$, satin $y = 50.000$, dan linen $z = 65.000$ per meter, pernyataan mana yang tepat?',
    options: [
      'Membeli 2 m katun + 2 m satin biayanya Rp170.000',
      'Harga 1 m linen sama dengan harga 1 m katun ditambah Rp30.000',
      'Total harga 1 m masing-masing kain adalah Rp150.000',
      'Membeli 3 m satin lebih murah daripada membeli 2 m linen',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'A: $70+100=170$ rb (Benar); B: $35+30=65$ rb (Benar); C: $35+50+65=150$ rb (Benar); D: $3(50)=150 > 2(65)=130$ (Salah).',
  },
  {
    id: 'hots-pgk-9',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Pengecekan Solusi',
    context: 'Analisis Solusi',
    question:
      'Diketahui $(x, y, z) = (3, -1, 4)$ merupakan himpunan penyelesaian suatu SPLTV. Persamaan mana sajakah yang DIPENUHI oleh titik tersebut?',
    options: [
      '$x + y + z = 6$',
      '$2x - 3y + z = 13$',
      '$x - 2y - z = 1$',
      '$4x + y - 2z = 5$',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'Uji $(3,-1,4)$: A: $3-1+4=6$ (Benar); B: $6+3+4=13$ (Benar); C: $3+2-4=1$ (Benar); D: $12-1-8=3 \\neq 5$ (Salah).',
  },
  {
    id: 'hots-pgk-10',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Perdagangan Sembako',
    context: 'Gudang Sembako',
    question:
      'Harga beras $x=14.000$/kg, gula $y=16.000$/kg, dan minyak $z=17.000$/L. Jika toko menaikkan harga minyak sebesar Rp1.000/L dan memberi diskon beras Rp500/kg, manakah pernyataan baru yang BENAR?',
    options: [
      'Harga baru 1 L minyak menjadi Rp18.000',
      'Harga 2 kg beras baru menjadi Rp27.000',
      'Harga 1 kg gula tetap Rp16.000',
      'Total paket (1 beras + 1 gula + 1 minyak) menjadi Rp48.000',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'Beras baru $= 13.500$, gula $= 16.000$, minyak baru $= 18.000$. Total paket baru $= 13.500 + 16.000 + 18.000 = 47.500 \\neq 48.000$. Jadi A, B, C benar.',
  },

  // --- 5 BENAR ATAU SALAH ---
  {
    id: 'hots-bs-1',
    format: 'benar-salah',
    topic: 'Benar/Salah · Syarat SPLTV',
    context: 'Konsep SPLTV',
    question:
      'Pernyataan: Sistem $\\begin{cases} x + y + z = 10 \\\\ x + y = 7 \\\\ y + z = 8 \\end{cases}$ BUKAN merupakan SPLTV karena persamaan kedua tidak memiliki variabel $z$.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
    explanation: 'SALAH. Sistem tersebut tetap merupakan SPLTV karena total memuat 3 variabel ($x, y, z$) berpangkat $1$; pada persamaan kedua koefisien $z$ bernilai $0$.',
  },
  {
    id: 'hots-bs-2',
    format: 'benar-salah',
    topic: 'Benar/Salah · Kewirausahaan',
    context: 'Usaha Minuman SMK',
    question:
      'Pernyataan: Jika 3 cup boba ($x$), 2 cup thai tea ($y$), dan 1 cup matcha ($z$) berharga Rp58.000, sedangkan $x = 10.000$ dan $y = 9.000$, maka harga 1 cup matcha ($z$) adalah Rp10.000.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. $3(10.000) + 2(9.000) + z = 58.000 \\implies 30.000 + 18.000 + z = 58.000 \\implies z = 10.000$.',
  },
  {
    id: 'hots-bs-3',
    format: 'benar-salah',
    topic: 'Benar/Salah · Aturan Eliminasi',
    context: 'Metode Eliminasi',
    question:
      'Pernyataan: Untuk menghilangkan variabel $y$ dari persamaan $4x - 3y + z = 12$ dan $2x + 3y - 2z = 8$, kedua persamaan harus DIKURANGKAN.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
    explanation: 'SALAH. Karena koefisien $y$ bertanda berlawanan ($-3y$ dan $+3y$), kedua persamaan harus DIJUMLAHKAN agar $-3y + 3y = 0$.',
  },
  {
    id: 'hots-bs-4',
    format: 'benar-salah',
    topic: 'Benar/Salah · Produksi',
    context: 'Unit Produksi Kriya',
    question:
      'Pernyataan: Jika $2x + 2y + 2z = 90.000$, maka nilai dari $x + y + z$ pasti sama dengan Rp45.000.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. Membagi kedua ruas persamaan linear dengan bilangan bukan nol ($2$) menghasilkan persamaan ekuivalen $x + y + z = 45.000$.',
  },
  {
    id: 'hots-bs-5',
    format: 'benar-salah',
    topic: 'Benar/Salah · Perubahan Persamaan',
    context: 'Metode Substitusi',
    question:
      'Pernyataan: Persamaan $x - 2y + 3z = 15$ ekuivalen dengan bentuk $x = 15 - 2y + 3z$.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
    explanation: 'SALAH. Ketika $-2y$ dan $+3z$ berpindah ke ruas kanan, tandanya wajib berubah menjadi $x = 15 + 2y - 3z$.',
  },

  // --- 5 URAIAN HOTS ---
  {
    id: 'hots-ur-1',
    format: 'uraian',
    topic: 'Uraian HOTS · Usaha Kuliner',
    context: 'Usaha Kuliner SMK',
    question:
      'Sebuah kedai kuliner siswa SMK menjual 3 menu sarapan: Nasi Uduk ($x$), Bubur Ayam ($y$), dan Lontong Sayur ($z$). Pada pagi hari terjual 1 porsi masing-masing menu dengan total Rp36.000 ($x+y+z=36.000$). Harga Bubur Ayam Rp2.000 lebih mahal dari Nasi Uduk ($y = x + 2.000$), dan harga Lontong Sayur sama dengan Nasi Uduk ($z = x$). Tentukan model matematika serta harga masing-masing menu!',
    options: [],
    correctIndex: 0,
    expectedKeywords: ['11', '13', '36', 'x'],
    sampleAnswer:
      'Model: x + y + z = 36.000, y = x + 2.000, z = x. Substitusi ke pers.(1): x + (x + 2.000) + x = 36.000 -> 3x = 34.000? Tunggu, ganti total 38.000 agar bulat 3x=36.000 -> x=12.000!',
    explanation: 'Pastikan kita menggunakan Rp38.000 di soal agar $3x = 36.000 \\implies x = 12.000, y = 14.000, z = 12.000$.',
  },
  {
    id: 'hots-ur-2',
    format: 'uraian',
    topic: 'Uraian HOTS · Koperasi Sekolah',
    context: 'Koperasi Siswa',
    question:
      'Koperasi SMK menjual paket alat praktik: 2 spidol ($x$) + 1 penghapus ($y$) + 1 penggaris ($z$) = Rp27.000. Jika $x + y + z = 19.000$ dan $y + z = 11.000$, hitunglah nilai $x$, $y$, dan $z$ bila diketahui $y = 5.000$!',
    options: [],
    correctIndex: 0,
    expectedKeywords: ['8', '5', '6'],
    sampleAnswer:
      'Dari Pers.(2) - Pers.(3): x = 19.000 - 11.000 = 8.000. Karena y = 5.000 dan y + z = 11.000, maka z = 6.000. Cek Pers.(1): 2(8.000) + 5.000 + 6.000 = 27.000. Jadi spidol Rp8.000, penghapus Rp5.000, penggaris Rp6.000.',
    explanation: 'Substitusi $y+z=11.000$ ke $x+y+z=19.000$ memberi $x=8.000$, lalu $z=11.000-5.000=6.000$.',
  },
  {
    id: 'hots-ur-3',
    format: 'uraian',
    topic: 'Uraian HOTS · Produksi Barang',
    context: 'Bengkel Otomotif SMK',
    question:
      'Bengkel SMK merakit 3 paket servis: Paket Ringan membutuhkan 1 busi ($x$), 1 oli ($y$), 1 filter ($z$) = Rp95.000. Paket Sedang: 2 busi, 1 oli, 1 filter = Rp115.000. Paket Lengkap: 1 busi, 2 oli, 1 filter = Rp145.000. Tentukan harga 1 busi, 1 oli, dan 1 filter!',
    options: [],
    correctIndex: 0,
    expectedKeywords: ['20', '50', '25'],
    sampleAnswer:
      'Eliminasi (2)-(1): x = 20.000 (busi). Eliminasi (3)-(1): y = 50.000 (oli). Substitusi ke (1): 20.000 + 50.000 + z = 95.000 -> z = 25.000 (filter).',
    explanation: 'Kurangkan Paket Sedang dengan Ringan diperoleh $x=20.000$; kurangkan Lengkap dengan Ringan diperoleh $y=50.000$; maka $z=25.000$.',
  },
  {
    id: 'hots-ur-4',
    format: 'uraian',
    topic: 'Uraian HOTS · Pembelian Bahan Baku',
    context: 'Unit Produksi Kuliner',
    question:
      'Untuk produksi kue, siswa membeli bahan baku dengan sistem: $x + y + z = 60$, $2x + y = 50$, dan $z = 25$ (dalam ribuan rupiah). Hitunglah harga bahan $x$, $y$, dan $z$, lalu tuliskan kesimpulan konteksnya!',
    options: [],
    correctIndex: 0,
    expectedKeywords: ['15', '20', '25'],
    sampleAnswer:
      'Substitusi z = 25 ke pers.(1): x + y = 35. Kurangkan dari 2x + y = 50 -> x = 15 (Rp15.000). Lalu y = 35 - 15 = 20 (Rp20.000). Jadi x = Rp15.000, y = Rp20.000, z = Rp25.000.',
    explanation: 'Dari $z=25$ diperoleh $x+y=35$. Eliminasi dengan $2x+y=50$ menghasilkan $x=15$ dan $y=20$.',
  },
  {
    id: 'hots-ur-5',
    format: 'uraian',
    topic: 'Uraian HOTS · Kewirausahaan',
    context: 'Evaluasi Usaha Siswa',
    question:
      'Sebuah tim wirausaha siswa memperoleh sistem $\\begin{cases} x + y + z = 30 \\\\ 2x - y + z = 20 \\\\ x + 2y + z = 35 \\end{cases}$. Jelaskan langkah metode eliminasi untuk menentukan nilai $x, y,$ dan $z$ serta lakukan pengecekan hasil!',
    options: [],
    correctIndex: 0,
    expectedKeywords: ['5', '10', '15'],
    sampleAnswer:
      'Eliminasi (3) - (1): y = 5. Eliminasi (1) - (2) atau substitusi y=5 ke (1) dan (2): x + z = 25 dan 2x + z = 25 -> x = 0? Tunggu cek: kalau x=0, y=5, z=25 -> (1) 0+5+25=30, (2) 0-5+25=20, (3) 0+10+25=35! Kita pakai solusi non-nol agar lebih bermakna untuk harga barang! Misal x=10, y=5, z=15: (1) 10+5+15=30, (2) 20-5+15=30, (3) 10+10+15=35!',
    explanation: 'Dengan $2x-y+z=30$, diperoleh $y=5, x=10, z=15$.',
  },
];

// Clean exact arithmetic updates for the 4 questions we verified inline above:
HOTS_30_QUESTIONS[5] = {
  id: 'hots-pg-6',
  format: 'pg',
  topic: 'Pilihan Ganda · Kewirausahaan',
  context: 'Bazar Wirausaha SMK',
  question:
    'Tim kewirausahaan menjual kopi susu ($x$), teh tarik ($y$), dan cokelat ($z$). Omzet hari ke-1 ($10x + 15y + 5z = 400.000$), hari ke-2 ($10x + 10y + 10z = 420.000$), dan hari ke-3 ($5x + 15y + 10z = 410.000$). Harga 1 gelas cokelat ($z$) adalah...',
  options: ['Rp12.000', 'Rp14.000', 'Rp15.000', 'Rp16.000'],
  correctIndex: 3,
  explanation: 'Dengan eliminasi/substitusi: $x=14.000, y=12.000, z=16.000$. Cek H1: $140+180+80=400$ rb; H2: $140+120+160=420$ rb; H3: $70+180+160=410$ rb.',
};

HOTS_30_QUESTIONS[14] = {
  id: 'hots-pgk-5',
  format: 'pg-kompleks',
  topic: 'PG Kompleks · Bahan Baku Kuliner',
  context: 'Bakery SMK',
  question:
    'Toko roti SMK membeli tepung ($x=12.000$/kg), mentega ($y=35.000$/kg), dan gula ($z=16.000$/kg). Manakah paket belanja yang total biayanya TEPAT Rp150.000?',
  options: [
    '$4\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $2\\text{ kg}$ gula',
    '$1\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $4\\text{ kg}$ gula',
    '$2\\text{ kg}$ tepung + $3\\text{ kg}$ mentega + $1\\text{ kg}$ gula',
    '$3\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $3\\text{ kg}$ gula',
  ],
  correctIndex: 0,
  correctIndices: [0],
  explanation: 'A: $4(12)+2(35)+2(16)=48+70+32=150$ rb. B: $12+70+64=146$ rb. C: $24+105+16=145$ rb. D: $36+70+48=154$ rb.',
};
// Let's make B also exact 150k by changing B to: 5 kg tepung + 2 kg mentega + 1,25? No, integer: 6 kg tepung + 2 kg mentega + 0,5? No: 12(4)+35(2)+16(2)=150. What about 12(7)+35(1)+16(2)=84+35+32=151. 12(1)+35(3)+16(2)=12+105+32=149. 12(2)+35(2)+16(3)=24+70+48=142. 12(5)+35(2)+16(1)=146. Let's make the prompt: "total biayanya TIDAK MELEBIHI Rp146.000" -> B (146rb) and C (145rb) and let's test! Or even cleaner: "tidak melebihi Rp145.000" -> only C? No, multi-select should have 2+ options! If "tidak melebihi Rp147.000": B (146rb) dan C (145rb)! Let's update HOTS_30_QUESTIONS[14] cleanly:
HOTS_30_QUESTIONS[14] = {
  id: 'hots-pgk-5',
  format: 'pg-kompleks',
  topic: 'PG Kompleks · Bahan Baku Kuliner',
  context: 'Bakery SMK',
  question:
    'Toko roti SMK membeli tepung ($x=12.000$/kg), mentega ($y=35.000$/kg), dan gula ($z=16.000$/kg). Jika anggaran belanja maksimal Rp147.000, paket mana sajakah yang MASIH CUKUP dibeli?',
  options: [
    '$4\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $2\\text{ kg}$ gula',
    '$1\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $4\\text{ kg}$ gula',
    '$2\\text{ kg}$ tepung + $3\\text{ kg}$ mentega + $1\\text{ kg}$ gula',
    '$3\\text{ kg}$ tepung + $2\\text{ kg}$ mentega + $3\\text{ kg}$ gula',
  ],
  correctIndex: 0,
  correctIndices: [1, 2],
  explanation: 'A = Rp150.000 (melebihi); B = $12+70+64=$ Rp146.000 (cukup); C = $24+105+16=$ Rp145.000 (cukup); D = $36+70+48=$ Rp154.000 (melebihi).',
};

HOTS_30_QUESTIONS[16] = {
  id: 'hots-pgk-7',
  format: 'pg-kompleks',
  topic: 'PG Kompleks · Produksi Tiga Mesin',
  context: 'Workshop Pemesinan',
  question:
    'Kapasitas produksi Mesin A ($x=40$), Mesin B ($y=50$), dan Mesin C ($z=80$) unit/jam. Agar target minimal 380 unit tercapai, kombinasi jam operasi manakah yang MEMENUHI target?',
  options: [
    'Mesin A 2 jam + Mesin B 2 jam + Mesin C 2 jam',
    'Mesin A 3 jam + Mesin B 2 jam + Mesin C 2 jam',
    'Mesin A 1 jam + Mesin B 3 jam + Mesin C 3 jam',
    'Mesin A 4 jam + Mesin B 3 jam + Mesin C 1 jam',
  ],
  correctIndex: 0,
  correctIndices: [1, 2, 3],
  explanation: 'A: $80+100+160=340$ (<380); B: $120+100+160=380$ (Memenuhi); C: $40+150+240=430$ (Memenuhi); D: $160+150+80=390$ (Memenuhi).',
};

HOTS_30_QUESTIONS[25] = {
  id: 'hots-ur-1',
  format: 'uraian',
  topic: 'Uraian HOTS · Usaha Kuliner',
  context: 'Usaha Kuliner SMK',
  question:
    'Sebuah kedai kuliner siswa SMK menjual 3 menu sarapan: Nasi Uduk ($x$), Bubur Ayam ($y$), dan Lontong Sayur ($z$). Pada pagi hari terjual 1 porsi masing-masing menu dengan total Rp38.000 ($x+y+z=38.000$). Harga Bubur Ayam Rp2.000 lebih mahal dari Nasi Uduk ($y = x + 2.000$), dan harga Lontong Sayur sama dengan Nasi Uduk ($z = x$). Tentukan model matematika serta harga masing-masing menu!',
  options: [],
  correctIndex: 0,
  expectedKeywords: ['12', '14'],
  sampleAnswer:
    'Model: x + y + z = 38.000, y = x + 2.000, z = x. Substitusi ke pers.(1): x + (x + 2.000) + x = 38.000 -> 3x + 2.000 = 38.000 -> 3x = 36.000 -> x = 12.000. Maka y = 14.000 dan z = 12.000.',
  explanation: 'Substitusikan $y=x+2.000$ dan $z=x$ ke $x+y+z=38.000$ diperoleh $3x=36.000 \\implies x=12.000, y=14.000, z=12.000$.',
};

HOTS_30_QUESTIONS[29] = {
  id: 'hots-ur-5',
  format: 'uraian',
  topic: 'Uraian HOTS · Kewirausahaan',
  context: 'Evaluasi Usaha Siswa',
  question:
    'Sebuah tim wirausaha siswa memperoleh sistem $\\begin{cases} x + y + z = 30 \\\\ 2x - y + z = 30 \\\\ x + 2y + z = 35 \\end{cases}$. Jelaskan langkah metode eliminasi untuk menentukan nilai $x, y,$ dan $z$ serta lakukan pengecekan hasil!',
  options: [],
  correctIndex: 0,
  expectedKeywords: ['10', '5', '15'],
  sampleAnswer:
    'Eliminasi (3) - (1) menghilangkan x dan z sehingga y = 5. Jumlahkan (1) + (2) menghilangkan y: 3x + 2z = 60. Atau substitusi y = 5 ke (1) -> x + z = 25, dan ke (2) -> 2x + z = 35. Kurangkan keduanya -> x = 10, lalu z = 15. Cek: (1) 10+5+15=30, (2) 20-5+15=30, (3) 10+10+15=35.',
  explanation: 'Eliminasi $(3)-(1)$ menghasilkan $y=5$. Lalu eliminasi $z$ dari $x+z=25$ dan $2x+z=35$ menghasilkan $x=10$ dan $z=15$.',
};

// =========================================================================
// 3. ASESMEN SUMATIF (20 SOAL: 10 PG, 5 PG KOMPLEKS, 5 BENAR/SALAH)
// =========================================================================
export const SUMMATIVE_20_QUESTIONS: QuizQuestion[] = [
  // 10 PILIHAN GANDA
  {
    id: 'sum-1',
    format: 'pg',
    topic: 'Definisi SPLTV',
    question: 'Ciri utama yang membedakan SPLTV dengan sistem persamaan tidak linear adalah...',
    options: [
      'Memiliki tiga konstanta di ruas kanan',
      'Semua variabel berpangkat tepat satu dan tidak ada perkalian antarvariabel',
      'Seluruh koefisien variabelnya harus bilangan bulat positif',
      'Setiap persamaan harus memuat ketiga variabel tanpa koefisien nol',
    ],
    correctIndex: 1,
    explanation: 'Persamaan linear mensyaratkan derajat pangkat tertinggi tiap variabel adalah $1$ dan tidak ada perkalian antarvariabel.',
  },
  {
    id: 'sum-2',
    format: 'pg',
    topic: 'Unsur Persamaan',
    question: 'Diketahui persamaan $5x - y + 4z = 32$. Koefisien variabel $y$ dan konstantanya berturut-turut adalah...',
    options: ['$1$ dan $32$', '$-1$ dan $32$', '$4$ dan $32$', '$-1$ dan $4$'],
    correctIndex: 1,
    explanation: 'Suku $-y$ bermakna $(-1)\\cdot y$, sehingga koefisien $y$ adalah $-1$ dan konstantanya $32$.',
  },
  {
    id: 'sum-3',
    format: 'pg',
    topic: 'Bukan Contoh SPLTV',
    question: 'Sistem $\\begin{cases} \\frac{1}{x} + y + z = 4 \\\\ 2x + y - z = 3 \\\\ x - y + 2z = 5 \\end{cases}$ bukan merupakan SPLTV karena...',
    options: [
      'Memiliki terlalu banyak konstanta',
      'Terdapat variabel $x$ pada penyebut pecahan ($x^{-1}$)',
      'Koefisien variabel $y$ sama pada dua persamaan',
      'Memiliki lebih dari dua persamaan',
    ],
    correctIndex: 1,
    explanation: 'Bentuk $\\frac{1}{x} = x^{-1}$ memiliki pangkat $-1$, bukan pangkat $1$.',
  },
  {
    id: 'sum-4',
    format: 'pg',
    topic: 'Pemodelan Sembako',
    question:
      'Paket A berisi 5 kg beras ($x$), 2 kg gula ($y$), dan 1 L minyak ($z$) seharga Rp119.000. Paket B berisi 4 kg beras, 1 kg gula, dan 2 L minyak seharga Rp106.000. Dua persamaan yang tepat adalah...',
    options: [
      '$5x + 2y + z = 119.000$ dan $4x + y + 2z = 106.000$',
      '$5x + 2y + 2z = 119.000$ dan $4x + y + z = 106.000$',
      '$2x + 5y + z = 119.000$ dan $x + 4y + 2z = 106.000$',
      '$5x + 2y - z = 119.000$ dan $4x + y - 2z = 106.000$',
    ],
    correctIndex: 0,
    explanation: 'Setiap kuantitas barang dikalikan variabel harganya masing-masing.',
  },
  {
    id: 'sum-5',
    format: 'pg',
    topic: 'Perubahan Bentuk',
    question: 'Persamaan $2a + b - 3c = 18$ jika diubah menjadi bentuk $b = \\dots$ menghasilkan...',
    options: ['$b = 18 + 2a - 3c$', '$b = 18 - 2a + 3c$', '$b = 2a - 3c - 18$', '$b = 18 - 2a - 3c$'],
    correctIndex: 1,
    explanation: 'Pindahkan $+2a$ menjadi $-2a$ dan $-3c$ menjadi $+3c$: $b = 18 - 2a + 3c$.',
  },
  {
    id: 'sum-6',
    format: 'pg',
    topic: 'Metode Substitusi',
    question:
      'Diketahui $\\begin{cases} x + y + z = 6 \\\\ x + y = 4 \\\\ y + z = 5 \\end{cases}$. Dengan metode substitusi, nilai $(x, y, z)$ adalah...',
    options: ['$(1, 3, 2)$', '$(2, 3, 1)$', '$(3, 1, 2)$', '$(1, 2, 3)$'],
    correctIndex: 0,
    explanation: 'Substitusi $x+y=4$ ke pers.(1): $4+z=6 \\implies z=2$. Lalu $y+2=5 \\implies y=3$, dan $x+3=4 \\implies x=1$.',
  },
  {
    id: 'sum-7',
    format: 'pg',
    topic: 'Metode Eliminasi',
    question:
      'Jika diketahui Pers.(1) $2x + 3y - z = 9$ dan Pers.(2) $x - y + 2z = 5$, cara mengeliminasi $z$ yang paling tepat adalah...',
    options: [
      'Kalikan (1) dengan $2$, lalu jumlahkan dengan (2)',
      'Kalikan (1) dengan $2$, lalu kurangkan dengan (2)',
      'Kalikan (2) dengan $2$, lalu jumlahkan dengan (1)',
      'Kurangkan langsung (1) dengan (2)',
    ],
    correctIndex: 0,
    explanation: 'Pers.(1) dikali $2$ menjadi $4x + 6y - 2z = 18$. Karena $-2z$ dan $+2z$ berlawanan tanda, keduanya dijumlahkan.',
  },
  {
    id: 'sum-8',
    format: 'pg',
    topic: 'Penyelesaian SPLTV',
    question:
      'Himpunan penyelesaian dari $\\begin{cases} x + y + z = 9 \\\\ 2x + y - z = 3 \\\\ x - y + 2z = 7 \\end{cases}$ adalah...',
    options: ['$(2, 3, 4)$', '$(3, 2, 4)$', '$(4, 3, 2)$', '$(2, 4, 3)$'],
    correctIndex: 0,
    explanation: 'Uji $(2,3,4)$: (1) $2+3+4=9$; (2) $2(2)+3-4=3$; (3) $2-3+2(4)=7$. Semua terpenuhi.',
  },
  {
    id: 'sum-9',
    format: 'pg',
    topic: 'Aplikasi Produksi Mesin',
    question:
      'Mesin A ($x=40$), Mesin B ($y=50$), dan Mesin C ($z=80$) unit/jam. Total komponen jika Mesin A bekerja 2 jam, B 1 jam, dan C 2 jam adalah...',
    options: ['250 unit', '270 unit', '290 unit', '310 unit'],
    correctIndex: 2,
    explanation: '$2(40) + 1(50) + 2(80) = 80 + 50 + 160 = 290$ unit.',
  },
  {
    id: 'sum-10',
    format: 'pg',
    topic: 'Aplikasi Harga Tiket',
    question:
      'Harga tiket pelajar Rp15.000, mahasiswa Rp25.000, dan umum Rp40.000. Jika rombongan SMK membeli 4 tiket pelajar, 1 tiket mahasiswa, dan 2 tiket umum, total biayanya adalah...',
    options: ['Rp155.000', 'Rp165.000', 'Rp170.000', 'Rp180.000'],
    correctIndex: 1,
    explanation: '$4(15.000) + 1(25.000) + 2(40.000) = 60.000 + 25.000 + 80.000 = 165.000$.',
  },

  // 5 PILIHAN GANDA KOMPLEKS
  {
    id: 'sum-11',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Ciri SPLTV',
    question: 'Pilih semua pernyataan yang BENAR mengenai Sistem Persamaan Linear Tiga Variabel:',
    options: [
      'Pangkat tertinggi setiap variabel harus tepat $1$',
      'Tidak boleh ada suku perkalian antarvariabel seperti $xy$',
      'Setiap persamaan wajib memuat ketiga variabel dengan koefisien bukan nol',
      'Solusi tunggal SPLTV dapat dipandang sebagai titik potong tiga bidang di ruang 3D',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 3],
    explanation: 'Pernyataan A, B, dan D benar. Pernyataan C salah karena salah satu koefisien variabel boleh bernilai $0$ asalkan sistem secara keseluruhan memuat 3 variabel.',
  },
  {
    id: 'sum-12',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Eliminasi Lanjutan',
    question:
      'Diketahui sistem $\\begin{cases} 3x - y + 2z = 15 \\\\ 2x + y + z = 13 \\\\ 3x + 2y + 2z = 24 \\end{cases}$. Manakah pernyataan yang BENAR?',
    options: [
      'Mengurangkan Pers.(3) dengan Pers.(1) langsung menghasilkan $3y = 9$',
      'Menjumlahkan Pers.(1) dengan Pers.(2) langsung mengeliminasi variabel $y$',
      'Nilai $y$ pada penyelesaian sistem tersebut adalah $3$',
      'Nilai $x$ pada penyelesaian sistem tersebut adalah $5$',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'A: $(3x+2y+2z)-(3x-y+2z)=24-15 \\implies 3y=9$ ($y=3$). B: $-y+y=0$. D salah karena nilai $x=2$ dan $z=6$.',
  },
  {
    id: 'sum-13',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Buah & Sembako',
    question:
      'Diketahui harga jeruk $x=20.000$/kg, mangga $y=18.000$/kg, dan pir $z=30.000$/kg. Manakah kombinasi pembelian yang total harganya LEBIH DARI Rp100.000?',
    options: [
      '$2\\text{ kg}$ jeruk + $2\\text{ kg}$ mangga + $1\\text{ kg}$ pir ($106.000$)',
      '$1\\text{ kg}$ jeruk + $2\\text{ kg}$ mangga + $1\\text{ kg}$ pir ($86.000$)',
      '$2\\text{ kg}$ jeruk + $1\\text{ kg}$ mangga + $2\\text{ kg}$ pir ($118.000$)',
      '$1\\text{ kg}$ jeruk + $1\\text{ kg}$ mangga + $2\\text{ kg}$ pir ($98.000$)',
    ],
    correctIndex: 0,
    correctIndices: [0, 2],
    explanation: 'Wait: jangan tulis nominal di opsi supaya tidak membocorkan! Mari tulis tanpa nominal di `SUMMATIVE_20_QUESTIONS[12]`.',
  },
  {
    id: 'sum-14',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Alat Tulis',
    question:
      'Pada kasus koperasi SMK: buku $x=5.000$, pensil $y=3.000$, penggaris $z=4.000$. Pernyataan mana sajakah yang BENAR?',
    options: [
      'Harga 1 buku + 1 pensil + 1 penggaris adalah Rp12.000',
      'Harga 2 buku sama dengan harga 2 pensil ditambah 1 penggaris',
      'Membeli 3 buku dan 2 pensil biayanya Rp21.000',
      'Harga 1 penggaris lebih mahal daripada harga 1 buku',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'A: $5+3+4=12$ rb; B: $2(5)=10$ rb dan $2(3)+4=10$ rb; C: $15+6=21$ rb; D salah karena penggaris ($4.000$) lebih murah dari buku ($5.000$).',
  },
  {
    id: 'sum-15',
    format: 'pg-kompleks',
    topic: 'PG Kompleks · Verifikasi Solusi',
    question:
      'Titik $(x, y, z) = (2, 1, 3)$ merupakan solusi yang TEPAT untuk persamaan mana saja?',
    options: [
      '$x + 2y + z = 7$',
      '$3x - y + 2z = 11$',
      '$2x + y - z = 2$',
      '$x + y + z = 8$',
    ],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
    explanation: 'Uji $(2,1,3)$: A: $2+2+3=7$ (Benar); B: $6-1+6=11$ (Benar); C: $4+1-3=2$ (Benar); D: $2+1+3=6 \\neq 8$ (Salah).',
  },

  // 5 BENAR ATAU SALAH
  {
    id: 'sum-16',
    format: 'benar-salah',
    topic: 'Benar/Salah · Substitusi',
    question:
      'Pernyataan: Dalam metode substitusi, kita bebas memilih persamaan mana saja yang akan diubah bentuknya terlebih dahulu, meskipun paling disarankan memilih persamaan berkoefisien $\\pm 1$.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. Secara matematis persamaan mana pun boleh dipilih, namun memilih koefisien $1$ atau $-1$ mencegah munculnya pecahan.',
  },
  {
    id: 'sum-17',
    format: 'benar-salah',
    topic: 'Benar/Salah · Pengecekan Hasil',
    question:
      'Pernyataan: Jika $(x, y, z)$ sudah memenuhi Persamaan (1) dan Persamaan (2), kita tidak perlu lagi mengecek Persamaan (3) karena pasti benar.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
    explanation: 'SALAH. Himpunan penyelesaian SPLTV wajib memenuhi KETIGA persamaan secara simultan.',
  },
  {
    id: 'sum-18',
    format: 'benar-salah',
    topic: 'Benar/Salah · Unsur Persamaan',
    question:
      'Pernyataan: Pada persamaan $7p - q + 2r = 0$, konstanta persamaan bernilai $0$ dan koefisien $q$ adalah $-1$.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. Ruas kanan bernilai $0$ sebagai konstanta dan suku $-q$ memiliki koefisien $-1$.',
  },
  {
    id: 'sum-19',
    format: 'benar-salah',
    topic: 'Benar/Salah · Eliminasi',
    question:
      'Pernyataan: Ketika mengeliminasi variabel $x$ dari dua pasang persamaan yang berbeda, kita harus memperoleh dua persamaan baru dalam variabel yang sama (misal sama-sama dalam $y$ dan $z$).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. Mengeliminasi variabel yang sama dari dua pasangan berbeda memastikan hasilnya membentuk SPLDV dengan dua variabel yang sama.',
  },
  {
    id: 'sum-20',
    format: 'benar-salah',
    topic: 'Benar/Salah · Aplikasi Kain',
    question:
      'Pernyataan: Jika harga 1 m kain katun Rp35.000, satin Rp50.000, dan linen Rp65.000, maka membeli 2 m katun dan 1 m linen menghabiskan tepat Rp135.000.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. $2(35.000) + 1(65.000) = 70.000 + 65.000 = 135.000$.',
  },
];

// Clean sum-13 option text so it doesn't leak calculated totals in the options
SUMMATIVE_20_QUESTIONS[12] = {
  id: 'sum-13',
  format: 'pg-kompleks',
  topic: 'PG Kompleks · Buah & Sembako',
  question:
    'Diketahui harga jeruk $x=20.000$/kg, mangga $y=18.000$/kg, dan pir $z=30.000$/kg. Manakah kombinasi pembelian yang total harganya LEBIH DARI Rp100.000?',
  options: [
    '$2\\text{ kg}$ jeruk + $2\\text{ kg}$ mangga + $1\\text{ kg}$ pir',
    '$1\\text{ kg}$ jeruk + $2\\text{ kg}$ mangga + $1\\text{ kg}$ pir',
    '$2\\text{ kg}$ jeruk + $1\\text{ kg}$ mangga + $2\\text{ kg}$ pir',
    '$1\\text{ kg}$ jeruk + $1\\text{ kg}$ mangga + $2\\text{ kg}$ pir',
  ],
  correctIndex: 0,
  correctIndices: [0, 2],
  explanation: 'A: $40+36+30=106$ rb (>100 rb); B: $20+36+30=86$ rb; C: $40+18+60=118$ rb (>100 rb); D: $20+18+60=98$ rb.',
};
