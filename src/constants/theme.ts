// src/constants/theme.ts
import { useWindowDimensions } from 'react-native';

export const COLORS = {
  background: '#050811',
  cardBg: 'rgba(13, 20, 36, 0.65)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  cardBorderGlow: 'rgba(0, 240, 255, 0.3)',
  
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  
  accent: '#00F0FF',
  accentGlow: 'rgba(0, 240, 255, 0.15)',
  
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.12)',
  
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isSmallMobile = width < 380;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return {
    width,
    height,
    isSmallMobile,
    isTablet,
    isDesktop,
    // Define a largura máxima do container central
    containerWidth: isDesktop ? 1080 : isTablet ? 720 : '100%',
    gridColumns: isDesktop ? 3 : isTablet ? 2 : 1,
  };
};