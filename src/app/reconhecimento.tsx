import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';

export default function Reconhecimento() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleStartScan = () => {
    setScanning(true);
    setStatus('idle');

    setTimeout(() => {
      setScanning(false);
      // Simulação visual de sucesso (90% de chance de aprovação)
      const isApproved = Math.random() > 0.1;
      setStatus(isApproved ? 'success' : 'error');
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CircuitBackground opacity={0.2} />

      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← VOLTAR</Text>
          </Pressable>
          <Text style={styles.headerTitle}>VALIDAÇÃO BIOMÉTRICA</Text>
        </View>

        <View style={styles.content}>
          {/* HUD DE LEITURA FACIAL */}
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
              <Text style={styles.hudIconText}>FACE ID</Text>
            </View>
            {scanning && <Text style={styles.scanningText}>A ANALISAR ROSTO...</Text>}
          </View>

          {/* BADGES DE ESTADO */}
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
              {scanning ? 'PROCESSANDO...' : 'INICIAR VERIFICAÇÃO'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  contentWrapper: { flex: 1, maxWidth: 680, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backText: { fontSize: 10, fontWeight: '800', color: '#00F0FF', letterSpacing: 1 },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5 },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 24,
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
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderStyle: 'dashed',
  },
  ringScanning: { borderColor: '#00F0FF' },
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
  },
  hudIconText: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 2 },
  scanningText: {
    position: 'absolute',
    bottom: -32,
    fontSize: 9,
    fontWeight: '800',
    color: '#00F0FF',
    letterSpacing: 1.5,
  },

  /* Status Badges */
  successBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  successText: { fontSize: 10, fontWeight: '800', color: '#10B981', letterSpacing: 0.8 },
  errorBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  errorText: { fontSize: 10, fontWeight: '800', color: '#EF4444', letterSpacing: 0.8 },

  /* Action Button */
  scanButton: {
    width: '100%',
    maxWidth: 300,
    paddingVertical: 14,
    backgroundColor: '#00F0FF',
    borderRadius: 10,
    alignItems: 'center', 
    marginTop: 12,
  },
  scanButtonPressed: { opacity: 0.85 },
  scanButtonText: { fontSize: 11, fontWeight: '800', color: '#050811', letterSpacing: 1.2 },
});