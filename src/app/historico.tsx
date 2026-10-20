import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router'; 
import { CircuitBackground } from '../components/circuitbackground';
import { useAuth } from '../context/authcontext';
import { supabase } from '../lib/supabase';

interface AccessLog {
  id: string;
  access_type: string;
  status: 'APROVADO' | 'RECUSADO';
  created_at: string;
}

export default function Historico() {
  const router = useRouter();
  const { user } = useAuth();
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('access_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLogs(data as AccessLog[]);
      }
    } catch (err) {
      console.error('Erro ao buscar logs:', err);
    } finally {
      setLoading(false);
    }
  };

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
      <CircuitBackground opacity={0.3} />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← VOLTAR</Text>
        </Pressable>
        <Text style={styles.headerTitle}>HISTÓRICO DE ACESSOS</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00A8E8" />
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum registro de acesso encontrado.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {logs.map((item) => (
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070C18' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  backButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(0, 168, 232, 0.15)', borderWidth: 1, borderColor: 'rgba(0, 168, 232, 0.3)' },
  backText: { fontSize: 11, fontWeight: '800', color: '#00A8E8' },
  headerTitle: { fontSize: 14, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1.5 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 13, color: '#A0AAB5', textAlign: 'center' },
  scrollContent: { padding: 20, gap: 12 },
  logCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 14, backgroundColor: 'rgba(7, 12, 24, 0.85)', borderWidth: 1, borderColor: 'rgba(0, 168, 232, 0.3)' },
  logMain: { gap: 4 },
  logType: { fontSize: 12, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  logDate: { fontSize: 11, color: '#A0AAB5' },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1 },
  badgeSuccess: { backgroundColor: 'rgba(0, 200, 83, 0.15)', borderColor: 'rgba(0, 200, 83, 0.4)' },
  badgeError: { backgroundColor: 'rgba(255, 68, 68, 0.15)', borderColor: 'rgba(255, 68, 68, 0.4)' },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  textSuccess: { color: '#00C853' },
  textError: { color: '#FF4444' },
});
