import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, InteractionManager, ActivityIndicator } from 'react-native';
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

const CASE_TYPE_OPTIONS = ['Fresh', 'Rollover'];

const toCaseType = (value) => {
  const text = toText(value).trim().toLowerCase();
  if (text === 'fresh') return 'Fresh';
  if (text === 'rollover' || text === 'roll over') return 'Rollover';
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
  brokerName: '',
  imdName: '',
  caseType: '',
  previousInsurer: '',
  businessAge: '',
  industryType: '',
  constructionType: '',
  fireFightingMeasures: 'No',
  cctvInstalled: 'No',
  hypothecationDetails: 'No',
  bankName: '',
  bankBranch: '',
  wordings: [''],
  termsConditions: [''],
};

/** Normalize GET detail / raw DB row into one object we can map from */
const normalizeDetailPayload = (data = {}) => {
  if (!data || typeof data !== 'object') return {};

  let parsedJson = {};
  if (typeof data.quotationJson === 'string' && data.quotationJson.trim()) {
    try {
      parsedJson = JSON.parse(data.quotationJson) || {};
    } catch (e) {
      parsedJson = {};
    }
  } else if (data.quotationJson && typeof data.quotationJson === 'object') {
    parsedJson = data.quotationJson;
  }

  return {
    ...parsedJson,
    ...data,
    quotation: data.quotation || parsedJson.quotation || data.quoteDetails || {},
    customer: data.customer || parsedJson.customer || data.riskDetails || {},
    risk: data.risk || parsedJson.risk || data.riskDetails || {},
    policy: data.policy || parsedJson.policy || data.policyDetails || {},
    wordings: data.wordings ?? parsedJson.wordings,
    termsConditions: data.termsConditions ?? parsedJson.termsConditions,
  };
};

const buildInitialForm = (data = {}) => {
  const root = normalizeDetailPayload(data);
  if (!Object.keys(root).length) {
    return { ...emptyForm, wordings: [''], termsConditions: [''] };
  }

  const customer = root.customer || {};
  const risk = root.risk || {};
  const policy = root.policy || {};

  return {
    brokerName: toText(root.brokerName ?? customer.brokerName ?? risk.brokerName),
    imdName: toText(root.imdName ?? customer.imdName ?? customer.imd ?? risk.imdName ?? root.imd),
    caseType: toCaseType(root.caseType ?? policy.caseType),
    previousInsurer: toText(root.previousInsurer ?? policy.previousInsurer),
    businessAge: toText(root.businessAge ?? policy.businessAge),
    industryType: toText(root.industryType ?? policy.industryType),
    constructionType: toText(root.constructionType ?? policy.constructionType),
    fireFightingMeasures: toYesNo(root.fireFightingMeasures ?? policy.fireFightingMeasures) || 'No',
    cctvInstalled: toYesNo(root.cctvInstalled ?? policy.cctvInstalled) || 'No',
    hypothecationDetails: toYesNo(
      root.hypothecationDetails
      ?? policy.hypothecationDetails
      ?? root.hypothecation
      ?? policy.hypothecation
    ) || 'No',
    bankName: toText(root.bankName ?? policy.bankName),
    bankBranch: toText(root.bankBranch ?? policy.bankBranch),
    wordings: toStringList(root.wordings),
    termsConditions: toStringList(root.termsConditions),
  };
};

const OptionToggle = ({ label, value, onChange, options = ['Yes', 'No'] }) => (
  <View style={styles.yesNoRow}>
    <Text style={styles.yesNoLabel}>{label}</Text>
    <View style={styles.yesNoOptions}>
      {options.map((option) => {
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

const YesNoToggle = (props) => <OptionToggle {...props} options={['Yes', 'No']} />;

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

  const [form, setForm] = useState(() => ({ ...emptyForm }));
  const [sourceDetail, setSourceDetail] = useState(null);
  const [quotationNo, setQuotationNo] = useState('');
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const applyPayload = (payload = {}) => {
      setForm(buildInitialForm(payload));
      setSourceDetail(payload);
      setQuotationNo(
        payload?.quotation?.quotationNumber
        || payload?.quotation?.quotationNo
        || payload?.quoteDetails?.quotationNumber
        || payload?.quoteDetails?.quotationNo
        || payload?.quotationNumber
        || payload?.quotationNo
        || ''
      );
      const resolvedType = resolveQuoteType(
        payload?.quotation?.type,
        payload?.quoteDetails?.type,
        payload?.type,
        rawQuoteType,
      );
      if (resolvedType) setQuoteType(resolvedType);
    };

    // Optional instant paint from route params, then always refresh from GET
    if (quotationData) {
      applyPayload(quotationData);
    }

    if (!quoteId) {
      setPageLoading(false);
      return undefined;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;

      const load = async () => {
        try {
          setPageLoading(true);
          const response = await getQuotationDetails(quoteId);
          if (cancelled) return;
          const payload = response.data?.data || response.data || {};
          console.log('Update quotation GET detail', payload);
          applyPayload(payload);
        } catch (error) {
          console.log('Update quotation GET error', error?.response?.data || error);
          if (!quotationData) {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to load quotation');
          }
        } finally {
          if (!cancelled) setPageLoading(false);
        }
      };

      load();
    });

    return () => {
      cancelled = true;
      task.cancel?.();
    };
  }, [quoteId, rawQuoteType]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildUpdatePayload = () => {
    const wordingList = form.wordings.map((item) => item.trim()).filter(Boolean);
    const termsList = form.termsConditions.map((item) => item.trim()).filter(Boolean);

    // Exact PUT body shape expected by quotations update API
    return {
      imdName: form.imdName.trim(),
      brokerName: form.brokerName.trim(),
      caseType: form.caseType.trim(),
      previousInsurer: form.previousInsurer.trim(),
      businessAge: form.businessAge.trim(),
      industryType: form.industryType.trim(),
      constructionType: form.constructionType.trim(),
      fireFightingMeasures: form.fireFightingMeasures === 'Yes',
      cctvInstalled: form.cctvInstalled === 'Yes',
      hypothecationDetails: toYesNoEnum(form.hypothecationDetails),
      bankName: form.bankName.trim(),
      bankBranch: form.bankBranch.trim(),
      wordings: toJsonText(wordingList),
      termsConditions: toJsonText(termsList),
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
      if (!quoteId) {
        Alert.alert('Error', 'Missing quotation id');
        return;
      }

      setSaving(true);
      dispatch(setAppLoading(true));

      const payload = buildUpdatePayload();
      console.log('Update quotation payload', quoteId, payload);

      await updateQuotation(quoteId, payload);
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
          {pageLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={color.primaryBlueDark} />
            </View>
          ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 110 + Math.max(insets.bottom, 12), gap: 12 }}
            keyboardShouldPersistTaps="handled"
          >
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
                label="IMD Name"
                value={form.imdName}
                onChangeText={(text) => setField('imdName', text)}
                placeholder="IMD name"
                containerInputStyle={styles.inputPad}
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Policy Details</Text>
              <OptionToggle
                label="Case Type"
                value={form.caseType}
                options={CASE_TYPE_OPTIONS}
                onChange={(value) => setField('caseType', value)}
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
                placeholder="5-10"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Industry Type"
                value={form.industryType}
                onChangeText={(text) => setField('industryType', text)}
                placeholder="Engineering"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Construction Type"
                value={form.constructionType}
                onChangeText={(text) => setField('constructionType', text)}
                placeholder="Pucca"
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
                  label="Hypothecation Details"
                  value={form.hypothecationDetails}
                  onChange={(value) => setField('hypothecationDetails', value)}
                />
              </View>

              <InputField
                label="Bank Name"
                value={form.bankName}
                onChangeText={(text) => setField('bankName', text)}
                placeholder="Bank name"
                containerInputStyle={styles.inputPad}
              />
              <InputField
                label="Bank Branch"
                value={form.bankBranch}
                onChangeText={(text) => setField('bankBranch', text)}
                placeholder="Bank branch"
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
          </ScrollView>
          )}
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
