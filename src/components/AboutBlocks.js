import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Screen from './Screen';
import { useTheme, useLayout } from '../theme';
import config from '../appConfig';

function Block({ title, children }) {
  const t = useTheme();
  const { fs } = useLayout();
  return (
    <View style={[styles.block, { backgroundColor: t.card, borderColor: t.border }]}>
      <Text accessibilityRole="header" style={[styles.h, { color: t.text, fontSize: fs(16) }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function LinkRow({ label, url }) {
  const t = useTheme();
  const { fs } = useLayout();
  return (
    <Pressable
      onPress={() => Linking.openURL(url).catch(() => {})}
      accessibilityRole="link"
      style={({ pressed }) => [styles.link, { borderColor: t.border }, pressed && { opacity: 0.7 }]}
    >
      <Text style={{ color: t.primary, fontSize: fs(15), fontWeight: '600', flex: 1 }}>{label}</Text>
      <Text style={{ color: t.muted, fontSize: 18 }}>↗</Text>
    </Pressable>
  );
}

/** Shared About screen: app info, privacy summary, legal links, extra blocks. */
export default function AboutScreen({ extra = [] }) {
  const t = useTheme();
  const { fs } = useLayout();
  const p = { color: t.text, fontSize: fs(14.5), lineHeight: fs(22) };
  const version = Constants.expoConfig?.version || '1.0.0';

  return (
    <Screen>
      <View style={styles.top}>
        <Text style={styles.logo}>{config.emoji}</Text>
        <Text style={[styles.name, { color: t.text, fontSize: fs(22) }]}>{config.shortName}</Text>
        <Text style={{ color: t.muted, fontSize: fs(13) }}>
          {config.tagline} · Version {version}
        </Text>
      </View>

      {extra.map((b) => (
        <Block key={b.title} title={b.title}>
          <Text style={p}>{b.body}</Text>
        </Block>
      ))}

      <Block title="Privacy">
        <Text style={p}>
          {config.shortName} does not collect, store or share any personal data. There are no accounts, ads,
          analytics or trackers, and the app needs no special permissions. Anything you save stays only on this
          device and is removed when you uninstall the app.
        </Text>
      </Block>

      <Block title="Legal">
        <LinkRow label="Privacy Policy" url={config.privacyUrl} />
        <LinkRow label="Terms of Use" url={config.termsUrl} />
      </Block>

      <Text style={[styles.foot, { color: t.muted, fontSize: fs(12) }]}>Works fully offline.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', marginBottom: 16 },
  logo: { fontSize: 44 },
  name: { fontWeight: '800', marginTop: 4 },
  block: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 16, marginBottom: 12 },
  h: { fontWeight: '800', marginBottom: 6 },
  link: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth },
  foot: { textAlign: 'center', marginVertical: 8 },
});
