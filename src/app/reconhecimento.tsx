import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';
import { useAuth } from '../context/authcontext';
import { supabase } from '../lib/supabase';

export default function Reconhecimento() {
  const router = useRouter();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleStartScan = () => {
    if (!user) {
      Alert.alert('Erro', 'Sessão inválida. Faça login novamente.');
      return;
    }

    setScanning(true);
    setStatus('idle');

    setTimeout(async () => {
      setScanning(false);

      // Simulação de decisão biométrica (90% de taxa de aprovação)
      const isApproved = Math.random() > 0.1;
      const finalStatus = isApproved ? 'APROVADO' : 'RECUSADO';

      setStatus(isApproved ? 'success' : 'error');

      // Gravar log real no Supabase
      try {
        const { error } = await supabase.from('access_logs').insert([
          {
            user_id: user.id,
            access_type: 'Validação Facial',
            status: finalStatus,
          },
        ]);

        if (error) console.error('Erro ao salvar log:', error.message);
      } catch (err) {
        console.error('Erro de conexão:', err);
      }
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CircuitBackground opacity={0.3} />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← VOLTAR</Text>
        </Pressable>
        <Text style={styles.headerTitle}>VALIDAÇÃO BIOMÉTRICA</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.hudContainer}>
          <View style={[styles.hudFrame, scanning && styles.hudFrameScanning]} />
          <Text style={styles.hudIcon}>👤</Text>
          {scanning && <Text style={styles.scanningText}>A ANALISAR ROSTO...</Text>}
        </View>

        {status === 'success' && (
          <View style={styles.successBadge}>
            <Text style={styles.successText}>✓ ROSTO RECONHECIDO - ACESSO PERMITIDO</Text>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.errorBadge}>
            <Text style={styles.errorText}>✕ RECONHECIMENTO FALHOU - TENTE NOVAMENTE</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
          onPress={handleStartScan}
          disabled={scanning}
        >
          <Text style={styles.scanButtonText}>
            {scanning ? 'PROCESSANDO...' : 'INICIAR ESCANEAR ROSTO'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070C18' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  backButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(0, 168, 232, 0.15)', borderWidth: 1, borderColor: 'rgba(0, 168, 232, 0.3)' },
  backText: { fontSize: 11, fontWeight: '800', color: '#00A8E8' },
  headerTitle: { fontSize: 14, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1.5 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 24 },
  hudContainer: { width: 240, height: 240, borderRadius: 120, borderWidth: 2, borderColor: 'rgba(0, 168, 232, 0.4)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(7, 12, 24, 0.8)', position: 'relative' },
  hudFrame: { position: 'absolute', width: 260, height: 260, borderRadius: 130, borderWidth: 1, borderColor: 'rgba(0, 168, 232, 0.2)', borderStyle: 'dashed' },
  hudFrameScanning: { borderColor: '#00C853' },
  hudIcon: { fontSize: 72 },
  scanningText: { marginTop: 12, fontSize: 10, fontWeight: '800', color: '#00A8E8', letterSpacing: 2 },
  successBadge: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, backgroundColor: 'rgba(0, 200, 83, 0.15)', borderWidth: 1, borderColor: 'rgba(0, 200, 83, 0.4)' },
  successText: { fontSize: 11, fontWeight: '800', color: '#00C853', letterSpacing: 1 },
  errorBadge: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, backgroundColor: 'rgba(255, 68, 68, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 68, 68, 0.4)' },
  errorText: { fontSize: 11, fontWeight: '800', color: '#FF4444', letterSpacing: 1 },
  scanButton: { width: '100%', maxWidth: 320, paddingVertical: 16, backgroundColor: '#00A8E8', borderRadius: 14, alignItems: 'center' },
  scanButtonPressed: { opacity: 0.8 },
  scanButtonText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5 },
});