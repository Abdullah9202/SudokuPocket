import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useLayout } from '../theme';

export default function Empty({ emoji, title, body }) {
  const t = useTheme();
  const { fs } = useLayout();
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: t.text, fontSize: fs(18) }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: t.muted, fontSize: fs(14.5) }]}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginTop: 56, paddingHorizontal: 20 },
  emoji: { fontSize: 46, marginBottom: 12 },
  title: { fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  body: { textAlign: 'center', lineHeight: 21 },
});
