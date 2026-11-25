import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import Grid from '../components/Grid';
import { useTheme, useLayout } from '../theme';
import { DIFFICULTIES, formatTime } from '../utils/sudoku';

function Stat({ label, value }) {
  const t = useTheme();
  const { fs } = useLayout();
  return (
    <View style={styles.stat}>
      <Text style={{ color: t.text, fontSize: fs(20), fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: t.muted, fontSize: fs(12) }}>{label}</Text>
    </View>
  );
}

export default function StatsScreen({ stats, onReset }) {
  const t = useTheme();
  const { fs } = useLayout();

  const confirmReset = () =>
    Alert.alert('Reset statistics?', 'All games played, wins and best times will be cleared.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: onReset },
    ]);

  return (
    <Screen>
      <Grid columns={undefined}>
        {DIFFICULTIES.map((d) => {
          const s = stats[d.id] || { played: 0, won: 0, best: null, totalTime: 0 };
          const rate = s.played ? Math.round((s.won / s.played) * 100) : 0;
          return (
            <View key={d.id} style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
              <Text accessibilityRole="header" style={[styles.title, { color: t.primary, fontSize: fs(17) }]}>
                {d.label}
              </Text>
              <View style={styles.row}>
                <Stat label="Played" value={s.played} />
                <Stat label="Won" value={s.won} />
                <Stat label="Win rate" value={`${rate}%`} />
              </View>
              <View style={styles.row}>
                <Stat label="Best time" value={s.best == null ? '—' : formatTime(s.best)} />
                <Stat label="Average" value={s.won ? formatTime(s.totalTime / s.won) : '—'} />
              </View>
            </View>
          );
        })}
      </Grid>
      <Pressable onPress={confirmReset} accessibilityRole="button" style={styles.reset}>
        <Text style={{ color: t.danger, fontWeight: '700', fontSize: fs(14) }}>Reset statistics</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 16, marginBottom: 12 },
  title: { fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', marginBottom: 8 },
  stat: { flex: 1, alignItems: 'center' },
  reset: { alignSelf: 'center', padding: 12 },
});
