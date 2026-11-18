import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Lock,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  X,
} from 'lucide-react';
import { LearningProgress, MenuId, NavItem, StudentIdentity } from '../types/module';
import { calculateGamification, calculateOverallProgress, NAV_ITEMS } from '../utils/storage';
import { SyncStatusSummary } from '../utils/syncService';
import { SyncStatusBar } from './SyncStatusBar';

interface LayoutShellProps {
  activeMenu: MenuId;
  onNavigate: (menu: MenuId) => void;
  identity: StudentIdentity | null;
  progress: LearningProgress;
  syncStatus?: SyncStatusSummary;
  onRetrySync?: () => Promise<void>;
  onCheckConnection?: () => Promise<void>;
  children: React.ReactNode;
}

const GROUPS: NavItem['group'][] = [
  'Utama',
  'Persiapan',
  'Materi Inti',
  'Praktik & Evaluasi',
  'Penutup',
];

export const LayoutShell: React.FC<LayoutShellProps> = ({
  activeMenu,
  onNavigate,
  identity,
  progress,
  syncStatus,
  onRetrySync,
  onCheckConnection,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const overallPercent = calculateOverallProgress(progress);
  const gamification = calculateGamification(progress);

  const isMenuCompleted = (id: MenuId): boolean => {
    switch (id) {
      case 'identitas':
        return Boolean(identity);
      case 'diagnostik':
        return Boolean(progress.diagnostik?.completed);
      case 'pertemuan-1':
        return progress.completedMeetings.includes('pertemuan-1');
      case 'pertemuan-2':
        return progress.completedMeetings.includes('pertemuan-2');
      case 'pertemuan-3':
        return progress.completedMeetings.includes('pertemuan-3');
      case 'simulasi':
        return progress.substitutionLabDone && progress.eliminationLabDone;
      case 'lkpd':
        return progress.lkpd.completed;
      case 'latihan':
        return Boolean(progress.latihan?.completed);
      case 'sumatif':
        return Boolean(progress.sumatif?.completed);
      case 'refleksi':
        return progress.refleksi.completed;
      default:
        return false;
    }
  };

  const handleSelect = (id: MenuId) => {
    onNavigate(id);
    setMobileDrawerOpen(false);
  };

  const renderNavList = () => (
    <div className="space-y-5">
      {GROUPS.map((group) => {
        const items = NAV_ITEMS.filter((item) => item.group === group);
        return (
          <div key={group}>
            <p className="px-3 mb-1.5 text-xs font-semibold tracking-wide text-slate-400">
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const isActive = activeMenu === item.id;
                const locked = item.requiresIdentity && !identity;
                const done = isMenuCompleted(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                        isActive
                          ? 'bg-navy-900 text-white font-semibold'
                          : 'text-slate-700 hover:bg-sky-50 hover:text-navy-900'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        {item.number ? (
                          <span
                            className={`text-xs font-mono tabular-nums w-5 shrink-0 ${
                              isActive ? 'text-sky-300' : 'text-slate-400'
                            }`}
                          >
                            {String(item.number).padStart(2, '0')}
                          </span>
                        ) : (
                          <span
                            className={`text-xs font-mono w-5 shrink-0 ${
                              isActive ? 'text-sky-300' : 'text-teal-600'
                            }`}
                          >
                            {item.id === 'teacher-dashboard' ? 'GR' : 'DB'}
                          </span>
                        )}
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className="shrink-0">
                        {locked ? (
                          <Lock
                            className={`w-3.5 h-3.5 ${
                              isActive ? 'text-sky-200' : 'text-slate-400'
                            }`}
                            aria-label="Memerlukan identitas"
                          />
                        ) : done ? (
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              isActive ? 'text-teal-300' : 'text-teal-600'
                            }`}
                            aria-label="Selesai"
                          />
                        ) : (
                          <ChevronRight
                            className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${
                              isActive ? 'text-sky-200 opacity-100' : 'text-slate-300'
                            }`}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50/70 via-slate-50 to-white text-slate-900">
      {/* Top Bar strictly obeying 3-zone contract */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title (single line) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-navy-900 hover:bg-sky-50 transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-sky-50 hover:text-navy-900 transition-colors"
              aria-label={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSelect('beranda')}
              className="text-base sm:text-lg font-bold tracking-tight text-navy-900 whitespace-nowrap shrink-0 hover:text-navy-700 transition-colors"
            >
              SPLTV Smart Learning
            </button>
          </div>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => handleSelect('beranda')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeMenu === 'beranda'
                  ? 'border-teal-600 text-navy-900 font-semibold'
                  : 'border-transparent hover:text-navy-900'
              }`}
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => handleSelect('dashboard')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeMenu === 'dashboard'
                  ? 'border-teal-600 text-navy-900 font-semibold'
                  : 'border-transparent hover:text-navy-900'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => handleSelect('pertemuan-1')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeMenu.startsWith('pertemuan-')
                  ? 'border-teal-600 text-navy-900 font-semibold'
                  : 'border-transparent hover:text-navy-900'
              }`}
            >
              Materi
            </button>
            <button
              type="button"
              onClick={() => handleSelect('simulasi')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeMenu === 'simulasi' || activeMenu === 'lkpd'
                  ? 'border-teal-600 text-navy-900 font-semibold'
                  : 'border-transparent hover:text-navy-900'
              }`}
            >
              Simulasi
            </button>
            <button
              type="button"
              onClick={() => handleSelect('sumatif')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                activeMenu === 'sumatif' || activeMenu === 'latihan'
                  ? 'border-teal-600 text-navy-900 font-semibold'
                  : 'border-transparent hover:text-navy-900'
              }`}
            >
              Asesmen
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="shrink-0">
            {identity ? (
              <button
                type="button"
                onClick={() => handleSelect('identitas')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-navy-900 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors whitespace-nowrap shrink-0 max-w-[190px]"
              >
                <UserCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="truncate">{identity.namaLengkap}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSelect('identitas')}
                className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Mulai Belajar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-navy-950/50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative z-10 w-80 max-w-[85vw] bg-white h-full overflow-y-auto p-5 border-r border-slate-200 flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="font-display font-bold text-navy-900">Navigasi E-Modul</span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {identity && (
              <div className="mb-4 p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs">
                <p className="font-semibold text-navy-900 truncate">{identity.namaLengkap}</p>
                <p className="text-slate-600 mt-0.5">
                  {identity.kelas} · Absen {identity.nomorAbsen} · Progres {overallPercent}%
                </p>
              </div>
            )}
            {renderNavList()}
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        {/* Desktop Persistent Sidebar */}
        {sidebarOpen && (
          <aside className="no-print hidden lg:block w-72 shrink-0 border-r border-slate-200 bg-white/80 p-4 overflow-y-auto max-h-[calc(100vh-4rem)] sticky top-16">
            {identity ? (
              <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 text-white">
                <p className="text-xs text-sky-300 font-medium">Peserta Didik Aktif</p>
                <p className="font-display font-semibold text-sm mt-0.5 truncate">
                  {identity.namaLengkap}
                </p>
                <p className="text-xs text-slate-200 mt-0.5 tabular-nums">
                  {identity.kelas} · No. Absen {identity.nomorAbsen}
                </p>
                <p className="text-xs text-teal-300 font-mono mt-1 tabular-nums">
                  Lv.{gamification.level} · {gamification.xp} XP · {gamification.stars}★
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-sky-200 mb-1 tabular-nums">
                    <span>Progres Modul</span>
                    <span>{overallPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400 transition-all duration-300"
                      style={{ width: `${overallPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-5 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-700">
                <p className="font-semibold text-navy-900">Identitas Belum Diisi</p>
                <p className="mt-1 leading-relaxed">
                  Lengkapi Nama, Kelas, dan Nomor Absen untuk membuka seluruh materi dan menyimpan progres belajar.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelect('identitas')}
                  className="mt-2.5 w-full py-2 px-3 bg-navy-900 text-white font-semibold rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Isi Identitas Sekarang
                </button>
              </div>
            )}
            {renderNavList()}
          </aside>
        )}

        {/* Active Page Viewport */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
          {identity && syncStatus && onRetrySync && onCheckConnection && activeMenu !== 'teacher-dashboard' && (
            <SyncStatusBar
              syncStatus={syncStatus}
              onRetrySync={onRetrySync}
              onCheckConnection={onCheckConnection}
            />
          )}
          {children}
        </main>
      </div>

      {/* Clean Minimal Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-5 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            SPLTV Smart Learning · E-Modul Matematika SMK Kelas X Fase E (Kurikulum Merdeka)
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleSelect('petunjuk')}
              className="hover:text-navy-900 transition-colors"
            >
              Petunjuk Penggunaan
            </button>
            <button
              type="button"
              onClick={() => handleSelect('peta-konsep')}
              className="hover:text-navy-900 transition-colors"
            >
              Peta Konsep
            </button>
            <button
              type="button"
              onClick={() => handleSelect('profil-guru')}
              className="hover:text-navy-900 transition-colors"
            >
              Profil Guru
            </button>
            <button
              type="button"
              onClick={() => handleSelect('teacher-dashboard')}
              className="font-semibold text-teal-700 hover:text-navy-900 transition-colors"
            >
              Dashboard Guru
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
