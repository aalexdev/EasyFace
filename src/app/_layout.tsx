import { Slot } from 'expo-router';
import { AuthProvider } from '../context/authcontext';

export default function Layout() {
  return (
    <AuthProvider>
      <Slot /> 
    </AuthProvider>
  );
}
