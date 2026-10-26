import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';

interface AccessLog {
  id: string;
  access_type: string;
  status: 'APROVADO' | 'RECUSADO';
  created_at: string;
}

const MOCK_LOGS: AccessLog[] = [
  {
    id: '1',
    access_type: 'Validação Facial',
    status: 'APROVADO',
    created_at: '2026-10-19T20:05:00Z',
  },
  {
    id: '2',
    access_type: 'Validação Facial',
    status: 'APROVADO',
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: '3',
    access_type: 'Validação Facial',
    status: 'RECUSADO',
    created_at: '2026-10-15T09:12:00Z',
  },
];

export default function Historico() {
  const router = useRouter();

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CircuitBackground opacity={0.2} />

      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← VOLTAR</Text>
          </Pressable>
          <Text style={styles.headerTitle}>HISTÓRICO DE LOGS</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {MOCK_LOGS.map((item) => (
            <View key={item.id} style={styles.logCard}>
              <View style={styles.logMain}>
                <Text style={styles.logType}>{item.access_type.toUpperCase()}</Text>
                <Text style={styles.logDate}>{formatDate(item.created_at)}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  item.status === 'APROVADO' ? styles.badgeSuccess : styles.badgeError,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.status === 'APROVADO' ? styles.textSuccess : styles.textError,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  contentWrapper: { flex: 1, maxWidth: 720, width: '100%', alignSelf: 'center' },
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
  scrollContent: { padding: 20, gap: 10 },
  logCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 20, 36, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  logMain: { gap: 4 },
  logType: { fontSize: 11, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.8 },
  logDate: { fontSize: 11, color: '#64748B' },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1 },
  badgeSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' },
  badgeError: { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.25)' },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  textSuccess: { color: '#10B981' },
  textError: { color: '#EF4444' },
});