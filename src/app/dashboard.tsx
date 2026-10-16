import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';
import { useAuth } from '../context/authcontext';

export default function Dashboard() {
  const router = useRouter();
  const { profile, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <CircuitBackground />
        <ActivityIndicator size="large" color="#00A8E8" />

      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CircuitBackground opacity={0.3} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>BEM-VINDO,</Text>
            <Text style={styles.userName}>
              {profile?.name ? profile.name.toUpperCase() : 'UTILIZADOR'}
            </Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {profile?.user_type === 'fornecedor' ? 'FORNECEDOR' : 'PARTICIPANTE'}
              </Text>
            </View>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutText}>SAIR</Text>
          </Pressable>
        </View>

        {/* Card Status do Sistema Biométrico */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>STATUS DA BIOMETRIA</Text>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.cardValue}>SISTEMA OPERACIONAL</Text>
          <Text style={styles.cardSubtext}>
            Documento associado: {profile?.document || 'Não informado'}
          </Text>
        </View>

        {/* Ações Rápidas */}
        <Text style={styles.sectionTitle}>AÇÕES RÁPIDAS</Text>
        <View style={styles.grid}>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => router.push('/reconhecimento')}
          >
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionTitle}>VALIDAR ACESSO</Text>
            <Text style={styles.actionSub}>Escanear Rosto</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => router.push('/historico')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionTitle}>HISTÓRICO</Text>
            <Text style={styles.actionSub}>Logs de Validação</Text>
          </Pressable>
        </View>

        {/* Resumo de Atividade */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ÚLTIMAS ATIVIDADES</Text>
          <View style={styles.logItem}>
            <Text style={styles.logStatus}>[OK]</Text>
            <Text style={styles.logText}>Sessão iniciada com sucesso</Text>
          </View>
          <View style={styles.logItem}>
            <Text style={styles.logStatus}>[OK]</Text>
            <Text style={styles.logText}>Chave biométrica sincronizada</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070C18',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#070C18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00A8E8',
    letterSpacing: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 168, 232, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.3)',
    marginTop: 4,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00A8E8',
    letterSpacing: 1,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
  },
  logoutText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF4444',
    letterSpacing: 1,
  },
  card: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: 'rgba(7, 12, 24, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00A8E8',
    letterSpacing: 1.5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: '#A0AAB5',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00A8E8',
    letterSpacing: 1.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(7, 12, 24, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.3)',
    alignItems: 'center',
  },
  actionCardPressed: {
    backgroundColor: 'rgba(0, 168, 232, 0.15)',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  actionSub: {
    fontSize: 10,
    color: '#A0AAB5',
    marginTop: 2,
  },
  logItem: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  logStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00C853',
  },
  logText: {
    fontSize: 12,
    color: '#A0AAB5',
  },
});