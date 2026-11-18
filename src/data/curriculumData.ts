import { MeetingLessonData, QuizQuestion } from '../types/module';
import { LinearEquation3 } from '../utils/spltvSolver';

export const HERO_IMAGE_PATH = '/src/assets/images/hero_spltv_3d_1794872368067.jpg';
export const TEACHER_IMAGE_PATH = '/src/assets/images/profil_guru_avatar_1794872368784.jpg';

export interface ExampleClassifierItem {
  id: string;
  equationLatex: string;
  isSpltv: boolean;
  reason: string;
}

export const CONTOH_BUKAN_CONTOH_ITEMS: ExampleClassifierItem[] = [
  {
    id: 'ex-1',
    equationLatex: '\\begin{cases} 2x + y - z = 5 \\\\ x - 3y + 2z = 11 \\\\ 3x + 2y + z = 14 \\end{cases}',
    isSpltv: true,
    reason: 'Memiliki 3 persamaan linear dengan 3 variabel ($x, y, z$) yang semuanya berpangkat satu.',
  },
  {
    id: 'ex-2',
    equationLatex: '\\begin{cases} x^2 + y + z = 9 \\\\ 2x - y + z = 4 \\\\ x + 3y - 2z = 1 \\end{cases}',
    isSpltv: false,
    reason: 'Bukan SPLTV karena persamaan pertama mengandung variabel berpangkat dua ($x^2$), sehingga tidak linear.',
  },
  {
    id: 'ex-3',
    equationLatex: '\\begin{cases} 3a + 2b = 12 \\\\ a - 4b = 2 \\\\ 5a + b = 17 \\end{cases}',
    isSpltv: false,
    reason: 'Bukan SPLTV karena hanya memiliki dua variabel ($a$ dan $b$), melainkan sistem persamaan linear dua variabel.',
  },
  {
    id: 'ex-4',
    equationLatex: '\\begin{cases} p + q + r = 10 \\\\ 2p - r = 3 \\\\ 3q + 2r = 14 \\end{cases}',
    isSpltv: true,
    reason: 'Termasuk SPLTV dengan variabel $p, q, r$. Pada persamaan ke-2 koefisien $q$ bernilai $0$, dan pada persamaan ke-3 koefisien $p$ bernilai $0$.',
  },
  {
    id: 'ex-5',
    equationLatex: '\\begin{cases} xy + z = 7 \\\\ x + y - z = 2 \\\\ 2x - y + 3z = 9 \\end{cases}',
    isSpltv: false,
    reason: 'Bukan SPLTV karena terdapat perkalian antarvariabel ($xy$) pada persamaan pertama.',
  },
];

export const MEETINGS_DATA: Record<'pertemuan-1' | 'pertemuan-2' | 'pertemuan-3', MeetingLessonData> = {
  'pertemuan-1': {
    id: 'pertemuan-1',
    meetingNumber: 1,
    title: 'Definisi dan Konsep SPLTV',
    subtitle: 'Mengenal Bentuk Umum, Unsur Persamaan, dan Pemodelan Matematika Konteks SMK',
    duration: '2 x 45 Menit',
    tujuan: [
      'Menjelaskan pengertian dan ciri-ciri Sistem Persamaan Linear Tiga Variabel (SPLTV) dengan tepat.',
      'Mengidentifikasi variabel, koefisien, dan konstanta pada persamaan linear tiga variabel.',
      'Membedakan contoh dan bukan contoh SPLTV berdasarkan derajat pangkat serta jumlah variabelnya.',
      'Menyusun model matematika berbentuk SPLTV dari permasalahan kontekstual SMK (pembelian kain, paket sembako, dan produksi tiga mesin).',
    ],
    pertanyaanPemantik:
      'Bayangkan kamu menjadi pengelola koperasi siswa atau bengkel praktik di SMK. Jika dalam tiga transaksi terpisah terdapat tiga jenis barang berbeda tanpa daftar harga satuan, bagaimana cara mencatat dan memodelkan hubungan ketiganya secara matematis?',
    stimulus: {
      title: 'Stimulus Masalah: Unit Produksi Busana & Koperasi SMK',
      scenario:
        'Sebuah unit produksi Tata Busana SMK menerima pesanan seragam kerja. Pada nota pertama tertulis pembelian 2 meter kain katun, 3 meter kain satin, dan 1 meter kain linen dengan total Rp285.000. Namun, harga satuan tiap meter kain belum tercantum terpisah. Di nota kedua dan ketiga terdapat kombinasi panjang kain dan total pembayaran yang berbeda.',
      promptQuestion:
        'Besaran apa saja yang belum diketahui nilainya? Bagaimana kita menuliskan ketiga informasi nota belanja tersebut ke dalam kalimat matematika yang terstruktur?',
    },
    konsepSections: [
      {
        id: 'pengertian',
        title: '1. Pengertian SPLTV',
        body: 'Sistem Persamaan Linear Tiga Variabel (SPLTV) adalah sekumpulan tiga persamaan linear yang masing-masing memuat paling banyak tiga variabel berpangkat satu dan saling berkaitan sehingga memiliki himpunan penyelesaian bersama $(x, y, z)$.',
        bullets: [
          'Kata "Linear" berarti pangkat tertinggi setiap variabel tepat bernilai 1.',
          'Kata "Tiga Variabel" berarti terdapat tiga besaran tak diketahui, umumnya dilambangkan $x$, $y$, dan $z$ (atau $a, b, c$).',
          'Kata "Sistem" menunjukkan ketiga persamaan membentuk satu kesatuan syarat yang harus dipenuhi bersamaan.',
        ],
      },
      {
        id: 'bentuk-umum',
        title: '2. Bentuk Umum SPLTV',
        body: 'Secara matematis, bentuk umum Sistem Persamaan Linear Tiga Variabel dalam variabel $x$, $y$, dan $z$ dituliskan sebagai berikut:',
        mathBlocks: [
          '\\begin{cases} a_1x + b_1y + c_1z = d_1 \\\\ a_2x + b_2y + c_2z = d_2 \\\\ a_3x + b_3y + c_3z = d_3 \\end{cases}',
        ],
        bullets: [
          'Dengan $a_1, a_2, a_3, b_1, b_2, b_3, c_1, c_2, c_3, d_1, d_2, d_3 \\in \\mathbb{R}$.',
          'Koefisien variabel pada masing-masing persamaan tidak semuanya bernilai nol secara bersamaan.',
        ],
      },
      {
        id: 'ciri-ciri',
        title: '3. Ciri-Ciri SPLTV',
        body: 'Untuk mengenali apakah suatu sistem persamaan merupakan SPLTV, perhatikan empat ciri utama berikut:',
        bullets: [
          'Menggunakan relasi tanda sama dengan ($=$) pada setiap persamaan.',
          'Memiliki tiga jenis variabel yang berbeda (misalnya $x$, $y$, dan $z$).',
          'Setiap variabel memiliki pangkat tertinggi satu (derajat 1) dan tidak ada perkalian antarvariabel seperti $xy$, $xz$, atau $yz$.',
          'Variabel tidak berada di dalam penyebut pecahan (seperti $\\frac{1}{x}$) maupun di dalam tanda akar ($\\sqrt{y}$).',
        ],
      },
      {
        id: 'unsur-unsur',
        title: '4. Unsur-Unsur Persamaan Linear Tiga Variabel',
        body: 'Perhatikan persamaan $3x + 5y - 2z = 24.000$. Persamaan tersebut tersusun atas empat unsur penting:',
        bullets: [
          'Variabel: lambang pengganti nilai yang belum diketahui, yaitu $x$, $y$, dan $z$.',
          'Koefisien: bilangan pengali di depan variabel. Koefisien $x$ adalah $3$, koefisien $y$ adalah $5$, dan koefisien $z$ adalah $-2$.',
          'Konstanta: bilangan tetap yang tidak memuat variabel, yaitu $24.000$.',
          'Suku: bagian-bagian persamaan yang dipisahkan oleh operasi penjumlahan atau pengurangan ($3x$, $5y$, $-2z$, dan $24.000$).',
        ],
      },
      {
        id: 'pemodelan',
        title: '5. Langkah Pemodelan Matematika SPLTV',
        body: 'Permasalahan kejuruan di dunia kerja dan kehidupan sehari-hari dapat diterjemahkan ke dalam model SPLTV melalui tiga langkah sistematis:',
        bullets: [
          'Langkah 1 (Identifikasi): Baca soal dengan cermat dan tentukan tiga besaran utama yang nilainya belum diketahui.',
          'Langkah 2 (Pemisalan): Nyatakan ketiga besaran tersebut ke dalam variabel $x$, $y$, dan $z$ lengkap dengan satuannya (misal rupiah per kg, unit per jam).',
          'Langkah 3 (Susun Persamaan): Ubah setiap pernyataan atau transaksi pada soal menjadi tiga persamaan linear yang sesuai.',
        ],
      },
    ],
    caseStudies: [
      {
        id: 'kasus-kain',
        title: 'Contoh 1: Permasalahan Pembelian Kain',
        contextTag: 'Kompetensi Tata Busana / Wirausaha',
        problemText:
          'Sebuah butik praktik SMK membeli tiga jenis kain untuk pembuatan seragam. Paket A terdiri atas 2 meter kain katun, 3 meter kain satin, dan 1 meter kain linen seharga Rp285.000. Paket B terdiri atas 4 meter kain katun, 1 meter kain satin, dan 2 meter kain linen seharga Rp320.000. Paket C terdiri atas 1 meter kain katun, 2 meter kain satin, dan 3 meter kain linen seharga Rp330.000. Susunlah model matematika SPLTV dari permasalahan tersebut!',
        givenInfo: [
          'Paket A: 2 m katun + 3 m satin + 1 m linen = Rp285.000',
          'Paket B: 4 m katun + 1 m satin + 2 m linen = Rp320.000',
          'Paket C: 1 m katun + 2 m satin + 3 m linen = Rp330.000',
        ],
        variables: [
          'Misalkan $x$ = harga 1 meter kain katun (dalam rupiah)',
          'Misalkan $y$ = harga 1 meter kain satin (dalam rupiah)',
          'Misalkan $z$ = harga 1 meter kain linen (dalam rupiah)',
        ],
        steps: [
          {
            stepTitle: 'Menyusun Persamaan dari Paket A',
            description: '2 meter katun, 3 meter satin, dan 1 meter linen berharga Rp285.000:',
            math: '2x + 3y + z = 285.000 \\quad \\text{... (1)}',
          },
          {
            stepTitle: 'Menyusun Persamaan dari Paket B',
            description: '4 meter katun, 1 meter satin, dan 2 meter linen berharga Rp320.000:',
            math: '4x + y + 2z = 320.000 \\quad \\text{... (2)}',
          },
          {
            stepTitle: 'Menyusun Persamaan dari Paket C',
            description: '1 meter katun, 2 meter satin, dan 3 meter linen berharga Rp330.000:',
            math: 'x + 2y + 3z = 330.000 \\quad \\text{... (3)}',
          },
        ],
        conclusion:
          'Model matematika SPLTV pembelian kain adalah: $\\begin{cases} 2x + 3y + z = 285.000 \\\\ 4x + y + 2z = 320.000 \\\\ x + 2y + 3z = 330.000 \\end{cases}$ (jika diselesaikan: katun Rp35.000/m, satin Rp50.000/m, linen Rp65.000/m).',
      },
      {
        id: 'kasus-sembako',
        title: 'Contoh 2: Permasalahan Paket Sembako',
        contextTag: 'Koperasi Siswa & Akuntansi SMK',
        problemText:
          'Dalam program bakti sosial SMK, panitia menyiapkan tiga jenis paket sembako berisi beras, gula pasir, dan minyak goreng. Paket Hemat berisi 5 kg beras, 2 kg gula, dan 1 liter minyak seharga Rp119.000. Paket Keluarga berisi 10 kg beras, 3 kg gula, dan 2 liter minyak seharga Rp222.000. Paket Peduli berisi 4 kg beras, 1 kg gula, dan 2 liter minyak seharga Rp106.000. Buatlah model SPLTV-nya!',
        givenInfo: [
          'Paket Hemat: 5 kg beras + 2 kg gula + 1 L minyak = Rp119.000',
          'Paket Keluarga: 10 kg beras + 3 kg gula + 2 L minyak = Rp222.000',
          'Paket Peduli: 4 kg beras + 1 kg gula + 2 L minyak = Rp106.000',
        ],
        variables: [
          'Misalkan $x$ = harga 1 kg beras (rupiah)',
          'Misalkan $y$ = harga 1 kg gula pasir (rupiah)',
          'Misalkan $z$ = harga 1 liter minyak goreng (rupiah)',
        ],
        steps: [
          {
            stepTitle: 'Persamaan Paket Hemat',
            description: 'Gabungan 5 kg beras, 2 kg gula, dan 1 liter minyak senilai Rp119.000:',
            math: '5x + 2y + z = 119.000',
          },
          {
            stepTitle: 'Persamaan Paket Keluarga',
            description: 'Gabungan 10 kg beras, 3 kg gula, dan 2 liter minyak senilai Rp222.000:',
            math: '10x + 3y + 2z = 222.000',
          },
          {
            stepTitle: 'Persamaan Paket Peduli',
            description: 'Gabungan 4 kg beras, 1 kg gula, dan 2 liter minyak senilai Rp106.000:',
            math: '4x + y + 2z = 106.000',
          },
        ],
        conclusion:
          'Model SPLTV paket sembako: $\\begin{cases} 5x + 2y + z = 119.000 \\\\ 10x + 3y + 2z = 222.000 \\\\ 4x + y + 2z = 106.000 \\end{cases}$',
      },
      {
        id: 'kasus-mesin',
        title: 'Contoh 3: Permasalahan Produksi Tiga Mesin',
        contextTag: 'Teknik Pemesinan & Manufaktur',
        problemText:
          'Bengkel produksi SMK mengoperasikan tiga mesin bubut yaitu Mesin A, Mesin B, dan Mesin C untuk mencetak komponen baut presisi. Pada hari Senin, Mesin A bekerja 2 jam, Mesin B 3 jam, dan Mesin C 1 jam menghasilkan 310 baut. Pada hari Selasa, Mesin A bekerja 3 jam, Mesin B 2 jam, dan Mesin C 2 jam menghasilkan 380 baut. Pada hari Rabu, Mesin A bekerja 1 jam, Mesin B 4 jam, dan Mesin C 3 jam menghasilkan 480 baut. Nyatakan dalam model SPLTV!',
        givenInfo: [
          'Senin: 2 jam A + 3 jam B + 1 jam C = 310 unit',
          'Selasa: 3 jam A + 2 jam B + 2 jam C = 380 unit',
          'Rabu: 1 jam A + 4 jam B + 3 jam C = 480 unit',
        ],
        variables: [
          'Misalkan $x$ = kapasitas produksi Mesin A per jam (unit/jam)',
          'Misalkan $y$ = kapasitas produksi Mesin B per jam (unit/jam)',
          'Misalkan $z$ = kapasitas produksi Mesin C per jam (unit/jam)',
        ],
        steps: [
          {
            stepTitle: 'Persamaan Produksi Hari Senin',
            description: 'Lama kerja tiap mesin dikalikan laju produksi per jam menghasilkan total 310 unit:',
            math: '2x + 3y + z = 310',
          },
          {
            stepTitle: 'Persamaan Produksi Hari Selasa',
            description: 'Total output hari Selasa adalah 380 unit:',
            math: '3x + 2y + 2z = 380',
          },
          {
            stepTitle: 'Persamaan Produksi Hari Rabu',
            description: 'Total output hari Rabu adalah 480 unit:',
            math: 'x + 4y + 3z = 480',
          },
        ],
        conclusion:
          'Model SPLTV produksi tiga mesin: $\\begin{cases} 2x + 3y + z = 310 \\\\ 3x + 2y + 2z = 380 \\\\ x + 4y + 3z = 480 \\end{cases}$',
      },
    ],
    rangkuman: [
      'SPLTV terdiri atas tiga persamaan linear yang memuat maksimal tiga variabel berpangkat satu dan membentuk satu kesatuan sistem.',
      'Unsur persamaan meliputi variabel (peubah), koefisien (pengali variabel), konstanta (bilangan tetap), dan suku.',
      'Pemodelan matematika dilakukan dengan menetapkan pemisalan tiga variabel $(x, y, z)$ secara jelas beserta satuannya, lalu menyusun tiga persamaan sesuai konteks soal.',
    ],
    nextMenuId: 'pertemuan-2',
    nextButtonLabel: 'Lanjut ke Pertemuan 2: Metode Substitusi',
  },

  'pertemuan-2': {
    id: 'pertemuan-2',
    meetingNumber: 2,
    title: 'Penyelesaian SPLTV dengan Metode Substitusi',
    subtitle: 'Mengubah Bentuk Persamaan, Mengganti Variabel, dan Mengecek Kebenaran Solusi',
    duration: '2 x 45 Menit',
    tujuan: [
      'Menjelaskan prinsip dasar metode substitusi dalam menyelesaikan SPLTV.',
      'Mengubah bentuk salah satu persamaan linear tiga variabel menjadi persamaan eksplisit satu variabel.',
      'Menentukan himpunan penyelesaian $(x, y, z)$ permasalahan harga tiket dan pembelian buah menggunakan metode substitusi.',
      'Melakukan pengecekan hasil penyelesaian ke seluruh persamaan awal untuk memastikan ketepatan jawaban.',
    ],
    pertanyaanPemantik:
      'Ketika kamu mengetahui bahwa harga 1 tiket pelajar ditambah 1 tiket mahasiswa ditambah 1 tiket umum sama dengan Rp80.000, bagaimana cara menyatakan harga tiket umum dalam harga tiket pelajar dan mahasiswa agar sistem tiga variabel menyusut menjadi dua variabel saja?',
    stimulus: {
      title: 'Stimulus Masalah: Penjualan Tiket Pameran Inovasi SMK',
      scenario:
        'Panitia pameran karya teknologi SMK menjual tiga kategori tiket: Pelajar, Mahasiswa, dan Umum. Rombongan pertama membeli 1 tiket pelajar, 1 tiket mahasiswa, dan 1 tiket umum seharga Rp80.000. Dua rombongan lain juga membeli dengan jumlah berbeda. Karena rombongan pertama memiliki koefisien $1$ pada semua variabelnya, panitia dapat menyelesaikannya dengan cepat tanpa menyamakan koefisien.',
      promptQuestion:
        'Persamaan manakah yang paling mudah diubah bentuknya? Bagaimana langkah substitusi yang rapi agar tidak terjadi kesalahan tanda positif dan negatif?',
    },
    konsepSections: [
      {
        id: 'pengertian-sub',
        title: '1. Pengertian Metode Substitusi',
        body: 'Metode substitusi adalah metode penyelesaian SPLTV dengan cara mengganti (menyulihkan) satu variabel menggunakan bentuk persamaan dari variabel lainnya secara bertahap, sehingga sistem tiga variabel (SPLTV) menyederhana menjadi dua variabel (SPLDV), lalu menjadi satu variabel.',
      },
      {
        id: 'perubahan-bentuk',
        title: '2. Penjelasan Perubahan Bentuk Persamaan',
        body: 'Kunci keberhasilan metode substitusi adalah memilih persamaan dengan koefisien $1$ atau $-1$ pada salah satu variabelnya agar tidak muncul bilangan pecahan saat memindahkan suku ke ruas kanan.',
        mathBlocks: [
          'x + 2y - z = 10 \\implies x = 10 - 2y + z',
          'x + y + z = 80.000 \\implies z = 80.000 - x - y',
        ],
        bullets: [
          'Ingat aturan pindah ruas: suku bertanda $+$ menjadi $-$, dan suku bertanda $-$ menjadi $+$.',
          'Selalu beri tanda kurung saat menyubstitusikan ekspresi baru ke persamaan lain, misalnya $2(10 - 2y + z)$, agar perkalian distributif tepat untuk seluruh suku.',
        ],
      },
      {
        id: 'langkah-sub',
        title: '3. Langkah-Langkah Metode Substitusi',
        body: 'Ikuti 6 langkah terstruktur berikut dalam menyelesaikan SPLTV:',
        bullets: [
          'Langkah 1: Pilih satu persamaan yang paling sederhana (memiliki koefisien $1$ atau $-1$).',
          'Langkah 2: Ubah bentuk persamaan tersebut untuk menyatakan satu variabel (misal $z$) ke dalam dua variabel lain ($x$ dan $y$) sebagai Persamaan (4).',
          'Langkah 3: Substitusikan Persamaan (4) ke dua persamaan lainnya sehingga diperoleh SPLDV dengan dua variabel ($x$ dan $y$).',
          'Langkah 4: Selesaikan SPLDV tersebut kembali dengan substitusi (ubah salah satu menjadi $y = \\dots$ lalu masukkan ke persamaan kedua SPLDV).',
          'Langkah 5: Substitusikan dua nilai variabel yang sudah ditemukan ke Persamaan (4) untuk memperoleh nilai variabel ketiga.',
          'Langkah 6 (Pengecekan Hasil): Uji nilai $(x, y, z)$ ke ketiga persamaan awal untuk memastikan ruas kiri sama dengan ruas kanan.',
        ],
      },
    ],
    caseStudies: [
      {
        id: 'kasus-tiket',
        title: 'Contoh 1: Permasalahan Harga Tiket',
        contextTag: 'Pemasaran & Event Management SMK',
        problemText:
          'Pada acara gelar karya SMK, terdapat tiga jenis tiket masuk: Pelajar ($x$), Mahasiswa ($y$), dan Umum ($z$). Rombongan A membeli 1 tiket pelajar, 1 tiket mahasiswa, dan 1 tiket umum seharga Rp80.000. Rombongan B membeli 2 tiket pelajar, 1 tiket mahasiswa, dan 2 tiket umum seharga Rp135.000. Rombongan C membeli 3 tiket pelajar, 2 tiket mahasiswa, dan 1 tiket umum seharga Rp135.000. Tentukan harga masing-masing tiket menggunakan metode substitusi!',
        givenInfo: [
          'Persamaan (1): $x + y + z = 80.000$',
          'Persamaan (2): $2x + y + 2z = 135.000$',
          'Persamaan (3): $3x + 2y + z = 135.000$',
        ],
        variables: [
          '$x$ = harga 1 tiket pelajar',
          '$y$ = harga 1 tiket mahasiswa',
          '$z$ = harga 1 tiket umum',
        ],
        steps: [
          {
            stepTitle: 'Langkah 1: Ubah Bentuk Persamaan (1)',
            description: 'Pilih Persamaan (1) karena semua koefisiennya $1$. Nyatakan $z$ dalam $x$ dan $y$:',
            math: 'z = 80.000 - x - y \\quad \\text{... (4)}',
          },
          {
            stepTitle: 'Langkah 2: Substitusi Persamaan (4) ke Persamaan (2)',
            description: 'Gantikan $z$ pada Persamaan (2) dengan $(80.000 - x - y)$:',
            math: '2x + y + 2(80.000 - x - y) = 135.000 \\\\ 2x + y + 160.000 - 2x - 2y = 135.000 \\\\ -y = 135.000 - 160.000 \\implies y = 25.000',
          },
          {
            stepTitle: 'Langkah 3: Substitusi $y = 25.000$ ke Persamaan (4)',
            description: 'Perbarui bentuk $z$ dengan nilai $y$ yang sudah diperoleh:',
            math: 'z = 80.000 - x - 25.000 \\implies z = 55.000 - x \\quad \\text{... (5)}',
          },
          {
            stepTitle: 'Langkah 4: Substitusi $y$ dan (5) ke Persamaan (3)',
            description: 'Masukkan $y = 25.000$ dan $z = 55.000 - x$ ke Persamaan (3) untuk menemukan $x$:',
            math: '3x + 2(25.000) + (55.000 - x) = 135.000 \\\\ 2x + 105.000 = 135.000 \\\\ 2x = 30.000 \\implies x = 15.000',
          },
          {
            stepTitle: 'Langkah 5: Substitusi Balik untuk Menemukan $z$',
            description: 'Masukkan $x = 15.000$ ke Persamaan (5):',
            math: 'z = 55.000 - 15.000 = 40.000',
          },
        ],
        verification: [
          'Cek Persamaan (1): $15.000 + 25.000 + 40.000 = 80.000$ (Benar)',
          'Cek Persamaan (2): $2(15.000) + 25.000 + 2(40.000) = 30.000 + 25.000 + 80.000 = 135.000$ (Benar)',
          'Cek Persamaan (3): $3(15.000) + 2(25.000) + 40.000 = 45.000 + 50.000 + 40.000 = 135.000$ (Benar)',
        ],
        conclusion:
          'Jadi, harga tiket Pelajar adalah Rp15.000, tiket Mahasiswa Rp25.000, dan tiket Umum Rp40.000.',
      },
      {
        id: 'kasus-buah',
        title: 'Contoh 2: Permasalahan Pembelian Jeruk, Mangga, dan Pir',
        contextTag: 'Agribisnis & Tata Boga SMK',
        problemText:
          'Kantin sehat SMK membeli buah segar dalam tiga paket berbeda. Paket 1 terdiri atas 1 kg jeruk, 2 kg mangga, dan 1 kg pir seharga Rp86.000. Paket 2 terdiri atas 2 kg jeruk, 1 kg mangga, dan 2 kg pir seharga Rp118.000. Paket 3 terdiri atas 3 kg jeruk, 2 kg mangga, dan 1 kg pir seharga Rp126.000. Tentukan harga per kilogram masing-masing buah dengan metode substitusi!',
        givenInfo: [
          'Persamaan (1): $x + 2y + z = 86.000$',
          'Persamaan (2): $2x + y + 2z = 118.000$',
          'Persamaan (3): $3x + 2y + z = 126.000$',
        ],
        variables: [
          '$x$ = harga 1 kg jeruk',
          '$y$ = harga 1 kg mangga',
          '$z$ = harga 1 kg pir',
        ],
        steps: [
          {
            stepTitle: 'Langkah 1: Ubah Bentuk Persamaan (1)',
            description: 'Nyatakan $x$ dalam $y$ dan $z$ dari Persamaan (1) karena koefisien $x$ bernilai $1$:',
            math: 'x = 86.000 - 2y - z \\quad \\text{... (4)}',
          },
          {
            stepTitle: 'Langkah 2: Substitusi (4) ke Persamaan (2)',
            description: 'Gantikan $x$ pada Persamaan (2):',
            math: '2(86.000 - 2y - z) + y + 2z = 118.000 \\\\ 172.000 - 4y - 2z + y + 2z = 118.000 \\\\ -3y = -54.000 \\implies y = 18.000',
          },
          {
            stepTitle: 'Langkah 3: Substitusi $y = 18.000$ dan (4) ke Persamaan (3)',
            description: 'Dari Persamaan (4) diperoleh $x = 86.000 - 2(18.000) - z = 50.000 - z$. Masukkan ke Persamaan (3):',
            math: '3(50.000 - z) + 2(18.000) + z = 126.000 \\\\ 150.000 - 3z + 36.000 + z = 126.000 \\\\ 186.000 - 2z = 126.000 \\implies 2z = 60.000 \\implies z = 30.000',
          },
          {
            stepTitle: 'Langkah 4: Tentukan Nilai $x$',
            description: 'Substitusi $y = 18.000$ dan $z = 30.000$ ke Persamaan (4):',
            math: 'x = 86.000 - 2(18.000) - 30.000 = 86.000 - 66.000 = 20.000',
          },
        ],
        verification: [
          'Cek Persamaan (1): $20.000 + 2(18.000) + 30.000 = 86.000$ (Benar)',
          'Cek Persamaan (2): $2(20.000) + 18.000 + 2(30.000) = 118.000$ (Benar)',
          'Cek Persamaan (3): $3(20.000) + 2(18.000) + 30.000 = 126.000$ (Benar)',
        ],
        conclusion:
          'Jadi, harga 1 kg jeruk adalah Rp20.000, 1 kg mangga Rp18.000, dan 1 kg pir Rp30.000.',
      },
    ],
    rangkuman: [
      'Metode substitusi efektif digunakan apabila minimal satu persamaan memiliki variabel berkoefisien $1$ atau $-1$.',
      'Perubahan bentuk persamaan harus memperhatikan tanda suku saat berpindah ruas serta penggunaan tanda kurung saat substitusi.',
      'Tahap akhir wajib melakukan pengecekan hasil dengan memasukkan $(x, y, z)$ ke ketiga persamaan awal.',
    ],
    nextMenuId: 'pertemuan-3',
    nextButtonLabel: 'Lanjut ke Pertemuan 3: Metode Eliminasi',
  },

  'pertemuan-3': {
    id: 'pertemuan-3',
    meetingNumber: 3,
    title: 'Penyelesaian SPLTV dengan Metode Eliminasi',
    subtitle: 'Menyamakan Koefisien, Menghilangkan Variabel, dan Menentukan Himpunan Penyelesaian',
    duration: '2 x 45 Menit',
    tujuan: [
      'Menjelaskan prinsip dasar metode eliminasi dalam menyelesaikan SPLTV.',
      'Menyamakan koefisien variabel target menggunakan kelipatan persekutuan terkecil (KPK).',
      'Menghilangkan variabel secara bertahap hingga menentukan nilai masing-masing variabel $x$, $y$, dan $z$.',
      'Menyelesaikan permasalahan kontekstual pembelian buku, pensil, dan penggaris serta mengecek kebenaran hasilnya.',
    ],
    pertanyaanPemantik:
      'Bagaimana jika ketiga persamaan pada suatu nota pengadaan alat tulis tidak memiliki variabel berkoefisien $1$, sehingga metode substitusi memunculkan pecahan yang rumit? Bagaimana cara melenyapkan satu variabel secara langsung?',
    stimulus: {
      title: 'Stimulus Masalah: Pengadaan Alat Tulis Koperasi SMK',
      scenario:
        'Pengurus koperasi siswa mencatat tiga transaksi pembelian paket alat tulis untuk siswa baru. Setiap paket terdiri atas buku tulis, pensil, dan penggaris dengan jumlah masing-masing lebih dari satu buah, misalnya 2 buku, 3 pensil, dan 2 penggaris. Agar perhitungan tetap bulat dan rapi tanpa pecahan, kita dapat menyamakan koefisien salah satu barang terlebih dahulu.',
      promptQuestion:
        'Variabel mana yang paling efisien untuk disamakan koefisiennya terlebih dahulu? Kapan kita menggunakan operasi penjumlahan dan kapan menggunakan operasi pengurangan?',
    },
    konsepSections: [
      {
        id: 'pengertian-elim',
        title: '1. Pengertian Metode Eliminasi',
        body: 'Metode eliminasi adalah teknik menyelesaikan SPLTV dengan cara menghilangkan (mengeliminasi) salah satu variabel secara bertahap dari pasangan-pasangan persamaan sehingga jumlah variabel berkurang dari tiga menjadi dua, dan akhirnya tinggal satu variabel.',
      },
      {
        id: 'menyamakan-koefisien',
        title: '2. Menyamakan Koefisien & Aturan Tanda',
        body: 'Sebelum sebuah variabel dapat dihilangkan, nilai mutlak koefisiennya pada kedua persamaan harus dibuat sama dengan mengalikan setiap persamaan dengan faktor tertentu (berdasarkan KPK kedua koefisien).',
        bullets: [
          'Jika koefisien variabel target bertanda SAMA (sama-sama $+$ atau sama-sama $-$), lakukan operasi PENGURANGAN ($-$) antar persamaan.',
          'Jika koefisien variabel target bertanda BERLAWANAN ($+$ dan $-$), lakukan operasi PENJUMLAHAN ($+$) antar persamaan.',
          'Pastikan seluruh suku pada persamaan—baik ruas kiri maupun konstanta di ruas kanan—ikut dikalikan dengan pengali yang sama.',
        ],
      },
      {
        id: 'langkah-elim',
        title: '3. Langkah-Langkah Metode Eliminasi',
        body: 'Proses eliminasi penuh pada SPLTV berjalan melalui tahapan berikut:',
        bullets: [
          'Langkah 1 (Pilih Target Eliminasi): Tentukan satu variabel yang paling mudah disamakan koefisiennya (misal $z$).',
          'Langkah 2 (Eliminasi Tahap 1): Eliminasi variabel $z$ dari pasangan Persamaan (1) dan (2) sehingga diperoleh Persamaan (4) dalam $x$ dan $y$.',
          'Langkah 3 (Eliminasi Tahap 2): Eliminasi variabel YANG SAMA ($z$) dari pasangan Persamaan (1) dan (3) atau (2) dan (3) sehingga diperoleh Persamaan (5) dalam $x$ dan $y$.',
          'Langkah 4 (Menentukan Nilai Variabel): Eliminasi Persamaan (4) dan (5) untuk menemukan nilai $x$ dan $y$.',
          'Langkah 5 (Menentukan Variabel Terakhir & Pengecekan): Eliminasi variabel lain pada persamaan awal (atau substitusi nilai $x, y$) untuk memperoleh $z$, lalu cek hasilnya ke semua persamaan.',
        ],
      },
    ],
    caseStudies: [
      {
        id: 'kasus-atk',
        title: 'Contoh Utama: Permasalahan Pembelian Buku, Pensil, dan Penggaris',
        contextTag: 'Koperasi Sekolah & Bisnis Daring SMK',
        problemText:
          'Di koperasi SMK, Andi membeli 2 buku tulis, 3 pensil, dan 2 penggaris seharga Rp27.000. Budi membeli 3 buku tulis, 2 pensil, dan 3 penggaris seharga Rp33.000. Citra membeli 4 buku tulis, 5 pensil, dan 2 penggaris seharga Rp43.000. Tentukan harga 1 buku tulis, 1 pensil, dan 1 penggaris menggunakan metode eliminasi!',
        givenInfo: [
          'Persamaan (1): $2x + 3y + 2z = 27.000$',
          'Persamaan (2): $3x + 2y + 3z = 33.000$',
          'Persamaan (3): $4x + 5y + 2z = 43.000$',
        ],
        variables: [
          '$x$ = harga 1 buku tulis (rupiah)',
          '$y$ = harga 1 pensil (rupiah)',
          '$z$ = harga 1 penggaris (rupiah)',
        ],
        steps: [
          {
            stepTitle: 'Langkah 1: Menghilangkan Variabel $z$ dari Persamaan (1) dan (3)',
            description:
              'Perhatikan bahwa koefisien $z$ pada Persamaan (1) dan (3) sudah sama, yaitu $+2$. Karena bertanda sama, langsung kurangkan Persamaan (3) dengan Persamaan (1):',
            math: '\\begin{aligned} 4x + 5y + 2z &= 43.000 \\\\ 2x + 3y + 2z &= 27.000 \\\\ \\hline 2x + 2y &= 16.000 \\end{aligned} \\\\[6pt] \\text{Sederhanakan (bagi 2): } x + y = 8.000 \\quad \\text{... (4)}',
          },
          {
            stepTitle: 'Langkah 2: Menyamakan Koefisien & Menghilangkan $z$ dari (1) dan (2)',
            description:
              'Koefisien $z$ pada (1) adalah $2$ dan pada (2) adalah $3$ (KPK = $6$). Kalikan Persamaan (1) dengan $3$ dan Persamaan (2) dengan $2$, lalu kurangkan:',
            math: '\\begin{aligned} (1)\\times 3:\\quad 6x + 9y + 6z &= 81.000 \\\\ (2)\\times 2:\\quad 6x + 4y + 6z &= 66.000 \\\\ \\hline 5y &= 15.000 \\implies y = 3.000 \\end{aligned}',
          },
          {
            stepTitle: 'Langkah 3: Menentukan Nilai Variabel $x$',
            description:
              'Karena Persamaan (4) adalah $x + y = 8.000$, kita dapat menyamakan koefisien $y$ dengan mengalikan $y = 3.000$ oleh $1$ dan mengeliminasi $y$ dari (4):',
            math: '\\begin{aligned} x + y &= 8.000 \\\\ y &= 3.000 \\\\ \\hline x &= 5.000 \\end{aligned}',
          },
          {
            stepTitle: 'Langkah 4: Menentukan Nilai Variabel $z$',
            description:
              'Eliminasi $x$ dan $y$ menggunakan nilai yang telah ditemukan pada Persamaan (1), yaitu $2x + 3y + 2z = 27.000$:',
            math: '2(5.000) + 3(3.000) + 2z = 27.000 \\\\ 10.000 + 9.000 + 2z = 27.000 \\\\ 2z = 8.000 \\implies z = 4.000',
          },
        ],
        verification: [
          'Cek Persamaan (1): $2(5.000) + 3(3.000) + 2(4.000) = 10.000 + 9.000 + 8.000 = 27.000$ (Benar)',
          'Cek Persamaan (2): $3(5.000) + 2(3.000) + 3(4.000) = 15.000 + 6.000 + 12.000 = 33.000$ (Benar)',
          'Cek Persamaan (3): $4(5.000) + 5(3.000) + 2(4.000) = 20.000 + 15.000 + 8.000 = 43.000$ (Benar)',
        ],
        conclusion:
          'Jadi, harga 1 buku tulis adalah Rp5.000, 1 pensil Rp3.000, dan 1 penggaris Rp4.000.',
      },
    ],
    rangkuman: [
      'Metode eliminasi menghilangkan satu variabel secara konsisten pada dua pasangan persamaan hingga terbentuk SPLDV.',
      'Menyamakan koefisien dilakukan dengan mengalikan persamaan menggunakan pengali dari KPK koefisien target.',
      'Koefisien bertanda sama dieliminasi dengan pengurangan ($-$), sedangkan koefisien berlawanan tanda dieliminasi dengan penjumlahan ($+$).',
    ],
    nextMenuId: 'simulasi',
    nextButtonLabel: 'Lanjut ke Simulasi Matematika Interaktif',
  },
};

export interface SimulationPreset {
  id: string;
  label: string;
  context: string;
  varNames: [string, string, string];
  unit: string;
  equations: [LinearEquation3, LinearEquation3, LinearEquation3];
}

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: 'kain',
    label: 'Pembelian Kain (Pertemuan 1)',
    context: 'Harga per meter kain katun (x), satin (y), dan linen (z) dalam ribuan rupiah.',
    varNames: ['Katun (rb/m)', 'Satin (rb/m)', 'Linen (rb/m)'],
    unit: 'rb',
    equations: [
      { a: 2, b: 3, c: 1, d: 285 },
      { a: 4, b: 1, c: 2, d: 320 },
      { a: 1, b: 2, c: 3, d: 330 },
    ],
  },
  {
    id: 'sembako',
    label: 'Paket Sembako (Pertemuan 1)',
    context: 'Harga beras (x), gula (y), dan minyak goreng (z) dalam ribuan rupiah.',
    varNames: ['Beras (rb/kg)', 'Gula (rb/kg)', 'Minyak (rb/L)'],
    unit: 'rb',
    equations: [
      { a: 5, b: 2, c: 1, d: 119 },
      { a: 10, b: 3, c: 2, d: 222 },
      { a: 4, b: 1, c: 2, d: 106 },
    ],
  },
  {
    id: 'mesin',
    label: 'Produksi Tiga Mesin (Pertemuan 1)',
    context: 'Kapasitas produksi Mesin A (x), Mesin B (y), dan Mesin C (z) per jam.',
    varNames: ['Mesin A (unit/jam)', 'Mesin B (unit/jam)', 'Mesin C (unit/jam)'],
    unit: 'unit',
    equations: [
      { a: 2, b: 3, c: 1, d: 310 },
      { a: 3, b: 2, c: 2, d: 380 },
      { a: 1, b: 4, c: 3, d: 480 },
    ],
  },
  {
    id: 'tiket',
    label: 'Harga Tiket (Pertemuan 2)',
    context: 'Harga tiket Pelajar (x), Mahasiswa (y), dan Umum (z) dalam ribuan rupiah.',
    varNames: ['Pelajar (rb)', 'Mahasiswa (rb)', 'Umum (rb)'],
    unit: 'rb',
    equations: [
      { a: 1, b: 1, c: 1, d: 80 },
      { a: 2, b: 1, c: 2, d: 135 },
      { a: 3, b: 2, c: 1, d: 135 },
    ],
  },
  {
    id: 'buah',
    label: 'Jeruk, Mangga, Pir (Pertemuan 2)',
    context: 'Harga per kg jeruk (x), mangga (y), dan pir (z) dalam ribuan rupiah.',
    varNames: ['Jeruk (rb/kg)', 'Mangga (rb/kg)', 'Pir (rb/kg)'],
    unit: 'rb',
    equations: [
      { a: 1, b: 2, c: 1, d: 86 },
      { a: 2, b: 1, c: 2, d: 118 },
      { a: 3, b: 2, c: 1, d: 126 },
    ],
  },
  {
    id: 'atk',
    label: 'Buku, Pensil, Penggaris (Pertemuan 3)',
    context: 'Harga satuan buku tulis (x), pensil (y), dan penggaris (z) dalam ribuan rupiah.',
    varNames: ['Buku (rb)', 'Pensil (rb)', 'Penggaris (rb)'],
    unit: 'rb',
    equations: [
      { a: 2, b: 3, c: 2, d: 27 },
      { a: 3, b: 2, c: 3, d: 33 },
      { a: 4, b: 5, c: 2, d: 43 },
    ],
  },
];

export const DIAGNOSTIC_QUESTIONS: QuizQuestion[] = [
  {
    id: 'diag-1',
    topic: 'Prasyarat Aljabar',
    question: 'Diketahui persamaan linear $3x + 2y = 19$. Jika nilai $x = 5$, berapakah nilai $y$?',
    options: ['$y = 2$', '$y = 3$', '$y = 4$', '$y = 7$'],
    correctIndex: 0,
    explanation: 'Substitusikan $x = 5$: $3(5) + 2y = 19 \\implies 15 + 2y = 19 \\implies 2y = 4 \\implies y = 2$.',
  },
  {
    id: 'diag-2',
    topic: 'Prasyarat SPLDV',
    question: 'Penyelesaian dari sistem $\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}$ adalah...',
    options: ['$x = 6, y = 4$', '$x = 7, y = 3$', '$x = 8, y = 2$', '$x = 5, y = 5$'],
    correctIndex: 1,
    explanation: 'Jumlahkan kedua persamaan: $2x = 14 \\implies x = 7$. Lalu $7 + y = 10 \\implies y = 3$.',
  },
  {
    id: 'diag-3',
    topic: 'Unsur Aljabar',
    question: 'Pada persamaan $4a - 7b + c = 15$, koefisien dari variabel $b$ dan konstantanya berturut-turut adalah...',
    options: ['$7$ dan $15$', '$-7$ dan $15$', '$4$ dan $-7$', '$-7$ dan $1$'],
    correctIndex: 1,
    explanation: 'Tanda pengurangan ikut pada suku $-7b$ sehingga koefisien $b$ adalah $-7$, dan konstantanya adalah $15$.',
  },
  {
    id: 'diag-4',
    topic: 'Pemodelan Dasar',
    question: 'Harga 3 buku ($x$) dan 2 pulpen ($y$) adalah Rp26.000. Kalimat matematika yang benar adalah...',
    options: ['$3x + 2y = 26.000$', '$2x + 3y = 26.000$', '$5(x+y) = 26.000$', '$3x - 2y = 26.000$'],
    correctIndex: 0,
    explanation: '3 unit buku dinyatakan dengan $3x$ dan 2 unit pulpen dengan $2y$, dijumlahkan sama dengan $26.000$.',
  },
  {
    id: 'diag-5',
    topic: 'Perubahan Bentuk Persamaan',
    question: 'Jika $2x - y + 3z = 12$, bentuk eksplisit untuk variabel $y$ adalah...',
    options: ['$y = 12 - 2x - 3z$', '$y = 2x + 3z - 12$', '$y = 2x - 3z + 12$', '$y = -2x - 3z - 12$'],
    correctIndex: 1,
    explanation: 'Pindahkan $-y$ ke ruas kanan menjadi $+y$, dan $12$ ke ruas kiri menjadi $-12$: $2x + 3z - 12 = y$.',
  },
];

export const LATIHAN_QUESTIONS: QuizQuestion[] = [
  {
    id: 'lat-1',
    topic: 'Konsep SPLTV',
    question: 'Manakah di bawah ini yang merupakan Sistem Persamaan Linear Tiga Variabel (SPLTV)?',
    options: [
      '$\\begin{cases} x^2 + y + z = 5 \\\\ x - y + z = 1 \\\\ 2x + y - z = 4 \\end{cases}$',
      '$\\begin{cases} x + 2y - z = 7 \\\\ 3x - y + 2z = 12 \\\\ x + y + z = 6 \\end{cases}$',
      '$\\begin{cases} 2x + 3y = 10 \\\\ x - y = 2 \\\\ 4x + y = 14 \\end{cases}$',
      '$\\begin{cases} xy + z = 8 \\\\ x + y - z = 3 \\\\ 2x + y + z = 9 \\end{cases}$',
    ],
    correctIndex: 1,
    explanation: 'Pilihan B memuat tiga persamaan linear dengan tiga variabel ($x, y, z$) yang semuanya berpangkat $1$.',
  },
  {
    id: 'lat-2',
    topic: 'Pemodelan Matematika',
    question:
      'Sebuah bengkel SMK membuat 3 jenis komponen ($x, y, z$). Hari ke-1 membuat 2 komponen A, 1 komponen B, dan 3 komponen C dalam waktu 19 jam. Model persamaan yang tepat adalah...',
    options: ['$2x + y + 3z = 19$', '$x + 2y + 3z = 19$', '$2x + 3y + z = 19$', '$6(x+y+z) = 19$'],
    correctIndex: 0,
    explanation: '2 kali waktu komponen A ($2x$), 1 kali komponen B ($y$), dan 3 kali komponen C ($3z$) berjumlah 19 jam.',
  },
  {
    id: 'lat-3',
    topic: 'Metode Substitusi',
    question:
      'Diketahui sistem $\\begin{cases} x + y + z = 6 \\\\ x = 2 \\\\ y = z + 2 \\end{cases}$. Nilai $(x, y, z)$ yang memenuhi adalah...',
    options: ['$(2, 3, 1)$', '$(2, 1, 3)$', '$(2, 4, 0)$', '$(1, 3, 2)$'],
    correctIndex: 0,
    explanation: 'Substitusikan $x = 2$ dan $y = z + 2$ ke persamaan pertama: $2 + (z + 2) + z = 6 \\implies 2z + 4 = 6 \\implies z = 1$, sehingga $y = 3$.',
  },
  {
    id: 'lat-4',
    topic: 'Metode Eliminasi',
    question:
      'Untuk mengeliminasi variabel $y$ dari pasangan persamaan $3x + 2y + z = 14$ dan $x - 4y + 2z = 2$, langkah penyamaan koefisien yang tepat adalah...',
    options: [
      'Kalikan persamaan pertama dengan $2$, lalu jumlahkan kedua persamaan',
      'Kalikan persamaan pertama dengan $2$, lalu kurangkan kedua persamaan',
      'Kalikan persamaan kedua dengan $2$, lalu kurangkan kedua persamaan',
      'Langsung jumlahkan kedua persamaan tanpa dikalikan',
    ],
    correctIndex: 0,
    explanation: 'Mengalikan persamaan pertama dengan $2$ mengubah $+2y$ menjadi $+4y$. Karena persamaan kedua memiliki $-4y$ (tanda berlawanan), kedua persamaan dijumlahkan.',
  },
  {
    id: 'lat-5',
    topic: 'Aplikasi SMK (Kain)',
    question:
      'Jika harga 1 meter kain katun $x = 35.000$, satin $y = 50.000$, dan linen $z = 65.000$, berapakah biaya untuk membeli $3\\text{ m}$ katun, $2\\text{ m}$ satin, dan $1\\text{ m}$ linen?',
    options: ['Rp250.000', 'Rp260.000', 'Rp270.000', 'Rp285.000'],
    correctIndex: 2,
    explanation: '$3(35.000) + 2(50.000) + 1(65.000) = 105.000 + 100.000 + 65.000 = 270.000$.',
  },
  {
    id: 'lat-6',
    topic: 'Pengecekan Hasil',
    question:
      'Manakah himpunan penyelesaian yang benar untuk $\\begin{cases} x + y + z = 12 \\\\ 2x - y + z = 9 \\\\ x + 2y - z = 7 \\end{cases}$?',
    options: ['$(3, 4, 5)$', '$(4, 3, 5)$', '$(5, 3, 4)$', '$(2, 5, 5)$'],
    correctIndex: 0,
    explanation: 'Uji $(3,4,5)$: (1) $3+4+5=12$, (2) $2(3)-4+5=7 \\neq 9$? Tunggu! Mari cek $(4,3,5)$: (1) $4+3+5=12$, (2) $2(4)-3+5=10$... Mari hitung tepat: Dari (1)+(3): $2x+3y=19$. Dari (2)+(3): $3x+y=16 \\implies y=16-3x$. Maka $2x+3(16-3x)=19 \\implies -7x=-29$ bukan bulat. Ayo pastikan soal bulat! Ganti Pers (2) dan (3) pada opsi benar $(3,4,5)$: $2(3)-4+5 = 7$ dan $3+2(4)-5=6$. Wait—lihat kita cek langsung!',
  },
];

// Fix lat-6 so it is 100% exact! Let's write a verified replacement for lat-6 and lat-7, lat-8 below:
LATIHAN_QUESTIONS[5] = {
  id: 'lat-6',
  topic: 'Pengecekan Hasil',
  question:
    'Manakah himpunan penyelesaian yang benar untuk $\\begin{cases} x + y + z = 12 \\\\ 2x - y + z = 7 \\\\ x + 2y - z = 6 \\end{cases}$?',
  options: ['$(3, 4, 5)$', '$(4, 3, 5)$', '$(5, 4, 3)$', '$(2, 4, 6)$'],
  correctIndex: 0,
  explanation: 'Uji $(3,4,5)$: $3+4+5=12$; $2(3)-4+5=7$; dan $3+2(4)-5=6$. Ketiga persamaan terpenuhi.',
};

LATIHAN_QUESTIONS.push(
  {
    id: 'lat-7',
    topic: 'Metode Substitusi (Buah)',
    question:
      'Diketahui harga 1 kg jeruk = Rp20.000, mangga = Rp18.000, dan pir = Rp30.000. Jika seseorang membeli $2\\text{ kg}$ jeruk, $3\\text{ kg}$ mangga, dan $1\\text{ kg}$ pir, total pembayarannya adalah...',
    options: ['Rp120.000', 'Rp124.000', 'Rp128.000', 'Rp134.000'],
    correctIndex: 1,
    explanation: '$2(20.000) + 3(18.000) + 1(30.000) = 40.000 + 54.000 + 30.000 = 124.000$.',
  },
  {
    id: 'lat-8',
    topic: 'Metode Eliminasi (Alat Tulis)',
    question:
      'Dari sistem $x + y = 8.000$ dan $2x + 3y = 19.000$, nilai $x$ dan $y$ berturut-turut adalah...',
    options: ['$x = 5.000, y = 3.000$', '$x = 3.000, y = 5.000$', '$x = 4.000, y = 4.000$', '$x = 6.000, y = 2.000$'],
    correctIndex: 0,
    explanation: 'Kalikan persamaan pertama dengan $2$: $2x + 2y = 16.000$. Kurangkan dari $2x + 3y = 19.000$ diperoleh $y = 3.000$, sehingga $x = 5.000$.',
  }
);

export const SUMMATIVE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'sum-1',
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
    topic: 'Unsur Persamaan',
    question: 'Diketahui persamaan $5x - y + 4z = 32$. Koefisien variabel $y$ adalah...',
    options: ['$1$', '$-1$', '$4$', '$5$'],
    correctIndex: 1,
    explanation: 'Suku $-y$ bermakna $(-1) \\cdot y$, sehingga koefisien variabel $y$ adalah $-1$.',
  },
  {
    id: 'sum-3',
    topic: 'Bukan Contoh SPLTV',
    question: 'Sistem $\\begin{cases} \\frac{1}{x} + y + z = 4 \\\\ 2x + y - z = 3 \\\\ x - y + 2z = 5 \\end{cases}$ bukan merupakan SPLTV karena...',
    options: [
      'Memiliki terlalu banyak konstanta',
      'Terdapat variabel $x$ pada penyebut pecahan ($x^{-1}$)',
      'Koefisien variabel $y$ sama pada dua persamaan',
      'Memiliki lebih dari dua persamaan',
    ],
    correctIndex: 1,
    explanation: 'Bentuk $\\frac{1}{x} = x^{-1}$ memiliki pangkat $-1$, bukan pangkat $1$, sehingga tidak linear.',
  },
  {
    id: 'sum-4',
    topic: 'Pemodelan (Sembako)',
    question:
      'Paket A berisi 5 kg beras ($x$), 2 kg gula ($y$), dan 1 L minyak ($z$) seharga Rp119.000. Paket B berisi 4 kg beras, 1 kg gula, dan 2 L minyak seharga Rp106.000. Dua persamaan awal dari model tersebut adalah...',
    options: [
      '$5x + 2y + z = 119.000$ dan $4x + y + 2z = 106.000$',
      '$5x + 2y + 2z = 119.000$ dan $4x + y + z = 106.000$',
      '$2x + 5y + z = 119.000$ dan $x + 4y + 2z = 106.000$',
      '$5x + 2y - z = 119.000$ dan $4x + y - 2z = 106.000$',
    ],
    correctIndex: 0,
    explanation: 'Setiap jumlah barang dikalikan dengan variabel harga satuannya masing-masing.',
  },
  {
    id: 'sum-5',
    topic: 'Perubahan Bentuk Persamaan',
    question: 'Persamaan $2a + b - 3c = 18$ jika diubah menjadi bentuk $b = \\dots$ menghasilkan...',
    options: ['$b = 18 + 2a - 3c$', '$b = 18 - 2a + 3c$', '$b = 2a - 3c - 18$', '$b = 18 - 2a - 3c$'],
    correctIndex: 1,
    explanation: 'Memindahkan $+2a$ menjadi $-2a$ dan $-3c$ menjadi $+3c$ ke ruas kanan menghasilkan $b = 18 - 2a + 3c$.',
  },
  {
    id: 'sum-6',
    topic: 'Metode Substitusi',
    question:
      'Diketahui $\\begin{cases} x + y + z = 10 \\\\ x + y = 7 \\\\ y + z = 6 \\end{cases}$. Dengan metode substitusi, nilai $(x, y, z)$ adalah...',
    options: ['$(4, 3, 3)$', '$(3, 4, 3)$', '$(4, 2, 4)$', '$(5, 2, 3)$'],
    correctIndex: 0,
    explanation: 'Substitusikan $x + y = 7$ ke persamaan pertama: $7 + z = 10 \\implies z = 3$. Lalu $y + 3 = 6 \\implies y = 3$, dan $x = 4$.',
  },
  {
    id: 'sum-7',
    topic: 'Metode Eliminasi',
    question:
      'Jika diketahui persamaan (1) $2x + 3y - z = 9$ dan persamaan (2) $x - y + 2z = 5$, untuk mengeliminasi $z$ maka...',
    options: [
      'Kalikan (1) dengan $2$, lalu jumlahkan dengan (2)',
      'Kalikan (1) dengan $2$, lalu kurangkan dengan (2)',
      'Kalikan (2) dengan $2$, lalu jumlahkan dengan (1)',
      'Kurangkan langsung (1) dengan (2)',
    ],
    correctIndex: 0,
    explanation: 'Persamaan (1) dikali $2$ menjadi $4x + 6y - 2z = 18$. Karena $-2z$ dan $+2z$ berlawanan tanda, keduanya dijumlahkan agar $z$ hilang.',
  },
  {
    id: 'sum-8',
    topic: 'Penyelesaian SPLTV',
    question:
      'Himpunan penyelesaian dari $\\begin{cases} x + y + z = 9 \\\\ 2x + y - z = 6 \\\\ x - y + 2z = 7 \\end{cases}$ adalah...',
    options: ['$(2, 3, 4)$', '$(3, 2, 4)$', '$(4, 3, 2)$', '$(2, 4, 3)$'],
    correctIndex: 0,
    explanation: 'Cek $(2,3,4)$: (1) $2+3+4=9$; (2) $2(2)+3-4=3$? Wait — cek $(3,2,4)$: $2(3)+2-4=4$... Cek yang tepat: misal $(2,3,4)$ -> $2(2)+3-4=3$ bukan $6$. Mari periksa dengan solver: kalau solusi $(2,3,4)$, $2(2)+3+4$ atau $2x+y-z=3$. Mari pastikan soal ini 100% akurat!',
  },
  {
    id: 'sum-9',
    topic: 'Aplikasi Produksi Mesin',
    question:
      'Mesin A ($x$), Mesin B ($y$), dan Mesin C ($z$) memproduksi komponen dengan kapasitas $x = 40$, $y = 50$, dan $z = 80$ unit/jam. Total komponen jika Mesin A bekerja 2 jam, B 1 jam, dan C 2 jam adalah...',
    options: ['250 unit', '270 unit', '290 unit', '310 unit'],
    correctIndex: 2,
    explanation: '$2(40) + 1(50) + 2(80) = 80 + 50 + 160 = 290$ unit.',
  },
  {
    id: 'sum-10',
    topic: 'Aplikasi Harga Tiket',
    question:
      'Harga tiket pelajar Rp15.000, mahasiswa Rp25.000, dan umum Rp40.000. Jika rombongan SMK membeli 4 tiket pelajar dan 2 tiket umum, serta 1 tiket mahasiswa, total biaya yang dibayar adalah...',
    options: ['Rp155.000', 'Rp165.000', 'Rp170.000', 'Rp180.000'],
    correctIndex: 1,
    explanation: '$4(15.000) + 1(25.000) + 2(40.000) = 60.000 + 25.000 + 80.000 = 165.000$.',
  },
];

// Verify sum-8 mathematically so $(2,3,4)$ satisfies all 3 equations cleanly:
// Eq1: x + y + z = 2 + 3 + 4 = 9
// Eq2: 2x + y - z = 4 + 3 - 4 = 3
// Eq3: x - y + 2z = 2 - 3 + 8 = 7
SUMMATIVE_QUESTIONS[7] = {
  id: 'sum-8',
  topic: 'Penyelesaian SPLTV',
  question:
    'Himpunan penyelesaian dari $\\begin{cases} x + y + z = 9 \\\\ 2x + y - z = 3 \\\\ x - y + 2z = 7 \\end{cases}$ adalah...',
  options: ['$(2, 3, 4)$', '$(3, 2, 4)$', '$(4, 3, 2)$', '$(2, 4, 3)$'],
  correctIndex: 0,
  explanation: 'Uji $(2,3,4)$: (1) $2+3+4=9$; (2) $2(2)+3-4=3$; (3) $2-3+2(4)=7$. Semua tepat! (Dengan eliminasi (1)+(2): $3x+2y=12$, dan $2\\times(1)-(3)$: $x+3y=11 \\implies x=2, y=3, z=4$).',
};
