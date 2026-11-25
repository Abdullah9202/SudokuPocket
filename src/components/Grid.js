import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLayout } from '../theme';

/** Lays children out in 1–3 columns depending on screen width. */
export default function Grid({ children, gap = 10, columns: forced, min = 1 }) {
  const { columns: auto } = useLayout();
  const columns = Math.max(min, forced || auto);
  const items = React.Children.toArray(children);

  if (columns === 1) return <View>{items}</View>;

  return (
    <View style={[styles.wrap, { marginHorizontal: -gap / 2 }]}>
      {items.map((child, i) => (
        <View key={i} style={{ width: `${100 / columns}%`, paddingHorizontal: gap / 2 }}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
