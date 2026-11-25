import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Board from '../components/Board';
import { ToolRow, NumberPad } from '../components/Controls';
import { useTheme, useLayout } from '../theme';
import { formatTime, getDifficulty } from '../utils/sudoku';
import { digitCounts } from '../utils/game';

export default function PlayScreen({ game, generating, selected, onSelect, notesMode, actions }) {
  const t = useTheme();
  const { width, height, fs, gutter, isLandscape } = useLayout();
  const insets = useSafeAreaInsets();

  if (generating || !game) {
    return (
      <View style={[styles.center, { backgroundColor: t.background }]}>
        <ActivityIndicator color={t.primary} size="large" />
        <Text style={{ color: t.muted, marginTop: 12, fontSize: fs(14) }}>Creating a fresh puzzle…</Text>
      </View>
    );
  }

  const sideBySide = isLandscape && width >= 640;
  const usableW = width - insets.left - insets.right - gutter * 2;
  // Header (56) + tab bar (~64) + status/nav insets + info row and controls.
  const usableH = height - insets.top - insets.bottom - 56 - 64 - 24;
  const boardSize = Math.max(
    252,
    sideBySide ? Math.min(usableH - 8, usableW * 0.55, 620) : Math.min(usableW, usableH - 210, 560)
  );
  const padWidth = sideBySide ? Math.min(usableW - boardSize - 24, 420) : Math.min(usableW, 560);

  const info = (
    <View style={[styles.info, { width: sideBySide ? padWidth : Math.max(boardSize, 260) }]}>
      <Text style={[styles.infoText, { color: t.muted, fontSize: fs(13.5) }]}>{getDifficulty(game.difficulty).label}</Text>
      <Text style={[styles.infoText, { color: game.mistakes ? t.danger : t.muted, fontSize: fs(13.5) }]}>
        Mistakes: {game.mistakes}
      </Text>
      <Text style={[styles.infoText, { color: t.text, fontSize: fs(15), fontWeight: '800' }]}>⏱ {formatTime(game.elapsed)}</Text>
    </View>
  );

  const controls = (
    <View style={{ width: padWidth, alignSelf: 'center' }}>
      <ToolRow
        onUndo={actions.undo}
        onErase={actions.erase}
        onNotes={actions.toggleNotes}
        onHint={actions.hint}
        notesMode={notesMode}
        hintsLeft={game.hintsLeft}
        canUndo={game.history.length > 0 && !game.completed}
      />
      <NumberPad onDigit={actions.digit} counts={digitCounts(game)} width={padWidth} />
      {game.completed ? (
        <Text style={[styles.done, { color: t.success, fontSize: fs(15) }]}>Solved! Tap “New” to play again.</Text>
      ) : null}
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.background }}
      contentContainerStyle={[styles.content, { paddingLeft: gutter + insets.left, paddingRight: gutter + insets.right }]}
    >
      {sideBySide ? (
        <View style={styles.row}>
          <Board game={game} selected={selected} onSelect={onSelect} size={boardSize} />
          <View style={{ marginLeft: 24, justifyContent: 'center' }}>
            {info}
            {controls}
          </View>
        </View>
      ) : (
        <View style={{ alignItems: 'center' }}>
          {info}
          <Board game={game} selected={selected} onSelect={onSelect} size={boardSize} />
          {controls}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  info: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, alignSelf: 'center' },
  infoText: { fontWeight: '700' },
  done: { textAlign: 'center', fontWeight: '800', marginTop: 12 },
});
