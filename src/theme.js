import { useColorScheme, useWindowDimensions } from 'react-native';
import config from './appConfig';

const base = {
  light: {
    dark: false,
    background: '#F5F6FA',
    card: '#FFFFFF',
    text: '#151A23',
    muted: '#5E6675',
    border: '#E2E5EC',
    input: '#FFFFFF',
    soft: '#EEF0F6',
    danger: '#D64545',
    success: '#2B8A3E',
    onPrimary: '#FFFFFF',
  },
  dark: {
    dark: true,
    background: '#0F1218',
    card: '#181C24',
    text: '#ECEFF4',
    muted: '#9AA3B2',
    border: '#272C37',
    input: '#1D222B',
    soft: '#20252F',
    danger: '#FF7B7B',
    success: '#69DB7C',
    onPrimary: '#0F1218',
  },
};

export function useTheme() {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? base.dark : base.light;
  return { ...c, primary: isDark ? config.primaryDark : config.primary, accent: config.accent };
}

/**
 * Responsive helper: centred content with a readable max width on tablets,
 * foldables and landscape; column count adapts to the available width.
 */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 600;
  const maxWidth = isTablet ? 920 : 700;
  const contentWidth = Math.min(width, maxWidth);
  const gutter = width < 360 ? 12 : 16;
  const columns = contentWidth >= 820 ? 3 : contentWidth >= 520 ? 2 : 1;
  const scale = isTablet ? 1.1 : width < 360 ? 0.94 : 1;
  return {
    width,
    height,
    isTablet,
    isLandscape: width > height,
    maxWidth,
    contentWidth,
    gutter,
    columns,
    fs: (n) => Math.round(n * scale),
  };
}
