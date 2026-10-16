import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CircuitBackground } from '../components/circuitbackground';
import { useAuth } from '../context/authcontext';

const logoImg = require('../images/logo.jpg');

export default function Registro() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [userType, setUserType] = useState<'participante' | 'fornecedor'>('participante');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !document || !email || !password) {
      Alert.alert('Atenção', 'Por favor preencha todos os campos.');
      return;
    }

    setSubmitting(true);
    const { error } = await signUp(email, password, name, document, userType);
    setSubmitting(false);

    if (error) {
      Alert.alert('Erro no Registo', error.message || 'Não foi possível concluir o registo.');
    } else {
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'Ir para Login', onPress: () => router.replace('/login') },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <CircuitBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Pressable style={styles.logoWrapper} onPress={() => router.push('/')}>
            <View style={styles.outerRing} />
            <Image source={logoImg} style={styles.logo} />
          </Pressable>

          <Text style={styles.title}>EASYFACE</Text>
          <Text style={styles.subtitle}>CADASTRAR NOVO UTILIZADOR</Text>

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
              <Text style={styles.label}>
                {userType === 'participante' ? 'NOME COMPLETO' : 'RAZÃO SOCIAL / EMPRESA'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={userType === 'participante' ? 'Seu nome completo' : 'Empresa Exemplo Ltda'}
                placeholderTextColor="rgba(160, 170, 181, 0.6)"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {userType === 'participante' ? 'CPF' : 'CNPJ'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={userType === 'participante' ? '000.000.000-00' : '00.000.000/0001-00'}
                placeholderTextColor="rgba(160, 170, 181, 0.6)"
                value={document}
                onChangeText={setDocument}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="rgba(160, 170, 181, 0.6)"
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
                placeholderTextColor="rgba(160, 170, 181, 0.6)"
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
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>REGISTAR COMO {userType.toUpperCase()}</Text>
              )}
            </Pressable>
          </View>

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
  container: { flex: 1, backgroundColor: '#070C18' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  content: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderRadius: 28,
    backgroundColor: 'rgba(7, 12, 24, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.3)',
    maxWidth: 410,
    width: '100%',
  },
  logoWrapper: { position: 'relative', width: 90, height: 90, marginBottom: 16, alignItems: 'center', justifyContent: 'center' },
  outerRing: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 1.5, borderColor: 'rgba(0, 168, 232, 0.5)', borderStyle: 'dashed' },
  logo: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#00A8E8' },
  title: { marginBottom: 4, fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 4 },
  subtitle: { marginBottom: 20, fontSize: 10, fontWeight: '700', color: '#00A8E8', letterSpacing: 2 },
  tabContainer: { flexDirection: 'row', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(0, 168, 232, 0.2)' },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#00A8E8' },
  tabText: { fontSize: 10, fontWeight: '800', color: '#A0AAB5', letterSpacing: 1 },
  tabTextActive: { color: '#FFFFFF' },
  form: { width: '100%', gap: 12 },
  inputGroup: { gap: 4 },
  label: { fontSize: 10, color: '#00A8E8', fontWeight: '800', letterSpacing: 1 },
  input: { width: '100%', paddingVertical: 10, paddingHorizontal: 14, fontSize: 13, color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(0, 168, 232, 0.3)', borderRadius: 10 },
  button: { marginTop: 8, width: '100%', paddingVertical: 14, backgroundColor: '#00A8E8', borderRadius: 12, alignItems: 'center' },
  buttonPressed: { backgroundColor: '#00B8F8', opacity: 0.9 },
  buttonText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5 },
  footerContainer: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#A0AAB5' },
  linkText: { fontSize: 12, color: '#00A8E8', fontWeight: '800', textDecorationLine: 'underline' },
});