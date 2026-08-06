import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import BackHeader from '../../components/BackHeader';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { color } from '../../utility/color';
import { textStyles } from '../../utility/textStyles';
import { setAppLoading, showModal } from '../../features/app/appSlice';
import { getQuotationDetails, updateQuotation, resolveQuoteType } from '../../features/quotations/quotationsAPI';

const toText = (value) => (value == null ? '' : String(value));

const toYesNo = (value) => {
  if (value === true || value === 'Yes' || value === 'yes' || value === 1 || value === '1') return 'Yes';
  if (value === false || value === 'No' || value === 'no' || value === 0 || value === '0') return 'No';
  return '';
};

/** Normalize API value → array of strings for separate text fields */
const toStringList = (value) => {
  if (Array.isArray(value)) {
    const list = value.map((item) => toText(item)).filter((item) => String(item).trim() !== '');
    return list.length ? list : [''];
  }
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return toStringList(parsed);
    } catch (e) {
      // plain string / newline-separated fallback
      if (value.includes('\n')) {
        return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      }
      return [value];
    }
  }
  return [''];
};

/** Arrays must be stored as LongText JSON strings per Prisma schema */
const toJsonText = (list = []) => JSON.stringify(
  (Array.isArray(list) ? list : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean)
);

const toYesNoEnum = (value) => {
  if (value === true || value === 'Yes' || value === 'yes' || value === 1 || value === '1') return 'Yes';
  return 'No';
};

const emptyForm = {
  companyName: '',
  productName: '',
  brokerName: '',
  imd: '',
  district: '',
  state: '',
  earthquakeZone: '',
  caseType: '',
  previousInsurer: '',
  businessAge: '',
  industryType: '',
  constructionType: '',
  fireFightingMeasures: 'No',
  cctvInstalled: 'No',
  hypothecation: 'No',
  bankName: '',
  remarks: '',
  wordings: [''],
  termsConditions: [''],
};

const buildInitialForm = (data = {}) => {
  if (!data || typeof data !== 'object') return { ...emptyForm, wordings: [''], termsConditions: [''] };

  const quotation = data.quotation || data.quoteDetails || {};
  const customer = data.customer || {};
  const risk = data.risk || data.riskDetails || {};
  const policy = data.policy || data.policyDetails || {};

  return {
    companyName: toText(quotation.companyName ?? data.companyName),
    productName: toText(quotation.productName ?? data.productName),
    brokerName: toText(customer.brokerName ?? data.brokerName),
    imd: toText(customer.imd ?? data.imd),
    district: toText(risk.district ?? data.district),
    state: toText(risk.state ?? data.state),
    earthquakeZone: toText(risk.earthquakeZone ?? data.earthquakeZone),
    caseType: toText(policy.caseType ?? data.caseType),
    previousInsurer: toText(policy.previousInsurer ?? data.previousInsurer),
    businessAge: toText(policy.businessAge ?? data.businessAge),
    industryType: toText(policy.industryType ?? data.industryType),
    constructionType: toText(policy.constructionType ?? data.constructionType),
    fireFightingMeasures: toYesNo(policy.fireFightingMeasures ?? data.fireFightingMeasures) || 'No',
    cctvInstalled: toYesNo(policy.cctvInstalled ?? data.cctvInstalled) || 'No',
    hypothecation: toYesNo(policy.hypothecation ?? data.hypothecation) || 'No',
    bankName: toText(policy.bankName ?? data.bankName),
    remarks: toText(data.remarks),
    wordings: toStringList(data.wordings),
    termsConditions: toStringList(data.termsConditions),
  };
};

const YesNoToggle = ({ label, value, onChange }) => (
  <View style={styles.yesNoRow}>
    <Text style={styles.yesNoLabel}>{label}</Text>
    <View style={styles.yesNoOptions}>
      {['Yes', 'No'].map((option) => {
        const selected = value === option;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.85}
            onPress={() => onChange(option)}
            style={[styles.yesNoChip, selected && styles.yesNoChipActive]}
          >
            <Text style={[styles.yesNoChipText, selected && styles.yesNoChipTextActive]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const ListFieldEditor = ({ title, items = [''], onChange, placeholder }) => {
  const updateItem = (index, text) => {
    const next = [...items];
    next[index] = text;
    onChange(next);
  };

  const removeItem = (index) => {
    if (items.length <= 1) {
      onChange(['']);
      return;
    }
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, '']);
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={addItem} style={styles.addBtn} activeOpacity={0.85}>
          <Icon name="plus" size={16} color={color.primaryBlueDark} />
          <Text style={styles.addBtnText}>Add more</Text>
        </TouchableOpacity>
      </View>

      {items.map((item, index) => (
        <View key={`${title}-${index}`} style={styles.listItem}>
          <Text style={styles.listIndex}>{index + 1}.</Text>
          <TextInput
            value={item}
            onChangeText={(text) => updateItem(index, text)}
            placeholder={`${placeholder} ${index + 1}`}
            placeholderTextColor="#999"
            multiline
            style={styles.listInput}
          />
          <TouchableOpacity onPress={() => removeItem(index)} hitSlop={10} style={styles.removeBtn}>
            <Icon name="trash-2" size={18} color={color.error} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const UpdateQuotationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const { quoteId, quoteType: rawQuoteType, quotationData } = route.params || {};
  const [quoteType, setQuoteType] = useState(() =>
    resolveQuoteType(
      rawQuoteType,
      quotationData?.quotation?.type,
      quotationData?.quoteDetails?.type,
      quotationData?.type,
    )
  );

  const [form, setForm] = useState(() => buildInitialForm(quotationData));
  const [sourceDetail, setSourceDetail] = useState(quotationData || null);
  const [quotationNo, setQuotationNo] = useState(
    quotationData?.quotation?.quotationNo || quotationData?.quoteDetails?.quotationNo || ''
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (quotationData) {
      setForm(buildInitialForm(quotationData));
      setSourceDetail(quotationData);
      setQuotationNo(
        quotationData?.quotation?.quotationNo ||
        quotationData?.quoteDetails?.quotationNo ||
        ''
      );
      const fromData = resolveQuoteType(
        quotationData?.quotation?.type,
        quotationData?.quoteDetails?.type,
        quotationData?.type,
        rawQuoteType,
      );
      if (fromData) setQuoteType(fromData);
    }

    if (!quoteId) return;

    const load = async () => {
      const requestType = resolveQuoteType(
        quoteType,
        rawQuoteType,
        quotationData?.quotation?.type,
        quotationData?.quoteDetails?.type,
      );

      if (!requestType) {
        Alert.alert('Error', 'Missing quotation type (fire / business / iar)');
        return;
      }

      try {
        dispatch(setAppLoading(true));
        const response = await getQuotationDetails(quoteId, requestType);
        const payload = response.data?.data || {};
        setForm(buildInitialForm(payload));
        setSourceDetail(payload);
        setQuotationNo(
          payload?.quotation?.quotationNo ||
          payload?.quoteDetails?.quotationNo ||
          ''
        );
        const resolvedType = resolveQuoteType(
          payload?.quotation?.type,
          payload?.quoteDetails?.type,
          payload?.type,
          requestType,
        );
        if (resolvedType) setQuoteType(resolvedType);
      } catch (error) {
        if (!quotationData) {
          Alert.alert('Error', error?.response?.data?.message || 'Failed to load quotation');
        }
      } finally {
        dispatch(setAppLoading(false));
      }
    };

    load();
  }, [quoteId, rawQuoteType, quotationData, dispatch]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildUpdatePayload = () => {
    const wordingList = form.wordings.map((item) => item.trim()).filter(Boolean);
    const termsList = form.termsConditions.map((item) => item.trim()).filter(Boolean);
    const remarks = form.remarks.trim() || null;

    const fireFightingMeasures = toYesNoEnum(form.fireFightingMeasures);
    const cctvInstalled = toYesNoEnum(form.cctvInstalled);
    const hypothecation = toYesNoEnum(form.hypothecation);

    const root = sourceDetail && typeof sourceDetail === 'object' ? sourceDetail : {};
    const quotation = { ...(root.quotation || root.quoteDetails || {}) };
    const customer = { ...(root.customer || {}) };
    const risk = { ...(root.risk || root.riskDetails || {}) };
    const policy = { ...(root.policy || root.policyDetails || {}) };

    quotation.companyName = form.companyName.trim();
    quotation.productName = form.productName.trim();

    customer.brokerName = form.brokerName.trim();
    customer.imd = form.imd.trim();

    risk.district = form.district.trim();
    risk.state = form.state.trim();
    risk.earthquakeZone = form.earthquakeZone.trim();

    policy.caseType = form.caseType.trim();
    policy.previousInsurer = form.previousInsurer.trim();
    policy.businessAge = form.businessAge.trim();
    policy.industryType = form.industryType.trim();
    policy.constructionType = form.constructionType.trim();
    policy.fireFightingMeasures = fireFightingMeasures === 'Yes';
    policy.cctvInstalled = cctvInstalled === 'Yes';
    policy.hypothecation = hypothecation === 'Yes';
    policy.bankName = form.bankName.trim();

    const mergedDetail = {
      ...root,
      quotation,
      customer,
      risk,
      policy,
      wordings: wordingList,
      termsConditions: termsList,
      remarks,
    };

    // Prisma FireQuotation columns only — wordings/termsConditions are LongText JSON strings
    return {
      companyName: form.companyName.trim() || null,
      productName: form.productName.trim() || null,
      brokerName: form.brokerName.trim() || null,
      imd: form.imd.trim() || null,
      district: form.district.trim() || null,
      state: form.state.trim() || null,
      earthquakeZone: form.earthquakeZone.trim() || null,
      caseType: form.caseType.trim() || null,
      previousInsurer: form.previousInsurer.trim() || null,
      businessAge: form.businessAge.trim() || null,
      industryType: form.industryType.trim() || null,
      constructionType: form.constructionType.trim() || null,
      fireFightingMeasures,
      cctvInstalled,
      hypothecation,
      bankName: form.bankName.trim() || null,
      remarks,
      wordings: toJsonText(wordingList),
      termsConditions: toJsonText(termsList),
      quotationJson: JSON.stringify(mergedDetail),
    };
  };

  const getErrorMessage = (error) => {
    const data = error?.response?.data;
    if (!data) return error?.message || 'Failed to update quotation';
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return String(data.error);
    try {
      return JSON.stringify(data);
    } catch (e) {
      return 'Failed to update quotation';
    }
  };

  const handleSave = async () => {
    try {
      const type = resolveQuoteType(
        quoteType,
        sourceDetail?.quotation?.type,
        sourceDetail?.quoteDetails?.type,
        sourceDetail?.type,
        rawQuoteType,
      );

      if (!type) {
        Alert.alert('Error', 'Missing quotation type (fire / business / iar)');
        return;
      }

      setSaving(true);
      dispatch(setAppLoading(true));

      const payload = buildUpdatePayload();
      console.log('Update quotation payload', quoteId, type, payload);

      await updateQuotation(quoteId, type, payload);
      dispatch(showModal({ title: 'Success', message: 'Quotation updated successfully.' }));
      navigation.goBack();
    } catch (error) {
      console.log('Update quotation error', error?.response?.status, error?.response?.data || error);
      dispatch(showModal({ title: 'Failed', message: getErrorMessage(error) }));
    } finally {
      setSaving(false);
      dispatch(setAppLoading(false));
    }
  };

  const subtitle = useMemo(
    () => quotationNo || (quoteId ? `ID: ${quoteId}` : ''),
    [quotationNo, quoteId]
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <BackHeader title="Update Quotation" subTitle={subtitle} />
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 110 + Math.max(insets.bottom, 12), gap: 12 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Company & Product</Text>
              <InputField
                label="Company Name"
                value={form.companyName}
                onChangeText={(text) => setField('companyName', text)}
                placeholder="Company name"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Product Name"
                value={form.productName}
                onChangeText={(text) => setField('productName', text)}
                placeholder="Product name"
                containerInputStyle={styles.inputPad}
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Broker Details</Text>
              <InputField
                label="Broker Name"
                value={form.brokerName}
                onChangeText={(text) => setField('brokerName', text)}
                placeholder="Broker name"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="IMD"
                value={form.imd}
                onChangeText={(text) => setField('imd', text)}
                placeholder="IMD code"
                containerInputStyle={styles.inputPad}
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Location Meta</Text>
              <InputField
                label="District"
                value={form.district}
                onChangeText={(text) => setField('district', text)}
                placeholder="District"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="State"
                value={form.state}
                onChangeText={(text) => setField('state', text)}
                placeholder="State"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Earthquake Zone"
                value={form.earthquakeZone}
                onChangeText={(text) => setField('earthquakeZone', text)}
                placeholder="Zone"
                containerInputStyle={styles.inputPad}
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Policy Details</Text>
              <InputField
                label="Case Type"
                value={form.caseType}
                onChangeText={(text) => setField('caseType', text)}
                placeholder="Fresh"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Previous Insurer"
                value={form.previousInsurer}
                onChangeText={(text) => setField('previousInsurer', text)}
                placeholder="Previous insurer"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Business Age"
                value={form.businessAge}
                onChangeText={(text) => setField('businessAge', text)}
                placeholder="5 Years"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Industry Type"
                value={form.industryType}
                onChangeText={(text) => setField('industryType', text)}
                placeholder="Industry type"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Construction Type"
                value={form.constructionType}
                onChangeText={(text) => setField('constructionType', text)}
                placeholder="RCC"
                containerInputStyle={styles.inputPad}
              />

              <View style={{ gap: 12, marginTop: 6 }}>
                <YesNoToggle
                  label="Fire Fighting Measures"
                  value={form.fireFightingMeasures}
                  onChange={(value) => setField('fireFightingMeasures', value)}
                />
                <YesNoToggle
                  label="CCTV Installed"
                  value={form.cctvInstalled}
                  onChange={(value) => setField('cctvInstalled', value)}
                />
                <YesNoToggle
                  label="Hypothecation"
                  value={form.hypothecation}
                  onChange={(value) => setField('hypothecation', value)}
                />
              </View>

              <InputField
                label="Bank Name"
                value={form.bankName}
                onChangeText={(text) => setField('bankName', text)}
                placeholder="Bank name"
                containerInputStyle={styles.inputPad}
              />
            </View>

            <ListFieldEditor
              title="Wordings"
              items={form.wordings}
              onChange={(items) => setField('wordings', items)}
              placeholder="Wording"
            />

            <ListFieldEditor
              title="Terms & Conditions"
              items={form.termsConditions}
              onChange={(items) => setField('termsConditions', items)}
              placeholder="Term"
            />

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Remarks</Text>
              <TextInput
                value={form.remarks}
                onChangeText={(text) => setField('remarks', text)}
                placeholder="Add remarks"
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
                style={styles.remarksInput}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <CustomButton
          label="Cancel"
          width="48%"
          backgroundColor={color.lightSerface}
          textColor={color.mainText}
          onPress={() => navigation.goBack()}
          disabled={saving}
        />
        <CustomButton
          label="Save Changes"
          width="48%"
          backgroundColor={color.primaryBlueDark}
          loading={saving}
          disabled={saving}
          onPress={handleSave}
        />
      </View>
    </View>
  );
};

export default UpdateQuotationScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.primaryBlueDark,
  },
  safe: {
    flex: 1,
  },
  sheet: {
    flex: 1,
    backgroundColor: color.screenBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 12,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: color.borderColor,
    borderRadius: 10,
    padding: 12,
    gap: 8,
    backgroundColor: color.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    ...textStyles.body,
    fontWeight: '700',
    marginBottom: 4,
  },
  inputPad: {
    paddingVertical: 6,
  },
  yesNoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  yesNoLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: color.mainText,
  },
  yesNoOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  yesNoChip: {
    borderWidth: 1,
    borderColor: color.borderColor,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: color.lightSerface,
  },
  yesNoChipActive: {
    backgroundColor: color.primaryBlueDark,
    borderColor: color.primaryBlueDark,
  },
  yesNoChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: color.mainText,
  },
  yesNoChipTextActive: {
    color: color.white,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: color.lightBlueBackground,
  },
  addBtnText: {
    color: color.primaryBlueDark,
    fontWeight: '700',
    fontSize: 13,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  listIndex: {
    marginTop: 12,
    minWidth: 18,
    color: color.primaryBlueDark,
    fontWeight: '700',
  },
  listInput: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: color.borderColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: color.mainText,
    textAlignVertical: 'top',
  },
  removeBtn: {
    marginTop: 12,
  },
  remarksInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: color.borderColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: color.mainText,
  },
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.borderColor,
  },
});
