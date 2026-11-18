export interface LinearEquation3 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface SolutionStep {
  title: string;
  explanation: string;
  math: string;
}

export interface SpltvSolveResult {
  status: 'unique' | 'infinite' | 'none';
  x: number | null;
  y: number | null;
  z: number | null;
  steps: SolutionStep[];
  verification: {
    eqIndex: number;
    lhsValue: number;
    rhsValue: number;
    valid: boolean;
    math: string;
  }[];
}

export function fmtNum(n: number): string {
  if (Math.abs(n) < 1e-9) return '0';
  const rounded = Math.round(n * 1000) / 1000;
  if (Number.isInteger(rounded)) {
    return rounded.toLocaleString('id-ID');
  }
  return rounded.toFixed(2).replace(/\.?0+$/, '');
}

export function fmtCoeff(val: number, variable: string, isFirst = false): string {
  if (Math.abs(val) < 1e-9) return '';
  const abs = Math.abs(val);
  const absStr = Math.abs(abs - 1) < 1e-9 ? '' : fmtNum(abs);
  if (isFirst) {
    return `${val < 0 ? '-' : ''}${absStr}${variable}`;
  }
  return `${val < 0 ? ' - ' : ' + '}${absStr}${variable}`;
}

export function formatEqLatex(eq: LinearEquation3): string {
  const parts: string[] = [];
  if (Math.abs(eq.a) > 1e-9) parts.push(fmtCoeff(eq.a, 'x', parts.length === 0));
  if (Math.abs(eq.b) > 1e-9) parts.push(fmtCoeff(eq.b, 'y', parts.length === 0));
  if (Math.abs(eq.c) > 1e-9) parts.push(fmtCoeff(eq.c, 'z', parts.length === 0));
  const lhs = parts.length > 0 ? parts.join('') : '0';
  return `${lhs} = ${fmtNum(eq.d)}`;
}

function det3(m: number[][]): number {
  const [r0, r1, r2] = m;
  return (
    r0[0] * (r1[1] * r2[2] - r1[2] * r2[1]) -
    r0[1] * (r1[0] * r2[2] - r1[2] * r2[0]) +
    r0[2] * (r1[0] * r2[1] - r1[1] * r2[0])
  );
}

export function solveSpltv(
  eqs: [LinearEquation3, LinearEquation3, LinearEquation3],
  method: 'substitusi' | 'eliminasi'
): SpltvSolveResult {
  const [e1, e2, e3] = eqs;

  const D = det3([
    [e1.a, e1.b, e1.c],
    [e2.a, e2.b, e2.c],
    [e3.a, e3.b, e3.c],
  ]);

  const Dx = det3([
    [e1.d, e1.b, e1.c],
    [e2.d, e2.b, e2.c],
    [e3.d, e3.b, e3.c],
  ]);

  const Dy = det3([
    [e1.a, e1.d, e1.c],
    [e2.a, e2.d, e2.c],
    [e3.a, e3.d, e3.c],
  ]);

  const Dz = det3([
    [e1.a, e1.b, e1.d],
    [e2.a, e2.b, e2.d],
    [e3.a, e3.b, e3.d],
  ]);

  if (Math.abs(D) < 1e-9) {
    const allZero = Math.abs(Dx) < 1e-9 && Math.abs(Dy) < 1e-9 && Math.abs(Dz) < 1e-9;
    return {
      status: allZero ? 'infinite' : 'none',
      x: null,
      y: null,
      z: null,
      steps: [
        {
          title: 'Analisis Determinan Sistem',
          explanation: allZero
            ? 'Ketiga bidang berimpit atau berpotongan pada satu garis yang sama sehingga sistem memiliki tak hingga banyaknya solusi.'
            : 'Bidang-bidang persamaan sejajar atau tidak berpotongan pada satu titik tunggal, sehingga sistem tidak memiliki penyelesaian (inkonsisten).',
          math: `\\begin{cases} ${formatEqLatex(e1)} \\\\ ${formatEqLatex(e2)} \\\\ ${formatEqLatex(e3)} \\end{cases}`,
        },
      ],
      verification: [],
    };
  }

  const x = Dx / D;
  const y = Dy / D;
  const z = Dz / D;

  const steps: SolutionStep[] = [];

  if (method === 'substitusi') {
    // Pick an equation with non-zero 'a' (prefer e1, else swap mentally)
    const pivot = Math.abs(e1.a) > 1e-9 ? e1 : Math.abs(e2.a) > 1e-9 ? e2 : e3;
    const otherA = pivot === e1 ? e2 : e1;
    const otherB = pivot === e3 ? e2 : e3;
    const pivotLabel = pivot === e1 ? '(1)' : pivot === e2 ? '(2)' : '(3)';
    const otherALabel = otherA === e1 ? '(1)' : otherA === e2 ? '(2)' : '(3)';
    const otherBLabel = otherB === e1 ? '(1)' : otherB === e2 ? '(2)' : '(3)';

    const bOverA = -pivot.b / pivot.a;
    const cOverA = -pivot.c / pivot.a;
    const dOverA = pivot.d / pivot.a;

    const exprX = `${fmtNum(dOverA)}${bOverA >= 0 ? ' + ' : ' - '}${fmtNum(Math.abs(bOverA))}y${cOverA >= 0 ? ' + ' : ' - '}${fmtNum(Math.abs(cOverA))}z`;

    steps.push({
      title: `Langkah 1: Ubah Persamaan ${pivotLabel} menjadi x = ...`,
      explanation: `Nyatakan variabel x dalam variabel y dan z dari persamaan ${pivotLabel}.`,
      math: `x = ${exprX} \\quad \\text{... (Persamaan 4)}`,
    });

    // Substitute into otherA & otherB -> reduce to SPLDV in y, z
    const a2y = otherA.a * bOverA + otherA.b;
    const a2z = otherA.a * cOverA + otherA.c;
    const a2d = otherA.d - otherA.a * dOverA;

    const b2y = otherB.a * bOverA + otherB.b;
    const b2z = otherB.a * cOverA + otherB.c;
    const b2d = otherB.d - otherB.a * dOverA;

    steps.push({
      title: `Langkah 2: Substitusi ke Persamaan ${otherALabel} dan ${otherBLabel}`,
      explanation: `Gantikan x pada dua persamaan lainnya sehingga terbentuk SPLDV dengan variabel y dan z.`,
      math: `\\begin{cases} ${fmtNum(a2y)}y ${a2z >= 0 ? '+' : '-'} ${fmtNum(Math.abs(a2z))}z = ${fmtNum(a2d)} \\\\ ${fmtNum(b2y)}y ${b2z >= 0 ? '+' : '-'} ${fmtNum(Math.abs(b2z))}z = ${fmtNum(b2d)} \\end{cases}`,
    });

    steps.push({
      title: 'Langkah 3: Selesaikan SPLDV untuk memperoleh y dan z',
      explanation: 'Dari SPLDV dua variabel di atas, substitusikan kembali nilai y untuk memperoleh nilai z.',
      math: `y = ${fmtNum(y)}, \\qquad z = ${fmtNum(z)}`,
    });

    steps.push({
      title: 'Langkah 4: Substitusi Balik ke Persamaan (4)',
      explanation: 'Masukkan nilai y dan z yang telah ditemukan untuk memperoleh nilai x.',
      math: `x = ${fmtNum(dOverA)} + (${fmtNum(bOverA)})(${fmtNum(y)}) + (${fmtNum(cOverA)})(${fmtNum(z)}) = ${fmtNum(x)}`,
    });
  } else {
    // Eliminasi: eliminate x from (1,2) and (1,3) or z
    const k1a = e2.a;
    const k2a = e1.a;
    const red1y = e1.b * k1a - e2.b * k2a;
    const red1z = e1.c * k1a - e2.c * k2a;
    const red1d = e1.d * k1a - e2.d * k2a;

    const k1b = e3.a;
    const k3b = e1.a;
    const red2y = e1.b * k1b - e3.b * k3b;
    const red2z = e1.c * k1b - e3.c * k3b;
    const red2d = e1.d * k1b - e3.d * k3b;

    steps.push({
      title: 'Langkah 1: Eliminasi Variabel x dari Persamaan (1) & (2)',
      explanation: `Samakan koefisien x dengan mengalikan Persamaan (1) dengan ${fmtNum(k1a)} dan Persamaan (2) dengan ${fmtNum(k2a)}, lalu kurangkan.`,
      math: `${fmtNum(red1y)}y ${red1z >= 0 ? '+' : '-'} ${fmtNum(Math.abs(red1z))}z = ${fmtNum(red1d)} \\quad \\text{... (Persamaan 4)}`,
    });

    steps.push({
      title: 'Langkah 2: Eliminasi Variabel x dari Persamaan (1) & (3)',
      explanation: `Samakan koefisien x dengan mengalikan Persamaan (1) dengan ${fmtNum(k1b)} dan Persamaan (3) dengan ${fmtNum(k3b)}, lalu kurangkan.`,
      math: `${fmtNum(red2y)}y ${red2z >= 0 ? '+' : '-'} ${fmtNum(Math.abs(red2z))}z = ${fmtNum(red2d)} \\quad \\text{... (Persamaan 5)}`,
    });

    steps.push({
      title: 'Langkah 3: Eliminasi Persamaan (4) & (5) untuk Nilai y dan z',
      explanation: 'Eliminasi variabel y untuk mendapatkan nilai z, kemudian eliminasi variabel z untuk mendapatkan nilai y.',
      math: `y = ${fmtNum(y)}, \\qquad z = ${fmtNum(z)}`,
    });

    steps.push({
      title: 'Langkah 4: Tentukan Nilai x dengan Eliminasi / Substitusi Akhir',
      explanation: 'Gunakan nilai y dan z pada persamaan awal untuk menentukan nilai x.',
      math: `x = ${fmtNum(x)}, \\quad y = ${fmtNum(y)}, \\quad z = ${fmtNum(z)}`,
    });
  }

  const verification = eqs.map((eq, idx) => {
    const lhs = eq.a * x + eq.b * y + eq.c * z;
    return {
      eqIndex: idx + 1,
      lhsValue: lhs,
      rhsValue: eq.d,
      valid: Math.abs(lhs - eq.d) < 1e-4,
      math: `${fmtNum(eq.a)}(${fmtNum(x)}) + ${fmtNum(eq.b)}(${fmtNum(y)}) + ${fmtNum(eq.c)}(${fmtNum(z)}) = ${fmtNum(lhs)} = ${fmtNum(eq.d)}`,
    };
  });

  return {
    status: 'unique',
    x,
    y,
    z,
    steps,
    verification,
  };
}
