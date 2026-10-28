import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GradientBackground } from '../components/gradientbackground';

interface AccessLog {
  id: string;
  access_type: string;
  status: 'APROVADO' | 'RECUSADO';
  created_at: string;
  location: string;
}

const MOCK_LOGS: AccessLog[] = [
  {
    id: '1',
    access_type: 'Validação Facial',
    status: 'APROVADO',
    location: 'Portaria Principal - Acesso A',
    created_at: '19/10/2026 - 20:05:12',
  },
  {
    id: '2',
    access_type: 'Validação Facial',
    status: 'APROVADO',
    location: 'Catraca 02 - Bloco B',
    created_at: '19/10/2026 - 18:30:45',
  },
  {
    id: '3',
    access_type: 'Leitura Invalida',
    status: 'RECUSADO',
    location: 'Terminal Sul - Entrada 01',
    created_at: '18/10/2026 - 14:12:08',
  },
  {
    id: '4',
    access_type: 'Validação Facial',
    status: 'APROVADO',
    location: 'Portaria Principal - Acesso A',
    created_at: '18/10/2026 - 08:15:30',
  },
];

export default function Historico() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/dashboard');
    }
  };

  const totalLogs = MOCK_LOGS.length;
  const approvedCount = MOCK_LOGS.filter((l) => l.status === 'APROVADO').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050811" />
      <GradientBackground />

      <View style={styles.content}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack} hitSlop={12}>
            <Text style={styles.backButtonText}>← VOLTAR</Text>
          </Pressable>
          <Text style={styles.title}>HISTÓRICO DE LOGS</Text>
          <Text style={styles.subtitle}>REGISTOS CRIPTOGRAFADOS DE REGISTO DE ENTRADA</Text>
        </View>

        {/* RESUMO DE REGISTOS */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalLogs}</Text>
            <Text style={styles.statLabel}>TOTAL DE EVENTOS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{approvedCount}</Text>
            <Text style={styles.statLabel}>APROVADOS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>
              {totalLogs - approvedCount}
            </Text>
            <Text style={styles.statLabel}>RECUSADOS</Text>
          </View>
        </View>

        {/* LISTA DE EVENTOS DE LOG */}
        <FlatList
          data={MOCK_LOGS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isApproved = item.status === 'APROVADO';

            return (
              <View
                style={[
                  styles.logCard,
                  isApproved ? styles.cardApproved : styles.cardRefused,
                ]}
              >
                <View style={styles.logHeader}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.logType}>{item.access_type}</Text>
                    <Text style={styles.logLocation}>{item.location}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      isApproved ? styles.badgeApproved : styles.badgeRefused,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isApproved ? styles.textApproved : styles.textRefused,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.logFooter}>
                  <Text style={styles.timestampText}>Timestamp: {item.created_at}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16, width: '100%' },

  /* Header */
  header: { marginBottom: 16 },
  backButton: {
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backButtonText: { color: '#00F0FF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5 },
  subtitle: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.2, marginTop: 2 },

  /* Resumo Stats */
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  statBox: { flex: 1, alignItems: 'center', gap: 2 },
  statNumber: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 8, fontWeight: '800', color: '#64748B', letterSpacing: 0.8, textAlign: 'center' },
  statDivider: { width: 1, height: 22, backgroundColor: 'rgba(255, 255, 255, 0.08)' },

  /* Lista de Cards */
  listContainer: { gap: 10, paddingBottom: 24 },
  logCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    gap: 10,
  },
  cardApproved: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  cardRefused: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  typeInfo: { gap: 2, flex: 1 },
  logType: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  logLocation: { fontSize: 10, color: '#64748B' },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  badgeApproved: { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' },
  badgeRefused: { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.25)' },
  statusText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  textApproved: { color: '#10B981' },
  textRefused: { color: '#EF4444' },

  logFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 8,
  },
  timestampText: { fontSize: 9, color: '#64748B', fontWeight: '600' },
});