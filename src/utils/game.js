/*
 * Pure game-state reducer for SudokuPocket.
 * Game: { difficulty, puzzle, solution, board, notes, mistakes, hintsLeft, elapsed, completed, history, startedAt }
 * notes[i] is a bitmask of pencil marks (bit d = digit d).
 */
import { makePuzzle, getDifficulty, PEERS } from './sudoku';

export const HINTS_PER_GAME = 3;
const HISTORY_LIMIT = 200;

export function newGame(difficulty, seed = Date.now()) {
  // Try a few seeds and keep the puzzle closest to the difficulty's clue target.
  let best = makePuzzle(difficulty, seed);
  const target = getDifficulty(difficulty).clues;
  for (let k = 1; k < 6 && best.clues > target; k++) {
    const p = makePuzzle(difficulty, seed + k * 7919);
    if (p.clues < best.clues) best = p;
  }
  const { puzzle, solution } = best;
  return {
    difficulty,
    puzzle,
    solution,
    board: puzzle.slice(),
    notes: new Array(81).fill(0),
    mistakes: 0,
    hintsLeft: HINTS_PER_GAME,
    elapsed: 0,
    completed: false,
    history: [],
    startedAt: Date.now(),
  };
}

/** Validate a game loaded from storage; return null if unusable. */
export function sanitizeGame(g) {
  const ok =
    g &&
    ['puzzle', 'solution', 'board', 'notes'].every((k) => Array.isArray(g[k]) && g[k].length === 81) &&
    typeof g.difficulty === 'string';
  if (!ok) return null;
  return {
    ...g,
    mistakes: Number(g.mistakes) || 0,
    hintsLeft: Number.isFinite(g.hintsLeft) ? g.hintsLeft : HINTS_PER_GAME,
    elapsed: Number(g.elapsed) || 0,
    completed: !!g.completed,
    history: Array.isArray(g.history) ? g.history.slice(-HISTORY_LIMIT) : [],
  };
}

const isGiven = (g, i) => g.puzzle[i] !== 0;
const isSolved = (board, solution) => board.every((v, i) => v === solution[i]);

function pushHistory(g, i) {
  const h = g.history.concat({ i, v: g.board[i], n: g.notes[i] });
  return h.length > HISTORY_LIMIT ? h.slice(-HISTORY_LIMIT) : h;
}

/** Remove digit d from the pencil marks of all peers of cell i. */
function clearPeerNotes(notes, i, d) {
  const out = notes.slice();
  for (const p of PEERS[i]) out[p] &= ~(1 << d);
  return out;
}

export function enterDigit(g, i, d, notesMode) {
  if (g.completed || i == null || isGiven(g, i)) return g;

  if (notesMode) {
    if (g.board[i] !== 0) return g;
    const notes = g.notes.slice();
    notes[i] ^= 1 << d;
    return { ...g, notes, history: pushHistory(g, i) };
  }

  if (g.board[i] === d) return g;
  const history = pushHistory(g, i);
  const board = g.board.slice();
  board[i] = d;
  let notes = g.notes.slice();
  notes[i] = 0;
  const correct = g.solution[i] === d;
  if (correct) notes = clearPeerNotes(notes, i, d);
  const completed = isSolved(board, g.solution);
  return { ...g, board, notes, history, mistakes: g.mistakes + (correct ? 0 : 1), completed };
}

export function erase(g, i) {
  if (g.completed || i == null || isGiven(g, i)) return g;
  if (g.board[i] === 0 && g.notes[i] === 0) return g;
  const history = pushHistory(g, i);
  const board = g.board.slice();
  const notes = g.notes.slice();
  board[i] = 0;
  notes[i] = 0;
  return { ...g, board, notes, history };
}

export function undo(g) {
  if (g.completed || g.history.length === 0) return g;
  const last = g.history[g.history.length - 1];
  const board = g.board.slice();
  const notes = g.notes.slice();
  board[last.i] = last.v;
  notes[last.i] = last.n;
  return { ...g, board, notes, history: g.history.slice(0, -1) };
}

/** Reveal the selected cell (or the first wrong/empty cell if none selected). */
export function hint(g, selected) {
  if (g.completed || g.hintsLeft <= 0) return { game: g, cell: null };
  let i = selected;
  if (i == null || isGiven(g, i) || g.board[i] === g.solution[i]) {
    i = g.board.findIndex((v, k) => v !== g.solution[k]);
  }
  if (i < 0) return { game: g, cell: null };
  const history = pushHistory(g, i);
  const board = g.board.slice();
  board[i] = g.solution[i];
  let notes = g.notes.slice();
  notes[i] = 0;
  notes = clearPeerNotes(notes, i, g.solution[i]);
  const completed = isSolved(board, g.solution);
  return { game: { ...g, board, notes, history, hintsLeft: g.hintsLeft - 1, completed }, cell: i };
}

export function tick(g, seconds = 1) {
  if (g.completed) return g;
  return { ...g, elapsed: g.elapsed + seconds };
}

/** How many times each digit is correctly placed (for hiding finished digits). */
export function digitCounts(g) {
  const counts = new Array(10).fill(0);
  g.board.forEach((v, i) => {
    if (v && v === g.solution[i]) counts[v]++;
  });
  return counts;
}

// ── Stats ──
export function emptyStats() {
  const s = {};
  for (const d of ['easy', 'medium', 'hard', 'expert']) s[d] = { played: 0, won: 0, best: null, totalTime: 0 };
  return s;
}

export function recordStart(stats, difficulty) {
  const s = { ...emptyStats(), ...stats };
  s[difficulty] = { ...s[difficulty], played: s[difficulty].played + 1 };
  return s;
}

export function recordWin(stats, difficulty, seconds) {
  const s = { ...emptyStats(), ...stats };
  const cur = s[difficulty];
  s[difficulty] = {
    ...cur,
    won: cur.won + 1,
    best: cur.best == null ? seconds : Math.min(cur.best, seconds),
    totalTime: cur.totalTime + seconds,
  };
  return s;
}
