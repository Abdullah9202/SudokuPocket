/*
 * Sudoku engine: generation with a guaranteed unique solution, solving and helpers.
 * Grids are flat arrays of 81 numbers (0 = empty), index = row * 9 + col.
 */

export const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', clues: 40 },
  { id: 'medium', label: 'Medium', clues: 33 },
  { id: 'hard', label: 'Hard', clues: 28 },
  { id: 'expert', label: 'Expert', clues: 24 },
];
export const getDifficulty = (id) => DIFFICULTIES.find((d) => d.id === id) || DIFFICULTIES[0];

/** Small, fast seeded PRNG (mulberry32). */
export function makeRng(seed = Date.now()) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const rowOf = (i) => Math.floor(i / 9);
export const colOf = (i) => i % 9;
export const boxOf = (i) => Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3);

// Precomputed peers (cells sharing a row, column or box).
export const PEERS = Array.from({ length: 81 }, (_, i) => {
  const out = [];
  for (let j = 0; j < 81; j++) {
    if (j !== i && (rowOf(j) === rowOf(i) || colOf(j) === colOf(i) || boxOf(j) === boxOf(i))) out.push(j);
  }
  return out;
});

const ALL = 0b1111111110; // bits 1..9

/** Bitmask of digits that can legally go in cell i. */
function candidates(grid, i) {
  let used = 0;
  const p = PEERS[i];
  for (let k = 0; k < p.length; k++) used |= 1 << grid[p[k]];
  return ALL & ~used;
}

function bitsToDigits(mask) {
  const out = [];
  for (let d = 1; d <= 9; d++) if (mask & (1 << d)) out.push(d);
  return out;
}

const popcount = (m) => {
  let c = 0;
  while (m) {
    m &= m - 1;
    c++;
  }
  return c;
};

/** Count solutions up to `limit` (stops early). Does not modify the input. */
export function countSolutions(input, limit = 2) {
  const grid = input.slice();
  let count = 0;

  function search() {
    let best = -1;
    let bestMask = 0;
    let bestCount = 10;
    for (let i = 0; i < 81; i++) {
      if (grid[i] !== 0) continue;
      const m = candidates(grid, i);
      const c = popcount(m);
      if (c === 0) return;
      if (c < bestCount) {
        best = i;
        bestMask = m;
        bestCount = c;
        if (c === 1) break;
      }
    }
    if (best === -1) {
      count++;
      return;
    }
    for (let d = 1; d <= 9 && count < limit; d++) {
      if (bestMask & (1 << d)) {
        grid[best] = d;
        search();
        grid[best] = 0;
      }
    }
  }
  search();
  return count;
}

/** Solve a puzzle; returns the solved grid or null. */
export function solve(input) {
  const grid = input.slice();
  function search() {
    let best = -1;
    let bestMask = 0;
    let bestCount = 10;
    for (let i = 0; i < 81; i++) {
      if (grid[i] !== 0) continue;
      const m = candidates(grid, i);
      const c = popcount(m);
      if (c === 0) return false;
      if (c < bestCount) {
        best = i;
        bestMask = m;
        bestCount = c;
      }
    }
    if (best === -1) return true;
    for (const d of bitsToDigits(bestMask)) {
      grid[best] = d;
      if (search()) return true;
    }
    grid[best] = 0;
    return false;
  }
  return search() ? grid : null;
}

/** A random, fully solved valid grid. */
export function generateSolved(rng) {
  const grid = new Array(81).fill(0);
  function fill(i) {
    if (i === 81) return true;
    const digits = shuffle(bitsToDigits(candidates(grid, i)), rng);
    for (const d of digits) {
      grid[i] = d;
      if (fill(i + 1)) return true;
    }
    grid[i] = 0;
    return false;
  }
  fill(0);
  return grid;
}

/**
 * Create a puzzle with exactly one solution.
 * Removes cells in random order while the solution stays unique, stopping at the
 * difficulty's clue target (or when no further cell can be removed).
 */
export function makePuzzle(difficultyId, seed = Date.now()) {
  const rng = makeRng(seed);
  const target = getDifficulty(difficultyId).clues;
  const solution = generateSolved(rng);
  const puzzle = solution.slice();
  let clues = 81;
  for (const i of shuffle([...Array(81).keys()], rng)) {
    if (clues <= target) break;
    const keep = puzzle[i];
    puzzle[i] = 0;
    if (countSolutions(puzzle, 2) !== 1) puzzle[i] = keep;
    else clues--;
  }
  return { puzzle, solution, clues };
}

/** True if grid is a complete, valid sudoku. */
export function isValidSolution(grid) {
  if (!Array.isArray(grid) || grid.length !== 81) return false;
  for (let i = 0; i < 81; i++) {
    const v = grid[i];
    if (!(v >= 1 && v <= 9)) return false;
    for (const p of PEERS[i]) if (grid[p] === v) return false;
  }
  return true;
}

/** Indices of filled cells that clash with a peer holding the same digit. */
export function conflicts(board) {
  const out = new Set();
  for (let i = 0; i < 81; i++) {
    const v = board[i];
    if (!v) continue;
    for (const p of PEERS[i]) if (board[p] === v) out.add(i);
  }
  return out;
}

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0');
  const ss = String(sec).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
