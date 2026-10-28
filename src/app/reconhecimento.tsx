import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GradientBackground } from '../components/gradientbackground';

export default function Reconhecimento() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Navegação Segura ao Clicar em Voltar
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/dashboard');
    }
  };

  // Animações
  const translateY = useRef(new Animated.Value(0)).current;
  const colorProgress = useRef(new Animated.Value(0)).current; // 0: Azul, 1: Verde, 2: Vermelho
  const blinkOpacity = useRef(new Animated.Value(1)).current;

  // Animação do Laser e Transição de Cor durante o Scan
  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 180,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.timing(colorProgress, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else {
      translateY.setValue(0);
    }
  }, [scanning]);

  // Efeito de Piscar ao Concluir
  useEffect(() => {
    if (status !== 'idle') {
      if (status === 'error') {
        Animated.timing(colorProgress, {
          toValue: 2,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }

      Animated.sequence([
        Animated.timing(blinkOpacity, { toValue: 0.1, duration: 120, useNativeDriver: true }),
        Animated.timing(blinkOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(blinkOpacity, { toValue: 0.1, duration: 120, useNativeDriver: true }),
        Animated.timing(blinkOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(blinkOpacity, { toValue: 0.1, duration: 120, useNativeDriver: true }),
        Animated.timing(blinkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [status]);

  const handleStartScan = () => {
    setScanning(true);
    setStatus('idle');
    colorProgress.setValue(0);
    blinkOpacity.setValue(1);

    setTimeout(() => {
      setScanning(false);
      const isApproved = Math.random() > 0.1;
      setStatus(isApproved ? 'success' : 'error');
    }, 3000);
  };

  const animatedColor = colorProgress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#00F0FF', '#10B981', '#EF4444'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050811" />
      <GradientBackground />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack} hitSlop={12}>
            <Text style={styles.backText}>← VOLTAR</Text>
          </Pressable>
          <Text style={styles.headerTitle}>VALIDAÇÃO BIOMÉTRICA</Text>
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <View style={styles.centerSection}>
          {/* HUD FACIAL COM TORSO PONTILHADO */}
          <View style={styles.hudContainer}>
            <View
              style={[
                styles.hudOuterRing,
                scanning && styles.ringScanning,
                status === 'success' && styles.ringSuccess,
                status === 'error' && styles.ringError,
              ]}
            />

            <View style={styles.hudInnerCircle}>
              <Animated.View style={[styles.torsoContainer, { opacity: blinkOpacity }]}>
                <Animated.View style={[styles.torsoHead, { borderColor: animatedColor }]} />
                <Animated.View style={[styles.torsoBody, { borderColor: animatedColor }]} />

                <Animated.View style={[styles.nodeDot, styles.dotForehead, { backgroundColor: animatedColor }]} />
                <Animated.View style={[styles.nodeDot, styles.dotLeftEye, { backgroundColor: animatedColor }]} />
                <Animated.View style={[styles.nodeDot, styles.dotRightEye, { backgroundColor: animatedColor }]} />
                <Animated.View style={[styles.nodeDot, styles.dotChin, { backgroundColor: animatedColor }]} />
                <Animated.View style={[styles.nodeDot, styles.dotLeftShoulder, { backgroundColor: animatedColor }]} />
                <Animated.View style={[styles.nodeDot, styles.dotRightShoulder, { backgroundColor: animatedColor }]} />
              </Animated.View>

              {scanning && (
                <Animated.View
                  style={[
                    styles.scanLaser,
                    {
                      transform: [{ translateY }],
                    },
                  ]}
                />
              )}
            </View>

            {scanning && <Text style={styles.scanningText}>A ANALISAR VETORES FACIAIS...</Text>}
          </View>

          {/* BADGES DE STATUS */}
          {status === 'success' && (
            <View style={styles.successBadge}>
              <Text style={styles.successText}>✓ ROSTO RECONHECIDO — ACESSO PERMITIDO</Text>
            </View>
          )}

          {status === 'error' && (
            <View style={styles.errorBadge}>
              <Text style={styles.errorText}>✕ FALHA NA LEITURA — TENTE NOVAMENTE</Text>
            </View>
          )}

          {/* BOTÃO DE AÇÃO */}
          <Pressable
            style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
            onPress={handleStartScan}
            disabled={scanning}
          >
            <Text style={styles.scanButtonText}>
              {scanning ? 'MANTENHA A POSIÇÃO...' : 'INICIAR ESCANEAR ROSTO'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 10,
  },
  backButton: {
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
  },
  backText: { fontSize: 10, fontWeight: '800', color: '#00F0FF', letterSpacing: 1 },
  headerTitle: { fontSize: 12, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.2 },

  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 28,
  },

  /* HUD */
  hudContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hudOuterRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.2)',
    borderStyle: 'dashed',
  },
  ringScanning: { borderColor: '#00F0FF', borderStyle: 'solid' },
  ringSuccess: { borderColor: '#10B981', borderStyle: 'solid' },
  ringError: { borderColor: '#EF4444', borderStyle: 'solid' },

  hudInnerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  /* TORSO PONTILHADO */
  torsoContainer: {
    width: 90,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  torsoHead: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 6,
  },
  torsoBody: {
    width: 72,
    height: 44,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderBottomWidth: 0,
  },
  nodeDot: { position: 'absolute', width: 4, height: 4, borderRadius: 2 },
  dotForehead: { top: 12 },
  dotLeftEye: { top: 20, left: 34 },
  dotRightEye: { top: 20, right: 34 },
  dotChin: { top: 38 },
  dotLeftShoulder: { bottom: 6, left: 12 },
  dotRightShoulder: { bottom: 6, right: 12 },

  /* Laser */
  scanLaser: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00F0FF',
  },

  scanningText: {
    position: 'absolute',
    bottom: -32,
    fontSize: 9,
    fontWeight: '800',
    color: '#00F0FF',
    letterSpacing: 1.5,
  },

  /* Badges */
  successBadge: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  successText: { fontSize: 10, fontWeight: '800', color: '#10B981', letterSpacing: 0.8, textAlign: 'center' },
  errorBadge: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  errorText: { fontSize: 10, fontWeight: '800', color: '#EF4444', letterSpacing: 0.8, textAlign: 'center' },

  /* Botão */
  scanButton: {
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: '#00F0FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  scanButtonPressed: { opacity: 0.85 },
  scanButtonText: { fontSize: 11, fontWeight: '800', color: '#050811', letterSpacing: 1.2 },
});