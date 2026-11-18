import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Play,
  RotateCcw,
  Sliders,
  XCircle,
} from 'lucide-react';
import { MathBlock, MathText } from '../components/MathText';
import { SmartTutorPanel, TutorScaffolding } from '../components/SmartTutorPanel';
import { SIMULATION_PRESETS } from '../data/curriculumData';
import { fmtNum, formatEqLatex, LinearEquation3, solveSpltv } from '../utils/spltvSolver';

interface SimulasiPageProps {
  substitutionLabDone: boolean;
  eliminationLabDone: boolean;
  onVisitSimulation: () => void;
  onCompleteSubstitutionLab: () => void;
  onCompleteEliminationLab: () => void;
}

const ELIM_EQUATIONS: [LinearEquation3, LinearEquation3, LinearEquation3] = [
  { a: 3, b: -1, c: 2, d: 15 },
  { a: 2, b: 1, c: 1, d: 13 },
  { a: 3, b: 2, c: 2, d: 24 },
];

export const SimulasiPage: React.FC<SimulasiPageProps> = ({
  substitutionLabDone,
  eliminationLabDone,
  onVisitSimulation,
  onCompleteSubstitutionLab,
  onCompleteEliminationLab,
}) => {
  const [simMode, setSimMode] = useState<'substitusi-lab' | 'eliminasi-lab' | 'explorer-3d'>(
    'substitusi-lab'
  );

  // =========================
  // 1. LAB SUBSTITUSI STATE
  // =========================
  const [subStep, setSubStep] = useState<number>(1);
  const [subSelectedEq, setSubSelectedEq] = useState<'eq1' | 'eq2' | 'eq3' | null>(null);
  const [subInputZ, setSubInputZ] = useState('');
  const [subInputY, setSubInputY] = useState('');
  const [subInputX, setSubInputX] = useState('');
  const [subFeedback, setSubFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [subAttemptedSteps, setSubAttemptedSteps] = useState<Record<number, boolean>>({});
  const [subValidatedSteps, setSubValidatedSteps] = useState<Record<number, boolean>>({});

  // =========================
  // 2. LAB ELIMINASI STATE
  // =========================
  const [elimEqA, setElimEqA] = useState<0 | 1 | 2>(0);
  const [elimEqB, setElimEqB] = useState<0 | 1 | 2>(2);
  const [elimTargetVar, setElimTargetVar] = useState<'x' | 'y' | 'z'>('z');
  const [elimMultA, setElimMultA] = useState<string>('1');
  const [elimMultB, setElimMultB] = useState<string>('1');
  const [elimOp, setElimOp] = useState<'+' | '-'>('-');
  const [elimNewEqHistory, setElimNewEqHistory] = useState<
    { label: string; eq: LinearEquation3; eliminatedVar: string }[]
  >([]);
  const [elimAttemptMsg, setElimAttemptMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const [elimAnsX, setElimAnsX] = useState('');
  const [elimAnsY, setElimAnsY] = useState('');
  const [elimAnsZ, setElimAnsZ] = useState('');
  const [elimFinalCheck, setElimFinalCheck] = useState<{ ok: boolean; msg: string } | null>(null);

  // =========================
  // 3. EXPLORER 3D & FREE SOLVER STATE
  // =========================
  const [presetId, setPresetId] = useState<string>(SIMULATION_PRESETS[0].id);
  const [equations, setEquations] = useState<[LinearEquation3, LinearEquation3, LinearEquation3]>(
    SIMULATION_PRESETS[0].equations
  );
  const [method, setMethod] = useState<'substitusi' | 'eliminasi'>('substitusi');
  const [azimuth, setAzimuth] = useState<number>(36);
  const [elevation, setElevation] = useState<number>(24);
  const [visiblePlanes, setVisiblePlanes] = useState<[boolean, boolean, boolean]>([true, true, true]);

  useEffect(() => {
    onVisitSimulation();
  }, [onVisitSimulation]);

  // ---------- Substitution Lab Handlers ----------
  const validateSubStep = () => {
    setSubAttemptedSteps((p) => ({ ...p, [subStep]: true }));

    if (subStep === 1) {
      if (subSelectedEq === 'eq2' || subSelectedEq === 'eq3') {
        setSubValidatedSteps((p) => ({ ...p, 1: true }));
        setSubFeedback({
          ok: true,
          msg:
            subSelectedEq === 'eq2'
              ? 'Tepat! Persamaan (2) $x + y = 4$ paling sederhana karena hanya memuat 2 variabel berkoefisien $1$. Kita dapat langsung mengganti $(x + y)$ pada Persamaan (1) dengan $4$.'
              : 'Tepat! Persamaan (3) $y + z = 5$ sangat sederhana karena hanya memuat 2 variabel. Mari lanjut dengan memanfaatkan Persamaan (2) $x + y = 4$ ke Persamaan (1).',
        });
      } else {
        setSubFeedback({
          ok: false,
          msg: 'Persamaan (1) memuat tiga variabel sekaligus. Coba pilih persamaan yang hanya memiliki dua variabel agar substitusi jauh lebih cepat.',
        });
      }
      return;
    }

    if (subStep === 2) {
      const val = Number(subInputZ.trim());
      if (subInputZ.trim() !== '' && val === 2) {
        setSubValidatedSteps((p) => ({ ...p, 2: true }));
        setSubFeedback({
          ok: true,
          msg: 'Benar! Karena $4 + z = 6$, maka $z = 6 - 4 = 2$.',
        });
      } else if (val === 10) {
        setSubFeedback({
          ok: false,
          msg: 'Kamu menjumlahkan $6 + 4 = 10$. Ingat aturan pindah ruas: $+4$ di ruas kiri berpindah ke ruas kanan menjadi $-4$.',
        });
      } else if (val === -2) {
        setSubFeedback({
          ok: false,
          msg: 'Perhatikan urutan pengurangannya: bukan $4 - 6$, melainkan $6 - 4$.',
        });
      } else {
        setSubFeedback({
          ok: false,
          msg: 'Belum tepat. Selesaikan persamaan $4 + z = 6$ untuk memperoleh nilai $z$.',
        });
      }
      return;
    }

    if (subStep === 3) {
      const val = Number(subInputY.trim());
      if (subInputY.trim() !== '' && val === 3) {
        setSubValidatedSteps((p) => ({ ...p, 3: true }));
        setSubFeedback({
          ok: true,
          msg: 'Tepat! Dari $y + 2 = 5$, diperoleh $y = 5 - 2 = 3$.',
        });
      } else if (val === 7) {
        setSubFeedback({
          ok: false,
          msg: 'Kamu menjumlahkan $5 + 2 = 7$. Pindahkan $+2$ ke ruas kanan sehingga tandanya berubah menjadi pengurangan.',
        });
      } else {
        setSubFeedback({
          ok: false,
          msg: 'Belum tepat. Substitusikan $z = 2$ ke $y + z = 5$, lalu hitung nilai $y$.',
        });
      }
      return;
    }

    if (subStep === 4) {
      const val = Number(subInputX.trim());
      if (subInputX.trim() !== '' && val === 1) {
        setSubValidatedSteps((p) => ({ ...p, 4: true }));
        setSubFeedback({
          ok: true,
          msg: 'Sempurna! Dengan $y = 3$ pada $x + y = 4$, diperoleh $x = 4 - 3 = 1$. Jawaban akhir $(1, 3, 2)$ terverifikasi!',
        });
        onCompleteSubstitutionLab();
      } else if (val === 7) {
        setSubFeedback({
          ok: false,
          msg: 'Hati-hati tanda pindah ruas: dari $x + 3 = 4$, kurangkan $4$ dengan $3$, bukan dijumlahkan.',
        });
      } else {
        setSubFeedback({
          ok: false,
          msg: 'Belum tepat. Masukkan $y = 3$ ke persamaan $x + y = 4$.',
        });
      }
    }
  };

  const getSubScaffolding = (): TutorScaffolding => {
    const diag = subFeedback && !subFeedback.ok ? subFeedback.msg : null;
    if (subStep === 1) {
      return {
        topicTitle: 'Langkah 1 · Pemilihan Persamaan',
        konsepHint: 'Apakah kamu sudah memilih persamaan yang paling sederhana?',
        prosesHint:
          'Bandingkan jumlah variabel pada Persamaan (1), (2), dan (3). Persamaan dengan 2 variabel paling mudah disubstitusikan.',
        perhitunganHint:
          'Pilih Persamaan (2) $x + y = 4$ atau Persamaan (3) $y + z = 5$ karena keduanya sudah berbentuk penjumlahan dua variabel.',
        errorDiagnosis: diag,
      };
    }
    if (subStep === 2) {
      return {
        topicTitle: 'Langkah 2 · Menemukan Variabel z',
        konsepHint:
          'Bagaimana jika bentuk $(x + y)$ pada $x + y + z = 6$ diganti langsung dengan nilainya dari Persamaan (2)?',
        prosesHint: 'Gantikan $x + y$ dengan $4$ sehingga terbentuk persamaan satu variabel: $4 + z = 6$.',
        perhitunganHint: 'Pindahkan $4$ ke ruas kanan: $z = 6 - 4$.',
        errorDiagnosis: diag,
      };
    }
    if (subStep === 3) {
      return {
        topicTitle: 'Langkah 3 · Menemukan Variabel y',
        konsepHint:
          'Setelah satu nilai variabel diketahui ($z = 2$), substitusi ke persamaan yang memuat $z$ dan satu variabel lainnya.',
        prosesHint: 'Gunakan Persamaan (3) $y + z = 5$, lalu gantikan $z$ dengan $2$.',
        perhitunganHint: 'Hitung $y = 5 - 2$ pada persamaan $y + 2 = 5$.',
        errorDiagnosis: diag,
      };
    }
    return {
      topicTitle: 'Langkah 4 · Substitusi Balik Nilai x',
      konsepHint:
        'Bagaimana jika variabel $x$ diubah terlebih dahulu menjadi bentuk $x = 4 - y$?',
      prosesHint: 'Masukkan nilai $y = 3$ yang sudah kamu peroleh ke $x = 4 - y$.',
      perhitunganHint: 'Hitung selisih $4 - 3$ dan uji hasilnya ke seluruh persamaan awal.',
      errorDiagnosis: diag,
    };
  };

  // ---------- Elimination Lab Handlers ----------
  const handleExecuteElimination = () => {
    if (elimEqA === elimEqB) {
      setElimAttemptMsg({
        ok: false,
        msg: 'Pilih dua persamaan yang BERBEDA untuk dieliminasi (misal Persamaan 1 dan Persamaan 3).',
      });
      return;
    }

    const k1 = Number(elimMultA);
    const k2 = Number(elimMultB);
    if (!Number.isFinite(k1) || !Number.isFinite(k2) || k1 === 0 || k2 === 0) {
      setElimAttemptMsg({
        ok: false,
        msg: 'Pengali persamaan tidak boleh nol atau kosong.',
      });
      return;
    }

    const A = ELIM_EQUATIONS[elimEqA];
    const B = ELIM_EQUATIONS[elimEqB];
    const sign = elimOp === '+' ? 1 : -1;

    const newEq: LinearEquation3 = {
      a: k1 * A.a + sign * k2 * B.a,
      b: k1 * A.b + sign * k2 * B.b,
      c: k1 * A.c + sign * k2 * B.c,
      d: k1 * A.d + sign * k2 * B.d,
    };

    const targetCoeff =
      elimTargetVar === 'x' ? newEq.a : elimTargetVar === 'y' ? newEq.b : newEq.c;

    if (Math.abs(targetCoeff) > 1e-9) {
      const cA = elimTargetVar === 'x' ? A.a : elimTargetVar === 'y' ? A.b : A.c;
      const cB = elimTargetVar === 'x' ? B.a : elimTargetVar === 'y' ? B.b : B.c;
      setElimAttemptMsg({
        ok: false,
        msg: `Variabel $${elimTargetVar}$ belum tereliminasi (koefisien barunya masih $${fmtNum(
          targetCoeff
        )}$). Pada Persamaan (${elimEqA + 1}) koefisien $${elimTargetVar}$ = $${fmtNum(
          cA
        )}$ dan pada Persamaan (${elimEqB + 1}) = $${fmtNum(
          cB
        )}$. Sesuaikan pengali dan operasi (+ atau −) agar jumlah/selisihnya menjadi $0$.`,
      });
      return;
    }

    const label = `(${elimEqA + 1})×${fmtNum(k1)} ${elimOp} (${elimEqB + 1})×${fmtNum(k2)}`;
    setElimNewEqHistory((prev) => [
      ...prev,
      { label, eq: newEq, eliminatedVar: elimTargetVar },
    ]);
    setElimAttemptMsg({
      ok: true,
      msg: `Berhasil! Variabel $${elimTargetVar}$ tereliminasi sehingga menghasilkan persamaan baru: $${formatEqLatex(
        newEq
      )}$.`,
    });
  };

  const handleValidateElimSolution = () => {
    const vx = Number(elimAnsX.trim());
    const vy = Number(elimAnsY.trim());
    const vz = Number(elimAnsZ.trim());
    if (
      elimAnsX.trim() === '' ||
      elimAnsY.trim() === '' ||
      elimAnsZ.trim() === '' ||
      !Number.isFinite(vx) ||
      !Number.isFinite(vy) ||
      !Number.isFinite(vz)
    ) {
      setElimFinalCheck({
        ok: false,
        msg: 'Lengkapi nilai x, y, dan z terlebih dahulu sebelum memeriksa hasil.',
      });
      return;
    }

    const eq1Val = 3 * vx - vy + 2 * vz;
    const eq2Val = 2 * vx + vy + vz;
    const eq3Val = 3 * vx + 2 * vy + 2 * vz;

    if (eq1Val === 15 && eq2Val === 13 && eq3Val === 24) {
      setElimFinalCheck({
        ok: true,
        msg: `Tepat sekali! $(x, y, z) = (2, 3, 6)$ memenuhi ketiga persamaan: Pers.(1) $= 15$, Pers.(2) $= 13$, dan Pers.(3) $= 24$.`,
      });
      onCompleteEliminationLab();
    } else {
      setElimFinalCheck({
        ok: false,
        msg: `Hasil pengecekan belum cocok: Pers.(1) menghasilkan $${eq1Val}$ (seharusnya $15$), Pers.(2) menghasilkan $${eq2Val}$ (seharusnya $13$), Pers.(3) menghasilkan $${eq3Val}$ (seharusnya $24$). Lakukan eliminasi satu pasang persamaan lagi (misal Pers. 1 & 3 untuk langsung mendapat $y = 3$).`,
      });
    }
  };

  const getElimScaffolding = (): TutorScaffolding => {
    const cA =
      elimTargetVar === 'x'
        ? ELIM_EQUATIONS[elimEqA].a
        : elimTargetVar === 'y'
        ? ELIM_EQUATIONS[elimEqA].b
        : ELIM_EQUATIONS[elimEqA].c;
    const cB =
      elimTargetVar === 'x'
        ? ELIM_EQUATIONS[elimEqB].a
        : elimTargetVar === 'y'
        ? ELIM_EQUATIONS[elimEqB].b
        : ELIM_EQUATIONS[elimEqB].c;

    return {
      topicTitle: 'Lab Eliminasi Terbimbing',
      konsepHint:
        'Pilih dua persamaan yang memiliki koefisien sama pada suatu variabel agar dapat langsung dieliminasi tanpa pengali rumit.',
      prosesHint: `Perhatikan Persamaan (1) $3x - y + 2z = 15$ dan Persamaan (3) $3x + 2y + 2z = 24$. Keduanya sama-sama memiliki $3x$ dan $+2z$!`,
      perhitunganHint: `Untuk Persamaan (${elimEqA + 1}) dan (${elimEqB + 1}) pada variabel $${elimTargetVar}$, koefisiennya adalah $${cA}$ dan $${cB}$. Gunakan pengali KPK dan kurangkan jika bertanda sama, atau jumlahkan jika berlawanan tanda.`,
      errorDiagnosis: elimAttemptMsg && !elimAttemptMsg.ok ? elimAttemptMsg.msg : null,
    };
  };

  // ---------- 3D Explorer & Free Solver ----------
  const currentPreset = SIMULATION_PRESETS.find((p) => p.id === presetId);
  const handleSelectPreset = (id: string) => {
    setPresetId(id);
    const found = SIMULATION_PRESETS.find((p) => p.id === id);
    if (found) {
      setEquations(
        found.equations.map((eq) => ({ ...eq })) as [
          LinearEquation3,
          LinearEquation3,
          LinearEquation3,
        ]
      );
    }
  };

  const handleCoeffChange = (eqIdx: 0 | 1 | 2, key: keyof LinearEquation3, value: string) => {
    const num = Number(value);
    const safeNum = Number.isFinite(num) ? num : 0;
    setEquations((prev) => {
      const next = prev.map((e, i) => (i === eqIdx ? { ...e, [key]: safeNum } : e));
      return next as [LinearEquation3, LinearEquation3, LinearEquation3];
    });
  };

  const result = useMemo(() => solveSpltv(equations, method), [equations, method]);

  const project3D = (x: number, y: number, z: number) => {
    const az = (azimuth * Math.PI) / 180;
    const el = (elevation * Math.PI) / 180;
    const rx = x * Math.cos(az) - y * Math.sin(az);
    const ry = x * Math.sin(az) + y * Math.cos(az);
    const px = rx;
    const py = ry * Math.sin(el) - z * Math.cos(el);
    return { cx: 220 + px * 11, cy: 175 + py * 11 };
  };

  const planePolygons = useMemo(() => {
    const scale = 6.5;
    const colors = [
      { fill: 'rgba(11, 31, 63, 0.28)', stroke: '#0b1f3f' },
      { fill: 'rgba(56, 189, 248, 0.30)', stroke: '#0284c7' },
      { fill: 'rgba(13, 148, 136, 0.30)', stroke: '#0d9488' },
    ];
    return equations.map((eq, idx) => {
      const norm = Math.sqrt(eq.a * eq.a + eq.b * eq.b + eq.c * eq.c) || 1;
      const dScaled = Math.max(-4, Math.min(4, (eq.d / norm) * 0.25));
      const nx = eq.a / norm;
      const ny = eq.b / norm;
      const nz = eq.c / norm;
      const ref = Math.abs(nz) < 0.8 ? [0, 0, 1] : [1, 0, 0];
      let ux = ny * ref[2] - nz * ref[1];
      let uy = nz * ref[0] - nx * ref[2];
      let uz = nx * ref[1] - ny * ref[0];
      const uLen = Math.hypot(ux, uy, uz) || 1;
      ux /= uLen;
      uy /= uLen;
      uz /= uLen;
      const vx = ny * uz - nz * uy;
      const vy = nz * ux - nx * uz;
      const vz = nx * uy - ny * ux;
      const cx = nx * dScaled;
      const cy = ny * dScaled;
      const cz = nz * dScaled;
      const corners = [
        [cx - scale * ux - scale * vx, cy - scale * uy - scale * vy, cz - scale * uz - scale * vz],
        [cx + scale * ux - scale * vx, cy + scale * uy - scale * vy, cz + scale * uz - scale * vz],
        [cx + scale * ux + scale * vx, cy + scale * uy + scale * vy, cz + scale * uz + scale * vz],
        [cx - scale * ux + scale * vx, cy - scale * uy + scale * vy, cz - scale * uz + scale * vz],
      ];
      const projected = corners.map(([px, py, pz]) => project3D(px, py, pz));
      return {
        pointsAttr: projected.map((p) => `${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(' '),
        ...colors[idx],
      };
    });
  }, [equations, azimuth, elevation]);

  const origin2D = project3D(0, 0, 0);
  const xEnd = project3D(10, 0, 0);
  const yEnd = project3D(0, 10, 0);
  const zEnd = project3D(0, 0, 10);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono font-semibold text-teal-700">
          Menu 10 · Laboratorium Simulasi Interaktif
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mt-1">
          Simulasi Matematika SPLTV
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Berlatih secara bertahap dengan Lab Metode Substitusi, Lab Metode Eliminasi mandiri, serta
          Eksplorasi Irisan 3 Bidang Ruang 3D.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/70 rounded-xl">
        <button
          type="button"
          onClick={() => setSimMode('substitusi-lab')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            simMode === 'substitusi-lab'
              ? 'bg-white text-navy-900 shadow-xs'
              : 'text-slate-600 hover:text-navy-900'
          }`}
        >
          <span>1. Lab Metode Substitusi</span>
          {substitutionLabDone && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
        </button>
        <button
          type="button"
          onClick={() => setSimMode('eliminasi-lab')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            simMode === 'eliminasi-lab'
              ? 'bg-white text-navy-900 shadow-xs'
              : 'text-slate-600 hover:text-navy-900'
          }`}
        >
          <span>2. Lab Metode Eliminasi</span>
          {eliminationLabDone && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
        </button>
        <button
          type="button"
          onClick={() => setSimMode('explorer-3d')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
            simMode === 'explorer-3d'
              ? 'bg-white text-navy-900 shadow-xs'
              : 'text-slate-600 hover:text-navy-900'
          }`}
        >
          3. Visualisasi 3D & Solver Bebas
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SIMULASI METODE SUBSTITUSI (x+y+z=6, x+y=4, y+z=5) */}
      {/* ========================================================= */}
      {simMode === 'substitusi-lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Lab Substitusi Terbimbing (Langkah {subStep} dari 4)
              </h2>
              <span className="text-xs font-mono text-teal-700 font-semibold">
                +150 XP saat tuntas
              </span>
            </div>

            <div className="p-4 rounded-xl bg-navy-900 text-white">
              <p className="text-xs text-sky-300 mb-1">Sistem Persamaan Target:</p>
              <MathBlock math="\begin{cases} x + y + z = 6 \quad \text{...(1)} \\ x + y = 4 \quad \text{...(2)} \\ y + z = 5 \quad \text{...(3)} \end{cases}" />
            </div>

            {/* Animated Equation Transformation Stage */}
            <AnimatePresence mode="wait">
              <motion.div
                key={subStep}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                className="p-5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-4"
              >
                {subStep === 1 && (
                  <>
                    <p className="text-sm font-bold text-navy-900">
                      Langkah 1: Pilih Persamaan Paling Sederhana untuk Diubah/Disubstitusi
                    </p>
                    <p className="text-sm text-slate-700">
                      Persamaan manakah yang paling praktis dipilih terlebih dahulu?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'eq1' as const, label: 'Pers. (1): x + y + z = 6' },
                        { id: 'eq2' as const, label: 'Pers. (2): x + y = 4' },
                        { id: 'eq3' as const, label: 'Pers. (3): y + z = 5' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSubSelectedEq(opt.id);
                            setSubFeedback(null);
                          }}
                          className={`p-3 rounded-xl border text-xs font-mono font-semibold text-left transition-colors ${
                            subSelectedEq === opt.id
                              ? 'bg-navy-900 text-white border-navy-900'
                              : 'bg-white text-navy-900 border-slate-300 hover:border-sky-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {subStep === 2 && (
                  <>
                    <p className="text-sm font-bold text-navy-900">
                      Langkah 2: Substitusi Persamaan (2) ke Persamaan (1)
                    </p>
                    <motion.div
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      className="p-3 rounded-lg bg-white border border-sky-200 text-sm"
                    >
                      <MathBlock math="\underbrace{(x + y)}_{=\,4} + z = 6 \implies 4 + z = 6" />
                    </motion.div>
                    <label className="block">
                      <span className="text-xs font-semibold text-navy-900">
                        Hitung dan masukkan nilai <MathText text="$z$" />:
                      </span>
                      <input
                        type="number"
                        value={subInputZ}
                        onChange={(e) => {
                          setSubInputZ(e.target.value);
                          setSubFeedback(null);
                        }}
                        placeholder="z = ?"
                        className="mt-1.5 w-36 px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-sm"
                      />
                    </label>
                  </>
                )}

                {subStep === 3 && (
                  <>
                    <p className="text-sm font-bold text-navy-900">
                      Langkah 3: Substitusi $z = 2$ ke Persamaan (3)
                    </p>
                    <motion.div
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      className="p-3 rounded-lg bg-white border border-sky-200 text-sm"
                    >
                      <MathBlock math="y + z = 5 \implies y + 2 = 5" />
                    </motion.div>
                    <label className="block">
                      <span className="text-xs font-semibold text-navy-900">
                        Hitung dan masukkan nilai <MathText text="$y$" />:
                      </span>
                      <input
                        type="number"
                        value={subInputY}
                        onChange={(e) => {
                          setSubInputY(e.target.value);
                          setSubFeedback(null);
                        }}
                        placeholder="y = ?"
                        className="mt-1.5 w-36 px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-sm"
                      />
                    </label>
                  </>
                )}

                {subStep === 4 && (
                  <>
                    <p className="text-sm font-bold text-navy-900">
                      Langkah 4: Substitusi Balik $y = 3$ ke Persamaan (2)
                    </p>
                    <motion.div
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      className="p-3 rounded-lg bg-white border border-sky-200 text-sm"
                    >
                      <MathBlock math="x + y = 4 \implies x + 3 = 4 \implies x = 4 - 3" />
                    </motion.div>
                    <label className="block">
                      <span className="text-xs font-semibold text-navy-900">
                        Hitung dan masukkan nilai <MathText text="$x$" />:
                      </span>
                      <input
                        type="number"
                        value={subInputX}
                        onChange={(e) => {
                          setSubInputX(e.target.value);
                          setSubFeedback(null);
                        }}
                        placeholder="x = ?"
                        className="mt-1.5 w-36 px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-sm"
                      />
                    </label>
                  </>
                )}

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={validateSubStep}
                    className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Validasi Jawaban
                  </button>
                  {subStep > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSubStep((s) => s - 1);
                        setSubFeedback(null);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-slate-300 text-navy-900 text-xs font-semibold rounded-lg hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Langkah Sebelumnya</span>
                    </button>
                  )}
                  {subStep < 4 && (
                    <button
                      type="button"
                      disabled={!subValidatedSteps[subStep]}
                      onClick={() => {
                        setSubStep((s) => s + 1);
                        setSubFeedback(null);
                      }}
                      className={`inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                        subValidatedSteps[subStep]
                          ? 'bg-teal-600 hover:bg-teal-500 text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Langkah Berikutnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {subFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2 ${
                      subFeedback.ok
                        ? 'bg-teal-50 border-teal-300 text-teal-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    {subFeedback.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <MathText text={subFeedback.msg} />
                    </div>
                  </div>
                )}

                {subAttemptedSteps[subStep] && subValidatedSteps[subStep] && subStep === 4 && (
                  <div className="p-4 rounded-xl bg-teal-600 text-white text-xs sm:text-sm space-y-1">
                    <p className="font-bold">
                      Pengecekan Akhir Terverifikasi: Himpunan Penyelesaian (1, 3, 2)
                    </p>
                    <p className="font-mono">
                      (1) 1 + 3 + 2 = 6 · (2) 1 + 3 = 4 · (3) 3 + 2 = 5
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Panel: Smart Tutor */}
          <div className="lg:col-span-5 space-y-4">
            <SmartTutorPanel key={subStep} scaffolding={getSubScaffolding()} />
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-navy-900">Aturan Lab Substitusi</p>
              <p>
                Kamu wajib mencoba dan memvalidasi jawaban pada setiap langkah sebelum tombol{' '}
                <strong>Langkah Berikutnya</strong> aktif. Jika kesulitan, buka petunjuk bertahap
                pada Tutor Pembelajaran Cerdas di atas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SIMULASI METODE ELIMINASI                          */}
      {/* ========================================================= */}
      {simMode === 'eliminasi-lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Lab Eliminasi Mandiri
              </h2>
              <span className="text-xs font-mono text-teal-700 font-semibold">
                +150 XP saat tuntas
              </span>
            </div>

            <div className="p-4 rounded-xl bg-navy-900 text-white">
              <p className="text-xs text-sky-300 mb-1">Sistem Persamaan Target:</p>
              <MathBlock math="\begin{cases} 3x - y + 2z = 15 \quad \text{...(1)} \\ 2x + y + z = 13 \quad \text{...(2)} \\ 3x + 2y + 2z = 24 \quad \text{...(3)} \end{cases}" />
            </div>

            {/* Interactive Controls to pick equations & multipliers */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <p className="text-sm font-bold text-navy-900">
                1. Pilih Pasangan Persamaan, Variabel Target & Penyetaraan Koefisien
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label className="block">
                  <span className="block font-semibold text-navy-900 mb-1">Persamaan Pertama</span>
                  <select
                    value={elimEqA}
                    onChange={(e) => setElimEqA(Number(e.target.value) as 0 | 1 | 2)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value={0}>(1) 3x - y + 2z = 15</option>
                    <option value={1}>(2) 2x + y + z = 13</option>
                    <option value={2}>(3) 3x + 2y + 2z = 24</option>
                  </select>
                </label>

                <label className="block">
                  <span className="block font-semibold text-navy-900 mb-1">Persamaan Kedua</span>
                  <select
                    value={elimEqB}
                    onChange={(e) => setElimEqB(Number(e.target.value) as 0 | 1 | 2)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value={0}>(1) 3x - y + 2z = 15</option>
                    <option value={1}>(2) 2x + y + z = 13</option>
                    <option value={2}>(3) 3x + 2y + 2z = 24</option>
                  </select>
                </label>

                <label className="block">
                  <span className="block font-semibold text-navy-900 mb-1">Variabel Dieliminasi</span>
                  <select
                    value={elimTargetVar}
                    onChange={(e) => setElimTargetVar(e.target.value as 'x' | 'y' | 'z')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  >
                    <option value="x">Variabel x</option>
                    <option value="y">Variabel y</option>
                    <option value="z">Variabel z</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label className="block">
                  <span className="block font-semibold text-navy-900 mb-1">
                    Pengali Pers. ({elimEqA + 1})
                  </span>
                  <input
                    type="number"
                    value={elimMultA}
                    onChange={(e) => setElimMultA(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </label>
                <label className="block">
                  <span className="block font-semibold text-navy-900 mb-1">Operasi Eliminasi</span>
                  <select
                    value={elimOp}
                    onChange={(e) => setElimOp(e.target.value as '+' | '-')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="-">Kurangkan (−)</option>
                    <option value="+">Jumlahkan (+)</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block font-semibold text-navy-900 mb-1">
                    Pengali Pers. ({elimEqB + 1})
                  </span>
                  <input
                    type="number"
                    value={elimMultB}
                    onChange={(e) => setElimMultB(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleExecuteElimination}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-teal-300" />
                <span>Jalankan Proses Eliminasi</span>
              </button>

              {elimAttemptMsg && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    elimAttemptMsg.ok
                      ? 'bg-teal-50 border-teal-300 text-teal-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <MathText text={elimAttemptMsg.msg} />
                </div>
              )}
            </div>

            {/* Persamaan Baru History */}
            {elimNewEqHistory.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-navy-900">
                  Persamaan Baru Hasil Eliminasimu:
                </p>
                {elimNewEqHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-mono text-slate-600">{item.label}</span>
                    <span className="font-bold text-navy-900">
                      <MathText text={`$${formatEqLatex(item.eq)}$`} />
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Penentuan Variabel & Pengecekan Hasil */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4">
              <p className="text-sm font-bold text-navy-900">
                2. Tentukan Nilai Variabel & Uji Pengecekan Hasil
              </p>
              <div className="grid grid-cols-3 gap-3">
                <label className="block text-xs">
                  <span className="font-semibold text-navy-900">Nilai x =</span>
                  <input
                    type="number"
                    value={elimAnsX}
                    onChange={(e) => setElimAnsX(e.target.value)}
                    placeholder="?"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-semibold text-navy-900">Nilai y =</span>
                  <input
                    type="number"
                    value={elimAnsY}
                    onChange={(e) => setElimAnsY(e.target.value)}
                    placeholder="?"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-semibold text-navy-900">Nilai z =</span>
                  <input
                    type="number"
                    value={elimAnsZ}
                    onChange={(e) => setElimAnsZ(e.target.value)}
                    placeholder="?"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={handleValidateElimSolution}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Cek Kebenaran Hasil
              </button>

              {elimFinalCheck && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    elimFinalCheck.ok
                      ? 'bg-teal-50 border-teal-300 text-teal-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <MathText text={elimFinalCheck.msg} />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <SmartTutorPanel scaffolding={getElimScaffolding()} />
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-navy-900">Catatan Verifikasi Matematis</p>
              <p>
                Sistem akan mengecek kebenaran $(x, y, z)$ secara langsung ke ketiga persamaan:
              </p>
              <p className="font-mono text-navy-900">
                3x - y + 2z = 15 · 2x + y + z = 13 · 3x + 2y + 2z = 24
              </p>
              <p>
                Cobalah mengeliminasi (1) dan (3) terlebih dahulu, lalu perhatikan bagaimana $y$ dapat
                langsung ditemukan!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: VISUALISASI 3D & SOLVER BEBAS (TAHAP 1 PRESERVED)  */}
      {/* ========================================================= */}
      {simMode === 'explorer-3d' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-bold text-navy-900">
                    Visualisasi Irisan Tiga Bidang (Ruang 3D)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Setiap persamaan linear tiga variabel membentuk satu bidang datar di ruang $(x, y, z)$.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setVisiblePlanes((prev) =>
                          prev.map((v, i) => (i === idx ? !v : v)) as [boolean, boolean, boolean]
                        )
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        visiblePlanes[idx]
                          ? 'bg-navy-900 text-white border-navy-900'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>B{idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-b from-slate-50 to-sky-50/70 border border-slate-200 p-2">
                <svg viewBox="0 0 440 330" className="w-full h-auto max-h-[340px]">
                  <g stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3">
                    <line x1={origin2D.cx} y1={origin2D.cy} x2={xEnd.cx} y2={xEnd.cy} />
                    <line x1={origin2D.cx} y1={origin2D.cy} x2={yEnd.cx} y2={yEnd.cy} />
                    <line x1={origin2D.cx} y1={origin2D.cy} x2={zEnd.cx} y2={zEnd.cy} />
                  </g>
                  <text x={xEnd.cx + 6} y={xEnd.cy + 4} fontSize="11" fontWeight="700" fill="#0b1f3f">
                    X
                  </text>
                  <text x={yEnd.cx + 6} y={yEnd.cy + 4} fontSize="11" fontWeight="700" fill="#0b1f3f">
                    Y
                  </text>
                  <text x={zEnd.cx - 4} y={zEnd.cy - 6} fontSize="11" fontWeight="700" fill="#0b1f3f">
                    Z
                  </text>

                  {planePolygons.map(
                    (poly, idx) =>
                      visiblePlanes[idx] && (
                        <polygon
                          key={idx}
                          points={poly.pointsAttr}
                          fill={poly.fill}
                          stroke={poly.stroke}
                          strokeWidth="1.5"
                        />
                      )
                  )}

                  {result.status === 'unique' && (
                    <g>
                      <circle cx={origin2D.cx} cy={origin2D.cy} r="6" fill="#0d9488" />
                      <circle
                        cx={origin2D.cx}
                        cy={origin2D.cy}
                        r="10"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="1.5"
                        opacity="0.45"
                      />
                    </g>
                  )}
                </svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <label className="block text-xs text-slate-600">
                  <span className="flex justify-between font-semibold text-navy-900 mb-1 tabular-nums">
                    <span>Sudut Putar Horizontal (Azimuth)</span>
                    <span>{azimuth}°</span>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={azimuth}
                    onChange={(e) => setAzimuth(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </label>
                <label className="block text-xs text-slate-600">
                  <span className="flex justify-between font-semibold text-navy-900 mb-1 tabular-nums">
                    <span>Sudut Kemiringan Vertikal (Elevasi)</span>
                    <span>{elevation}°</span>
                  </span>
                  <input
                    type="range"
                    min={5}
                    max={75}
                    value={elevation}
                    onChange={(e) => setElevation(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold text-navy-900">
                  Hasil & Langkah ({method === 'substitusi' ? 'Metode Substitusi' : 'Metode Eliminasi'})
                </h2>
                {result.status === 'unique' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Solusi Tunggal Ditemukan</span>
                  </span>
                )}
              </div>

              {result.status === 'unique' &&
              result.x !== null &&
              result.y !== null &&
              result.z !== null ? (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: currentPreset?.varNames[0] ?? 'Nilai x', val: result.x, sym: 'x' },
                    { label: currentPreset?.varNames[1] ?? 'Nilai y', val: result.y, sym: 'y' },
                    { label: currentPreset?.varNames[2] ?? 'Nilai z', val: result.z, sym: 'z' },
                  ].map((item) => (
                    <div
                      key={item.sym}
                      className="p-3.5 rounded-xl bg-navy-900 text-white text-center"
                    >
                      <p className="text-[11px] text-sky-300 truncate">{item.label}</p>
                      <p className="font-mono text-lg sm:text-xl font-bold mt-1 tabular-nums">
                        {item.sym} = {fmtNum(item.val)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
                  {result.status === 'infinite'
                    ? 'Sistem memiliki tak hingga banyaknya solusi.'
                    : 'Sistem tidak memiliki solusi tunggal.'}
                </div>
              )}

              <div className="space-y-3">
                {result.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                  >
                    <p className="text-sm font-bold text-navy-900">{st.title}</p>
                    <p className="text-xs sm:text-sm text-slate-600">{st.explanation}</p>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-sm overflow-x-auto">
                      <MathBlock math={st.math} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 sticky top-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-navy-900 font-display font-bold text-base">
                <Sliders className="w-4 h-4 text-teal-700" />
                <h2>Panel Kontrol Sistem</h2>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPreset(presetId)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-navy-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div>
              <label htmlFor="presetSelect" className="block text-xs font-semibold text-navy-900 mb-1.5">
                Pilih Studi Kasus Kontekstual SMK
              </label>
              <select
                id="presetSelect"
                value={presetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-navy-900"
              >
                {SIMULATION_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              {currentPreset && (
                <p className="mt-1.5 text-xs text-slate-500">{currentPreset.context}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMethod('substitusi')}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  method === 'substitusi' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Metode Substitusi
              </button>
              <button
                type="button"
                onClick={() => setMethod('eliminasi')}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  method === 'eliminasi' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Metode Eliminasi
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 overflow-x-auto text-sm">
              <MathBlock
                math={`\\begin{cases} ${formatEqLatex(equations[0])} \\\\ ${formatEqLatex(
                  equations[1]
                )} \\\\ ${formatEqLatex(equations[2])} \\end{cases}`}
              />
            </div>

            <div className="space-y-3">
              {equations.map((eq, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs font-semibold text-slate-600">Persamaan ({idx + 1})</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(['a', 'b', 'c', 'd'] as const).map((field) => (
                      <label key={field} className="block">
                        <span className="block text-[11px] font-mono text-slate-500 mb-0.5">
                          {field === 'a'
                            ? 'a (x)'
                            : field === 'b'
                            ? 'b (y)'
                            : field === 'c'
                            ? 'c (z)'
                            : 'd'}
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={eq[field]}
                          onChange={(e) =>
                            handleCoeffChange(idx as 0 | 1 | 2, field, e.target.value)
                          }
                          className="w-full px-2 py-1.5 text-xs font-mono tabular-nums rounded-md border border-slate-300 bg-white"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
