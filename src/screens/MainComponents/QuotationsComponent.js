import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import SearchBar from '../../components/SearchBar'
import { color } from '../../utility/color'
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../../utility/textStyles';
import { useNavigation } from '@react-navigation/native';
import { deleteQuotation, getQuotations, normalizeQuoteType } from '../../features/quotations/quotationsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { removeQuotation, resetQuotationList, setLoading, setQuotationData, setRefresh, setSearch, setTab } from '../../features/quotations/quotationsSlice';
import { formattedDate } from '../../utility/helper';
import { IconComponent, icons } from '../../components/IconComponent';
import QuotationSkeleton from '../../components/QuotationSkeleton';
import { setAppLoading, showModal } from '../../features/app/appSlice';

const PAGE_LIMIT = 10;

const tabs = [
    {
        key: 'all',
        label: 'ALL',
        icon: 'view-dashboard'
    },
    {
        key: 'fire',
        label: 'Fire',
        icon: 'fire'
    },
    {
        key: 'business',
        label: 'Business',
        icon: 'briefcase-variant'
    },
    {
        key: 'iar',
        label: 'IAR',
        icon: 'shield-check'
    }
]

const QuotationsComponent = () => {
    const dispatch = useDispatch();
    const { quotations, page, loading, refresh, hasMore, search, tab } = useSelector(state => state.quotations);
    const fetchingRef = useRef(false);

    const navigation = useNavigation();

    const fetchQuotations = useCallback(async (currentPage = 1) => {
        if (fetchingRef.current && currentPage > 1) return;
        fetchingRef.current = true;

        try {
            dispatch(setLoading(true));
            const response = await getQuotations({
                page: currentPage,
                limit: PAGE_LIMIT,
                search,
                tab,
            });
            console.log("response", response);
            // GET /api/quotations → { success, data: [...], pagination }
            const rawData = Array.isArray(response?.data?.data)
                ? response.data.data
                : Array.isArray(response?.data)
                    ? response.data
                    : [];
            const tabType = normalizeQuoteType(tab);
            // Map list summary fields to what the UI expects
            const data = rawData.map((item) => ({
                ...item,
                type: item?.type || item?.quoteType || tabType || null,
                quotationNo: item?.quotationNo || item?.quotationNumber || null,
                clientName: item?.clientName || item?.customerName || '-',
                sumInsured: item?.sumInsured ?? 0,
                grossPremium: item?.grossPremium ?? 0,
                createdAt: item?.createdAt || item?.created_at || null,
            }));
            const pagination = response?.data?.pagination;
            const hasMorePages = typeof pagination?.hasMore === 'boolean'
                ? pagination.hasMore
                : pagination
                    ? pagination.page < pagination.totalPages
                    : data.length >= PAGE_LIMIT;

            dispatch(
                setQuotationData({
                    page: currentPage,
                    data,
                    hasMore: hasMorePages,
                })
            );
        } catch (error) {
            console.log("error in fetchQuotations", error?.response?.data || error);
            dispatch(
                setQuotationData({
                    page: currentPage,
                    data: currentPage === 1 ? [] : [],
                    hasMore: false,
                })
            );
        } finally {
            fetchingRef.current = false;
            dispatch(setLoading(false));
        }
    }, [dispatch, search, tab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchQuotations(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [fetchQuotations]);

    const onchangeText = (text) => {
        dispatch(setSearch(text));
    };

    const onSelectTab = (key) => {
        if (tab === key) return;
        dispatch(resetQuotationList());
        dispatch(setTab(key));
    };

    const handleLoadMore = () => {
        if (loading || !hasMore || fetchingRef.current || quotations.length === 0) return;
        fetchQuotations(page + 1);
    };

    const getQuoteAccent = (quoteType) => {
        if (quoteType === 'fire') return color.fire;
        if (quoteType === 'business') return color.primaryBlue;
        return color.icon;
    };

    const getQuoteBg = (quoteType) => {
        if (quoteType === 'fire') return color.lightFire;
        return color.lightBlueBackground;
    };

    const getQuoteLabel = (quoteType) => {
        if (quoteType === 'fire') return 'Fire';
        if (quoteType === 'business') return 'Business';
        if (quoteType === 'iar') return 'IAR';
        return quoteType;
    };

    const handleDelete = (item, quoteType) => {
        Alert.alert(
            'Delete Quotation',
            `Delete ${item?.quotationNo || 'this quotation'}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            dispatch(setAppLoading(true));
                            await deleteQuotation(item?.id);
                            dispatch(removeQuotation({ id: item?.id, type: quoteType }));
                            dispatch(showModal({ title: 'Success', message: 'Quotation deleted successfully.' }));
                        } catch (error) {
                            dispatch(showModal({
                                title: 'Failed',
                                message: error?.response?.data?.message || 'Failed to delete quotation',
                            }));
                        } finally {
                            dispatch(setAppLoading(false));
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => {
        // List API tags rows with `type`: FIRE | BUSINESS | IAR
        const quoteType = normalizeQuoteType(item?.type || item?.quoteType) || normalizeQuoteType(tab) || 'fire';
        const accent = getQuoteAccent(quoteType);
        const softBg = getQuoteBg(quoteType);
        const typeLabel = getQuoteLabel(quoteType);

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('QuoteDetail', {
                    quoteId: item?.id,
                    quoteType,
                })}
                activeOpacity={0.85}
                style={{ paddingVertical: 10, paddingHorizontal: 6, borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, flexDirection: 'row', borderLeftWidth: 4, borderLeftColor: accent, justifyContent: 'space-between' }}
            >
                <View style={{ width: '65%', borderRightWidth: 1, borderColor: color.borderColor, gap: 10 }}>
                    <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                        <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: softBg, alignItems: 'center', justifyContent: 'center' }}>
                            {quoteType === 'fire' ? <IconComponent icon={icons.fire} size={22} tintColor={color.fire} />
                                : quoteType === 'business' ? <IconComponent icon={icons.businessins} size={22} tintColor={color.primaryBlue} /> :
                                    <IconComponent icon={icons.industry} size={22} tintColor={color.icon} />
                            }
                        </View>
                        <View style={{ gap: 5, width: '80%' }}>
                            <Text style={textStyles.subtitle}>{item?.clientName || '-'}</Text>
                            <Text style={[textStyles.bodySmall, { fontSize: 13 }]}>{item?.quotationNo || item?.quotationNumber || '-'}</Text>

                            {!!item?.companyName && (
                                <Text style={[textStyles.caption, { color: color.secondaryText }]}>{item?.companyName}</Text>
                            )}

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <Icon name="calendar" size={18} />
                                <Text style={[textStyles.caption,]}> {formattedDate(item?.createdAt)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ width: '35%', justifyContent: 'space-between', gap: 10 }}>
                    <View style={{ gap: 5, paddingLeft: 6 }}>
                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Total SI</Text>
                        <Text style={[textStyles.caption]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.55}>
                            {Number(item?.sumInsured || 0).toLocaleString('en-IN')}
                        </Text>
                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Gross Premium</Text>
                        <Text style={[textStyles.caption, { color: color.primaryBlue }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.55}>
                            {Number(item?.grossPremium || 0).toLocaleString('en-IN')}
                        </Text>
                    </View>

                    <View style={{ paddingLeft: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ backgroundColor: softBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                            <Text style={[textStyles.caption, { color: accent, fontWeight: '700', textTransform: 'uppercase' }]}>
                                {typeLabel}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={(e) => {
                                e?.stopPropagation?.();
                                handleDelete(item, quoteType);
                            }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{ padding: 6, borderRadius: 8, backgroundColor: '#FEE2E2' }}
                        >
                            <IconComponent icon={icons.delete} size={18} tintColor={color.error} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
            {
                tabs.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => onSelectTab(item.key)} style={{ width: '24%', alignItems: 'center', padding: 10, backgroundColor: tab == item.key ? color.primaryBlueDark : color.lightSerface, borderRadius: 6, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                        <MaterialCommunityIcons name={item.icon} size={18} color={tab == item.key && color.lightText} />
                        <Text style={[textStyles.bodySmall, { color: tab == item.key && color.lightText }]}>{item.label}</Text>
                    </TouchableOpacity>
                ))
            }
        </View >
    )

    const onRefresh = async () => {
        try {
            dispatch(setRefresh(true));
            dispatch(resetQuotationList());
            await fetchQuotations(1);
        } catch (error) {

        } finally {
            dispatch(setRefresh(false));
        }
    }

    const skeletonData = useMemo(
        () => Array.from({ length: 5 }, (_, i) => i),
        []
    );

    return (
        <View style={{ gap: 12, height: '80%', backgroundColor: '#fff', }}>
            <SearchBar onChangeText={onchangeText} value={search} />
            {renderHeader()}
            <FlatList
                data={quotations}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item?.type || item?.quoteType || 'q'}-${item?.id || index}`}
                contentContainerStyle={{ gap: 12, paddingBottom: 100, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshing={refresh}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    !loading &&
                    <View style={{}}>
                        <Text style={[textStyles.body, { color: color.secondaryText, textAlign: 'center' }]}>Quotation not found!</Text>
                    </View>
                }
                ListFooterComponent={
                    loading ? <>
                        {skeletonData.map((item, index) => (
                            <QuotationSkeleton key={index} />
                        ))}
                    </> : null
                }
            />
        </View>
    )
}

export default QuotationsComponent
