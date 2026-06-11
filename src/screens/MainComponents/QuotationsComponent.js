import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/SearchBar'
import { color } from '../../utility/color';
import Icon from 'react-native-vector-icons/Feather';
import { textStyles } from '../../utility/textStyles';
import { useNavigation } from '@react-navigation/native';
import { getQuotations } from '../../features/quotations/quotationsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { resetQuotationList, setLoading, setQuotationData, setSearch, setTab } from '../../features/quotations/quotationsSlice';
import { formattedDate } from '../../utility/helper';



const tabs = [
    {
        key: 'all',
        label: 'ALL'
    },
    {
        key: 'fire',
        label: 'Fire'
    },
    {
        key: 'business',
        label: 'Business'
    },
    {
        key: 'iar',
        label: 'IAR'
    }
]

const QuotationsComponent = () => {
    const dispatch = useDispatch();
    const { quotations, page, loading, hasMore, search, tab } = useSelector(state => state.quotations);

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
        <TouchableOpacity onPress={() => navigation.navigate('QuoteDetail', { quoteId: item?.id })} style={{ paddingVertical: 10, paddingHorizontal: 6, borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, flexDirection: 'row', }}>
            <View style={{ width: '60%', borderRightWidth: 1, borderColor: color.borderColor, gap: 10 }}>
                <View style={{ flexDirection: 'row', gap: 10, }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: color.lightBlueBackground, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="file-text" size={22} color={color.primaryBlue} />
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text style={textStyles.subtitle}>{item?.quoteNo || 'null'}</Text>
                        <Text style={textStyles.body}>{item?.customerName}</Text>
                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>{item?.occupancy}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, }}>
                        <View style={{ width: 40, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="calendar" size={22} color={color.secondaryText} />
                        </View>
                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}> {formattedDate(item?.createdAt)}</Text>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: color.successGreen, borderRadius: 6, marginLeft: 10 }}>
                            <Text style={[textStyles.caption, { color: color.lightText, textTransform: 'uppercase' }]}> {item?.quoteType} </Text>
                        </View>
                    </View>

                </View>

            </View>
            <View style={{ width: '35%', justifyContent: 'space-between', gap: 10 }}>
                <View style={{ gap: 5, paddingLeft: 6 }}>
                    <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Total SI</Text>
                    <Text style={[textStyles.body,]}>{item?.totalSi}</Text>
                    <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Gross Premium</Text>

                    <Text style={[textStyles.body, { color: color.primaryBlue }]}>{item?.grossPremium}</Text>
                </View>

                <View style={{ paddingLeft: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Addons: {item?.addons?.length}</Text>
                    <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="chevron-right" size={22} color={color.secondaryText} />
                    </View>
                </View>
            </View>

        </TouchableOpacity>
    )

    const renderHeader = () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {
                tabs.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => onSelectTab(item.key)} style={{ width: '24%', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: tab == item.key ? color.primaryBlueDark : color.borderColor, borderRadius: 6, backgroundColor: tab == item.key && color.lightBlueBackground }}>
                        <Text style={[textStyles.bodySmall, { color: tab == item.key && color.primaryBlueDark }]}>{item.label}</Text>
                    </TouchableOpacity>
                ))
            }
        </View >
    )

    return (
        <View style={{ gap: 12, height: '80%', backgroundColor: '#fff', }}>
            <SearchBar onChangeText={onchangeText} value={search} />
            <FlatList
                data={quotations}
                ListHeaderComponent={renderHeader}
                renderItem={renderItem}
                contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    !loading && <Text style={[textStyles.body, { color: color.secondaryText, textAlign: 'center' }]}>Not Found!</Text>
                }
                ListFooterComponent={
                    loading && <ActivityIndicator size={'large'} color={color.primaryBlueDark} />
                }
            />
        </View>
    )
}

export default QuotationsComponent