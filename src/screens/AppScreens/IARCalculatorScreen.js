import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, Image, Dimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import { IconComponent, icons } from '../../components/IconComponent'
import InputField from '../../components/InputField'
import CustomAutoSearchModal from '../../components/CustomAutoSearchModal'
import { calculatIARIndurance } from '../../features/iarInsurance/iARInsuranceAPI'
import ResultCardComponent from '../../components/ResultCardComponent'
import { globalStyles } from '../../utility/globalStyles'
import { useNavigation } from '@react-navigation/native'
import { color } from '../../utility/color'
import { riskIARCovers } from '../../utility/helper'
import CustomButton from '../../components/CustomButton'
import AddonSelector from '../../components/AddonSelector'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackHeader from '../../components/BackHeader'


const IARCalculatorScreen = () => {
    const { width } = Dimensions.get('window');
    const [modalVisible, setModalVisible] = useState(false);
    const [riskCover, setRiskCover] = useState(riskIARCovers)
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [viewButton, setViewButton] = useState(true);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [expanded, setExpanded] = useState({
        insuredDetails: true,
        optionalCovers: true,
        discounts: true,
        sumInsured: true,
        fireAllied: true,
        businessInterruption: true,
        machineryBreakdown: true,
        mlop: true
    });


    const [sumInsuredData, setSumInsuredData] = useState({
        buildingSI: '',
        plantAndMachinerySI: '',
        stockSI: '',
        furnitureFixturesFittingsSI: '',
        otherContentsSI: '',

    });

    const [fireAllied, setFireAllied] = useState({
        "sectionName": "Fire & Allied Perils",
        "buildingSI": '',
        "plantAndMachinerySI": '',
        "stockSI": '',
        "furnitureFixturesFittingsSI": '',
        "otherContentsSI": '',
        "earthquakeSI": '',
        "stfiSI": '',
        "terrorismSI": ''
    })

    const [businessInterruptionData, setBusinessInterruptionData] = useState(
        {
            "sectionName": "Business Interruption",
            "businessInterruptionSI": "",
            "terrorismSI": ""
        },
    )

    const [machineryData, setMachineryData] = useState(
        {
            "sectionName": "Machinery Breakdown",
            "machineryBreakdownSI": ""
        },
    )

    const [mlopData, setMlopData] = useState(
        {
            "sectionName": "MLOP",
            "mlopSI": ""
        },
    )

    const [totalSumInsured, setTotalSumInsured] = useState(null);

    const [form, setForm] = useState(
        {
            "customerDetails": {
                "customerName": null,
                "address": null,
                "pinCode": null,
                "riskCode": null,
                "occupancy": null,
                "description": null
            },

            "optionalCovers": {
                "terrorism": false,
                "mlop": false
            },

            "discounts": {
                "iibDiscountPercent": "",
                "eqDiscountPercent": "",
                "stfiDiscountPercent": ""
            }

        }
    );

    const handleChange = (section, field, value) => {
        setForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };


    const onSelectRiskCode = (data) => {
        handleChange("customerDetails", "riskCode", data?.risk_code);
        handleChange("customerDetails", "occupancy", data?.occupancy_desc);
    }


    const toggleRiskCover = (key) => {
        setRiskCover((prev) =>
            prev.map((item) =>
                item.key === key
                    ? { ...item, selected: !item.selected }
                    : item
            )
        );
    };

    const isRiskCoverSelected = (key) => {
        return riskCover.find((item) => item.key === key)?.selected;
    };

    const handleChangeText = (key, value) => {
        const updatedData = {
            ...sumInsuredData,
            [key]: value,
        };
        const total =
            (parseFloat(updatedData.buildingSI) || 0) +
            (parseFloat(updatedData.plantAndMachinerySI) || 0) +
            (parseFloat(updatedData.stockSI) || 0) +
            (parseFloat(updatedData.furnitureFixturesFittingsSI) || 0) +
            (parseFloat(updatedData.otherContentsSI) || 0);
        setSumInsuredData(updatedData);
        setTotalSumInsured(total.toString());
    };


    const handleFireAliedChangeText = (key, value) => {
        const updatedData = {
            ...fireAllied,
            [key]: value,
        };
        setFireAllied(updatedData);
    };

    const handleBusinessInterruptionChange = (key, value) => {
        setBusinessInterruptionData((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const handleIARCalculate = async () => {
        try {
            setLoading(true);

            const updatedForm = {
                customerDetails: form.customerDetails,

                optionalCovers: {
                    terrorism: isRiskCoverSelected('terrorism'),
                    mlop: isRiskCoverSelected('mlop'),
                },

                discounts: form.discounts,

                sumInsured: {
                    ...sumInsuredData
                },

                sections: {
                    section1: {
                        ...fireAllied,
                        earthquakeSI: totalSumInsured,
                        stfiSI: totalSumInsured,
                        terrorismSI: isRiskCoverSelected('terrorism') ? totalSumInsured : "0"
                    },

                    section2: {
                        ...businessInterruptionData,
                        terrorismSI: isRiskCoverSelected('terrorism') ? businessInterruptionData.terrorismSI : "0"
                    },

                    section3A: {
                        ...machineryData
                    },

                    section3B: {
                        ...mlopData,
                        mlopSI: isRiskCoverSelected('mlop') ? mlopData.mlopSI : '0'
                    }
                },
                addons: selectedAddons
            };

            console.log("updatedForm", updatedForm);

            const response = await calculatIARIndurance(updatedForm);
            setResult(response.data?.data)
            console.log("response", response);

        } catch (error) {
            console.log("error?.response?.data?.message", error?.response?.data);
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: color.screenBackground }}>
            <SafeAreaView>
                <View style={globalStyles.newContainer}>
                    <BackHeader title={'IAR Calculator'} subTitle={'Calculate premium for Industrial All Risk policies.'} />
                    <KeyboardAvoidingView
                        behavior='padding'
                        style={{ flex: 1 }}
                    >
                        <View style={globalStyles.innerContainer}>
                            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, }}>
                                <View style={{ gap: 12, paddingHorizontal: 12, marginTop: 12 }}>
                                    {/* customer detail */}
                                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, insuredDetails: !prev.insuredDetails }))}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComponent icon={icons.user} tintColor={color.white} size={18} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Customer Details</Text>
                                            </View>
                                            {
                                                expanded.insuredDetails ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                            }
                                        </TouchableOpacity>

                                        <View style={{ display: expanded.insuredDetails ? 'flex' : 'none', marginTop: 10 }}>
                                            <InputField value={form.customerDetails?.customerName} onChangeText={(text) => handleChange("customerDetails", "customerName", text)} placeholder='Customer Name' label={'Customer Name'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={form.customerDetails?.address} onChangeText={(text) => handleChange("customerDetails", "address", text)} placeholder='Address' label={'Address'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={form.customerDetails?.pinCode} onChangeText={(text) => handleChange("customerDetails", "pinCode", text)} keyboardType='numeric' placeholder='eg.141001' label={'Pin Code'} containerInputStyle={{ paddingVertical: 6 }} />

                                            <View style={{ gap: 10, marginBottom: 10 }}>
                                                <Text style={{ color: color.mainText, fontSize: 14, fontWeight: '600' }}>Risk Code</Text>
                                                <Pressable onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 16, borderRadius: 12, borderColor: color.borderColor, backgroundColor: color.cardBackground }}>
                                                    <Text style={{ color: form.customerDetails.riskCode ? color.mainText : color.secondaryText }}>{form.customerDetails.riskCode || 'Risk Code'}</Text>
                                                </Pressable>
                                            </View>

                                            <View style={{ gap: 10, marginBottom: 10 }}>
                                                <Text style={{ color: color.mainText, fontSize: 14, fontWeight: '600' }}>Occupancy</Text>
                                                <Pressable onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 16, borderRadius: 12, borderColor: color.borderColor, backgroundColor: color.cardBackground }}>
                                                    <Text style={{ color: form.customerDetails.occupancy ? color.mainText : color.secondaryText }}>{form.customerDetails.occupancy || 'Occupancy'}</Text>
                                                </Pressable>
                                            </View>
                                            <InputField value={form.customerDetails?.description} onChangeText={(text) => handleChange("customerDetails", "description", text)} placeholder='Description' label={'Description'} containerInputStyle={{ paddingVertical: 6 }} />
                                        </View>
                                    </View>

                                    {/* optionalCovers */}
                                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, optionalCovers: !prev.optionalCovers }))}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComponent icon={icons.shield} tintColor={color.white} size={18} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Optional Covers </Text>
                                            </View>

                                            {
                                                expanded.optionalCovers ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                            }
                                        </TouchableOpacity>


                                        <View style={{ display: expanded.optionalCovers ? 'flex' : 'none', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>

                                            {
                                                riskCover.map((item, index) => (
                                                    <View key={index} style={{ width: width * 0.43, borderWidth: 1, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8, borderColor: color.borderColor }}>
                                                        <IconComponent icon={item?.icon} size={24} tintColor={item.selected ? color.primaryBlueDark : color.secondaryText} />
                                                        <Text style={{ width: '55%', fontWeight: '400', color: item.selected ? color.mainText : color.secondaryText }}>
                                                            {item.label}
                                                        </Text>
                                                        <Pressable hitSlop={40} onPress={() => toggleRiskCover(item.key)}>
                                                            <IconComponent icon={item.selected ? icons.switchright : icons.switchleft} size={30} tintColor={item.selected ? color.primaryBlueDark : color.secondaryText} />
                                                        </Pressable>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    </View>

                                    {/* dicount */}
                                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, discounts: !prev.discounts }))}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComponent icon={icons.tag} tintColor={color.white} size={18} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Discounts</Text>
                                            </View>

                                            {
                                                expanded.discounts ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                            }
                                        </TouchableOpacity>

                                        <View style={{ display: expanded.discounts ? 'flex' : 'none', marginTop: 10 }}>
                                            <InputField value={form.discounts?.iibDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "iibDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'IIB Discount %'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={form.discounts?.eqDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "eqDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'Earthquake Discount %'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={form.discounts?.stfiDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "stfiDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'STFI Discount %'} containerInputStyle={{ paddingVertical: 6 }} />
                                        </View>
                                    </View>

                                    {/* Sum Insured */}
                                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, sumInsured: !prev.sumInsured }))}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComponent icon={icons.indured} tintColor={color.white} size={18} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Sum Insured </Text>
                                            </View>

                                            {
                                                expanded.sumInsured ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                            }
                                        </TouchableOpacity>

                                        <View style={{ display: expanded.sumInsured ? 'flex' : 'none', marginTop: 10 }}>
                                            <InputField value={sumInsuredData.buildingSI} keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }}
                                                onChangeText={(text) => {
                                                    handleChangeText('buildingSI', text);
                                                    handleFireAliedChangeText('buildingSI', text);
                                                }}
                                            />

                                            <InputField value={sumInsuredData.plantAndMachinerySI}
                                                keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }}
                                                onChangeText={(text) => {
                                                    handleChangeText('plantAndMachinerySI', text);
                                                    handleFireAliedChangeText('plantAndMachinerySI', text);
                                                    setMachineryData((prev) => ({
                                                        ...prev,
                                                        machineryBreakdownSI: text,
                                                    }));
                                                }} />


                                            <InputField value={sumInsuredData.stockSI}
                                                keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }}
                                                onChangeText={(text) => {
                                                    handleChangeText('stockSI', text)
                                                    handleFireAliedChangeText('stockSI', text);
                                                }}

                                            />

                                            <InputField value={sumInsuredData.furnitureFixturesFittingsSI}
                                                keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }}
                                                onChangeText={(text) => {
                                                    handleChangeText('furnitureFixturesFittingsSI', text);
                                                    handleFireAliedChangeText('furnitureFixturesFittingsSI', text);
                                                }}
                                            />

                                            <InputField value={sumInsuredData.otherContentsSI}
                                                keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }}
                                                onChangeText={(text) => {
                                                    handleChangeText('otherContentsSI', text);
                                                    handleFireAliedChangeText('otherContentsSI', text);
                                                }}
                                            />

                                            <InputField value={totalSumInsured} editable={false} placeholder='0' label={'Total Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                        </View>
                                    </View>



                                    {/* Fire & Allied Perils */}
                                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, fireAllied: !prev.fireAllied }))}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComponent icon={icons.fire} tintColor={color.white} size={18} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Fire & Allied Perils </Text>
                                            </View>

                                            {
                                                expanded.fireAllied ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                            }
                                        </TouchableOpacity>

                                        <View style={{ display: expanded.fireAllied ? 'flex' : 'none', marginTop: 10 }}>
                                            <InputField value={fireAllied.buildingSI} editable={false} placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={fireAllied.plantAndMachinerySI} editable={false} placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={fireAllied.stockSI} editable={false} placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={fireAllied.furnitureFixturesFittingsSI} editable={false} placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={fireAllied.otherContentsSI} editable={false} placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={totalSumInsured} editable={false} placeholder='0' label={'Earthquake'} containerInputStyle={{ paddingVertical: 6 }} />
                                            <InputField value={totalSumInsured} editable={false} placeholder='0' label={'STFI'} containerInputStyle={{ paddingVertical: 6 }} />
                                            {riskCover.find(c => c.key == 'terrorism').selected && <InputField value={totalSumInsured} editable={false} placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />}
                                        </View>
                                    </View>

                                    {/* business interruption */}
                                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, businessInterruption: !prev.businessInterruption }))}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComponent icon={icons.businessins} tintColor={color.white} size={18} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', width: '80%' }} numberOfLines={1}>Business Interruption</Text>
                                            </View>

                                            {
                                                expanded.businessInterruption ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                            }
                                        </TouchableOpacity>

                                        <View style={{ display: expanded.businessInterruption ? 'flex' : 'none', marginTop: 10 }}>
                                            <View style={{ display: expanded.businessInterruption ? 'flex' : 'none', marginTop: 10 }}>
                                                <InputField value={businessInterruptionData.businessInterruptionSI}
                                                    keyboardType='numeric' placeholder='0' label={'Business Interruption Sum Insured (FLOP) - Indemnity 12 months'} containerInputStyle={{ paddingVertical: 6 }}
                                                    onChangeText={(text) => {
                                                        handleBusinessInterruptionChange("businessInterruptionSI", text);
                                                        handleBusinessInterruptionChange("terrorismSI", text);
                                                        setMlopData((prev) => ({
                                                            ...prev,
                                                            mlopSI: text,
                                                        }))

                                                    }}
                                                />


                                                {riskCover.find(c => c.key == 'terrorism').selected &&
                                                    <InputField value={businessInterruptionData.terrorismSI} editable={false} placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />}
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, machineryBreakdown: !prev.machineryBreakdown }))}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComponent icon={icons.process} tintColor={color.white} size={18} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', }}>Machinery Breakdown</Text>
                                            </View>

                                            {
                                                expanded.machineryBreakdown ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                            }
                                        </TouchableOpacity>

                                        <View style={{ display: expanded.machineryBreakdown ? 'flex' : 'none', marginTop: 10 }}>
                                            <InputField editable={false} value={machineryData.machineryBreakdownSI} keyboardType='numeric' placeholder='0' label={'Machinery Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                        </View>
                                    </View>

                                    {isRiskCoverSelected('mlop') && (<View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, mlop: !prev.mlop }))}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComponent icon={icons.growth} tintColor={color.white} size={18} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', }}>Mlop</Text>
                                            </View>

                                            {
                                                expanded.mlop ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                            }
                                        </TouchableOpacity>

                                        <View style={{ display: expanded.mlop ? 'flex' : 'none', marginTop: 10 }}>
                                            <InputField editable={false} value={mlopData.mlopSI} keyboardType='numeric' placeholder='0' label={'Mlop Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                        </View>
                                    </View>)}


                                    <AddonSelector
                                        value={selectedAddons}
                                        onChange={setSelectedAddons}
                                    />

                                    <CustomButton
                                        disabled={totalSumInsured > 0 ? false : true}
                                        label='CALCULATE PREMIUM' loading={loading} onPress={handleIARCalculate} />

                                    {result && <ResultCardComponent heading='IAR' value={result?.summary?.grossPremium || 0.00}
                                        children={
                                            <View style={{ gap: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                                    <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>Net Premium</Text>
                                                    <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.summary?.netPremium || 0}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                                    <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>GST</Text>
                                                    <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.summary?.gst || 0}</Text>
                                                </View>

                                                {viewButton && <TouchableOpacity hitSlop={40} onPress={() => setViewButton(false)} style={{ paddingBottom: 6, paddingRight: 10, alignItems: 'center', alignSelf: 'flex-end' }}>
                                                    <Text style={{ color: color.primaryBlueDark, textDecorationLine: 'underline' }}>View Rates</Text>
                                                </TouchableOpacity>}

                                                {!viewButton && <View style={{ gap: 10, }}>
                                                    <Text style={{ fontSize: 18, fontWeight: '600', color: color.mainText }}>Rates</Text>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>IIB Rate</Text>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.rates?.iibRate}</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>Earthquake Rate</Text>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.rates?.earthquakeRate}</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>STFI Rate</Text>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.rates?.stfiRate}</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>Terrorism Rate</Text>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.rates?.terrorismRate}</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>Final Fire Rate</Text>
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.rates?.finalFireRate}</Text>
                                                    </View>

                                                </View>}

                                                {!viewButton && <TouchableOpacity hitSlop={40} onPress={() => setViewButton(true)} style={{ paddingBottom: 6, paddingRight: 10, alignItems: 'center', alignSelf: 'flex-end' }}>
                                                    <Text style={{ color: color.primaryBlueDark, textDecorationLine: 'underline' }}>Hide Rates</Text>
                                                </TouchableOpacity>}

                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <TouchableOpacity style={{ width: '48%', borderWidth: 1, borderColor: color.borderColor, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                        <IconComponent icon={icons.pdfFile} size={24} />
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>Export PDF</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ width: '48%', borderWidth: 1, borderColor: color.borderColor, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                        <IconComponent icon={icons.excelFile} size={24} />
                                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>Export Excel</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }
                                    />}

                                </View>
                            </ScrollView>
                        </View>
                        <CustomAutoSearchModal visible={modalVisible} onClose={() => setModalVisible(false)} onSelect={onSelectRiskCode} />

                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        </View>

    )
}

export default IARCalculatorScreen

const styles = StyleSheet.create({
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
})