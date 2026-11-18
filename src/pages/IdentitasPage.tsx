import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Trash2, UserCheck } from 'lucide-react';
import { MenuId, StudentIdentity } from '../types/module';

interface IdentitasPageProps {
  identity: StudentIdentity | null;
  pendingRedirect: MenuId | null;
  onSaveIdentity: (identity: StudentIdentity) => void;
  onResetAll: () => void;
}

export const IdentitasPage: React.FC<IdentitasPageProps> = ({
  identity,
  pendingRedirect,
  onSaveIdentity,
  onResetAll,
}) => {
  const [namaLengkap, setNamaLengkap] = useState(identity?.namaLengkap ?? '');
  const [kelas, setKelas] = useState(identity?.kelas ?? '');
  const [nomorAbsen, setNomorAbsen] = useState(identity?.nomorAbsen ?? '');
  const [errors, setErrors] = useState<{ nama?: string; kelas?: string; absen?: string }>({});
  const [savedToast, setSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { nama?: string; kelas?: string; absen?: string } = {};

    const cleanName = namaLengkap.trim();
    const cleanKelas = kelas.trim();
    const cleanAbsen = nomorAbsen.trim();
    const absenNum = Number(cleanAbsen);

    if (cleanName.length < 3) {
      newErrors.nama = 'Nama lengkap minimal terdiri atas 3 karakter.';
    }
    if (cleanKelas.length < 2) {
      newErrors.kelas = 'Silakan tuliskan kelas / konsentrasi keahlian kamu.';
    }
    if (!cleanAbsen || !Number.isInteger(absenNum) || absenNum < 1 || absenNum > 50) {
      newErrors.absen = 'Nomor absen harus berupa angka bulat antara 1 sampai 50.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSavedToast(true);
    onSaveIdentity({
      namaLengkap: cleanName,
      kelas: cleanKelas,
      nomorAbsen: String(absenNum),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono font-semibold text-teal-700">Menu 02 · Registrasi Belajar</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
          Identitas Peserta Didik
        </h1>
        <p className="text-sm text-slate-600 mt-1.5">
          Isi data dirimu dengan benar sebelum memasuki materi, simulasi, LKPD, dan asesmen.
          Identitas ini tersimpan otomatis agar progres belajarmu tidak hilang.
        </p>
      </div>

      {pendingRedirect && !identity && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-navy-900">
          <AlertCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Lengkapi Identitas Terlebih Dahulu</p>
            <p className="text-slate-600 mt-0.5">
              Setelah menekan tombol <strong>MULAI</strong>, kamu akan langsung diarahkan ke halaman yang kamu pilih.
            </p>
          </div>
        </div>
      )}

      {savedToast && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-sm text-teal-900">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Identitas peserta didik berhasil disimpan.</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5"
      >
        {/* Nama Lengkap */}
        <div>
          <label htmlFor="namaLengkap" className="block text-sm font-semibold text-navy-900 mb-1.5">
            Nama Lengkap <span className="text-rose-600">*</span>
          </label>
          <input
            id="namaLengkap"
            type="text"
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            placeholder="Contoh: Muhammad Rizky Pratama"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500"
          />
          {errors.nama && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.nama}</p>
          )}
        </div>

        {/* Kelas / Konsentrasi Keahlian */}
        <div>
          <label htmlFor="kelasInput" className="block text-sm font-semibold text-navy-900 mb-1.5">
            Kelas / Konsentrasi Keahlian <span className="text-rose-600">*</span>
          </label>
          <input
            id="kelasInput"
            type="text"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            placeholder="Contoh: X TKJ 1 / X DKV 2 / X Kuliner"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500"
          />
          {errors.kelas && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.kelas}</p>
          )}
        </div>

        {/* Nomor Absen */}
        <div>
          <label htmlFor="nomorAbsen" className="block text-sm font-semibold text-navy-900 mb-1.5">
            Nomor Absen <span className="text-rose-600">*</span>
          </label>
          <input
            id="nomorAbsen"
            type="number"
            min={1}
            max={50}
            value={nomorAbsen}
            onChange={(e) => setNomorAbsen(e.target.value)}
            placeholder="Contoh: 14"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500"
          />
          {errors.absen && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.absen}</p>
          )}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <UserCheck className="w-4 h-4 text-teal-300" />
            <span>MULAI</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {identity && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data & Progres</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
