import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';

export default function Dashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [profile] = useState({
    name: 'João da Silva',
    document: '123.456.789-00',
    user_type: 'participante',
  });

  const handleSignOut = () => {
    router.replace('/login');
  };

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
      <CircuitBackground opacity={0.2} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainWrapper, { maxWidth: isDesktop ? 1040 : '100%' }]}>
          {/* Header Minimalista */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{userInitials}</Text>
                </View>
                <View style={styles.onlineBadge} />
              </View>

              <View style={styles.userTextContainer}>
                <Text style={styles.welcomeText}>PAINEL DE CONTROLO</Text>
                <Text style={styles.userName} numberOfLines={1}>
                  {profile?.name}
                </Text>
                <View
                  style={[
                    styles.roleTag,
                    isSupplier ? styles.supplierTag : styles.participantTag,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleTagText,
                      isSupplier ? styles.supplierTagText : styles.participantTagText,
                    ]}
                  >
                    {isSupplier ? 'FORNECEDOR CERTIFICADO' : 'PARTICIPANTE AUTORIZADO'}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
              onPress={handleSignOut}
            >
              <Text style={styles.logoutText}>ENCRERRAR SESSÃO</Text>
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
                <Text style={styles.detailValue}>{profile?.document}</Text>
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
              <Text style={styles.statLabel}>PRECISÃO</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>256-bit</Text>
              <Text style={styles.statLabel}>ENCRIPTAÇÃO</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>ATIVO</Text>
              <Text style={styles.statLabel}>CHAVE BIOMÉTRICA</Text>
            </View>
          </View>

          {/* Módulos de Ação Grid Responsivo */}
          <Text style={styles.sectionTitle}>MÓDULOS DE AÇÃO</Text>
          <View style={styles.grid}>
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                isDesktop && styles.actionCardDesktop,
                pressed && styles.actionCardPressed,
              ]}
              onPress={() => router.push('/reconhecimento')}
            >
              <View style={styles.actionTag}>
                <Text style={styles.actionTagText}>SCAN</Text>
              </View>
              <View style={styles.actionTextWrapper}>
                <Text style={styles.actionTitle}>VALIDAR ACESSO</Text>
                <Text style={styles.actionSub}>Escanear rosto para autenticação</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                isDesktop && styles.actionCardDesktop,
                pressed && styles.actionCardPressed,
              ]}
              onPress={() => router.push('/historico')}
            >
              <View style={styles.actionTag}>
                <Text style={styles.actionTagText}>LOGS</Text>
              </View>
              <View style={styles.actionTextWrapper}>
                <Text style={styles.actionTitle}>HISTÓRICO DE LOGS</Text>
                <Text style={styles.actionSub}>Consultar registos de entrada</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                isDesktop && styles.actionCardDesktop,
                pressed && styles.actionCardPressed,
              ]}
              onPress={() => router.push('/lista-acessos')}
            >
              <View style={styles.actionTag}>
                <Text style={styles.actionTagText}>LIST</Text>
              </View>
              <View style={styles.actionTextWrapper}>
                <Text style={styles.actionTitle}>LISTA DE ACESSOS</Text>
                <Text style={styles.actionSub}>Lista completa de participantes</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>
          </View>

          {/* Banner Informativo */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTag}>SECURE</Text>
            <Text style={styles.infoBoxText}>
              Todos os acessos são monitorizados em tempo real e associados à sua chave biométrica criptografada.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  scrollContent: { padding: 20, paddingBottom: 40, alignItems: 'center' },
  mainWrapper: { width: '100%', gap: 20 },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1 },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#050811',
  },
  userTextContainer: { flex: 1, gap: 2 },
  welcomeText: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.5 },
  userName: { fontSize: 17, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  roleTag: { alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, borderWidth: 1, marginTop: 2 },
  participantTag: { backgroundColor: 'rgba(0, 240, 255, 0.05)', borderColor: 'rgba(0, 240, 255, 0.2)' },
  supplierTag: { backgroundColor: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' },
  roleTagText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  participantTagText: { color: '#00F0FF' },
  supplierTagText: { color: '#F59E0B' },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutButtonPressed: { backgroundColor: 'rgba(239, 68, 68, 0.16)' },
  logoutText: { fontSize: 9, fontWeight: '800', color: '#EF4444', letterSpacing: 1 },

  /* Hero Card */
  heroCard: {
    padding: 22,
    borderRadius: 16,
    backgroundColor: 'rgba(13, 20, 36, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 16,
  },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroTitleGroup: { gap: 2 },
  heroSubtitle: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.5 },
  heroTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusPillText: { fontSize: 9, fontWeight: '800', color: '#10B981', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)' },
  heroDetails: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  detailItem: { flex: 1, gap: 2 },
  detailLabel: { fontSize: 8, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  detailValue: { fontSize: 12, fontWeight: '700', color: '#E2E8F0' },
  detailValueHighlight: { fontSize: 11, fontWeight: '800', color: '#00F0FF' },

  /* Metrics */
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 20, 36, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  statLabel: { fontSize: 8, fontWeight: '800', color: '#64748B', letterSpacing: 0.8, textAlign: 'center' },

  /* Actions */
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 2, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(13, 20, 36, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 14,
  },
  actionCardDesktop: { width: '32%', flexGrow: 1 },
  actionCardPressed: { backgroundColor: 'rgba(0, 240, 255, 0.05)', borderColor: 'rgba(0, 240, 255, 0.3)' },
  actionTag: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionTagText: { fontSize: 9, fontWeight: '800', color: '#00F0FF', letterSpacing: 1 },
  actionTextWrapper: { flex: 1, gap: 2 },
  actionTitle: { fontSize: 12, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.8 },
  actionSub: { fontSize: 10, color: '#94A3B8' },
  actionArrow: { fontSize: 16, color: '#64748B' },

  /* Banner */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  infoBoxTag: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  infoBoxText: { flex: 1, fontSize: 10, color: '#94A3B8', lineHeight: 15 },
});