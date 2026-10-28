import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { GradientBackground } from '../components/gradientbackground';

export default function Login() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Modos de Login: 'biometric' ou 'password'
  const [authMethod, setAuthMethod] = useState<'biometric' | 'password'>('biometric');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulação de autenticação
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/dashboard');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050811" />
      <GradientBackground />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.card, { maxWidth: isTablet ? 440 : '100%' }]}>
              {/* Header do Card */}
              <View style={styles.header}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>EASYFACE BIOMETRICS</Text>
                </View>
                <Text style={styles.title}>AUTENTICAÇÃO</Text>
                <Text style={styles.subtitle}>
                  Selecione o método para aceder à plataforma
                </Text>
              </View>

              {/* Selector de Método de Login */}
              <View style={styles.tabContainer}>
                <Pressable
                  style={[
                    styles.tabButton,
                    authMethod === 'biometric' && styles.tabButtonActive,
                  ]}
                  onPress={() => setAuthMethod('biometric')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      authMethod === 'biometric' && styles.tabTextActive,
                    ]}
                  >
                    BIOMETRIA
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.tabButton,
                    authMethod === 'password' && styles.tabButtonActive,
                  ]}
                  onPress={() => setAuthMethod('password')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      authMethod === 'password' && styles.tabTextActive,
                    ]}
                  >
                    SENHA
                  </Text>
                </Pressable>
              </View>

              {/* Formulário Estável */}
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CPF / DOCUMENTO</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="000.000.000-00"
                    placeholderTextColor="#64748B"
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {authMethod === 'password' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>SENHA DE ACESSO</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#64748B"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                )}

                <Pressable
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.submitButtonPressed,
                    isLoading && styles.submitButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.submitText}>
                    {isLoading
                      ? 'A PROCESSAR...'
                      : authMethod === 'biometric'
                      ? 'INICIAR RECONHECIMENTO'
                      : 'ENTRAR NO SISTEMA'}
                  </Text>
                </Pressable>
              </View>

              {/* Link de Registo */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Ainda não tem conta?</Text>
                <Pressable onPress={() => router.push('/registro')}>
                  <Text style={styles.linkText}>CRIAR REGISTO</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(13, 20, 36, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 20,
  },

  /* Header */
  header: { alignItems: 'center', gap: 6 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  badgeText: { fontSize: 8, fontWeight: '800', color: '#00F0FF', letterSpacing: 1.5 },
  title: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5, marginTop: 4 },
  subtitle: { fontSize: 11, color: '#94A3B8', textAlign: 'center' },

  /* Tabs */
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(5, 8, 17, 0.6)',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  tabText: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  tabTextActive: { color: '#00F0FF' },

  /* Form */
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  label: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  input: {
    width: '100%',
    height: 46,
    backgroundColor: 'rgba(5, 8, 17, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 13,
  },

  /* Submit Button */
  submitButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#00F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  submitButtonPressed: { opacity: 0.85 },
  submitButtonDisabled: { opacity: 0.5 },
  submitText: { fontSize: 11, fontWeight: '800', color: '#050811', letterSpacing: 1.2 },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: { fontSize: 11, color: '#64748B' },
  linkText: { fontSize: 11, fontWeight: '800', color: '#00F0FF', letterSpacing: 0.5 },
});
