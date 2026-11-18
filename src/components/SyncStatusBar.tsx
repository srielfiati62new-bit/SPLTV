import React, { useEffect, useState } from 'react';
import { CheckCircle2, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { SyncStatusSummary } from '../utils/syncService';

interface SyncStatusBarProps {
  syncStatus: SyncStatusSummary;
  onRetrySync: () => Promise<void>;
  onCheckConnection: () => Promise<void>;
}

export const SyncStatusBar: React.FC<SyncStatusBarProps> = ({
  syncStatus,
  onRetrySync,
  onCheckConnection,
}) => {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      if (syncStatus.pendingOrFailedCount > 0) {
        void onRetrySync();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncStatus.pendingOrFailedCount, onRetrySync]);

  const handleRetry = async () => {
    setBusy(true);
    try {
      await onRetrySync();
    } finally {
      setBusy(false);
    }
  };

  const handlePing = async () => {
    setBusy(true);
    try {
      await onCheckConnection();
    } finally {
      setBusy(false);
    }
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return 'Belum tersinkron';
    try {
      return new Date(iso).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const isFailed = syncStatus.state === 'failed' || syncStatus.pendingOrFailedCount > 0;
  const isGas = syncStatus.state === 'synced-gas';

  return (
    <div
      className={`no-print mb-5 rounded-xl border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs ${
        isFailed
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : isGas
            ? 'bg-teal-50/80 border-teal-200 text-teal-900'
            : 'bg-sky-50/80 border-sky-200 text-navy-900'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {isFailed ? (
          <CloudOff className="w-4 h-4 text-amber-700 shrink-0" />
        ) : isGas ? (
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
        ) : (
          <Cloud className="w-4 h-4 text-sky-700 shrink-0" />
        )}
        <div className="min-w-0">
          <span className="font-semibold">
            {isFailed
              ? `Sinkronisasi Tertunda (${syncStatus.pendingOrFailedCount} antrean)`
              : isGas
                ? 'Terhubung Google Sheets via Apps Script'
                : 'Tersimpan di Server Lokal (GAS Belum Diatur)'}
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span className="text-slate-600 tabular-nums">
            Pembaruan: {formatTime(syncStatus.lastSyncedAt)}
          </span>
          {syncStatus.lastMessage && (
            <>
              <span className="hidden sm:inline mx-2 text-slate-400">·</span>
              <span className="hidden sm:inline text-slate-600 truncate">
                {syncStatus.lastMessage}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isFailed && (
          <button
            type="button"
            disabled={busy}
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
            <span>Kirim Ulang Data Gagal</span>
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={handlePing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-navy-900 font-semibold rounded-lg transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-3 h-3 ${busy ? 'animate-spin' : ''}`} />
          <span>Cek Koneksi</span>
        </button>
      </div>
    </div>
  );
};
