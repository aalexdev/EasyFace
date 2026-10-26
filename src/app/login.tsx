import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';

const logoImg = require('../images/logo.jpg');

export default function Login() {
  const router = useRouter();

  const [userType, setUserType] = useState<'participante' | 'fornecedor'>('participante');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor preencha o e-mail e a palavra-passe.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      router.replace('/dashboard');
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <CircuitBackground opacity={0.2} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Pressable style={styles.logoWrapper} onPress={() => router.push('/')}>
            <Image source={logoImg} style={styles.logo} />
          </Pressable>

          <Text style={styles.title}>EASYFACE</Text>
          <Text style={styles.subtitle}>AUTENTICAÇÃO DE ACESSO</Text>

          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tabButton, userType === 'participante' && styles.tabActive]}
              onPress={() => setUserType('participante')}
            >
              <Text style={[styles.tabText, userType === 'participante' && styles.tabTextActive]}>
                PARTICIPANTE
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabButton, userType === 'fornecedor' && styles.tabActive]}
              onPress={() => setUserType('fornecedor')}
            >
              <Text style={[styles.tabText, userType === 'fornecedor' && styles.tabTextActive]}>
                FORNECEDOR
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PALAVRA-PASSE</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748B"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleLogin}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#050811" size="small" />
              ) : (
                <Text style={styles.buttonText}>ENTRAR COMO {userType.toUpperCase()}</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Não está registado? </Text>
            <Pressable onPress={() => router.push('/registro')}>
              <Text style={styles.linkText}>Registe-se</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  content: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 28,
    borderRadius: 20,
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    maxWidth: 410,
    width: '100%',
  },
  logoWrapper: { width: 72, height: 72, marginBottom: 16, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 68, height: 68, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
  title: { marginBottom: 2, fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: 3 },
  subtitle: { marginBottom: 24, fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.5 },
  
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  tabText: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  tabTextActive: { color: '#FFFFFF' },
  
  form: { width: '100%', gap: 14 },
  inputGroup: { gap: 6 },
  label: { fontSize: 9, color: '#64748B', fontWeight: '800', letterSpacing: 1 },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
  },
  button: {
    marginTop: 8,
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#00F0FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 11, fontWeight: '800', color: '#050811', letterSpacing: 1.2 },
  
  footerContainer: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#64748B' },
  linkText: { fontSize: 11, color: '#00F0FF', fontWeight: '700' },
});