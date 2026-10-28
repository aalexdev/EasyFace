import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { GradientBackground } from '../components/gradientbackground';

export default function Login() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  
  // Breakpoints de responsividade
  const isTablet = width >= 768;
  const isSmallScreen = width < 360;

  // Estados
  const [authMethod, setAuthMethod] = useState<'biometric' | 'password'>('biometric');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/dashboard');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1128" />
      <GradientBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: height - (StatusBar.currentHeight || 0) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.card,
              {
                maxWidth: isTablet ? 460 : 400,
                padding: isSmallScreen ? 18 : 28,
              },
            ]}
          >
            {/* Header do Card */}
            <View style={styles.header}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>EASYFACE BIOMETRICS</Text>
              </View>
              <Text style={[styles.title, isSmallScreen && { fontSize: 18 }]}>
                AUTENTICAÇÃO
              </Text>
              <Text style={styles.subtitle}>
                Aceda à sua conta ou utilize o reconhecimento facial
              </Text>
            </View>

            {/* Selector de Método (Tabs) */}
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

            {/* Rodapé / Link de Registo */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem conta?</Text>
              <Pressable
                onPress={() => router.push('/registro')}
                style={({ pressed }) => [
                  styles.linkButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.linkText}>CRIAR REGISTO</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(10, 17, 40, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    gap: 20,
    alignSelf: 'center',
  },

  /* Header */
  header: {
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00F0FF',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* Tabs */
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(3, 5, 10, 0.6)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 44, // Target de toque mobile acessível
  },
  tabButtonActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.35)',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#00F0FF',
  },

  /* Form */
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    height: 48, // Mínimo acessível touch target
    backgroundColor: 'rgba(3, 5, 10, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },

  /* Submit Button */
  submitButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#00F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#03050A',
    letterSpacing: 1.2,
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
  },
  linkButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00F0FF',
    letterSpacing: 0.5,
  },
});
