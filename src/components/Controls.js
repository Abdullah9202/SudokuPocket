import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, useLayout } from '../theme';

function Tool({ icon, label, onPress, active, disabled, badge }) {
  const t = useTheme();
  const { fs } = useLayout();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, selected: !!active }}
      style={({ pressed }) => [styles.tool, { opacity: disabled ? 0.35 : pressed ? 0.6 : 1 }]}
    >
      <View style={[styles.toolIcon, { backgroundColor: active ? t.primary : t.soft }]}>
        <Text style={{ fontSize: 20, color: active ? t.onPrimary : t.text }}>{icon}</Text>
        {badge != null ? (
          <View style={[styles.badge, { backgroundColor: t.primary }]}>
            <Text style={{ color: t.onPrimary, fontSize: 11, fontWeight: '800' }}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={{ color: active ? t.primary : t.muted, fontSize: fs(12), fontWeight: '700', marginTop: 4 }} maxFontSizeMultiplier={1.2}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ToolRow({ onUndo, onErase, onNotes, onHint, notesMode, hintsLeft, canUndo }) {
  return (
    <View style={styles.tools}>
      <Tool icon="↶" label="Undo" onPress={onUndo} disabled={!canUndo} />
      <Tool icon="⌫" label="Erase" onPress={onErase} />
      <Tool icon="✎" label={notesMode ? 'Notes on' : 'Notes'} onPress={onNotes} active={notesMode} />
      <Tool icon="💡" label="Hint" onPress={onHint} disabled={hintsLeft <= 0} badge={hintsLeft} />
    </View>
  );
}

export function NumberPad({ onDigit, counts, width }) {
  const t = useTheme();
  const size = Math.min(56, Math.floor((width - 8 * 6) / 9));
  return (
    <View style={styles.pad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
        const done = counts[d] >= 9;
        return (
          <Pressable
            key={d}
            onPress={() => onDigit(d)}
            disabled={done}
            accessibilityRole="button"
            accessibilityLabel={done ? `${d}, all placed` : `Enter ${d}`}
            style={({ pressed }) => [
              styles.key,
              { width: size, height: size * 1.25, backgroundColor: t.card, borderColor: t.border, opacity: done ? 0.25 : pressed ? 0.6 : 1 },
            ]}
          >
            <Text allowFontScaling={false} style={{ fontSize: size * 0.55, fontWeight: '700', color: t.primary }}>
              {d}
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 10, color: t.muted }}>
              {done ? '' : 9 - counts[d]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tools: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12 },
  tool: { alignItems: 'center', minWidth: 64, minHeight: 48 },
  toolIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  pad: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  key: { borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', margin: 3 },
});
