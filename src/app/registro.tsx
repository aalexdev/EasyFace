import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
  View,
} from 'react-native';
import { CircuitBackground } from '../components/circuitbackground';

const logoImg = require('../images/logo.jpg');

export default function Registro() {
  const router = useRouter();

  const [userType, setUserType] = useState<'participante' | 'fornecedor'>('participante');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = () => {
    if (!name || !document || !email || !password) {
      Alert.alert('Atenção', 'Por favor preencha todos os campos.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'Ir para Login', onPress: () => router.replace('/login') },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050811" />
      <CircuitBackground opacity={0.2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentCard}>
              {/* LOGO */}
              <Pressable style={styles.logoWrapper} onPress={() => router.push('/')}>
                <Image source={logoImg} style={styles.logo} />
              </Pressable>

              <Text style={styles.title}>EASYFACE</Text>
              <Text style={styles.subtitle}>CADASTRAR NOVO UTILIZADOR</Text>

              {/* SELETOR DE TIPO */}
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

              {/* FORMULÁRIO */}
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {userType === 'participante' ? 'NOME COMPLETO' : 'RAZÃO SOCIAL / EMPRESA'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={userType === 'participante' ? 'Seu nome completo' : 'Empresa Exemplo Ltda'}
                    placeholderTextColor="#64748B"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{userType === 'participante' ? 'CPF' : 'CNPJ'}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={userType === 'participante' ? '000.000.000-00' : '00.000.000/0001-00'}
                    placeholderTextColor="#64748B"
                    value={document}
                    onChangeText={setDocument}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>E-MAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="seuemail@exemplo.com"
                    placeholderTextColor="#64748B"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PALAVRA-PASSE</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#64748B"
                    secureTextEntry
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                  onPress={handleRegister}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#050811" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>REGISTAR COMO {userType.toUpperCase()}</Text>
                  )}
                </Pressable>
              </View>

              {/* FOOTER */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Já tem uma conta? </Text>
                <Pressable onPress={() => router.push('/login')} hitSlop={10}>
                  <Text style={styles.linkText}>Faça Login</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  contentCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(13, 20, 36, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  logoWrapper: { width: 64, height: 64, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 60, height: 60, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
  title: { marginBottom: 2, fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: 3 },
  subtitle: { marginBottom: 18, fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.5, textAlign: 'center' },

  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabButton: { flex: 1, minHeight: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  tabText: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  tabTextActive: { color: '#FFFFFF' },

  form: { width: '100%', gap: 14 },
  inputGroup: { gap: 6 },
  label: { fontSize: 9, color: '#64748B', fontWeight: '800', letterSpacing: 1 },
  input: {
    width: '100%',
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
  },
  button: {
    marginTop: 6,
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: '#00F0FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 11, fontWeight: '800', color: '#050811', letterSpacing: 1.2 },

  footerContainer: { flexDirection: 'row', marginTop: 20, alignItems: 'center', paddingVertical: 4 },
  footerText: { fontSize: 12, color: '#64748B' },
  linkText: { fontSize: 12, color: '#00F0FF', fontWeight: '700' },
});