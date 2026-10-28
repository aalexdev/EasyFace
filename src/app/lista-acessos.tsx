import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { GradientBackground } from '../components/gradientbackground';

interface AccessUser {
  id: string;
  name: string;
  document: string;
  role: 'PARTICIPANTE' | 'FORNECEDOR';
  status: 'AUTORIZADO' | 'PENDENTE' | 'BLOQUEADO';
  lastAccess: string;
}

const INITIAL_USERS: AccessUser[] = [
  {
    id: '1',
    name: 'João da Silva',
    document: '123.456.789-00',
    role: 'PARTICIPANTE',
    status: 'AUTORIZADO',
    lastAccess: '19/10/2026 - 20:05',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    document: '987.654.321-11',
    role: 'FORNECEDOR',
    status: 'AUTORIZADO',
    lastAccess: '19/10/2026 - 19:42',
  },
  {
    id: '3',
    name: 'Carlos Eduardo',
    document: '456.789.123-22',
    role: 'PARTICIPANTE',
    status: 'PENDENTE',
    lastAccess: 'Sem registo',
  },
  {
    id: '4',
    name: 'Ana Beatriz Santos',
    document: '321.654.987-33',
    role: 'FORNECEDOR',
    status: 'BLOQUEADO',
    lastAccess: '17/10/2026 - 11:15',
  },
];

export default function ListaAcessos() {
  const router = useRouter();
  const [users, setUsers] = useState<AccessUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');

  // Retorno seguro
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/dashboard');
    }
  };

  // Alterna o status ao clicar no card
  const toggleUserStatus = (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === id) {
          const nextStatus: Record<AccessUser['status'], AccessUser['status']> = {
            AUTORIZADO: 'PENDENTE',
            PENDENTE: 'BLOQUEADO',
            BLOQUEADO: 'AUTORIZADO',
          };
          return { ...user, status: nextStatus[user.status] };
        }
        return user;
      })
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.document.includes(search)
  );

  const countAuthorized = users.filter((u) => u.status === 'AUTORIZADO').length;
  const countPending = users.filter((u) => u.status === 'PENDENTE').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050811" />
      <GradientBackground />

      <View style={styles.content}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack} hitSlop={12}>
            <Text style={styles.backButtonText}>← VOLTAR</Text>
          </Pressable>
          <Text style={styles.title}>LISTA DE ACESSOS</Text>
          <Text style={styles.subtitle}>GESTÃO DE PERMISSÕES E CREDENCIAIS</Text>
        </View>

        {/* MÉTRICAS RÁPIDAS */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>INSCRITOS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{countAuthorized}</Text>
            <Text style={styles.statLabel}>AUTORIZADOS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#00F0FF' }]}>{countPending}</Text>
            <Text style={styles.statLabel}>PENDENTES</Text>
          </View>
        </View>

        {/* CAMPO DE PESQUISA */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por nome ou CPF..."
            placeholderTextColor="#64748B"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* LISTA DE PARTICIPANTES */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isAuthorized = item.status === 'AUTORIZADO';
            const isPending = item.status === 'PENDENTE';
            const isBlocked = item.status === 'BLOQUEADO';
            const isSupplier = item.role === 'FORNECEDOR';

            return (
              <Pressable
                style={({ pressed }) => [
                  styles.userCard,
                  pressed && styles.userCardPressed,
                ]}
                onPress={() => toggleUserStatus(item.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userDoc}>CPF: {item.document}</Text>
                  </View>

                  <View
                    style={[
                      styles.roleTag,
                      isSupplier ? styles.roleSupplier : styles.roleParticipant,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTagText,
                        isSupplier ? styles.roleSupplierText : styles.roleParticipantText,
                      ]}
                    >
                      {item.role}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.lastAccessText}>Último acesso: {item.lastAccess}</Text>

                  <View
                    style={[
                      styles.statusBadge,
                      isAuthorized && styles.badgeAuthorized,
                      isPending && styles.badgePending,
                      isBlocked && styles.badgeBlocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isAuthorized && styles.textAuthorized,
                        isPending && styles.textPending,
                        isBlocked && styles.textBlocked,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050811' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16, width: '100%' },

  /* Header */
  header: { marginBottom: 16 },
  backButton: {
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backButtonText: { color: '#00F0FF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5 },
  subtitle: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1.2, marginTop: 2 },

  /* Stats */
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  statBox: { flex: 1, alignItems: 'center', gap: 2 },
  statNumber: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 8, fontWeight: '800', color: '#64748B', letterSpacing: 0.8, textAlign: 'center' },
  statDivider: { width: 1, height: 22, backgroundColor: 'rgba(255, 255, 255, 0.08)' },

  /* Search */
  searchContainer: { marginBottom: 14 },
  searchInput: {
    backgroundColor: 'rgba(13, 20, 36, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    minHeight: 44,
    color: '#FFFFFF',
    fontSize: 13,
  },

  /* List Cards */
  listContainer: { gap: 10, paddingBottom: 24 },
  userCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(13, 20, 36, 0.65)',
    gap: 12,
  },
  userCardPressed: {
    backgroundColor: 'rgba(0, 240, 255, 0.04)',
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  userInfo: { gap: 2, flex: 1 },
  userName: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  userDoc: { fontSize: 10, color: '#64748B' },

  /* Role Tags */
  roleTag: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4, borderWidth: 1 },
  roleParticipant: { backgroundColor: 'rgba(0, 240, 255, 0.05)', borderColor: 'rgba(0, 240, 255, 0.2)' },
  roleSupplier: { backgroundColor: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' },
  roleTagText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  roleParticipantText: { color: '#00F0FF' },
  roleSupplierText: { color: '#F59E0B' },

  /* Card Footer & Badges */
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 10,
  },
  lastAccessText: { fontSize: 9, color: '#64748B', fontWeight: '600' },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  badgeAuthorized: { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' },
  badgePending: { backgroundColor: 'rgba(0, 240, 255, 0.08)', borderColor: 'rgba(0, 240, 255, 0.25)' },
  badgeBlocked: { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.25)' },

  statusText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  textAuthorized: { color: '#10B981' },
  textPending: { color: '#00F0FF' },
  textBlocked: { color: '#EF4444' },
});