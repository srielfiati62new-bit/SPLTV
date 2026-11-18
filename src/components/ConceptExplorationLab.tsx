import React, { useState } from 'react';
import { CheckCircle2, GripVertical, Layers, RotateCcw, XCircle } from 'lucide-react';
import { ConceptExplorationRecord } from '../types/module';
import { MathBlock, MathText } from './MathText';

interface ConceptExplorationLabProps {
  record: ConceptExplorationRecord;
  onUpdateRecord: (rec: ConceptExplorationRecord) => void;
}

interface TokenItem {
  id: string;
  label: string;
  correctBucket: 'variabel' | 'koefisien' | 'konstanta';
}

const ANATOMY_TOKENS: TokenItem[] = [
  { id: 't-x', label: 'x', correctBucket: 'variabel' },
  { id: 't-y', label: 'y', correctBucket: 'variabel' },
  { id: 't-z', label: 'z', correctBucket: 'variabel' },
  { id: 't-4', label: '4', correctBucket: 'koefisien' },
  { id: 't-n7', label: '-7', correctBucket: 'koefisien' },
  { id: 't-2', label: '2', correctBucket: 'koefisien' },
  { id: 't-18500', label: '18.500', correctBucket: 'konstanta' },
];

interface LinearCheckItem {
  id: string;
  latex: string;
  isLinear: boolean;
  reason: string;
}

const LINEAR_CHECK_ITEMS: LinearCheckItem[] = [
  {
    id: 'lin-1',
    latex: '3x + 2y - z = 14',
    isLinear: true,
    reason: 'Semua variabel ($x, y, z$) berpangkat $1$ dan tidak ada perkalian antarvariabel.',
  },
  {
    id: 'lin-2',
    latex: 'x^2 + 3y - 2z = 10',
    isLinear: false,
    reason: 'Bukan persamaan linear karena terdapat suku berpangkat dua ($x^2$).',
  },
  {
    id: 'lin-3',
    latex: '\\frac{2}{x} + y + z = 7',
    isLinear: false,
    reason: 'Bukan linear karena variabel $x$ berada di penyebut ($2x^{-1}$, pangkat $-1$).',
  },
  {
    id: 'lin-4',
    latex: '5a - 4b + c = 0',
    isLinear: true,
    reason: 'Persamaan linear tiga variabel karena $a, b, c$ berpangkat $1$ dengan konstanta $0$.',
  },
  {
    id: 'lin-5',
    latex: 'xy + 2z = 12',
    isLinear: false,
    reason: 'Bukan linear karena terdapat hasil kali antarvariabel ($xy$).',
  },
];

export const ConceptExplorationLab: React.FC<ConceptExplorationLabProps> = ({
  record,
  onUpdateRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'drag-unsur' | 'linear-check' | 'sistem-isian'>(
    'drag-unsur'
  );

  // Task 1: Drag & Drop / Click assign for 4x - 7y + 2z = 18.500
  const [assignments, setAssignments] = useState<
    Record<string, 'variabel' | 'koefisien' | 'konstanta' | null>
  >({});
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [task1Checked, setTask1Checked] = useState(false);

  // Task 2: Linear vs Non-Linear Drag & Drop / Click
  const [linearBuckets, setLinearBuckets] = useState<Record<string, 'linear' | 'bukan' | null>>({});
  const [selectedLinId, setSelectedLinId] = useState<string | null>(null);
  const [task2Checked, setTask2Checked] = useState(false);

  // Task 3: Fill-in + Choice SPLTV verification
  const [sysVarCount, setSysVarCount] = useState('');
  const [sysMaxPower, setSysMaxPower] = useState('');
  const [sysChoice, setSysChoice] = useState<'spltv' | 'bukan' | null>(null);
  const [task3Checked, setTask3Checked] = useState(false);

  const syncCompletion = (taskId: string, taskScore: number) => {
    const completed = record.completedTasks.includes(taskId)
      ? record.completedTasks
      : [...record.completedTasks, taskId];
    const newScore = Math.max(record.score, Math.round((completed.length / 3) * 100));
    onUpdateRecord({
      completedTasks: completed,
      score: Math.max(newScore, taskScore),
    });
  };

  // Drag handlers Task 1
  const assignToken = (tokenId: string, bucket: 'variabel' | 'koefisien' | 'konstanta') => {
    setAssignments((prev) => ({ ...prev, [tokenId]: bucket }));
    setSelectedTokenId(null);
    setTask1Checked(false);
  };

  const checkTask1 = () => {
    setTask1Checked(true);
    const correctCount = ANATOMY_TOKENS.filter(
      (t) => assignments[t.id] === t.correctBucket
    ).length;
    const pct = Math.round((correctCount / ANATOMY_TOKENS.length) * 100);
    if (correctCount === ANATOMY_TOKENS.length) {
      syncCompletion('task-unsur', pct);
    }
  };

  // Drag handlers Task 2
  const assignLinear = (itemId: string, bucket: 'linear' | 'bukan') => {
    setLinearBuckets((prev) => ({ ...prev, [itemId]: bucket }));
    setSelectedLinId(null);
    setTask2Checked(false);
  };

  const checkTask2 = () => {
    setTask2Checked(true);
    const correctCount = LINEAR_CHECK_ITEMS.filter((item) => {
      const assigned = linearBuckets[item.id];
      return (item.isLinear && assigned === 'linear') || (!item.isLinear && assigned === 'bukan');
    }).length;
    const pct = Math.round((correctCount / LINEAR_CHECK_ITEMS.length) * 100);
    if (correctCount === LINEAR_CHECK_ITEMS.length) {
      syncCompletion('task-linear', pct);
    }
  };

  // Task 3 check
  const checkTask3 = () => {
    setTask3Checked(true);
    const okVar = sysVarCount.trim() === '3';
    const okPow = sysMaxPower.trim() === '1';
    const okChoice = sysChoice === 'spltv';
    if (okVar && okPow && okChoice) {
      syncCompletion('task-sistem', 100);
    }
  };

  const task1CorrectCount = ANATOMY_TOKENS.filter(
    (t) => assignments[t.id] === t.correctBucket
  ).length;
  const task2CorrectCount = LINEAR_CHECK_ITEMS.filter(
    (i) => (i.isLinear && linearBuckets[i.id] === 'linear') || (!i.isLinear && linearBuckets[i.id] === 'bukan')
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
            <Layers className="w-4 h-4" />
            <span>Lab Eksplorasi Konsep SPLTV · +150 XP</span>
          </div>
          <h3 className="font-display text-lg font-bold text-navy-900 mt-0.5">
            Aktivitas Interaktif: Unsur, Linearitas, dan Syarat SPLTV
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold text-navy-900 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg tabular-nums">
          Selesai: {record.completedTasks.length} / 3 Aktivitas
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
        {[
          { id: 'drag-unsur' as const, label: '1. Drag & Drop Unsur Persamaan' },
          { id: 'linear-check' as const, label: '2. Klasifikasi Linear vs Bukan Linear' },
          { id: 'sistem-isian' as const, label: '3. Isian & Analisis Sistem SPLTV' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[180px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-navy-900 shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DRAG & DROP UNSUR PERSAMAAN */}
      {activeTab === 'drag-unsur' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
            <p className="text-xs font-semibold text-navy-900 mb-1">
              Seret (drag) atau klik komponen dari persamaan di bawah ke kotak kategori yang tepat:
            </p>
            <div className="text-center">
              <MathBlock math="4x - 7y + 2z = 18.500" />
            </div>
          </div>

          {/* Draggable / Selectable Pool */}
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            {ANATOMY_TOKENS.filter((t) => !assignments[t.id]).map((tok) => (
              <button
                key={tok.id}
                type="button"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', tok.id)}
                onClick={() => setSelectedTokenId(selectedTokenId === tok.id ? null : tok.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-mono font-bold cursor-grab active:cursor-grabbing transition-colors ${
                  selectedTokenId === tok.id
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-navy-900 border-slate-300 hover:border-sky-400'
                }`}
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                <span>{tok.label}</span>
              </button>
            ))}
            {ANATOMY_TOKENS.every((t) => Boolean(assignments[t.id])) && (
              <span className="text-xs text-slate-500">
                Semua komponen sudah ditempatkan. Klik &ldquo;Periksa Jawaban&rdquo;.
              </span>
            )}
          </div>

          {/* 3 Drop Zones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(
              [
                { key: 'variabel', title: 'Variabel (Peubah)', hint: 'Huruf pengganti nilai' },
                { key: 'koefisien', title: 'Koefisien', hint: 'Pengali di depan variabel' },
                { key: 'konstanta', title: 'Konstanta', hint: 'Bilangan tetap tanpa variabel' },
              ] as const
            ).map((bucket) => {
              const itemsInBucket = ANATOMY_TOKENS.filter((t) => assignments[t.id] === bucket.key);
              return (
                <div
                  key={bucket.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const tid = e.dataTransfer.getData('text/plain');
                    if (tid) assignToken(tid, bucket.key);
                  }}
                  onClick={() => {
                    if (selectedTokenId) assignToken(selectedTokenId, bucket.key);
                  }}
                  className={`min-h-[120px] p-4 rounded-xl border-2 border-dashed transition-colors ${
                    selectedTokenId
                      ? 'border-teal-400 bg-teal-50/40 cursor-pointer'
                      : 'border-slate-300 bg-slate-50/60'
                  }`}
                >
                  <p className="text-xs font-bold text-navy-900">{bucket.title}</p>
                  <p className="text-[11px] text-slate-500 mb-2">{bucket.hint}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {itemsInBucket.map((tok) => {
                      const isOk = task1Checked && tok.correctBucket === bucket.key;
                      const isBad = task1Checked && tok.correctBucket !== bucket.key;
                      return (
                        <button
                          key={tok.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAssignments((prev) => ({ ...prev, [tok.id]: null }));
                            setTask1Checked(false);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                            isOk
                              ? 'bg-teal-600 text-white border-teal-600'
                              : isBad
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-navy-900 border-slate-300 hover:bg-slate-100'
                          }`}
                          title="Klik untuk mengembalikan"
                        >
                          {tok.label} ×
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={checkTask1}
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Periksa Jawaban
              </button>
              <button
                type="button"
                onClick={() => {
                  setAssignments({});
                  setTask1Checked(false);
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {task1Checked && (
              <p
                className={`text-xs font-semibold ${
                  task1CorrectCount === ANATOMY_TOKENS.length ? 'text-teal-700' : 'text-amber-800'
                }`}
              >
                {task1CorrectCount === ANATOMY_TOKENS.length
                  ? 'Benar semua! Variabel: x, y, z; Koefisien: 4, -7, 2 (tanda negatif ikut koefisien); Konstanta: 18.500.'
                  : `${task1CorrectCount} dari ${ANATOMY_TOKENS.length} tepat. Ingat: tanda negatif pada -7y merupakan bagian dari koefisien (-7).`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: KLASIFIKASI PERSAMAAN LINEAR VS BUKAN LINEAR */}
      {activeTab === 'linear-check' && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600">
            Seret atau klik persamaan berikut ke kelompok <strong>Persamaan Linear</strong> atau{' '}
            <strong>Bukan Persamaan Linear</strong>:
          </p>

          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            {LINEAR_CHECK_ITEMS.filter((i) => !linearBuckets[i.id]).map((item) => (
              <button
                key={item.id}
                type="button"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
                onClick={() => setSelectedLinId(selectedLinId === item.id ? null : item.id)}
                className={`px-3 py-2 rounded-lg border text-xs sm:text-sm cursor-grab transition-colors ${
                  selectedLinId === item.id
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-navy-900 border-slate-300 hover:border-sky-400'
                }`}
              >
                <MathText text={`$${item.latex}$`} />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(
              [
                { key: 'linear', title: 'Persamaan Linear', desc: 'Semua variabel berpangkat tepat 1' },
                {
                  key: 'bukan',
                  title: 'Bukan Persamaan Linear',
                  desc: 'Mengandung kuadrat, pecahan variabel, atau perkalian antarvariabel',
                },
              ] as const
            ).map((zone) => {
              const items = LINEAR_CHECK_ITEMS.filter((i) => linearBuckets[i.id] === zone.key);
              return (
                <div
                  key={zone.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const lid = e.dataTransfer.getData('text/plain');
                    if (lid) assignLinear(lid, zone.key);
                  }}
                  onClick={() => {
                    if (selectedLinId) assignLinear(selectedLinId, zone.key);
                  }}
                  className={`min-h-[140px] p-4 rounded-xl border-2 border-dashed space-y-2 ${
                    selectedLinId
                      ? 'border-teal-400 bg-teal-50/40 cursor-pointer'
                      : 'border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-navy-900">{zone.title}</p>
                    <p className="text-[11px] text-slate-500">{zone.desc}</p>
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const ok =
                        task2Checked &&
                        ((item.isLinear && zone.key === 'linear') ||
                          (!item.isLinear && zone.key === 'bukan'));
                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                            !task2Checked
                              ? 'bg-white border-slate-300'
                              : ok
                              ? 'bg-teal-50 border-teal-400 text-teal-950'
                              : 'bg-rose-50 border-rose-400 text-rose-950'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <MathText text={`$${item.latex}$`} />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLinearBuckets((prev) => ({ ...prev, [item.id]: null }));
                                setTask2Checked(false);
                              }}
                              className="text-[11px] font-semibold text-slate-500 hover:text-navy-900"
                            >
                              Keluarkan
                            </button>
                          </div>
                          {task2Checked && (
                            <p className="text-[11px] leading-snug">
                              <MathText text={item.reason} />
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={checkTask2}
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Periksa Klasifikasi
            </button>
            {task2Checked && (
              <span className="text-xs font-semibold text-navy-900">
                Skor Klasifikasi: {task2CorrectCount} / {LINEAR_CHECK_ITEMS.length} tepat.
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ISIAN & ANALISIS SISTEM SPLTV */}
      {activeTab === 'sistem-isian' && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600">
            Amati sistem persamaan berikut, lalu isi analisis matematisnya:
          </p>
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
            <MathBlock math="\begin{cases} 2p + q - r = 9 \\ p + 3r = 11 \\ 4q - 2r = 8 \end{cases}" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <label className="block">
              <span className="block text-xs font-semibold text-navy-900 mb-1">
                1. Berapa jumlah variabel berbeda pada sistem tersebut?
              </span>
              <input
                type="number"
                value={sysVarCount}
                onChange={(e) => {
                  setSysVarCount(e.target.value);
                  setTask3Checked(false);
                }}
                placeholder="Isi angka..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-navy-900 mb-1">
                2. Berapa pangkat tertinggi variabel pada sistem tersebut?
              </span>
              <input
                type="number"
                value={sysMaxPower}
                onChange={(e) => {
                  setSysMaxPower(e.target.value);
                  setTask3Checked(false);
                }}
                placeholder="Isi angka..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm"
              />
            </label>
          </div>

          <div>
            <p className="text-xs font-semibold text-navy-900 mb-2">
              3. Kesimpulan: Apakah sistem di atas termasuk SPLTV?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSysChoice('spltv');
                  setTask3Checked(false);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
                  sysChoice === 'spltv'
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-sky-50'
                }`}
              >
                Ya, Termasuk SPLTV
              </button>
              <button
                type="button"
                onClick={() => {
                  setSysChoice('bukan');
                  setTask3Checked(false);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
                  sysChoice === 'bukan'
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-sky-50'
                }`}
              >
                Bukan SPLTV
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={checkTask3}
            className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Validasi Analisis
          </button>

          {task3Checked && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                sysVarCount.trim() === '3' && sysMaxPower.trim() === '1' && sysChoice === 'spltv'
                  ? 'bg-teal-50 border-teal-200 text-teal-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              {sysVarCount.trim() === '3' && sysMaxPower.trim() === '1' && sysChoice === 'spltv' ? (
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              )}
              <div>
                <MathText text="Terdapat **3 variabel** ($p, q, r$) dengan **pangkat tertinggi 1**. Meskipun persamaan kedua tidak memuat $q$ (koefisien $q = 0$) dan persamaan ketiga tidak memuat $p$ (koefisien $p = 0$), ketiganya membentuk satu kesatuan sistem sehingga **termasuk SPLTV**." />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
