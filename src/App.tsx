import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutShell } from './components/LayoutShell';
import { BerandaPage } from './pages/BerandaPage';
import { DashboardPage } from './pages/DashboardPage';
import {
  PetaKonsepPage,
  PetunjukPage,
  ProfilGuruPage,
  TujuanPage,
} from './pages/GuideAndMetaPages';
import { HasilBelajarPage, RefleksiPage } from './pages/HasilAndRefleksiPages';
import { IdentitasPage } from './pages/IdentitasPage';
import { LessonMeetingView } from './pages/LessonMeetingView';
import { LkpdPage } from './pages/LkpdPage';
import {
  AsesmenDiagnostikPage,
  AsesmenSumatifPage,
  LatihanSoalPage,
} from './pages/QuizAssessmentPages';
import { SimulasiPage } from './pages/SimulasiPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import {
  AssessmentRecord,
  ConceptExplorationRecord,
  LearningProgress,
  LkpdRecord,
  MenuId,
  ReflectionRecord,
  StudentIdentity,
} from './types/module';
import {
  clearIdentityAndProgress,
  DEFAULT_PROGRESS,
  loadIdentity,
  loadProgress,
  NAV_ITEMS,
  saveIdentity,
  saveProgress,
} from './utils/storage';
import {
  buildDiagnostikPayload,
  buildLatihanPayload,
  buildLkpdPayload,
  buildRefleksiPayload,
  buildSumatifPayload,
  checkBackendHealth,
  loadSyncMeta,
  retryFailedSyncs,
  syncActivity,
  SyncActivityType,
  SyncStatusSummary,
} from './utils/syncService';

export default function App() {
  const [identity, setIdentity] = useState<StudentIdentity | null>(() => loadIdentity());
  const [progress, setProgress] = useState<LearningProgress>(() => loadProgress());
  const [activeMenu, setActiveMenu] = useState<MenuId>('beranda');
  const [pendingRedirect, setPendingRedirect] = useState<MenuId | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatusSummary>(() => loadSyncMeta());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleCheckConnection = useCallback(async () => {
    const res = await checkBackendHealth();
    setSyncStatus((prev) => ({
      ...prev,
      gasConfigured: res.gasConfigured,
      lastMessage: res.ok
        ? res.gasConfigured
          ? 'Server dan endpoint Google Apps Script terkonfigurasi.'
          : 'Server aplikasi aktif (Mode Server Lokal — GAS belum diatur).'
        : 'Server backend tidak merespons.',
    }));
  }, []);

  useEffect(() => {
    void handleCheckConnection();
  }, [handleCheckConnection]);

  const handleRetrySync = useCallback(async () => {
    const meta = await retryFailedSyncs();
    setSyncStatus(meta);
  }, []);

  const triggerSync = useCallback(
    (
      activeIdentity: StudentIdentity,
      nextProgress: LearningProgress,
      activityType: SyncActivityType,
      payload: Record<string, unknown>
    ) => {
      setSyncStatus((prev) => ({ ...prev, state: 'syncing' }));
      void syncActivity(activeIdentity, nextProgress, activityType, payload).then((meta) => {
        setSyncStatus(meta);
      });
    },
    []
  );

  const handleNavigate = useCallback(
    (target: MenuId) => {
      const navItem = NAV_ITEMS.find((n) => n.id === target);
      if (navItem?.requiresIdentity && !identity) {
        setPendingRedirect(target);
        setActiveMenu('identitas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setActiveMenu(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [identity]
  );

  const handleSaveIdentity = (newIdentity: StudentIdentity) => {
    saveIdentity(newIdentity);
    setIdentity(newIdentity);
    triggerSync(newIdentity, progress, 'identitas', { nomorAbsen: newIdentity.nomorAbsen });
    const nextDest = pendingRedirect ?? 'dashboard';
    setPendingRedirect(null);
    setActiveMenu(nextDest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    clearIdentityAndProgress();
    setIdentity(null);
    setProgress(DEFAULT_PROGRESS);
    setPendingRedirect(null);
    setActiveMenu('beranda');
  };

  const handleCompleteMeeting = (
    meetingId: 'pertemuan-1' | 'pertemuan-2' | 'pertemuan-3',
    nextMenu: MenuId
  ) => {
    setProgress((prev) => {
      const exists = prev.completedMeetings.includes(meetingId);
      const next: LearningProgress = {
        ...prev,
        completedMeetings: exists ? prev.completedMeetings : [...prev.completedMeetings, meetingId],
      };
      if (identity) {
        triggerSync(identity, next, 'identitas', { nomorAbsen: identity.nomorAbsen });
      }
      return next;
    });
    handleNavigate(nextMenu);
  };

  const handleUpdateExploration = useCallback((conceptExploration: ConceptExplorationRecord) => {
    setProgress((prev) => ({ ...prev, conceptExploration }));
  }, []);

  const handleVisitSimulation = useCallback(() => {
    setProgress((prev) => (prev.simulationVisited ? prev : { ...prev, simulationVisited: true }));
  }, []);

  const handleCompleteSubstitutionLab = useCallback(() => {
    setProgress((prev) => (prev.substitutionLabDone ? prev : { ...prev, substitutionLabDone: true }));
  }, []);

  const handleCompleteEliminationLab = useCallback(() => {
    setProgress((prev) => (prev.eliminationLabDone ? prev : { ...prev, eliminationLabDone: true }));
  }, []);

  const handleSaveLkpd = (lkpd: LkpdRecord) => {
    setProgress((prev) => {
      const next = { ...prev, lkpd };
      if (
        identity &&
        (lkpd.lkpd1.completed || lkpd.lkpd2.completed || lkpd.lkpd3.completed)
      ) {
        triggerSync(identity, next, 'lkpd', buildLkpdPayload(lkpd));
      }
      return next;
    });
  };

  const handleSaveDiagnostik = (diagnostik: AssessmentRecord) => {
    setProgress((prev) => {
      const next = { ...prev, diagnostik };
      if (identity && diagnostik.completed) {
        triggerSync(identity, next, 'diagnostik', buildDiagnostikPayload(diagnostik));
      }
      return next;
    });
  };

  const handleSaveLatihan = (latihan: AssessmentRecord) => {
    setProgress((prev) => {
      const next = { ...prev, latihan };
      if (identity && latihan.completed) {
        triggerSync(identity, next, 'latihan', buildLatihanPayload(latihan));
      }
      return next;
    });
  };

  const handleSaveSumatif = (sumatif: AssessmentRecord) => {
    setProgress((prev) => {
      const next = { ...prev, sumatif };
      if (identity && sumatif.completed) {
        triggerSync(identity, next, 'sumatif', buildSumatifPayload(sumatif));
      }
      return next;
    });
  };

  const handleSaveRefleksi = (refleksi: ReflectionRecord) => {
    setProgress((prev) => {
      const next = { ...prev, refleksi };
      if (identity && refleksi.completed) {
        triggerSync(identity, next, 'refleksi', buildRefleksiPayload(refleksi));
      }
      return next;
    });
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'beranda':
        return <BerandaPage identity={identity} onNavigate={handleNavigate} />;
      case 'identitas':
        return (
          <IdentitasPage
            identity={identity}
            pendingRedirect={pendingRedirect}
            onSaveIdentity={handleSaveIdentity}
            onResetAll={handleResetAll}
          />
        );
      case 'dashboard':
        return identity ? (
          <DashboardPage identity={identity} progress={progress} onNavigate={handleNavigate} />
        ) : null;
      case 'petunjuk':
        return <PetunjukPage onNavigate={handleNavigate} />;
      case 'peta-konsep':
        return <PetaKonsepPage onNavigate={handleNavigate} />;
      case 'tujuan':
        return <TujuanPage onNavigate={handleNavigate} />;
      case 'diagnostik':
        return identity ? (
          <AsesmenDiagnostikPage
            identity={identity}
            record={progress.diagnostik}
            onSaveRecord={handleSaveDiagnostik}
            onNavigate={handleNavigate}
          />
        ) : null;
      case 'pertemuan-1':
        return (
          <LessonMeetingView
            key="pertemuan-1"
            meetingId="pertemuan-1"
            isCompleted={progress.completedMeetings.includes('pertemuan-1')}
            conceptExploration={progress.conceptExploration}
            onUpdateExploration={handleUpdateExploration}
            onCompleteAndContinue={handleCompleteMeeting}
          />
        );
      case 'pertemuan-2':
        return (
          <LessonMeetingView
            key="pertemuan-2"
            meetingId="pertemuan-2"
            isCompleted={progress.completedMeetings.includes('pertemuan-2')}
            conceptExploration={progress.conceptExploration}
            onUpdateExploration={handleUpdateExploration}
            onCompleteAndContinue={handleCompleteMeeting}
          />
        );
      case 'pertemuan-3':
        return (
          <LessonMeetingView
            key="pertemuan-3"
            meetingId="pertemuan-3"
            isCompleted={progress.completedMeetings.includes('pertemuan-3')}
            conceptExploration={progress.conceptExploration}
            onUpdateExploration={handleUpdateExploration}
            onCompleteAndContinue={handleCompleteMeeting}
          />
        );
      case 'simulasi':
        return (
          <SimulasiPage
            substitutionLabDone={progress.substitutionLabDone}
            eliminationLabDone={progress.eliminationLabDone}
            onVisitSimulation={handleVisitSimulation}
            onCompleteSubstitutionLab={handleCompleteSubstitutionLab}
            onCompleteEliminationLab={handleCompleteEliminationLab}
          />
        );
      case 'lkpd':
        return identity ? (
          <LkpdPage
            identity={identity}
            lkpd={progress.lkpd}
            onSaveLkpd={handleSaveLkpd}
            onNavigate={handleNavigate}
          />
        ) : null;
      case 'latihan':
        return identity ? (
          <LatihanSoalPage
            identity={identity}
            record={progress.latihan}
            onSaveRecord={handleSaveLatihan}
            onNavigate={handleNavigate}
          />
        ) : null;
      case 'sumatif':
        return identity ? (
          <AsesmenSumatifPage
            identity={identity}
            record={progress.sumatif}
            onSaveRecord={handleSaveSumatif}
            onNavigate={handleNavigate}
          />
        ) : null;
      case 'hasil-belajar':
        return identity ? (
          <HasilBelajarPage
            identity={identity}
            progress={progress}
            syncStatus={syncStatus}
            onNavigate={handleNavigate}
          />
        ) : null;
      case 'refleksi':
        return identity ? (
          <RefleksiPage
            identity={identity}
            refleksi={progress.refleksi}
            onSaveRefleksi={handleSaveRefleksi}
            onNavigate={handleNavigate}
          />
        ) : null;
      case 'profil-guru':
        return <ProfilGuruPage onNavigate={handleNavigate} />;
      case 'teacher-dashboard':
        return <TeacherDashboardPage />;
      default:
        return <BerandaPage identity={identity} onNavigate={handleNavigate} />;
    }
  };

  return (
    <LayoutShell
      activeMenu={activeMenu}
      onNavigate={handleNavigate}
      identity={identity}
      progress={progress}
      syncStatus={syncStatus}
      onRetrySync={handleRetrySync}
      onCheckConnection={handleCheckConnection}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMenu}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </LayoutShell>
  );
}
