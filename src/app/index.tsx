import React from 'react';  
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';      
import { useRouter } from 'expo-router';   
import { CircuitBackground } from '../components/circuitbackground';       
   
const logoImg = require('../images/logo.jpg'); 
    
export default function Home() {    
  const router = useRouter();  
      
  return ( 
    <View style={styles.container}>   
      <CircuitBackground /> 
 
      <View style={styles.content}>
        <View style={styles.logoWrapper}> 
          <View style={styles.outerRing} />
          <Image source={logoImg} style={styles.logo} />
        </View>

        <Text style={styles.title}>EASYFACE</Text>

        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>SISTEMA BIOMÉTRICO ATIVO</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>LOGIN / REGISTO</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070C18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    zIndex: 2, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    borderRadius: 28,
    backgroundColor: 'rgba(7, 12, 24, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.3)',
    maxWidth: 400,
    width: '88%',
  },
  logoWrapper: {
    position: 'relative',
    width: 150,
    height: 150,
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 166,
    height: 166,
    borderRadius: 83,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 168, 232, 0.5)',
    borderStyle: 'dashed',
  },
  logo: {
    width: 135,
    height: 135,
    borderRadius: 67.5,
    borderWidth: 2.5, 
    borderColor: '#00A8E8',
  },
  title: {
    marginBottom: 6,
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  badge: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
    backgroundColor: 'rgba(0, 168, 232, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 232, 0.25)', 
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C853',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00A8E8',
    letterSpacing: 2,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#00A8E8',
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#00B8F8',
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});
