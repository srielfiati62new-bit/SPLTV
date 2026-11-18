import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Compass, Layers, PlayCircle } from 'lucide-react';
import { HERO_IMAGE_PATH } from '../data/curriculumData';
import { MenuId, StudentIdentity } from '../types/module';
import { SafeImage } from '../components/SafeImage';

interface BerandaPageProps {
  identity: StudentIdentity | null;
  onNavigate: (menu: MenuId) => void;
}

export const BerandaPage: React.FC<BerandaPageProps> = ({ identity, onNavigate }) => {
  const handleMulaiBelajar = () => {
    if (identity) {
      onNavigate('dashboard');
    } else {
      onNavigate('identitas');
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Section with Light Entrance Animation & Blue Navy Gradient */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-800"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="text-xs sm:text-sm font-medium text-sky-300 mb-3">
              Kurikulum Merdeka · Matematika Fase E · Kelas X SMK
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.15] text-balance">
              SPLTV SMART LEARNING
            </h1>
            <p className="mt-2 text-lg sm:text-xl font-semibold text-teal-300">
              E-Modul Matematika SMK Kelas X
            </p>
            <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              Platform pembelajaran interaktif Sistem Persamaan Linear Tiga Variabel (SPLTV) yang
              dirancang khusus untuk siswa SMK. Pelajari definisi dan pemodelan matematika,
              kuasai metode substitusi dan eliminasi, jelajahi irisan tiga bidang dalam ruang 3D,
              serta uji pemahamanmu dengan kasus nyata dunia usaha dan industri.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={handleMulaiBelajar}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              >
                <PlayCircle className="w-4 h-4" />
                <span>MULAI BELAJAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('petunjuk')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-4 h-4 text-sky-300" />
                <span>PETUNJUK PENGGUNAAN</span>
              </button>
            </div>

            {identity && (
              <p className="mt-5 text-xs text-sky-200">
                Masuk sebagai <strong className="text-white">{identity.namaLengkap}</strong> ({identity.kelas} · Absen {identity.nomorAbsen})
              </p>
            )}
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-navy-950">
            <SafeImage
              src={HERO_IMAGE_PATH}
              alt="Ilustrasi 3D tiga bidang koordinat SPLTV yang berpotongan pada satu titik"
              fallbackTitle="Visualisasi 3D Tiga Bidang SPLTV"
              className="w-full h-full object-cover lg:h-full"
            />
          </div>
        </div>
      </motion.section>

      {/* Structure Overview of the 3 Pertemuan */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-900">
              Alur Pembelajaran Tiga Pertemuan
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Susunan materi terpadu dari konsep dasar hingga penerapan metode penyelesaian dan simulasi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('peta-konsep')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 whitespace-nowrap shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Lihat Peta Konsep</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-sky-300 transition-colors">
            <div>
              <p className="text-xs font-mono font-semibold text-teal-700">Pertemuan 01 · Konsep</p>
              <h3 className="font-display text-lg font-bold text-navy-900 mt-1.5">
                Definisi dan Konsep SPLTV
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Memahami bentuk umum, ciri-ciri, unsur persamaan, contoh dan bukan contoh, serta memodelkan kasus pembelian kain, paket sembako, dan produksi tiga mesin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('pertemuan-1')}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-teal-700 transition-colors"
            >
              <span>Pelajari Pertemuan 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-sky-300 transition-colors">
            <div>
              <p className="text-xs font-mono font-semibold text-teal-700">Pertemuan 02 · Substitusi</p>
              <h3 className="font-display text-lg font-bold text-navy-900 mt-1.5">
                Metode Substitusi
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Mengubah bentuk persamaan secara tepat, menyulihkan variabel antar persamaan, mengecek hasil, serta memecahkan kasus harga tiket dan pembelian buah.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('pertemuan-2')}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-teal-700 transition-colors"
            >
              <span>Pelajari Pertemuan 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-sky-300 transition-colors">
            <div>
              <p className="text-xs font-mono font-semibold text-teal-700">Pertemuan 03 · Eliminasi</p>
              <h3 className="font-display text-lg font-bold text-navy-900 mt-1.5">
                Metode Eliminasi
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Menyamakan koefisien variabel, menghilangkan variabel secara sistematis, memverifikasi solusi, dan menyelesaikan kasus pembelian buku, pensil, dan penggaris.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('pertemuan-3')}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-teal-700 transition-colors"
            >
              <span>Pelajari Pertemuan 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Supporting Interactive Features Strip */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold">
              <Layers className="w-4 h-4" />
              <span>Ekosistem Pembelajaran Terintegrasi</span>
            </div>
            <h2 className="font-display text-xl font-bold text-navy-900">
              Simulasi Interaktif, LKPD Digital, dan Asesmen Otomatis
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Setiap progres belajar, jawaban LKPD, nilai latihan soal, asesmen diagnostik, dan asesmen sumatif tersimpan otomatis pada perangkatmu.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('tujuan')}
              className="px-4 py-2.5 text-sm font-semibold text-navy-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Tujuan Pembelajaran
            </button>
            <button
              type="button"
              onClick={() => onNavigate('simulasi')}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Buka Simulasi 3D
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
