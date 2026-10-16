import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
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
        <CircuitBackground opacity={0.35} />
        <ActivityIndicator size="large" color="#00A8E8" />
        <Text style={styles.loadingText}>CARREGANDO PAINEL...</Text>
      </View>
    );
  }

  const isSupplier = profile?.user_type === 'fornecedor';
  const userInitials = profile?.name
    ? profile.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
    : 'EF';

  return (
    <SafeAreaView style={styles.container}>
      <CircuitBackground opacity={0.35} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Perfil */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarGlow} />
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userInitials}</Text>
              </View>
              <View style={styles.onlineBadge} />
            </View>

            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>PAINEL DE CONTROLO</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {profile?.name || 'Utilizador EasyFace'}
              </Text>
              <View style={[styles.roleTag, isSupplier ? styles.supplierTag : styles.participantTag]}>
                <Text style={[styles.roleTagText, isSupplier ? styles.supplierTagText : styles.participantTagText]}>
                  ⚡ {isSupplier ? 'FORNECEDOR CERTIFICADO' : 'PARTICIPANTE AUTORIZADO'}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
            onPress={handleSignOut}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>SAIR</Text>
          </Pressable>
        </View>

        {/* Hero Card - Status Biométrico */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroTitleGroup}>
              <Text style={styles.heroSubtitle}>SISTEMA DE SEGURANÇA</Text>
              <Text style={styles.heroTitle}>BIOMETRIA FACIAL</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusPillText}>OPERACIONAL</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.heroDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>DOCUMENTO REGISTADO</Text>
              <Text style={styles.detailValue}>{profile?.document || '---'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>NÍVEL DE ACESSO</Text>
              <Text style={styles.detailValueHighlight}>
                {isSupplier ? 'NÍVEL 2 - FORNECEDOR' : 'NÍVEL 1 - PADRÃO'}
              </Text>
            </View>
          </View>
        </View>

        {/* Métricas Rápidas */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>TAXA DE PRECISÃO</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>256-bit</Text>
            <Text style={styles.statLabel}>ENCRIPTAÇÃO</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#00C853' }]}>ATIVO</Text>
            <Text style={styles.statLabel}>ESTADO DA CHAVE</Text>
          </View>
        </View>

        {/* Ações Rápidas */}
        <Text style={styles.sectionTitle}>MÓDULOS DE AÇÃO</Text>
        <View style={styles.grid}>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => router.push('/reconhecimento')}
          >
            <View style={styles.actionIconWrapper}>
              <Text style={styles.actionIcon}>📸</Text>
            </View>
            <View style={styles.actionTextWrapper}>
              <Text style={styles.actionTitle}>VALIDAR ACESSO</Text>
              <Text style={styles.actionSub}>Escanear rosto para autenticação</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => router.push('/historico')}
          >
            <View style={styles.actionIconWrapper}>
              <Text style={styles.actionIcon}>📋</Text>
            </View>
            <View style={styles.actionTextWrapper}>
              <Text style={styles.actionTitle}>HISTÓRICO DE LOGS</Text>
              <Text style={styles.actionSub}>Consultar registos de entrada</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </Pressable>
        </View>

        {/* Banner Informativo */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxIcon}>🛡️</Text>
          <Text style={styles.infoBoxText}>
            Todos os acessos são monitorizados em tempo real e associados à sua chave biométrica criptografada.
          </Text>
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
    gap: 12,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00A8E8',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 168, 232, 0.4)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 168, 232, 0.2)',
    borderWidth: 1,
    borderColor: '#00A8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C853',
    borderWidth: 2,
    borderColor: '#070C18',
  },
  userTextContainer: {
    flex: 1,
    gap: 2,
  },
  welcomeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00A8E8',
    letterSpacing: 1.5,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  roleTag: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 2,
  },
  participantTag: {
    backgroundColor: 'rgba(0, 168, 232, 0.12)',
    borderColor: 'rgba(0, 168, 232, 0.3)',
  },
  supplierTag: {
    backgroundColor: 'rgba(255, 179, 0, 0.12)',
    borderColor: 'rgba(255, 179, 0, 0.3)',
  },
  roleTagText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  participantTagText: {
    color: '#00A8E8',
  },
  supplierTagText: {
    color: '#FFB300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
  },
  logoutButtonPressed: {
    backgroundColor: 'rgba(255, 68, 68, 0.25)',
  },
  logoutIcon: {
    fontSize: 12,
  },
  logoutText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF4444',
    letterSpacing: 1,
  },

  /* Hero Card */
  heroCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 18, 36, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.35)',
    gap: 14,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTitleGroup: {
    gap: 2,
  },
  heroSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00A8E8',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 200, 83, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 83, 0.3)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C853',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#00C853',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 168, 232, 0.15)',
  },
  heroDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#A0AAB5',
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailValueHighlight: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4CC9FE',
  },

  /* Métricas Rápidas */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 18, 36, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.2)',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#A0AAB5',
    letterSpacing: 0.8,
    textAlign: 'center',
  },

  /* Módulos de Ação */
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00A8E8',
    letterSpacing: 2,
    marginTop: 4,
  },
  grid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(10, 18, 36, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.3)',
    gap: 14,
  },
  actionCardPressed: {
    backgroundColor: 'rgba(0, 168, 232, 0.15)',
    borderColor: '#00A8E8',
  },
  actionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 168, 232, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionTextWrapper: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  actionSub: {
    fontSize: 10,
    color: '#A0AAB5',
  },
  actionArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: '#00A8E8',
  },

  /* Banner Informativo */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 168, 232, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.2)',
  },
  infoBoxIcon: {
    fontSize: 18,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 10,
    color: '#A0AAB5',
    lineHeight: 15,
  },
});