import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { memo, useState } from 'react'
import GlassCard from '../../components/GlassCard'
import { useNavigation } from '@react-navigation/native';

const HomeComponent = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);

  const CATEGORIES = [
    { id: 'InsuranceCalculator', label: 'Fire', icon: '🔥', bg: '#C62828', border: '#E53935' },
    { id: 'home', label: 'Home', icon: '🏠', bg: 'rgba(255,255,255,0.2)', border: 'rgba(255,255,255,0.5)' },
    { id: 'IARCalculator', label: 'Shop', icon: '🏪', bg: 'rgba(255,235,205,0.55)', border: 'rgba(255,200,150,0.6)' },
    { id: 'BusinessCalculator', label: 'Business', icon: '🏢', bg: '#1565C0', border: '#42A5F5' },
  ];

  const handleSelect = (id) => {
    if (selected === id) {
      // If already selected, navigate to calculator with the category
      navigation.navigate(id);
    } else {
      setSelected(id);
    }
  };

  const welcomeMsg = selected
    ? `You selected ${CATEGORIES.find(c => c.id === selected)?.label} Insurance. Tap again to continue.`
    : 'Welcome! Please select a category to proceed.';

  return (
    <View style={{ padding: 12, marginTop: 30 }}>
      <View style={styles.logoArea}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoIconText}>🛡️</Text>
        </View>
        <Text style={styles.logoTitle}>Tia</Text>
        <Text style={styles.logoSub}>One App. All Insurance. Zero Hassle.</Text>
      </View>

      {/* Category Card */}
      <GlassCard style={styles.categoryCard}>

        {/* Header pill */}
        <View style={styles.categoryHeader}>
          <View style={styles.headerLine} />
          <View style={styles.headerPill}>
            <Text style={styles.headerPillText}>SELECT CATEGORY</Text>
          </View>
          <View style={styles.headerLine} />
        </View>

        {/* Arrow + subtitle */}
        <View style={styles.arrowRow}>
          <Text style={styles.arrowIcon}>⬇</Text>
        </View>
        <Text style={styles.subText}>Select a category below to get started</Text>

        {/* 2x2 Grid */}
        <View style={styles.grid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catBtn,
                { backgroundColor: cat.bg, borderColor: cat.border },
                selected === cat.id && styles.catBtnSelected,
              ]}
              onPress={() => handleSelect(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[
                styles.catLabel,
                { color: cat.id === 'home' || cat.id === 'shop' ? '#1A237E' : '#fff' },
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </GlassCard>

      {/* Welcome Banner */}
      <TouchableOpacity onPress={() => { navigation.navigate(selected) }} style={styles.banner}>
        <Text style={styles.bannerText}>{welcomeMsg}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default memo(HomeComponent);


const styles = StyleSheet.create({
  // Logo
  logoArea: { alignItems: 'center', paddingTop: 40, marginBottom: 20 },
  logoPlaceholder: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  logoIconText: { fontSize: 36 },
  logoTitle: {
    fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
  },
  logoSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2, letterSpacing: 0.4 },

  // Card override
  categoryCard: { marginBottom: 16 },

  // Header
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.4)' },
  headerPill: {
    backgroundColor: '#1565C0',
    borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  headerPillText: { color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 1.5 },

  arrowRow: { alignItems: 'center', marginBottom: 4 },
  arrowIcon: { fontSize: 18, color: '#42A5F5' },
  subText: { textAlign: 'center', color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 16 },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catBtn: {
    width: '47.5%', flexDirection: 'row', alignItems: 'center',
    paddingVertical: 18, paddingHorizontal: 14,
    borderRadius: 14, borderWidth: 1.5,
    // shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.25, shadowRadius: 6, elevation: 5,
  },
  catBtnSelected: {
    borderColor: '#FFD700', borderWidth: 2.5,
    shadowColor: '#FFD700', shadowOpacity: 0.5,
  },
  catIcon: { fontSize: 26, marginRight: 10 },
  catLabel: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  // Banner
  banner: {
    backgroundColor: '#1565C0',
    borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    marginBottom: 8,
  },
  bannerText: { color: '#fff', textAlign: 'center', fontSize: 14, fontWeight: '600', lineHeight: 22 },


})