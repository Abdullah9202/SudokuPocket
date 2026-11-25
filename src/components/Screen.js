import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useLayout } from '../theme';

/** Page body: centred, max-width capped, safe for edge-to-edge and landscape. */
export default function Screen({ children, scroll = true, padded = true }) {
  const t = useTheme();
  const { maxWidth, gutter } = useLayout();
  const insets = useSafeAreaInsets();
  const side = (padded ? gutter : 0) + Math.max(insets.left, insets.right);

  const inner = (
    <View style={[styles.inner, { maxWidth, paddingHorizontal: side }, !scroll && styles.flex]}>
      {children}
    </View>
  );

  if (!scroll) {
    return <View style={[styles.flex, { backgroundColor: t.background, paddingTop: 12 }]}>{inner}</View>;
  }
  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: t.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {inner}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingVertical: 16 },
  inner: { width: '100%', alignSelf: 'center' },
});
