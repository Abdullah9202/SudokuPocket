import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, useLayout } from '../theme';
import { DIFFICULTIES, formatTime, getDifficulty } from '../utils/sudoku';

function Shell({ visible, onClose, children }) {
  const t = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close">
        <Pressable style={[styles.card, { backgroundColor: t.card }]} onPress={() => {}}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DifficultyDialog({ visible, onPick, onClose, canClose }) {
  const t = useTheme();
  const { fs } = useLayout();
  return (
    <Shell visible={visible} onClose={canClose ? onClose : () => {}}>
      <Text accessibilityRole="header" style={[styles.title, { color: t.text, fontSize: fs(20) }]}>New game</Text>
      <Text style={[styles.body, { color: t.muted, fontSize: fs(14) }]}>Choose a difficulty</Text>
      {DIFFICULTIES.map((d) => (
        <Pressable
          key={d.id}
          onPress={() => onPick(d.id)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.option, { borderColor: t.border, backgroundColor: pressed ? t.soft : t.card }]}
        >
          <Text style={{ color: t.text, fontSize: fs(16), fontWeight: '700', flex: 1 }}>{d.label}</Text>
          <Text style={{ color: t.muted, fontSize: fs(13) }}>{d.clues} clues</Text>
        </Pressable>
      ))}
      {canClose ? (
        <Pressable onPress={onClose} accessibilityRole="button" style={styles.cancel}>
          <Text style={{ color: t.muted, fontWeight: '700', fontSize: fs(15) }}>Cancel</Text>
        </Pressable>
      ) : null}
    </Shell>
  );
}

export function WinDialog({ visible, game, best, onNewGame, onClose }) {
  const t = useTheme();
  const { fs } = useLayout();
  if (!game) return null;
  const isBest = best != null && game.elapsed <= best;
  return (
    <Shell visible={visible} onClose={onClose}>
      <Text style={styles.trophy}>🏆</Text>
      <Text accessibilityRole="header" style={[styles.title, { color: t.text, fontSize: fs(22), textAlign: 'center' }]}>
        Puzzle solved!
      </Text>
      <Text style={[styles.body, { color: t.muted, fontSize: fs(14.5), textAlign: 'center' }]}>
        {getDifficulty(game.difficulty).label} · {formatTime(game.elapsed)} · {game.mistakes} mistake{game.mistakes === 1 ? '' : 's'}
      </Text>
      {isBest ? (
        <Text style={{ color: t.primary, fontWeight: '800', textAlign: 'center', fontSize: fs(15), marginBottom: 8 }}>
          New best time!
        </Text>
      ) : null}
      <Pressable
        onPress={onNewGame}
        accessibilityRole="button"
        style={({ pressed }) => [styles.primary, { backgroundColor: t.primary, opacity: pressed ? 0.85 : 1 }]}
      >
        <Text style={{ color: t.onPrimary, fontWeight: '800', fontSize: fs(16) }}>Play again</Text>
      </Pressable>
      <Pressable onPress={onClose} accessibilityRole="button" style={styles.cancel}>
        <Text style={{ color: t.muted, fontWeight: '700', fontSize: fs(15) }}>View board</Text>
      </Pressable>
    </Shell>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 420, borderRadius: 20, padding: 22 },
  title: { fontWeight: '800', marginBottom: 4 },
  body: { marginBottom: 14 },
  option: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 8, minHeight: 52 },
  cancel: { alignSelf: 'center', padding: 12, marginTop: 4 },
  trophy: { fontSize: 52, textAlign: 'center', marginBottom: 6 },
  primary: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
});
