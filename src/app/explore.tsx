import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircuitBackground } from '../components/circuitbackground';

export default function ExploreScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.contentContainer, { paddingTop: safeAreaInsets.top + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <CircuitBackground opacity={0.2} />

      <View style={styles.container}>
        <Text style={styles.title}>SOBRE O EASYFACE</Text>
        <Text style={styles.subtitle}>SISTEMA DE AUTENTICAÇÃO BIOMÉTRICA</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.badgeText}>COMPLIANCE</Text>
            <Text style={styles.cardTitle}>Segurança e Proteção de Dados (LGPD)</Text>
          </View>
          <Text style={styles.cardText}>
            O EasyFace foi desenhado sob rigorosos padrões de segurança, convertendo dados faciais em representações vetoriais criptografadas (*embeddings*), garantindo total privacidade e conformidade com a LGPD.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.badgeText}>STACK</Text>
            <Text style={styles.cardTitle}>Arquitetura e Tecnologia</Text>
          </View>
          <Text style={styles.cardText}>
            Desenvolvido utilizando React Native / Expo para multiplataforma (Mobile e Web), com suporte a estilização modular e navegação fluida em tempo real.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#050811' },
  contentContainer: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  container: { maxWidth: 680, width: '100%', gap: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: 2, textAlign: 'center' },
  subtitle: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.5, textAlign: 'center', marginBottom: 12 },
  card: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(13, 20, 36, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  cardHeader: { gap: 4 },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#00F0FF', letterSpacing: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  cardText: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
});