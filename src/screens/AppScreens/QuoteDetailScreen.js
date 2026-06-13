import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { color } from '../../utility/color';
import BackHeader from '../../components/BackHeader'
import { globalStyles } from '../../utility/globalStyles';
import Icon from 'react-native-vector-icons/Feather';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../../utility/textStyles';
import { checkPermission } from '../../utility/permissions';
// Import RNFetchBlob for the file download
import { IconComponent, icons } from '../../components/IconComponent';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { getQuotationDetails } from '../../features/quotations/quotationsAPI';
import { BASE_URL } from '../../config/env';
import { useDispatch, useSelector } from 'react-redux';
import { setAppLoading, showModal } from '../../features/app/appSlice';
import { formattedDate } from '../../utility/helper';
import { sumInsuredLabels, discountLabels, rateLabels, premiumLabels } from '../../utility/labels';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
const QuoteDetailScreen = ({ route }) => {
    const { quoteId, quoteType } = route.params;
    const dispatch = useDispatch();
    const { accessToken } = useSelector(state => state.auth);

    const [data, setData] = useState(null);
    const [sectionShow, setSectionShow] = useState({
        sumInsured: false,
        discount: false,
        rate: false,
        premiumBreackdown: false,
        additonalCover: false
    });


    useEffect(() => {
        fetchQuotationDetails();
    }, []);

    const fetchQuotationDetails = async () => {
        try {
            dispatch(setAppLoading(true));
            const response = await getQuotationDetails(quoteId);
            console.log("Quotation Details response ", response.data?.data);
            setData(response.data?.data);
        } catch (error) {
            console.log("error dfsg", error.response.data);
        } finally {
            dispatch(setAppLoading(false));
        }
    }

    const toggleSection = (section) => {
        setSectionShow((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const downloadFile = async (ext, url) => {
        try {
            console.log(ext, url);
            const needsStoragePermission =
                Platform.OS === 'android' &&
                Platform.Version <= 28;

            if (needsStoragePermission) {
                const status = await checkPermission();
                if (status) {
                    download(ext, url);
                }
            } else {
                download(ext, url);
            }

        } catch (error) {
            console.log(error)
        }

    }

    const download = async (ext, url) => {
        try {
            dispatch(setAppLoading(true));

            // Main function to download the image

            // To add the time suffix in filename
            let date = new Date();

            // let file = `${BASE_URL}/api/quotations/export/${quoteId}/export/pdf`
            let file = `${BASE_URL}${url}`
            // Getting the extention of the file
            // let ext = getExtention(file);
            // ext = '.' + ext[0];
            // Get config and fs from RNFetchBlob
            // config: To pass the downloading related options
            // fs: Directory path where we want our image to download
            const { config, fs } = ReactNativeBlobUtil;
            let PictureDir = fs.dirs.DownloadDir;
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    // Related to the Android only
                    useDownloadManager: true,
                    notification: true,
                    path:
                        PictureDir +
                        '/doc_' +
                        Math.floor(date.getTime() + date.getSeconds() / 2) +
                        ext,
                    description: 'Downloading File',
                },
            };
            await config(options)
                .fetch('GET', file,
                    {
                        Authorization: `Bearer ${accessToken}`,
                    }
                )
                .then(res => {
                    // Showing alert after successful downloading
                    console.log('res -> ', JSON.stringify(res));
                    // alert('Quote Downloaded Successfully.');
                    dispatch(
                        showModal({
                            title: 'Success',
                            message: 'Quotation downloaded successfully.',
                        })
                    );
                });

        } catch (error) {
            dispatch(
                showModal({
                    title: 'Failed',
                    message: 'Something went wrong. Please try again later.',
                })
            );

        } finally {
            dispatch(setAppLoading(false));
        }


    };




    return (
        <View style={{ flex: 1, backgroundColor: color.screenBackground }}>
            <SafeAreaView>
                <View style={globalStyles.newContainer}>
                    <BackHeader title={'Quotation Details'} />
                    <View style={{ flex: 1, backgroundColor: color.screenBackground, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 12 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ gap: 12, padding: 20 }}>
                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: color.lightBlueBackground, alignItems: 'center', justifyContent: 'center' }}>
                                                {quoteType == 'fire' ? <IconComponent icon={icons.fire} size={22} tintColor={color.fire} />
                                                    : quoteType == 'business' ? <IconComponent icon={icons.businessins} size={22} tintColor={color.primaryBlue} /> :
                                                        <IconComponent icon={icons.industry} size={22} tintColor={color.icon} />
                                                }
                                            </View>
                                            <Text style={textStyles.subtitle}> {data?.quoteDetails?.quoteNo} </Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ width: '70%', flexDirection: 'row', gap: 10 }}>
                                            <FontAwesome6 name="user-large" size={18} color={color.primaryBlueDark} />
                                            <Text style={textStyles.bodySmall}>{data?.quoteDetails?.customerName}</Text>
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ width: '70%', flexDirection: 'row', gap: 10 }}>
                                            <FontAwesome6 name="location-dot" size={18} color={color.primaryBlueDark} />
                                            <Text style={textStyles.bodySmall}>{data?.riskDetails?.pinCode}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <FontAwesome6 name="calendar-days" size={18} color={color.primaryBlueDark} />
                                            <Text style={textStyles.bodySmall}>{formattedDate(data?.quoteDetails?.createdAt)}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[textStyles.bodySmall, { fontWeight: '600' }]} numberOfLines={2} ellipsizeMode='tail'>RiskCode :</Text>
                                        <Text style={[textStyles.bodySmall]} numberOfLines={2} ellipsizeMode='tail'> {data?.riskDetails?.riskCode}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[textStyles.bodySmall, { fontWeight: '600' }]} numberOfLines={2} ellipsizeMode='tail'>Address :</Text>
                                        <Text style={[textStyles.bodySmall]} numberOfLines={2} ellipsizeMode='tail'> {data?.riskDetails?.address}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[textStyles.bodySmall, { fontWeight: '600' }]} numberOfLines={2} ellipsizeMode='tail'>Occupancy :</Text>
                                        <Text style={[textStyles.bodySmall]} numberOfLines={2} ellipsizeMode='tail'> {data?.riskDetails?.occupancy}</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderWidth: 1,
                                        borderRadius: 6,
                                        borderColor: color.borderColor
                                    }}
                                >
                                    <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, paddingVertical: 10, borderColor: color.borderColor }}>
                                        <FontAwesome6 name="calculator" size={20} color={color.primaryBlueDark} />
                                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Total SI</Text>
                                        <Text style={[textStyles.bodySmall, { color: color.primaryBlue }]}> {Number(data?.sumInsured?.totalSi).toLocaleString('en-IN')}</Text>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, paddingVertical: 10, borderColor: color.borderColor }}>
                                        <FontAwesome6 name="chart-line" size={20} color={color.primaryBlueDark} />
                                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Gross Premium</Text>
                                        <Text style={[textStyles.bodySmall, { color: color.primaryBlue }]}>{Number(data?.premiums?.grossPremium).toLocaleString('en-IN')}</Text>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                                        <FontAwesome6 name="circle-plus" size={20} color={color.primaryBlueDark} />
                                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Addons</Text>
                                        <Text style={[textStyles.bodySmall, { color: color.primaryBlue }]} >{data?.addons.length} Selected</Text>
                                    </View>
                                </View>

                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <TouchableOpacity onPress={() => toggleSection('sumInsured')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={22} color={color.primaryBlueDark} />
                                            <Text style={textStyles.body}>Sum Insured Details</Text>
                                        </View>
                                        <Icon name={sectionShow.sumInsured ? "chevron-up" : "chevron-down"} size={28} color={color.icon} />
                                    </TouchableOpacity>

                                    <View style={{ display: sectionShow.sumInsured ? 'flex' : 'none' }}>

                                        <View style={styles.table}>
                                            {Object.entries(data?.sumInsured || {}).map(([key, value], index, arr) => (
                                                <View
                                                    key={key}
                                                    style={[
                                                        styles.row,
                                                        index === arr.length - 1 && { borderBottomWidth: 0 },
                                                    ]}
                                                >
                                                    <Text style={[textStyles.body, styles.label]}>
                                                        {sumInsuredLabels[key] || key}
                                                    </Text>

                                                    <Text style={[textStyles.body, styles.value]}>
                                                        {Number(value).toLocaleString('en-IN')}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                    </View>
                                </View>


                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <TouchableOpacity onPress={() => toggleSection('discount')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={22} color={color.primaryBlueDark} />
                                            <Text style={textStyles.body}>Discounts</Text>
                                        </View>
                                        <Icon name={sectionShow.discount ? "chevron-up" : "chevron-down"} size={28} color={color.icon} />

                                    </TouchableOpacity>

                                    <View style={{ display: sectionShow.discount ? 'flex' : 'none' }}>
                                        <View style={styles.table}>
                                            {Object.entries(data?.discounts || {}).map(([key, value], index, arr) => (
                                                <View
                                                    key={key}
                                                    style={[
                                                        styles.row,
                                                        index === arr.length - 1 && { borderBottomWidth: 0 },
                                                    ]}
                                                >
                                                    <Text style={[textStyles.body, styles.label]}>
                                                        {discountLabels[key] || key}
                                                    </Text>

                                                    <Text style={[textStyles.body, styles.value]}>
                                                        {`${value}%`}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>

                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <TouchableOpacity onPress={() => toggleSection('rate')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={22} color={color.primaryBlueDark} />
                                            <Text style={textStyles.body}>Rate</Text>
                                        </View>
                                        <Icon name={sectionShow.rate ? "chevron-up" : "chevron-down"} size={28} color={color.icon} />
                                    </TouchableOpacity>
                                    <View style={{ display: sectionShow.rate ? 'flex' : 'none' }}>
                                        <View style={styles.table}>
                                            {Object.entries(data?.rates || {}).map(([key, value], index, arr) => (
                                                <View
                                                    key={key}
                                                    style={[
                                                        styles.row,
                                                        index === arr.length - 1 && { borderBottomWidth: 0 },
                                                    ]}
                                                >
                                                    <Text style={[textStyles.body, styles.label]}>
                                                        {rateLabels[key] || key}
                                                    </Text>

                                                    <Text style={[textStyles.body, styles.value]}>
                                                        {Number(value).toLocaleString('en-IN')}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>

                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <TouchableOpacity onPress={() => toggleSection('premiumBreackdown')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={22} color={color.primaryBlueDark} />
                                            <Text style={textStyles.body}>Premium & Breackdown</Text>
                                        </View>
                                        <Icon name={sectionShow.premiumBreackdown ? "chevron-up" : "chevron-down"} size={28} color={color.icon} />
                                    </TouchableOpacity>
                                    <View style={{ display: sectionShow.premiumBreackdown ? 'flex' : 'none' }}>
                                        <View style={styles.table}>
                                            {Object.entries(data?.premiums || {}).map(([key, value], index, arr) => (
                                                <View
                                                    key={key}
                                                    style={[
                                                        styles.row,
                                                        index === arr.length - 1 && { borderBottomWidth: 0 },
                                                    ]}
                                                >
                                                    <Text style={[textStyles.body, styles.label]}>
                                                        {premiumLabels[key] || key}
                                                    </Text>

                                                    <Text style={[textStyles.body, styles.value]}>
                                                        {Number(value).toLocaleString('en-IN')}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>

                                {data?.addons?.length > 0 && <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <TouchableOpacity onPress={() => toggleSection('additonalCover')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={22} color={color.primaryBlueDark} />
                                            <Text style={textStyles.body}>Additional Covers (Addons)</Text>
                                        </View>
                                        <Icon name={sectionShow.additonalCover ? "chevron-up" : "chevron-down"} size={28} color={color.icon} />
                                    </TouchableOpacity>
                                    <View style={{ display: sectionShow.additonalCover ? 'flex' : 'none', gap: 10 }}>
                                        {
                                            data?.addons?.map((item, index) => (
                                                <View key={index} style={{ flex: 1, gap: 6, borderBottomWidth: 1, paddingBottom: 6, borderColor: color.borderColor }}>
                                                    <Text style={textStyles.body}>{`${index + 1}. ${item?.addonName}`}</Text>
                                                    <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>{item?.remarksSi}</Text>
                                                </View>
                                            ))
                                        }

                                    </View>
                                </View>}


                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={() => downloadFile('.pdf', data?.exports?.pdfUrl)} style={{ width: '48%', borderWidth: 1, borderColor: color.borderColor, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                        <IconComponent icon={icons.pdfFile} size={24} />
                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>Export PDF</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => downloadFile('.xlsx', data?.exports?.excelUrl)} style={{ width: '48%', borderWidth: 1, borderColor: color.borderColor, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                        <IconComponent icon={icons.excelFile} size={24} />
                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>Export Excel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View >
            </SafeAreaView >
        </View >
    )
}

export default QuoteDetailScreen


const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        marginVertical: 10,
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
        // flex: 1,
        marginRight: 10,
        width: '60%',
    },
    value: {
        flex: 1,
        textAlign: 'right',
    },
});
