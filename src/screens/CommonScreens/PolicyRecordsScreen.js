// src/screens/HomeScreens/PolicyRecordsScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, StatusBar, FlatList,
} from 'react-native';
import AppBackground from '../../components/AppBackground';
import BottomTabBar from '../../components/BottomTabBar';

/* ─── Mock Data ──────────────────────────────────────────────── */
const ALL_POLICIES = [
  {
    id: '1', type: 'Fire Insurance', icon: '🔥', iconBg: '#E53935',
    policy: '4917635262', validTill: '20-Mar-2025',
    amount: '5,00,000', status: 'Active',
  },
  {
    id: '2', type: 'Non-Motor Insurance', icon: '🚗', iconBg: '#1565C0',
    policy: '2088174421', validTill: '15-Feb-2025',
    amount: '8,00,000', status: 'Active',
  },
  {
    id: '3', type: 'Health Insurance', icon: '🏥', iconBg: '#E53935',
    policy: '1109452875', validTill: '30-Jan-2025',
    amount: '1,00,000', status: 'Active',
  },
  {
    id: '4', type: 'Travel Insurance', icon: '✈️', iconBg: '#1976D2',
    policy: '6813529744', validTill: '25-Dec-2024',
    amount: '75,000', status: 'Active',
  },
  {
    id: '5', type: 'Home Insurance', icon: '🏠', iconBg: '#388E3C',
    policy: '3312984401', validTill: '10-Nov-2024',
    amount: '12,00,000', status: 'Active',
  },
  {
    id: '6', type: 'Marine Insurance', icon: '⚓', iconBg: '#0277BD',
    policy: '7721938840', validTill: '05-Jun-2024',
    amount: '3,50,000', status: 'Expired',
  },
  {
    id: '7', type: 'Cyber Insurance', icon: '💻', iconBg: '#6A1B9A',
    policy: '9901234567', validTill: '01-Jan-2024',
    amount: '2,00,000', status: 'Expired',
  },
];

const FILTER_OPTIONS = ['All Policies', 'Fire', 'Health', 'Travel', 'Home', 'Marine'];

/* ─── Main Screen ────────────────────────────────────────────── */
const PolicyRecordsScreen = ({ navigation, route }) => {
  const userName = route?.params?.userName || 'Agent';

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Active');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Policies');

  const activePolicies = ALL_POLICIES.filter(p => p.status === 'Active');
  const expiredPolicies = ALL_POLICIES.filter(p => p.status === 'Expired');

  const displayed = (activeTab === 'Active' ? activePolicies : expiredPolicies).filter(p => {
    const matchSearch = p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.policy.includes(search);
    const matchFilter = selectedFilter === 'All Policies' ||
      p.type.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <AppBackground>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoEmoji}>🛡️</Text>
          </View>
          <Text style={styles.logoTitle}>Tia</Text>
        </View>
        <View style={styles.welcomeBadge}>
          <Text style={styles.welcomeIcon}>👤</Text>
          <View>
            <Text style={styles.welcomeSmall}>Welcome,</Text>
            <Text style={styles.welcomeName}>{userName}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Page Title ── */}
        <View style={styles.pageTitleRow}>
          <View style={styles.titleLine} />
          <Text style={styles.pageTitle}>MY POLICY RECORDS</Text>
          <View style={styles.titleLine} />
        </View>

        {/* ── Filter Dropdown ── */}
        <TouchableOpacity
          style={styles.filterDropdown}
          onPress={() => setFilterOpen(o => !o)}
          activeOpacity={0.85}
        >
          <View style={styles.filterLeft}>
            <Text style={styles.filterCheck}>✓</Text>
            <Text style={styles.filterText}>{selectedFilter}</Text>
          </View>
          <Text style={styles.filterChevron}>{filterOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {filterOpen && (
          <View style={styles.dropdownMenu}>
            {FILTER_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownItem, selectedFilter === opt && styles.dropdownItemActive]}
                onPress={() => { setSelectedFilter(opt); setFilterOpen(false); }}
              >
                <Text style={[styles.dropdownItemText, selectedFilter === opt && styles.dropdownItemTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Search Bar ── */}
        <View style={styles.searchCard}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Policy..."
            placeholderTextColor="#90A4AE"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
            <Text style={styles.filterBtnIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* ── Active / Expired Tabs ── */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'Active' && styles.tabPillActive]}
            onPress={() => setActiveTab('Active')}
          >
            <Text style={[styles.tabPillText, activeTab === 'Active' && styles.tabPillTextActive]}>
              Active ({activePolicies.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'Expired' && styles.tabPillExpired]}
            onPress={() => setActiveTab('Expired')}
          >
            <Text style={[styles.tabPillText, activeTab === 'Expired' && styles.tabPillTextActive]}>
              Expired ({expiredPolicies.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Policy List ── */}
        <View style={styles.listCard}>
          {displayed.length === 0 ? (
            <Text style={styles.emptyText}>No policies found.</Text>
          ) : (
            displayed.map((policy, idx) => (
              <View key={policy.id}>
                <PolicyCard policy={policy} onView={() => navigation?.navigate('PolicyDetail', { policy })} />
                {idx < displayed.length - 1 && <View style={styles.cardDivider} />}
              </View>
            ))
          )}
        </View>

        {/* ── Total ── */}
        <Text style={styles.totalText}>Total Policies: {ALL_POLICIES.length}</Text>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Bottom Tab ── */}
      <BottomTabBar navigation={navigation} active="Policies" />
    </AppBackground>
  );
};

/* ─── Policy Card ────────────────────────────────────────────── */
const PolicyCard = ({ policy, onView }) => (
  <View style={styles.policyCard}>
    {/* Icon */}
    <View style={[styles.policyIconWrap, { backgroundColor: policy.iconBg }]}>
      <Text style={styles.policyIcon}>{policy.icon}</Text>
    </View>

    {/* Info */}
    <View style={styles.policyInfo}>
      <Text style={styles.policyType}>{policy.type}</Text>
      <Text style={styles.policyNum}>Policy# {policy.policy}</Text>
      <View style={styles.policyBottomRow}>
        <Text style={styles.policyDate}>Valid Till: {policy.validTill}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusDot}>●</Text>
          <Text style={[
            styles.statusText,
            { color: policy.status === 'Active' ? '#2E7D32' : '#B71C1C' },
          ]}>
            {policy.status}
          </Text>
        </View>
      </View>
    </View>

    {/* Right: Amount + View */}
    <View style={styles.policyRight}>
      <Text style={styles.policyAmount}>₹ {policy.amount}</Text>
      <TouchableOpacity style={styles.viewBtn} onPress={onView} activeOpacity={0.85}>
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

/* ─── Styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 14, paddingBottom: 12 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 14,
    backgroundColor: '#1565C0',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoPlaceholder: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  logoEmoji: { fontSize: 22 },
  logoTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  welcomeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  welcomeIcon: { fontSize: 22 },
  welcomeSmall: { fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  welcomeName: { fontSize: 13, color: '#fff', fontWeight: '700' },

  // Page title
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  titleLine: { flex: 1, height: 1.5, backgroundColor: '#1565C0', opacity: 0.4 },
  pageTitle: {
    color: '#fff', fontWeight: '800', fontSize: 14,
    letterSpacing: 1.5, marginHorizontal: 10,
  },

  // Filter dropdown
  filterDropdown: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1565C0', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    marginBottom: 4,
    shadowColor: '#1565C0', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  filterLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterCheck: { color: '#fff', fontSize: 14, fontWeight: '700' },
  filterText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  filterChevron: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  dropdownMenu: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#D0E4F7',
    overflow: 'hidden',
    shadowColor: '#1565C0', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEF4FC' },
  dropdownItemActive: { backgroundColor: '#E3F0FF' },
  dropdownItemText: { fontSize: 14, color: '#333' },
  dropdownItemTextActive: { color: '#1565C0', fontWeight: '700' },

  // Search
  searchCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 4,
    marginBottom: 12, marginTop: 8,
    borderWidth: 1.5, borderColor: '#1565C0',
    shadowColor: '#1565C0', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#222', paddingVertical: 8 },
  filterBtn: {
    backgroundColor: '#1565C0', borderRadius: 10,
    padding: 8, marginLeft: 6,
  },
  filterBtnIcon: { fontSize: 14 },

  // Tabs
  tabRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  tabPill: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  tabPillActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  tabPillExpired: { backgroundColor: '#B71C1C', borderColor: '#B71C1C' },
  tabPillText: { fontSize: 13, fontWeight: '600', color: '#1A237E' },
  tabPillTextActive: { color: '#fff' },

  // List card wrapper
  listCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#1565C0', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
    marginBottom: 12,
  },
  cardDivider: { height: 1, backgroundColor: '#EEF4FC', marginHorizontal: 14 },
  emptyText: { textAlign: 'center', color: '#90A4AE', padding: 24, fontSize: 14 },

  // Policy card row
  policyCard: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 14, gap: 10,
  },
  policyIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  policyIcon: { fontSize: 22 },
  policyInfo: { flex: 1 },
  policyType: { fontSize: 13, fontWeight: '700', color: '#1A237E', marginBottom: 2 },
  policyNum: { fontSize: 11, color: '#546E7A', marginBottom: 4 },
  policyBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  policyDate: { fontSize: 11, color: '#546E7A' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statusDot: { fontSize: 8, color: '#2E7D32' },
  statusText: { fontSize: 11, fontWeight: '600' },
  policyRight: { alignItems: 'flex-end', gap: 6 },
  policyAmount: { fontSize: 13, fontWeight: '800', color: '#E65100' },
  viewBtn: {
    backgroundColor: '#1565C0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 7,
    shadowColor: '#1565C0', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35, shadowRadius: 4, elevation: 3,
  },
  viewBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Total
  totalText: { textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
});

export default PolicyRecordsScreen;