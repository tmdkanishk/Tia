import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/SearchBar'
import { color } from '../../utility/color';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../../utility/textStyles';
import { useNavigation } from '@react-navigation/native';
import { getQuotations } from '../../features/quotations/quotationsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { resetQuotationList, setLoading, setQuotationData, setRefresh, setSearch, setTab } from '../../features/quotations/quotationsSlice';
import { formattedDate } from '../../utility/helper';
import { IconComponent, icons } from '../../components/IconComponent';



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

    const navigation = useNavigation();

    useEffect(() => {
        if (page == 1) {
            fetchQuotations();
        }
    }, [search, tab]);

    const fetchQuotations = async (currentPage = 1) => {
        try {
            dispatch(setLoading(true));
            const response = await getQuotations({
                page: currentPage,
                search,
                tab
            });
            console.log("response", response);
            const data = response?.data?.data || [];
            dispatch(
                setQuotationData({
                    page: currentPage,
                    data,
                    hasMore: data.length > 0
                })
            );
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const onchangeText = (text) => {
        dispatch(resetQuotationList());
        dispatch(setSearch(text));
    };

    const onSelectTab = (key) => {
        dispatch(resetQuotationList());
        dispatch(setTab(key));
    };

    const handleLoadMore = () => {
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        // dispatch(setPage(nextPage));
        fetchQuotations(nextPage);
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('QuoteDetail', { quoteId: item?.id, quoteType: item?.quoteType })} style={{ paddingVertical: 10, paddingHorizontal: 6, borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, flexDirection: 'row', borderLeftWidth: 4, borderLeftColor: item?.quoteType == 'fire' ? color.fire : item?.quoteType == 'business' ? color.primaryBlue : color.icon, justifyContent: 'space-between' }}>
            <View style={{ width: '65%', borderRightWidth: 1, borderColor: color.borderColor, gap: 10 }}>
                <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                    <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: color.lightBlueBackground, alignItems: 'center', justifyContent: 'center' }}>
                        {item?.quoteType == 'fire' ? <IconComponent icon={icons.fire} size={22} tintColor={color.fire} />
                            : item?.quoteType == 'business' ? <IconComponent icon={icons.businessins} size={22} tintColor={color.primaryBlue} /> :
                                <IconComponent icon={icons.industry} size={22} tintColor={color.icon} />
                        }
                    </View>
                    <View style={{ gap: 5, width: '80%', }}>
                        <Text style={textStyles.subtitle}>{item?.customerName || 'null'}</Text>
                        <Text style={[textStyles.bodySmall, { fontSize: 13 }]}>{item?.quoteNo}</Text>

                        <View style={{ flexDirection: 'row', width: '100%', }}>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', gap: 6, backgroundColor: color.lightBlueBackground, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, flexShrink: 1 }}>
                                <MaterialCommunityIcons name="warehouse" size={18} />
                                <Text style={[textStyles.caption, { flexShrink: 1 }]}>{item?.occupancy}</Text>
                            </View>
                        </View>

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
                    <Text style={[textStyles.caption,]}>{Number(item?.totalSi).toLocaleString('en-IN')}</Text>
                    <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Gross Premium</Text>

                    <Text style={[textStyles.caption, { color: color.primaryBlue }]}>{Number(item?.grossPremium).toLocaleString('en-IN')}</Text>
                </View>

                <View style={{ paddingLeft: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: item?.quoteType == 'fire' ? color.lightFire : color.lightBlueBackground, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}>
                        <Icon name="layers" size={16} color={item?.quoteType == 'fire' ? color.fire : item?.quoteType == 'business' ? color.primaryBlue : color.icon} />
                        <Text style={[textStyles.caption, { color: item?.quoteType == 'fire' ? color.fire : item?.quoteType == 'business' ? color.primaryBlue : color.icon }]}>{item?.addons?.length} Addons</Text>
                    </View>
                    <Icon name="chevron-right" size={22} />
                </View>
            </View>

        </TouchableOpacity>
    )

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
            console.log("calling refreshing")
            dispatch(setRefresh(true));
            dispatch(resetQuotationList());
            await fetchQuotations();
        } catch (error) {

        } finally {
            dispatch(setRefresh(false));
        }


    }

    return (
        <View style={{ gap: 12, height: '80%', backgroundColor: '#fff', }}>
            <SearchBar onChangeText={onchangeText} value={search} />
            {
                renderHeader()
            }
            <FlatList
                data={quotations}
                // ListHeaderComponent={renderHeader}
                renderItem={renderItem}
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
                    loading && <ActivityIndicator size={'large'} color={color.primaryBlueDark} />
                }
            />
        </View>
    )
}

export default QuotationsComponent