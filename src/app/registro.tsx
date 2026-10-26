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
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.linkText}>Faça Login</Text>
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
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderRadius: 20,
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    maxWidth: 410,
    width: '100%',
  },
  logoWrapper: { width: 68, height: 68, marginBottom: 14, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 64, height: 64, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
  title: { marginBottom: 2, fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: 3 },
  subtitle: { marginBottom: 20, fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.5 },

  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  tabText: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  tabTextActive: { color: '#FFFFFF' },

  form: { width: '100%', gap: 12 },
  inputGroup: { gap: 4 },
  label: { fontSize: 9, color: '#64748B', fontWeight: '800', letterSpacing: 1 },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
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

  footerContainer: { flexDirection: 'row', marginTop: 18, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#64748B' },
  linkText: { fontSize: 11, color: '#00F0FF', fontWeight: '700' },
});