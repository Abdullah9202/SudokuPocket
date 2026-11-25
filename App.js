import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, BackHandler, AppState, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Header, { HeaderButton } from './src/components/Header';
import TabBar from './src/components/TabBar';
import AboutScreen from './src/components/AboutBlocks';
import { DifficultyDialog, WinDialog } from './src/components/Dialogs';
import PlayScreen from './src/screens/PlayScreen';
import StatsScreen from './src/screens/StatsScreen';
import { useTheme } from './src/theme';
import { loadJSON, saveJSON } from './src/utils/storage';
import * as G from './src/utils/game';

const TABS = [
  { key: 'play', label: 'Play', icon: '🧩' },
  { key: 'stats', label: 'Stats', icon: '📊' },
  { key: 'about', label: 'About', icon: 'ℹ️' },
];
const GAME_KEY = 'sudokupocket.game.v1';
const STATS_KEY = 'sudokupocket.stats.v1';

function Main() {
  const t = useTheme();
  const [tab, setTab] = useState('play');
  const [game, setGame] = useState(null);
  const [stats, setStats] = useState(G.emptyStats());
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notesMode, setNotesMode] = useState(false);
  const [picker, setPicker] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [appActive, setAppActive] = useState(true);
  const wasCompleted = useRef(false);

  // Load saved game and stats.
  useEffect(() => {
    (async () => {
      const g = G.sanitizeGame(await loadJSON(GAME_KEY, null));
      const s = await loadJSON(STATS_KEY, null);
      if (s && typeof s === 'object') setStats({ ...G.emptyStats(), ...s });
      setGame(g);
      wasCompleted.current = !!g?.completed;
      if (!g) setPicker(true);
      setLoaded(true);
    })();
  }, []);

  // Persist game state.
  useEffect(() => {
    if (loaded && game) saveJSON(GAME_KEY, game);
  }, [game, loaded]);

  useEffect(() => {
    if (loaded) saveJSON(STATS_KEY, stats);
  }, [stats, loaded]);

  // Pause the timer when the app is in the background.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => setAppActive(s === 'active'));
    return () => sub.remove();
  }, []);

  // Timer runs only on the Play tab, with no dialog open, while the game is unfinished.
  const running = tab === 'play' && appActive && !!game && !game.completed && !generating && !picker;
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setGame((g) => (g ? G.tick(g) : g)), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Detect a win.
  useEffect(() => {
    if (!game) return;
    if (game.completed && !wasCompleted.current) {
      setStats((s) => G.recordWin(s, game.difficulty, game.elapsed));
      setShowWin(true);
      setSelected(null);
    }
    wasCompleted.current = game.completed;
  }, [game]);

  const startGame = useCallback((difficulty) => {
    setPicker(false);
    setShowWin(false);
    setGenerating(true);
    setSelected(null);
    setNotesMode(false);
    // Let the spinner render before the (short) generation work.
    setTimeout(() => {
      const g = G.newGame(difficulty);
      wasCompleted.current = false;
      setGame(g);
      setStats((s) => G.recordStart(s, difficulty));
      setGenerating(false);
    }, 50);
  }, []);

  const actions = {
    digit: (d) => setGame((g) => (g ? G.enterDigit(g, selected, d, notesMode) : g)),
    erase: () => setGame((g) => (g ? G.erase(g, selected) : g)),
    undo: () => setGame((g) => (g ? G.undo(g) : g)),
    toggleNotes: () => setNotesMode((n) => !n),
    hint: () => {
      if (!game) return;
      const { game: next, cell } = G.hint(game, selected);
      setGame(next);
      if (cell != null) setSelected(cell);
    },
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tab !== 'play') {
        setTab('play');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [tab]);

  let title = 'Sudoku';
  let right = null;
  let body;
  if (tab === 'play') {
    right = <HeaderButton label="New" accessibilityLabel="New game" onPress={() => setPicker(true)} />;
    body = (
      <PlayScreen
        game={game}
        generating={generating || !loaded}
        selected={selected}
        onSelect={setSelected}
        notesMode={notesMode}
        actions={actions}
      />
    );
  } else if (tab === 'stats') {
    title = 'Statistics';
    body = <StatsScreen stats={stats} onReset={() => setStats(G.emptyStats())} />;
  } else {
    title = 'About';
    body = (
      <AboutScreen
        extra={[
          {
            title: 'How to play',
            body:
              'Fill the grid so that every row, every column and every 3×3 box contains the digits 1 to 9 exactly once. Tap a cell, then tap a number. Turn on Notes to pencil in candidates. Wrong numbers turn red, Undo reverses your last move, and you get 3 hints per game.',
          },
          {
            title: 'Fair puzzles',
            body:
              'Every puzzle is generated on your device and checked to have exactly one solution, so it can always be solved by logic.',
          },
        ]}
      />
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: t.background }]}>
      <StatusBar style="light" />
      <Header title={title} right={right} />
      <View style={styles.body}>{body}</View>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <DifficultyDialog
        visible={picker}
        canClose={!!game}
        onClose={() => setPicker(false)}
        onPick={startGame}
      />
      <WinDialog
        visible={showWin}
        game={game}
        best={game ? stats[game.difficulty]?.best : null}
        onClose={() => setShowWin(false)}
        onNewGame={() => {
          setShowWin(false);
          setPicker(true);
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
});
