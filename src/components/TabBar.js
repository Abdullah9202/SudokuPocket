import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

/** Bottom tab bar. `tabs` = [{ key, label, icon }] */
export default function TabBar({ tabs, active, onChange }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          backgroundColor: t.card,
          borderTopColor: t.border,
          paddingBottom: Math.max(insets.bottom, 6),
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.label}
            style={styles.item}
          >
            <Text style={[styles.icon, { opacity: selected ? 1 : 0.5 }]} maxFontSizeMultiplier={1.2}>
              {tab.icon}
            </Text>
            <Text
              maxFontSizeMultiplier={1.2}
              numberOfLines={1}
              style={[styles.label, { color: selected ? t.primary : t.muted, fontWeight: selected ? '700' : '500' }]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 6 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  icon: { fontSize: 20 },
  label: { fontSize: 11.5, marginTop: 2 },
});
