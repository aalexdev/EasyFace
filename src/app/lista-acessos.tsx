import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';

interface Participant {
  id: string;
  name: string;
  document: string;
  accessed: boolean;
  accessTime?: string;
}

const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    name: 'Carlos Eduardo Silva',
    document: '123.456.789-00',
    accessed: true,
    accessTime: '19/10/2026 - 20:05',
  },
  {
    id: '2',
    name: 'Ana Beatriz Santos',
    document: '987.654.321-11',
    accessed: false,
  },
  {
    id: '3',
    name: 'Lucas Ferreira Lima',
    document: '456.789.123-22',
    accessed: false,
  },
];

export default function ListaAcessos() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredParticipants = INITIAL_PARTICIPANTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.document.includes(search)
  );

  const totalAccessed = INITIAL_PARTICIPANTS.filter((p) => p.accessed).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050811" />
      <CircuitBackground opacity={0.2} />

      <View style={styles.content}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← VOLTAR</Text>
          </Pressable>
          <Text style={styles.title}>LISTA DE ACESSOS</Text>
          <Text style={styles.subtitle}>MONITORIZAÇÃO DE PRESENÇA EM TEMPO REAL</Text>
        </View>

        {/* RESUMO / CONTADOR */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {totalAccessed} / {INITIAL_PARTICIPANTS.length}
            </Text>
            <Text style={styles.statLabel}>ACESSOS CONFIRMADOS</Text>
          </View>
          <View style={styles.badgeLive}>
            <View style={styles.dotLive} />
            <Text style={styles.badgeLiveText}>LIVE</Text>
          </View>
        </View>

        {/* CAMPO DE PESQUISA */}
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por nome ou documento..."
          placeholderTextColor="#64748B"
          value={search}
          onChangeText={setSearch}
        />

        {/* LISTA DE PARTICIPANTES */}
        <FlatList
          data={filteredParticipants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.participantCard,
                item.accessed ? styles.cardAccessed : styles.cardPending,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userDoc}>DOC: {item.document}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.accessed ? styles.badgeGreen : styles.badgeBlue,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.accessed ? styles.textGreen : styles.textBlue,
                    ]}
                  >
                    {item.accessed ? 'CONFIRMADO' : 'PENDENTE'}
                  </Text>
                </View>
              </View>

              {item.accessed && item.accessTime && (
                <Text style={styles.timeText}>Entrada: {item.accessTime}</Text>
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  content: { flex: 1, padding: 20, maxWidth: 720, width: '100%', alignSelf: 'center' },
  header: { marginBottom: 20 },
  backButton: {
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  backButtonText: { color: '#00F0FF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5 },
  subtitle: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.2, marginTop: 2 },
  
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 20, 36, 0.6)',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  statBox: { gap: 2 },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 8, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  dotLive: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  badgeLiveText: { color: '#10B981', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 16,
  },
  listContainer: { gap: 10, paddingBottom: 20 },
  participantCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(13, 20, 36, 0.6)',
  },
  cardAccessed: {
    borderColor: 'rgba(16, 185, 129, 0.25)',
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
  },
  cardPending: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { gap: 2, flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  userDoc: { fontSize: 11, color: '#64748B' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  badgeGreen: { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' },
  badgeBlue: { backgroundColor: 'rgba(0, 240, 255, 0.05)', borderColor: 'rgba(0, 240, 255, 0.2)' },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  textGreen: { color: '#10B981' },
  textBlue: { color: '#00F0FF' },
  timeText: { marginTop: 8, fontSize: 10, color: '#10B981', fontWeight: '600' },
});