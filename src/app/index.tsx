import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';

const logoImg = require('../images/logo.jpg');

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CircuitBackground opacity={0.2} />

      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Image source={logoImg} style={styles.logo} />
        </View>

        <Text style={styles.title}>EASYFACE</Text>

        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>SISTEMA BIOMÉTRICO ATIVO</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>LOGIN / REGISTO</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050811',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 44,
    paddingHorizontal: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    maxWidth: 380,
    width: '88%',
  },
  logoWrapper: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    marginBottom: 6,
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 1.5,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#00F0FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#050811',
    letterSpacing: 1.5,
  },
});