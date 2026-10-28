import { useRouter } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { GradientBackground } from '../components/gradientbackground';

export default function ExploreScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050811" />
      <GradientBackground />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { maxWidth: isTablet ? 680 : '100%' }]}>
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
              onPress={handleBack}
              hitSlop={12}
            >
              <Text style={styles.backButtonText}>← VOLTAR</Text>
            </Pressable>
            <Text style={styles.title}>SOBRE O EASYFACE</Text>
            <Text style={styles.subtitle}>SISTEMA DE AUTENTICAÇÃO BIOMÉTRICA</Text>
          </View>

          {/* CARD COMPLIANCE */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>COMPLIANCE</Text>
              </View>
              <Text style={styles.cardTitle}>Segurança e Proteção de Dados (LGPD)</Text>
            </View>
            <Text style={styles.cardText}>
              O EasyFace foi desenhado sob rigorosos padrões de segurança, convertendo dados faciais em representações vetoriais criptografadas (*embeddings*), garantindo total privacidade e conformidade com a LGPD.
            </Text>
          </View>

          {/* CARD STACK */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>STACK</Text>
              </View>
              <Text style={styles.cardTitle}>Arquitetura e Tecnologia</Text>
            </View>
            <Text style={styles.cardText}>
              Desenvolvido utilizando React Native e Expo para o ecossistema nativo mobile (iOS e Android), com suporte a componentes modulares, animações fluidas e alta performance.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  content: { width: '100%', gap: 14 },

  /* Header */
  header: { marginBottom: 4 },
  backButton: {
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonPressed: {
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  backButtonText: { color: '#00F0FF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5 },
  subtitle: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.2, marginTop: 2 },

  /* Cards */
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  cardHeader: { gap: 6 },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
  },
  badgeText: { fontSize: 8, fontWeight: '800', color: '#00F0FF', letterSpacing: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  cardText: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
});