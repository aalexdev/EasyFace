import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export function GradientBackground() {
  return (
    <LinearGradient
      colors={['#0A1128', '#050811', '#03050A']}
      locations={[0, 0.5, 1]}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
}