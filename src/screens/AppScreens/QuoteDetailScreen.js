import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native'
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
import apiClient from '../../services/apiClient';
import { BASE_URL } from '../../config/env';
import { useDispatch, useSelector } from 'react-redux';
import { setAppLoading } from '../../features/app/appSlice';

const QuoteDetailScreen = ({ route }) => {
    const { quoteId } = route.params;
    const [data, setData] = useState(null);
    const { accessToken } = useSelector(state => state.auth);
    const dispatch = useDispatch()

    useEffect(() => {
        fetchQuotationDetails();
    }, []);

    const fetchQuotationDetails = async () => {
        try {
            dispatch(setAppLoading(true));
            const response = await getQuotationDetails(quoteId);
            console.log("response", response);
        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            dispatch(setAppLoading(false));
        }
    }

    const downloadFile = async () => {
        try {
            const needsStoragePermission =
                Platform.OS === 'android' &&
                Platform.Version <= 28;

            if (needsStoragePermission) {
                const status = await checkPermission();
                if (status) {
                    download();
                }
            } else {
                download();
            }

        } catch (error) {
            console.log(error)
        }
    }

    const download = () => {
        // Main function to download the image

        // To add the time suffix in filename
        let date = new Date();
        // Image URL which we want to download
        let file = `${BASE_URL}/api/quotations/export/${quoteId}/export/pdf`
        // Getting the extention of the file
        let ext = getExtention(file);
        ext = '.' + ext[0];
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
                    '.pdf',
                description: 'Downloading File',
            },
        };
        config(options)
            .fetch('GET', file,
                {
                    Authorization: `Bearer ${accessToken}`,
                }
            )
            .then(res => {
                // Showing alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                alert('Quote Downloaded Successfully.');
            });
    };

    //     const download = async () => {
    //     try {
    //         const response = await apiClient.get(
    //             '/api/quotations/export/8/export/pdf',
    //             {
    //                 responseType: 'arraybuffer',
    //             }
    //         );

    //         const { fs } = ReactNativeBlobUtil;

    //         const filePath =
    //             fs.dirs.DownloadDir +
    //             `/quotation_${Date.now()}.pdf`;

    //         const binary = response.data;

    //         const base64 = ReactNativeBlobUtil.base64.encode(binary);

    //         await fs.writeFile(filePath, base64, 'base64');

    //         console.log('Saved:', filePath);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const getExtention = filename => {
        // To get the file extension
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };


    return (
        <View style={{ flex: 1, backgroundColor: color.screenBackground }}>
            <SafeAreaView>
                <View style={globalStyles.newContainer}>
                    <BackHeader title={'Quote Details'} />
                    <View style={{ flex: 1, backgroundColor: color.screenBackground, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 12 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ gap: 12, padding: 20 }}>
                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: color.lightBlueBackground, alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon name="file-text" size={22} color={color.primaryBlue} />
                                            </View>
                                            <Text style={textStyles.subtitle}>IAR-46585765</Text>
                                        </View>
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: color.successGreen, borderRadius: 6, marginLeft: 10 }}>
                                            <Text style={[textStyles.caption, { color: color.lightText }]}>PDF Exported</Text>
                                        </View>

                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Text style={{ width: '49%' }}>Customer   : {' Name'}</Text>
                                        <Text style={{ width: '49%' }}>Risk Code  : {' 2454'}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Text style={{ width: '49%' }}>Pincode      : {' Name'}</Text>
                                        <Text style={{ width: '49%' }}>Date            : {' 07 jun 2026'}</Text>
                                    </View>
                                    <Text style={{ width: '49%' }}>Address      : {' Address'}</Text>
                                    <Text style={{ width: '49%' }}>Occupancy : {' Occupancy'}</Text>
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
                                    <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, padding: 10, borderColor: color.borderColor }}>
                                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Total SI</Text>
                                        <Text style={[textStyles.body, { color: color.primaryBlue }]}>46546464</Text>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, padding: 10, borderColor: color.borderColor }}>
                                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Gross Premium</Text>
                                        <Text style={[textStyles.body, { color: color.primaryBlue }]}>46546464</Text>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                                        <Text style={[textStyles.bodySmall, { color: color.secondaryText }]}>Addons</Text>
                                        <Text >3 Selected</Text>
                                    </View>
                                </View>

                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={28} color={color.primaryBlueDark} />
                                            <Text style={textStyles.body}>Sum Insured Details</Text>
                                        </View>
                                        <Icon name="chevron-down" size={28} color={color.icon} />
                                    </View>

                                    {/* <View>

                                    </View> */}
                                </View>


                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={28} color={color.successGreen} />
                                            <Text style={textStyles.body}>Coverages</Text>
                                        </View>
                                        <Icon name="chevron-down" size={28} color={color.icon} />
                                    </View>
                                    {/* 
                                    <View>

                                    </View> */}
                                </View>

                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={28} color={color.successGreen} />
                                            <Text style={textStyles.body}>Rate & Discounts</Text>
                                        </View>
                                        <Icon name="chevron-down" size={28} color={color.icon} />
                                    </View>
                                    {/* 
                                    <View>

                                    </View> */}
                                </View>

                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={28} color={color.successGreen} />
                                            <Text style={textStyles.body}>Premium & Breackdown</Text>
                                        </View>
                                        <Icon name="chevron-down" size={28} color={color.icon} />
                                    </View>
                                    {/* 
                                    <View>

                                    </View> */}
                                </View>

                                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.borderColor, padding: 10, gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MaterialDesignIcons name="shield-check" size={28} color={color.successGreen} />
                                            <Text style={textStyles.body}>Additional Covers (Addons)</Text>
                                        </View>
                                        <Icon name="chevron-down" size={28} color={color.icon} />
                                    </View>
                                    {/* 
                                    <View>

                                    </View> */}
                                </View>


                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={downloadFile} style={{ width: '48%', borderWidth: 1, borderColor: color.borderColor, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                        <IconComponent icon={icons.pdfFile} size={24} />
                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>Export PDF</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={downloadFile} style={{ width: '48%', borderWidth: 1, borderColor: color.borderColor, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                        <IconComponent icon={icons.excelFile} size={24} />
                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>Export Excel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default QuoteDetailScreen
