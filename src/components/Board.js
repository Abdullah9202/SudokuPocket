import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { rowOf, colOf, boxOf } from '../utils/sudoku';

const Cell = memo(function Cell({ i, value, given, wrong, notes, size, bg, onPress, t }) {
  const r = rowOf(i);
  const c = colOf(i);
  const thickR = c === 2 || c === 5;
  const thickB = r === 2 || r === 5;
  const label = value ? `Row ${r + 1}, column ${c + 1}, ${value}${given ? ', given' : ''}` : `Row ${r + 1}, column ${c + 1}, empty`;

  return (
    <Pressable
      onPress={() => onPress(i)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: bg,
          borderRightWidth: c === 8 ? 0 : thickR ? 2 : StyleSheet.hairlineWidth,
          borderBottomWidth: r === 8 ? 0 : thickB ? 2 : StyleSheet.hairlineWidth,
          borderRightColor: thickR ? t.text : t.border,
          borderBottomColor: thickB ? t.text : t.border,
        },
      ]}
    >
      {value ? (
        <Text
          allowFontScaling={false}
          style={{
            fontSize: size * 0.55,
            fontWeight: given ? '800' : '600',
            color: wrong ? t.danger : given ? t.text : t.primary,
          }}
        >
          {value}
        </Text>
      ) : notes ? (
        <View style={styles.notes}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <Text
              key={d}
              allowFontScaling={false}
              style={[styles.note, { width: size / 3 - 0.5, fontSize: size * 0.22, lineHeight: size * 0.3, color: t.muted }]}
            >
              {notes & (1 << d) ? d : ''}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
});

export default function Board({ game, selected, onSelect, size }) {
  const t = useTheme();
  const cell = Math.floor((size - 4) / 9);
  const selVal = selected != null ? game.board[selected] : 0;

  const bgFor = (i) => {
    if (i === selected) return t.primary + '55';
    if (selVal && game.board[i] === selVal) return t.primary + '2E';
    if (
      selected != null &&
      (rowOf(i) === rowOf(selected) || colOf(i) === colOf(selected) || boxOf(i) === boxOf(selected))
    ) {
      return t.soft;
    }
    return t.card;
  };

  const rows = [];
  for (let r = 0; r < 9; r++) {
    const cells = [];
    for (let c = 0; c < 9; c++) {
      const i = r * 9 + c;
      const v = game.board[i];
      cells.push(
        <Cell
          key={i}
          i={i}
          value={v}
          given={game.puzzle[i] !== 0}
          wrong={!!v && v !== game.solution[i]}
          notes={game.notes[i]}
          size={cell}
          bg={bgFor(i)}
          onPress={onSelect}
          t={t}
        />
      );
    }
    rows.push(
      <View key={r} style={styles.row}>
        {cells}
      </View>
    );
  }

  return <View style={[styles.board, { borderColor: t.text, width: cell * 9 + 4 }]}>{rows}</View>;
}

const styles = StyleSheet.create({
  board: { borderWidth: 2, borderRadius: 6, overflow: 'hidden', alignSelf: 'center' },
  row: { flexDirection: 'row' },
  cell: { alignItems: 'center', justifyContent: 'center' },
  notes: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', paddingHorizontal: 1 },
  note: { textAlign: 'center' },
});
