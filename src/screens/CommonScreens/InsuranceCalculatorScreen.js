// src/screens/CommonScreens/InsuranceCalculatorScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, StatusBar, Alert,
} from 'react-native';
import AppBackground from '../../components/AppBackground';
import HeaderComponent from '../../components/HeaderComponent';
import { calculateFireInsuranceAPI, formatFireInsurancePayload } from '../../features/fireInsurance/fireInsuranceAPI';

/* ─── Small reusable atoms ───────────────────────────────────── */

const SectionCard = ({ children, style }) => (
  <View style={[styles.sectionCard, style]}>{children}</View>
);

const SectionHeader = ({ label }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionLine} />
    <Text style={styles.sectionHeaderText}>{label}</Text>
    <View style={styles.sectionLine} />
  </View>
);

const FormRow = ({ icon, label, placeholder, value, onChangeText, keyboardType, children }) => (
  <View style={styles.formRow}>
    <Text style={styles.rowIcon}>{icon}</Text>
    <Text style={styles.rowLabel}>{label}</Text>
    {children ?? (
      <TextInput
        style={styles.rowInput}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
      />
    )}
  </View>
);

const CoverageRow = ({ label, value, onChangeText }) => (
  <View style={styles.coverageRow}>
    <View style={styles.checkCircle}><Text style={styles.checkMark}>✓</Text></View>
    <Text style={styles.coverageLabel}>{label}</Text>
    <TextInput
      style={styles.coverageInput}
      placeholder="Enter amount"
      placeholderTextColor="#aaa"
      value={value}
      onChangeText={onChangeText}
      keyboardType="numeric"
    />
  </View>
);

const RadioGroup = ({ value, onChange }) => (
  <View style={styles.radioGroup}>
    {['Yes', 'No'].map(opt => (
      <TouchableOpacity key={opt} style={styles.radioBtn} onPress={() => onChange(opt)} activeOpacity={0.7}>
        <View style={[styles.radioOuter, value === opt && styles.radioOuterActive]}>
          {value === opt && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioLabel}>{opt}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const ToggleRow = ({ icon, label, value, onChange }) => (
  <View style={styles.toggleRow}>
    <Text style={styles.rowIcon}>{icon}</Text>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Text style={styles.infoIcon}>ⓘ</Text>
    <RadioGroup value={value} onChange={onChange} />
  </View>
);

/* ─── Main Screen ────────────────────────────────────────────── */

const InsuranceCalculatorScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    customerName: '', address: '', pinCode: '', riskSearch: '',
    sumInsured: '',
    building: '', stock: '', plantMachinery: '',
    furnitureFixture: '', otherContents: '',
    terrorism: 'No', burglary: 'No',
    discountIIB: '', discountNetCat: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleCalculate = async () => {
    // Basic validation
    if (!form.customerName || !form.address || !form.pinCode) {
      Alert.alert('Missing Information', 'Please fill in customer name, address, and PIN code.');
      return;
    }

    setLoading(true);
    try {
      const payload = formatFireInsurancePayload(form);
      console.log('Sending payload:', payload);
      
      const response = await calculateFireInsuranceAPI(payload);
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        Alert.alert('Error', response.data.message || 'Calculation failed');
      }
    } catch (error) {
      console.error('Calculate error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to calculate premium';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = () => console.log('Generate PDF');
  const handleExcel = () => console.log('Generate Excel');

  return (
    <AppBackground>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
       <HeaderComponent/>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Enter Details Card ── */}
        <SectionCard>
          <SectionHeader label="Enter Details" />
          <FormRow icon="👷" label="Customer Name" placeholder="Enter customer name"
            value={form.customerName} onChangeText={set('customerName')} />
          <View style={styles.divider} />
          <FormRow icon="🏠" label="Address" placeholder="Enter address"
            value={form.address} onChangeText={set('address')} />
          <View style={styles.divider} />
          <FormRow icon="📮" label="PIN Code" placeholder="Enter PIN code"
            value={form.pinCode} onChangeText={set('pinCode')} keyboardType="numeric" />
          <View style={styles.divider} />
          {/* Search row */}
          <View style={styles.formRow}>
            <Text style={styles.rowIcon}>🔍</Text>
            <Text style={[styles.rowLabel, { fontSize: 12 }]}>Risk / Occupancy Search</Text>
            <View style={styles.searchWrap}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search risk / occupancy"
                placeholderTextColor="#aaa"
                value={form.riskSearch}
                onChangeText={set('riskSearch')}
              />
              <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8}>
                <Text style={styles.searchBtnIcon}>🔍</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SectionCard>

        {/* ── Sum Insured ── */}
        {/* <SectionCard style={styles.sumCard}>
          <View style={styles.sumRow}>
            <Text style={styles.rowIcon}>🔒</Text>
            <Text style={styles.sumLabel}>Sum Insured (₹)</Text>
            <TextInput
              style={styles.sumInput}
              placeholder="Enter sum insured"
              placeholderTextColor="#aaa"
              value={form.sumInsured}
              onChangeText={set('sumInsured')}
              keyboardType="numeric"
            />
          </View>
        </SectionCard> */}

        {/* ── Coverage Details ── */}
        <SectionCard>
          <View style={styles.coverageHeaderRow}>
            <Text style={styles.coverageHeaderIcon}>🏢</Text>
            <Text style={styles.coverageHeaderText}>Coverage Details</Text>
          </View>
          {[
            ['building', 'Building'],
            ['stock', 'Stock'],
            ['plantMachinery', 'Plant & Machinery'],
            ['furnitureFixture', 'Furniture Fixture'],
            ['otherContents', 'Other Contents'],
          ].map(([key, label]) => (
            <CoverageRow key={key} label={label} value={form[key]} onChangeText={set(key)} />
          ))}
        </SectionCard>

        {/* ── Add-ons & Discounts ── */}
        <SectionCard>
          <ToggleRow icon="🔥" label="Terrorism" value={form.terrorism} onChange={set('terrorism')} />
          <View style={styles.divider} />
          <ToggleRow icon="🏠" label="Burglary" value={form.burglary} onChange={set('burglary')} />
          <View style={styles.divider} />
          <View style={styles.formRow}>
            <Text style={styles.rowIcon}>📋</Text>
            <Text style={[styles.toggleLabel, { flex: 1 }]}>Discount on IIB</Text>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <TextInput
              style={styles.discountInput}
              placeholder="Enter % or amount"
              placeholderTextColor="#aaa"
              value={form.discountIIB}
              onChangeText={set('discountIIB')}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.formRow}>
            <Text style={styles.rowIcon}>📋</Text>
            <Text style={[styles.toggleLabel, { flex: 1 }]}>Discount on NetCat</Text>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <TextInput
              style={styles.discountInput}
              placeholder="Enter % or amount"
              placeholderTextColor="#aaa"
              value={form.discountNetCat}
              onChangeText={set('discountNetCat')}
              keyboardType="numeric"
            />
          </View>
        </SectionCard>

        {/* ── Calculate Button ── */}
        <TouchableOpacity 
          style={[styles.calcBtn, loading && styles.calcBtnDisabled]} 
          onPress={handleCalculate} 
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.calcBtnText}>
            {loading ? 'CALCULATING...' : 'CALCULATE PREMIUM'}
          </Text>
        </TouchableOpacity>

        {/* ── Results Section ── */}
        {result && (
          <SectionCard style={styles.resultCard}>
            <SectionHeader label="PREMIUM BREAKDOWN" />
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Sum Insured</Text>
              <Text style={styles.resultValue}>₹ {result.totalSumInsured?.toLocaleString('en-IN') || '0'}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Net Rate (IIB)</Text>
              <Text style={styles.resultValue}>{result.net_rate_iib || '0'}%</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Net Rate (NatCat)</Text>
              <Text style={styles.resultValue}>{result.net_cat_rate || '0'}%</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Final Rate</Text>
              <Text style={styles.resultValue}>{result.final_rate || '0'}%</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Rate</Text>
              <Text style={styles.resultValue}>{result.total_rate || '0'}%</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Net Premium</Text>
              <Text style={styles.resultValue}>₹ {result.net_premium?.toLocaleString('en-IN') || '0'}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>GST (18%)</Text>
              <Text style={styles.resultValue}>₹ {result.gst?.toLocaleString('en-IN') || '0'}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.resultRowHighlight}>
              <Text style={styles.resultLabelHighlight}>Gross Premium</Text>
              <Text style={styles.resultValueHighlight}>₹ {result.gross_premium?.toLocaleString('en-IN') || '0'}</Text>
            </View>
          </SectionCard>
        )}

        {/* ── OR divider ── */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <View style={styles.orPill}><Text style={styles.orText}>OR</Text></View>
          <View style={styles.orLine} />
        </View>

        {/* ── Generate Quote ── */}
        <SectionCard style={styles.quoteCard}>
          <SectionHeader label="GENERATE QUOTE" />
          <View style={styles.quoteGrid}>
            <TouchableOpacity style={styles.quoteBtn} onPress={handlePDF} activeOpacity={0.8}>
              <Text style={styles.quoteBtnIcon}>📄</Text>
              <Text style={styles.quoteBtnLabel}>PDF</Text>
              <View style={styles.downloadBadge}><Text style={styles.downloadIcon}>⬇</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quoteBtn} onPress={handleExcel} activeOpacity={0.8}>
              <Text style={styles.quoteBtnIcon}>📊</Text>
              <Text style={styles.quoteBtnLabel}>EXCEL</Text>
              <View style={styles.downloadBadge}><Text style={styles.downloadIcon}>⬇</Text></View>
            </TouchableOpacity>
          </View>
        </SectionCard>

        <View style={{ height: 32 }} />
      </ScrollView>
    </AppBackground>
  );
};

/* ─── Styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 14, paddingBottom: 24 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16,
    backgroundColor: '#1565C0',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerTitleWrap: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  headerDividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  headerDivLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 6 },
  headerSub: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  calcIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  calcIcon: { fontSize: 18 },

  // Section Card
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16, padding: 14,
    marginTop: 12,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: '#C5D8F0' },
  sectionHeaderText: {
    color: '#fff', fontWeight: '700', fontSize: 14, letterSpacing: 0.5,
    backgroundColor: '#1565C0', paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, marginHorizontal: 8,
  },

  // Form rows
  formRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  rowIcon: { fontSize: 20, width: 32 },
  rowLabel: { fontWeight: '700', color: '#1A237E', fontSize: 13, width: 110 },
  rowInput: {
    flex: 1, borderWidth: 1, borderColor: '#D0E4F7',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 13, color: '#333', backgroundColor: '#F5F9FF',
  },
  divider: { height: 1, backgroundColor: '#EEF4FC', marginVertical: 2 },

  // Search
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  searchInput: {
    flex: 1, borderWidth: 1, borderColor: '#D0E4F7', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, fontSize: 12,
    color: '#333', backgroundColor: '#F5F9FF',
  },
  searchBtn: {
    marginLeft: 6, backgroundColor: '#1565C0', borderRadius: 10,
    padding: 9, alignItems: 'center', justifyContent: 'center',
  },
  searchBtnIcon: { fontSize: 14 },

  // Sum Insured
  sumCard: { flexDirection: 'row', padding: 14 },
  sumRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  sumLabel: { fontWeight: '700', color: '#1A237E', fontSize: 13, flex: 1 },
  sumInput: {
    flex: 1.2, borderWidth: 1, borderColor: '#D0E4F7',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 13, color: '#333', backgroundColor: '#F5F9FF',
  },

  // Coverage
  coverageHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  coverageHeaderIcon: { fontSize: 22, marginRight: 8 },
  coverageHeaderText: { fontWeight: '700', color: '#1A237E', fontSize: 15 },
  coverageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '800' },
  coverageLabel: { flex: 1, fontWeight: '600', color: '#1A237E', fontSize: 13 },
  coverageInput: {
    width: 130, borderWidth: 1, borderColor: '#D0E4F7',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7,
    fontSize: 12, color: '#333', backgroundColor: '#F5F9FF',
  },

  // Toggle rows
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  toggleLabel: { fontWeight: '700', color: '#1A237E', fontSize: 13 },
  infoIcon: { color: '#42A5F5', fontSize: 14, marginHorizontal: 4 },
  radioGroup: { flexDirection: 'row', marginLeft: 'auto' },
  radioBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#90A4AE',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#1565C0' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1565C0' },
  radioLabel: { marginLeft: 5, fontSize: 13, color: '#333', fontWeight: '500' },
  discountInput: {
    width: 130, borderWidth: 1, borderColor: '#D0E4F7',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7,
    fontSize: 12, color: '#333', backgroundColor: '#F5F9FF',
  },

  // Calculate button
  calcBtn: {
    marginTop: 16, backgroundColor: '#F57C00',
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#E65100', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45, shadowRadius: 10, elevation: 8,
  },
  calcBtnDisabled: {
    backgroundColor: '#D0A060', opacity: 0.7,
  },
  calcBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1.5 },

  // Results section
  resultCard: {
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, alignItems: 'center',
  },
  resultLabel: {
    fontSize: 13, color: '#1A237E', fontWeight: '600',
  },
  resultValue: {
    fontSize: 14, color: '#333', fontWeight: '700',
  },
  resultRowHighlight: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  resultLabelHighlight: {
    fontSize: 16, color: '#2E7D32', fontWeight: '800',
  },
  resultValueHighlight: {
    fontSize: 20, color: '#2E7D32', fontWeight: '900',
  },

  // OR divider
  orRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  orLine: { flex: 1, height: 1, backgroundColor: '#C5D8F0' },
  orPill: {
    borderWidth: 1, borderColor: '#1565C0', borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 4, marginHorizontal: 10,
  },
  orText: { color: '#1565C0', fontWeight: '700', fontSize: 12 },

  // Quote card
  quoteCard: { backgroundColor: '#1565C0', marginTop: 12 },
  quoteGrid: { flexDirection: 'row', gap: 12, marginTop: 4 },
  quoteBtn: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    paddingVertical: 20, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },
  quoteBtnIcon: { fontSize: 36, marginBottom: 4 },
  quoteBtnLabel: { fontSize: 13, fontWeight: '800', color: '#1A237E', letterSpacing: 1 },
  downloadBadge: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: '#1565C0', borderRadius: 10,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  downloadIcon: { fontSize: 10, color: '#fff' },
});

export default InsuranceCalculatorScreen;