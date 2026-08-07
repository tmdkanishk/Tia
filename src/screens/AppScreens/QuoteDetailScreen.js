import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { color } from '../../utility/color'
import BackHeader from '../../components/BackHeader'
import Icon from 'react-native-vector-icons/Feather'
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { textStyles } from '../../utility/textStyles'
import { checkPermission } from '../../utility/permissions'
import { IconComponent, icons } from '../../components/IconComponent'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { getQuotationDetails, getQuotationPdfExportPath, resolveQuoteType } from '../../features/quotations/quotationsAPI'
import { normalizeQuotationDetail } from '../../features/quotations/normalizeQuotationDetail'
import { BASE_URL } from '../../config/env'
import { useDispatch, useSelector } from 'react-redux'
import { setAppLoading, showModal } from '../../features/app/appSlice'
import { formattedDate } from '../../utility/helper'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

const NA = 'N/A';

const FIRE_LABELS = {
    iib: 'IIB Discount %',
    earthquake: 'Earthquake Discount %',
    stfi: 'STFI Discount %',
    building: 'Building',
    plantAndMachinery: 'Plant & Machinery',
    stock: 'Stock',
    furnitureFixturesFittings: 'Furniture Fixtures & Fittings',
    otherContents: 'Other Contents',
    total: 'Total Sum Insured',
    fireSection: 'Fire Section Sum Insured',
    burglarySection: 'Burglary Section Sum Insured',
    iibRate: 'IIB Rate',
    discountOnIibPct: 'Discount on IIB %',
    netRateIib: 'Net IIB Rate',
    netIIBRate: 'Net IIB Rate',
    eqRate: 'Earthquake Rate',
    earthquakeRate: 'Earthquake Rate',
    eqDiscountPct: 'EQ Discount %',
    stfiRate: 'STFI Rate',
    stfiDiscountPct: 'STFI Discount %',
    netEqRate: 'Net Earthquake Rate',
    netStfiRate: 'Net STFI Rate',
    netCatRate: 'Net Cat Rate',
    finalRate: 'Final Rate',
    totalRate: 'Total Rate',
    finalFireRate: 'Final Fire Rate',
    terrorismRate: 'Terrorism Rate',
    bhbRate: 'BHB Rate',
    fire: 'Fire Premium',
    terrorism: 'Terrorism Premium',
    burglary: 'Burglary Premium',
    netPremium: 'Net Premium',
    gstPercent: 'GST (%)',
    gstAmount: 'GST Amount',
    grossPremium: 'Gross Premium',
};

const FIRE_DISCOUNT_KEYS = ['iib', 'earthquake', 'stfi'];
const FIRE_ASSET_KEYS = ['building', 'plantAndMachinery', 'stock', 'furnitureFixturesFittings', 'otherContents'];
const FIRE_SI_SECTION_KEYS = ['total', 'fireSection', 'burglarySection'];
const FIRE_RATE_KEYS = [
    'iibRate',
    'discountOnIibPct',
    'netRateIib',
    'eqRate',
    'eqDiscountPct',
    'stfiRate',
    'stfiDiscountPct',
    'netCatRate',
    'finalRate',
    'totalRate',
    'terrorismRate',
    'bhbRate',
];
const FIRE_PREMIUM_KEYS = ['netPremium', 'gstPercent', 'gstAmount', 'grossPremium'];

const humanizeKey = (key = '') =>
    key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (s) => s.toUpperCase()).trim();

const getLabel = (key, labels = {}) => labels[key] || FIRE_LABELS[key] || humanizeKey(key);

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const isEmptyValue = (value) =>
    value === null || value === undefined || value === '';

const formatMoney = (value) => {
    if (isEmptyValue(value) || Number.isNaN(Number(value))) return NA;
    return Number(value).toLocaleString('en-IN');
};

const formatDisplayValue = (value, { percent = false, money = false } = {}) => {
    if (isEmptyValue(value)) return NA;
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (percent) return `${value}%`;
    if (money) return formatMoney(value);
    if (typeof value === 'number' || (!isNaN(Number(value)) && value !== '')) {
        const num = Number(value);
        if (!Number.isInteger(num) && Math.abs(num) < 1000) return String(num);
        return formatMoney(num);
    }
    return String(value);
};

const buildRows = (source = {}, keys = [], options = {}) => {
    const obj = isPlainObject(source) ? source : {};
    const keyList = keys.length
        ? keys
        : Object.keys(obj).filter((k) => !isPlainObject(obj[k]) && !Array.isArray(obj[k]));
    return keyList.map((key) => {
        const isPercent = options.percent || key === 'gstPercent' || /Pct$/i.test(key);
        const isMoney = options.money && !isPercent && !/Rate$/i.test(key);
        return {
            key,
            label: getLabel(key, options.labels),
            value: formatDisplayValue(obj[key], {
                percent: isPercent && (options.percent || key === 'gstPercent'),
                money: isMoney,
            }),
        };
    });
};

const TYPE_META = {
    fire: { title: 'Fire Quotation', accent: color.fire, softBg: color.lightFire, icon: icons.fire },
    business: { title: 'Business Quotation', accent: color.primaryBlue, softBg: color.lightBlueBackground, icon: icons.businessins },
    iar: { title: 'IAR Quotation', accent: color.icon, softBg: color.lightBlueBackground, icon: icons.industry },
};

const QuoteDetailScreen = ({ route }) => {
    const { quoteId, quoteType: rawQuoteType } = route.params || {};
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const { accessToken } = useSelector(state => state.auth);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sectionShow, setSectionShow] = useState({});
    const [quoteType, setQuoteType] = useState(() => resolveQuoteType(rawQuoteType) || 'fire');

    const meta = TYPE_META[quoteType] || TYPE_META.fire;

    // Always hit GET /api/quotations/:id on focus, then fill UI from response
    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            const fetchQuotationDetails = async () => {
                if (!quoteId) {
                    Alert.alert('Error', 'Missing quotation id');
                    if (!cancelled) setLoading(false);
                    return;
                }

                try {
                    if (!cancelled) {
                        setLoading(true);
                        setData(null);
                    }
                    const response = await getQuotationDetails(quoteId);
                    if (cancelled) return;

                    const payload = response?.data?.data ?? response?.data ?? null;
                    console.log('Quotation Details response ', payload);

                    const resolvedType = resolveQuoteType(
                        payload?.quotation?.type,
                        payload?.quoteDetails?.type,
                        payload?.type,
                        rawQuoteType,
                    );
                    if (resolvedType) setQuoteType(resolvedType);
                    setData(payload);
                } catch (error) {
                    if (cancelled) return;
                    console.log('error', error?.response?.data || error);
                    setData(null);
                    Alert.alert('Error', error?.response?.data?.message || 'Failed to load quotation details');
                } finally {
                    if (!cancelled) setLoading(false);
                }
            };

            // Fetch immediately (don't wait for interactions) so detail always loads from API
            fetchQuotationDetails();

            return () => {
                cancelled = true;
            };
        }, [quoteId, rawQuoteType])
    );

    const downloadFile = async (ext, url) => {
        try {
            if (!url) {
                Alert.alert('Unavailable', 'Export file is not available for this quotation.');
                return;
            }
            const needsStoragePermission = Platform.OS === 'android' && Platform.Version <= 28;
            if (needsStoragePermission) {
                const status = await checkPermission();
                if (status) download(ext, url);
            } else {
                download(ext, url);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const download = async (ext, url) => {
        try {
            dispatch(setAppLoading(true));
            const file = url.startsWith('http') ? url : `${BASE_URL}${url}`;
            const { config, fs } = ReactNativeBlobUtil;
            const fileName = `quotation_${quoteId}_${Date.now()}${ext}`;
            const filePath = Platform.OS === 'ios'
                ? `${fs.dirs.DocumentDir}/${fileName}`
                : `/storage/emulated/0/Download/${fileName}`;

            const configOptions = Platform.OS === 'ios'
                ? { fileCache: true, path: filePath }
                : {
                    fileCache: true,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        description: 'Downloading File',
                        mediaScannable: true,
                        path: filePath,
                        mime: ext === '.pdf' ? 'application/pdf' : undefined,
                        title: fileName,
                    },
                };

            await config(configOptions).fetch('GET', file, { Authorization: `Bearer ${accessToken}` });
            dispatch(showModal({ title: 'Success', message: 'Quotation downloaded successfully.' }));
        } catch (error) {
            console.log('download error', error);
            dispatch(showModal({ title: 'Failed', message: 'Something went wrong. Please try again later.' }));
        } finally {
            dispatch(setAppLoading(false));
        }
    };

    const handleExportPdf = () => {
        const path = getQuotationPdfExportPath(quoteId);
        downloadFile('.pdf', path);
    };

    const handleUpdateQuotation = () => {
        const type = resolveQuoteType(
            data?.quotation?.type,
            data?.quoteDetails?.type,
            data?.type,
            quoteType,
            rawQuoteType,
        );
        navigation.navigate('UpdateQuotation', {
            quoteId,
            quoteType: type,
            quotationData: data,
        });
    };

    const model = useMemo(() => normalizeQuotationDetail(data || {}), [data]);

    const renderAmount = (value, style) => (
        <Text
            style={style}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
        >
            {value}
        </Text>
    );

    const renderRows = (rows) => (
        <View style={styles.table}>
            {rows.map((row, index) => (
                <View key={row.key} style={[styles.row, index === rows.length - 1 && { borderBottomWidth: 0 }]}>
                    <Text style={[textStyles.body, styles.label]}>{row.label}</Text>
                    {renderAmount(
                        row.value,
                        [textStyles.body, styles.value, row.value === NA && styles.na]
                    )}
                </View>
            ))}
        </View>
    );

    const renderInfoRow = (label, value, { money = false } = {}) => {
        const display = isEmptyValue(value) ? NA : String(value);
        const valueStyle = [textStyles.bodySmall, styles.infoValue, (display === NA) && styles.na];
        return (
            <View style={styles.infoRow}>
                <Text style={[textStyles.bodySmall, styles.infoLabel]}>{label}</Text>
                {money
                    ? renderAmount(display, valueStyle)
                    : <Text style={valueStyle}>{display}</Text>}
            </View>
        );
    };

    const renderCollapsibleSection = (key, title, content, defaultOpen = true, iconName = 'file-document-outline') => {
        const open = sectionShow[key] ?? defaultOpen;
        return (
            <View style={styles.sectionCard}>
                <TouchableOpacity
                    onPress={() => setSectionShow(prev => ({ ...prev, [key]: !open }))}
                    style={styles.sectionHeader}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                        <MaterialDesignIcons name={iconName} size={22} color={meta.accent} />
                        <Text style={textStyles.body}>{title}</Text>
                    </View>
                    <Icon name={open ? 'chevron-up' : 'chevron-down'} size={28} color={color.icon} />
                </TouchableOpacity>
                {open ? <View>{content}</View> : null}
            </View>
        );
    };

    const renderPolicyDetails = () => (
        <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: meta.softBg, alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent icon={meta.icon} size={22} tintColor={meta.accent} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={textStyles.subtitle}>
                        {model.quotation?.quotationNumber || model.quotation?.quotationNo || NA}
                    </Text>
                    <Text style={[textStyles.caption, { color: meta.accent, marginTop: 2, textTransform: 'uppercase' }]}>
                        {(model.quotation?.type || quoteType)}
                    </Text>
                </View>
            </View>

            {renderInfoRow('Policy Type', model.quotation?.policyType)}
            {renderInfoRow(
                'Quotation Date',
                model.quotation?.quotationDate ? formattedDate(model.quotation.quotationDate) : null
            )}
            {renderInfoRow('Company', model.quotation?.companyName)}
            {renderInfoRow('Product', model.quotation?.productName)}
            {renderInfoRow('Customer Name', model.customer?.clientName)}
            {renderInfoRow('Broker', model.customer?.brokerName)}
            {renderInfoRow('IMD', model.customer?.imdName || model.customer?.imd)}
            {renderInfoRow('Risk Location', model.risk?.location || model.risk?.riskLocation)}
            {renderInfoRow('City', model.risk?.city || model.risk?.district)}
            {renderInfoRow('State', model.risk?.state)}
            {renderInfoRow('Pin Code', model.risk?.pinCode)}
            {renderInfoRow('Earthquake Zone', model.risk?.earthquakeZone)}
            {renderInfoRow('Earthquake Rate', formatDisplayValue(model.risk?.earthquakeRate))}
            {renderInfoRow('Risk Code', model.risk?.riskCode ?? model.inputs?.riskCode)}
            {renderInfoRow('Occupancy', model.risk?.occupancy || model.risk?.riskDescription || model.inputs?.occupancy)}
            {renderInfoRow('Risk Sum Insured', formatDisplayValue(model.risk?.sumInsured, { money: true }), { money: true })}
            {renderInfoRow('Case Type', model.policy?.caseType)}
            {renderInfoRow('Previous Insurer', model.policy?.previousInsurer)}
            {renderInfoRow('Business Age', model.policy?.businessAge)}
            {renderInfoRow('Industry Type', model.policy?.industryType)}
            {renderInfoRow('Construction Type', model.policy?.constructionType)}
            {renderInfoRow('Burglary / RSMD / Theft', formatDisplayValue(model.covers?.burglaryRsmdTheft))}
            {renderInfoRow('Terrorism Cover', formatDisplayValue(model.covers?.terrorism))}
            {renderInfoRow('Fire Fighting Measures', formatDisplayValue(model.policy?.fireFightingMeasures))}
            {renderInfoRow('CCTV Installed', formatDisplayValue(model.policy?.cctvInstalled))}
            {renderInfoRow('Hypothecation', formatDisplayValue(model.policy?.hypothecationDetails ?? model.policy?.hypothecation))}
            {renderInfoRow('Bank Name', model.policy?.bankName)}
            {renderInfoRow('Bank Branch', model.policy?.bankBranch)}
            {renderInfoRow('Created', model.quotation?.createdAt ? formattedDate(model.quotation.createdAt) : null)}
            {renderInfoRow('Updated', model.quotation?.updatedAt ? formattedDate(model.quotation.updatedAt) : null)}
        </View>
    );

    const renderListSection = (items = []) => {
        if (!items.length) {
            return <Text style={[textStyles.bodySmall, styles.na, { paddingVertical: 8 }]}>{NA}</Text>;
        }
        return (
            <View style={{ gap: 8, paddingVertical: 6 }}>
                {items.map((item, index) => (
                    <View key={`${index}`} style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={[textStyles.bodySmall, { color: meta.accent, fontWeight: '700' }]}>{index + 1}.</Text>
                        <Text style={[textStyles.bodySmall, { flex: 1 }]}>{item}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderAddons = () => {
        if (!model.addons.length) {
            return <Text style={[textStyles.bodySmall, styles.na, { paddingVertical: 8 }]}>{NA}</Text>;
        }
        return (
            <View style={{ gap: 10 }}>
                {model.addons.map((item, index) => (
                    <View key={`${item?.id || index}`} style={styles.addonCard}>
                        <View style={styles.addonHeader}>
                            <View style={[styles.addonBadge, { backgroundColor: meta.softBg }]}>
                                <Text style={[textStyles.caption, { color: meta.accent, fontWeight: '700' }]}>{index + 1}</Text>
                            </View>
                            <Text style={[textStyles.body, { fontWeight: '700', flex: 1 }]}>
                                {item?.name || item?.addonName || `Addon ${index + 1}`}
                            </Text>
                        </View>
                        {renderInfoRow('Sum Insured', formatDisplayValue(item?.value, { money: true }), { money: true })}
                    </View>
                ))}
            </View>
        );
    };

    const renderCoverageSections = () => {
        if (!model.coverageSections?.length) {
            return <Text style={[textStyles.bodySmall, styles.na, { paddingVertical: 8 }]}>{NA}</Text>;
        }

        return (
            <View style={{ gap: 12 }}>
                {model.coverageSections.map((section, index) => (
                    <View key={section?.section_key || index} style={styles.addonCard}>
                        <Text style={[textStyles.body, { fontWeight: '700', marginBottom: 6 }]}>
                            {section?.section_name || `Section ${index + 1}`}
                        </Text>
                        {renderInfoRow('Rate', formatDisplayValue(section?.rate))}
                        {renderInfoRow('Premium', formatDisplayValue(section?.premium, { money: true }), { money: true })}
                        {renderInfoRow('Excess', section?.excess)}
                        {renderInfoRow(
                            'Total SI',
                            formatDisplayValue(section?.total_sum_insured ?? section?.totalSumInsured, { money: true }),
                            { money: true }
                        )}
                        {renderInfoRow(
                            'Total Premium',
                            formatDisplayValue(section?.total_premium ?? section?.totalPremium, { money: true }),
                            { money: true }
                        )}

                        <View style={{ marginTop: 8, gap: 4 }}>
                            <Text style={[textStyles.caption, { color: color.secondaryText, fontWeight: '700' }]}>
                                Items
                            </Text>
                            {(section?.items || []).map((item, itemIndex) => (
                                <View key={`${index}-${itemIndex}`} style={styles.infoRow}>
                                    <Text style={[textStyles.bodySmall, styles.infoLabel]}>
                                        {item?.particular || `Item ${itemIndex + 1}`}
                                    </Text>
                                    {renderAmount(
                                        formatMoney(item?.sum_insured ?? item?.sumInsured),
                                        [textStyles.bodySmall, styles.infoValue]
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    const sumInsuredRows = [
        ...buildRows(model.assetBreakup, FIRE_ASSET_KEYS, { money: true, labels: FIRE_LABELS }),
        ...buildRows(model.sumInsured, FIRE_SI_SECTION_KEYS, { money: true, labels: FIRE_LABELS }),
    ].filter((row) => row.value !== NA || FIRE_ASSET_KEYS.includes(row.key) || row.key === 'total');

    const footerBottomPad = Math.max(insets.bottom, 12);

    return (
        <View style={styles.screen}>
            <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                <BackHeader title={meta.title} />
                <View style={styles.sheet}>
                    {loading && !data ? (
                        <View style={styles.inlineLoader}>
                            <ActivityIndicator size="large" color={meta.accent} />
                            <Text style={[textStyles.bodySmall, { color: color.secondaryText, marginTop: 10 }]}>
                                Loading quotation…
                            </Text>
                        </View>
                    ) : (
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 110 + footerBottomPad }}
                    >
                        <View style={{ gap: 12, padding: 20 }}>
                            {renderCollapsibleSection('policyDetails', 'Policy Details', renderPolicyDetails(), true, 'file-document-outline')}

                            <View style={styles.summaryStrip}>
                                <View style={[styles.summaryCell, styles.summaryBorder]}>
                                    <FontAwesome6 name="calculator" size={18} color={meta.accent} />
                                    <Text style={[textStyles.caption, { color: color.secondaryText }]}>Total SI</Text>
                                    {renderAmount(
                                        formatMoney(model.totalSi),
                                        [textStyles.bodySmall, styles.summaryAmount, { color: meta.accent }]
                                    )}
                                </View>
                                <View style={[styles.summaryCell, styles.summaryBorder]}>
                                    <FontAwesome6 name="wallet" size={18} color={meta.accent} />
                                    <Text style={[textStyles.caption, { color: color.secondaryText }]}>Net</Text>
                                    {renderAmount(
                                        formatMoney(model.premium?.netPremium),
                                        [textStyles.bodySmall, styles.summaryAmount, { color: meta.accent }]
                                    )}
                                </View>
                                <View style={[styles.summaryCell, styles.summaryBorder]}>
                                    <FontAwesome6 name="percent" size={18} color={meta.accent} />
                                    <Text style={[textStyles.caption, { color: color.secondaryText }]}>GST</Text>
                                    {renderAmount(
                                        formatMoney(model.premium?.gstAmount),
                                        [textStyles.bodySmall, styles.summaryAmount, { color: meta.accent }]
                                    )}
                                </View>
                                <View style={styles.summaryCell}>
                                    <FontAwesome6 name="chart-line" size={18} color={meta.accent} />
                                    <Text style={[textStyles.caption, { color: color.secondaryText }]}>Gross</Text>
                                    {renderAmount(
                                        formatMoney(model.premium?.grossPremium),
                                        [textStyles.bodySmall, styles.summaryAmount, { color: meta.accent }]
                                    )}
                                </View>
                            </View>

                            {renderCollapsibleSection(
                                'coverage',
                                `Coverage Sections (${model.coverageSections?.length || 0})`,
                                renderCoverageSections(),
                                true,
                                'shield-outline'
                            )}

                            {renderCollapsibleSection(
                                'discounts',
                                'Discounts',
                                renderRows(buildRows(model.discounts, FIRE_DISCOUNT_KEYS, { percent: true, labels: FIRE_LABELS })),
                                true,
                                'tag-outline'
                            )}

                            {renderCollapsibleSection(
                                'sumInsured',
                                'Sum Insured',
                                renderRows(sumInsuredRows),
                                true,
                                'cash-multiple'
                            )}

                            {renderCollapsibleSection(
                                'rates',
                                'Rates',
                                renderRows(buildRows(model.rates, FIRE_RATE_KEYS, { labels: FIRE_LABELS })),
                                true,
                                'percent-outline'
                            )}

                            {renderCollapsibleSection(
                                'premium',
                                'Premium',
                                renderRows(buildRows(model.premium, FIRE_PREMIUM_KEYS, {
                                    money: true,
                                    labels: FIRE_LABELS,
                                })),
                                true,
                                'currency-inr'
                            )}

                            {renderCollapsibleSection(
                                'addons',
                                `Addons (${model.addons.length})`,
                                renderAddons(),
                                true,
                                'plus-circle-outline'
                            )}

                            {renderCollapsibleSection(
                                'wordings',
                                `Wordings (${model.wordings.length})`,
                                renderListSection(model.wordings),
                                false,
                                'format-list-bulleted'
                            )}

                            {renderCollapsibleSection(
                                'terms',
                                `Terms & Conditions (${model.termsConditions.length})`,
                                renderListSection(model.termsConditions),
                                false,
                                'text-box-outline'
                            )}

                            {renderCollapsibleSection(
                                'remarks',
                                'Remarks',
                                <Text style={[textStyles.bodySmall, { paddingVertical: 6 }, isEmptyValue(model.remarks) && styles.na]}>
                                    {isEmptyValue(model.remarks) ? NA : model.remarks}
                                </Text>,
                                false,
                                'message-text-outline'
                            )}
                        </View>
                    </ScrollView>
                    )}
                </View>
            </SafeAreaView>

            <View pointerEvents="box-none" style={[styles.stickyFooter, { paddingBottom: footerBottomPad }]}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={loading || !data}
                    onPress={handleExportPdf}
                    style={[styles.footerBtn, styles.footerBtnSecondary, (loading || !data) && { opacity: 0.5 }]}
                >
                    <Text style={[styles.footerBtnText, { color: color.primaryBlueDark }]}>Export PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={loading || !data}
                    onPress={handleUpdateQuotation}
                    style={[styles.footerBtn, { backgroundColor: meta.accent, borderColor: meta.accent }, (loading || !data) && { opacity: 0.5 }]}
                >
                    <Text style={[styles.footerBtnText, { color: color.white }]}>Update Quotation</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default QuoteDetailScreen;

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
    inlineLoader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    stickyFooter: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        elevation: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: color.white,
        borderTopWidth: 1,
        borderTopColor: color.borderColor,
    },
    footerBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    footerBtnSecondary: {
        backgroundColor: color.white,
        borderColor: color.primaryBlueDark,
    },
    footerBtnText: {
        fontSize: 15,
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        paddingVertical: 2,
    },
    infoLabel: {
        fontWeight: '600',
        color: color.secondaryText,
        flexShrink: 1,
        maxWidth: '40%',
        marginRight: 8,
    },
    infoValue: {
        flex: 1,
        flexShrink: 0,
        textAlign: 'right',
        color: color.mainText,
    },
    na: {
        color: color.secondaryText,
        fontStyle: 'italic',
    },
    summaryStrip: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: color.borderColor,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    summaryCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 4,
        paddingHorizontal: 6,
        minWidth: 0,
    },
    summaryAmount: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '700',
    },
    summaryBorder: {
        borderRightWidth: 1,
        borderColor: color.borderColor,
    },
    sectionCard: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: color.borderColor,
        padding: 10,
        gap: 10,
        backgroundColor: '#FFFFFF',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    table: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        marginVertical: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    label: {
        flexShrink: 1,
        maxWidth: '42%',
        marginRight: 10,
    },
    value: {
        flex: 1,
        flexShrink: 0,
        textAlign: 'right',
        minWidth: 0,
    },
    addonCard: {
        gap: 6,
        borderWidth: 1,
        borderColor: color.borderColor,
        borderRadius: 8,
        padding: 10,
        backgroundColor: color.lightSerface,
    },
    addonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4,
    },
    addonBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
