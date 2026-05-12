// src/screens/AuthScreens/RoleSelectionScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar, Animated,
  Image,
} from 'react-native';
import AppBackground from '../../components/AppBackground';
import GlassCard from '../../components/GlassCard';
import { useDispatch } from 'react-redux';

import agentImg from '../../assets/images/businessman.png';
import employeeImg from '../../assets/images/manager.png';
import customerImg from '../../assets/images/man.png';
import RoleButton from "../../components/RoleButton";
import { setRole } from '../../features/auth/authSlice';

const ROLES = [
  {
    id: 'AGENT',
    label: 'Agent',
    image: agentImg,
    bg: ['#1565C0', '#1E88E5'],
    border: 'rgba(100,180,255,0.6)',
    glow: '#42A5F5',
    labelColor: '#fff',
  },
  {
    id: 'EMPLOYEE',
    label: 'Employee',
    image: employeeImg,
    bg: ['#FFF3E0', '#FFE0B2'],
    border: 'rgba(255,180,100,0.5)',
    glow: '#FFB74D',
    labelColor: '#1A237E',
  },
  {
    id: 'CUSTOMER',
    label: 'Customer',
    image: customerImg,
    bg: ['#1565C0', '#26C6DA'],
    border: 'rgba(100,220,255,0.6)',
    glow: '#26C6DA',
    labelColor: '#fff',
  },
];

const RoleSelectionScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch()

  const handleSelect = (id) => {
    setSelected(id);
     dispatch(setRole(id)); // save selected role
    // { role: id }
    setTimeout(() => {
      navigation?.navigate('Register');
    }, 180);
  };

  return (
    <AppBackground>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>

        {/* ── Logo ── */}
        <View style={styles.logoArea}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoEmoji}>🛡️</Text>
          </View>
          <Text style={styles.logoTitle}>Tia</Text>
          <Text style={styles.logoSub}>One App. All Insurance. Zero Hassle.</Text>
        </View>

        {/* ── Glass Card ── */}
        <GlassCard>

          <Text style={styles.cardTitle}>SELECT YOUR ROLE</Text>

          {/* Row 1: Agent + Employee */}
          <View style={styles.row}>
            {ROLES.slice(0, 2).map(role => (
              <RoleButton
                key={role.id}
                role={role}
                selected={selected === role.id}
                onPress={() => handleSelect(role.id)}
              />
            ))}
          </View>

          {/* Row 2: Customer centred */}
          <View style={[styles.row, styles.rowCentered]}>
            <RoleButton
              role={ROLES[2]}
              selected={selected === ROLES[2].id}
              onPress={() => handleSelect(ROLES[2].id)}
            />
          </View>

        </GlassCard>

      </View>
    </AppBackground>
  );
};



/* ─── Styles ──────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  // Logo
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    // shadowColor: '#42A5F5', shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  logoEmoji: { fontSize: 40 },
  logoTitle: {
    fontSize: 38, fontWeight: '800', color: '#fff', letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  logoSub: {
    fontSize: 11, color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.4, marginTop: 3,
  },

  // Glass card
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    padding: 22,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.2, shadowRadius: 20, elevation: 12,
  },

  cardTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },

  // Grid rows
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 14,
  },
  rowCentered: {
    justifyContent: 'center',
    marginBottom: 0,
  },

  
});

export default RoleSelectionScreen;