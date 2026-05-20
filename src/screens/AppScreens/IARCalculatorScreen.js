import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import GlassCard from '../../components/GlassCard'
import { IconComponent, icons } from '../../components/IconComponent'
import InputField from '../../components/InputField'
import YesNoRadioComponent from '../../components/YesNoRadioComponent'
import CustomAutoSearchModal from '../../components/CustomAutoSearchModal'
import { calculatIARIndurance } from '../../features/iarInsurance/iARInsuranceAPI'
import ResultCardComponent from '../../components/ResultCardComponent'
import { globalStyles } from '../../utility/globalStyles'
import { useNavigation } from '@react-navigation/native'
import { color } from '../../utility/color'
import { riskIARCovers } from '../../utility/helper'
import CustomButton from '../../components/CustomButton'

const IARCalculatorScreen = () => {
    const { width } = Dimensions.get('window');
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [terrorism, setTerrorism] = useState(true);
    const [riskCover, setRiskCover] = useState(riskIARCovers)
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [expanded, setExpanded] = useState({
        insuredDetails: true,
        rickCover: true,
        discounts: true,
        sumInsured: true,
        fireAllied: false,
        businessInterruption: false,
        machineryBreakdown: false,
        mlop: false

    });
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

            "riskCovers": {
                "terrorism": true,
                "burglary": true,
                "fireAndAlliedPerils": false,
                "businessInterruption": false,
                "machineryBreakdown": false,
                "mlop": false
            },

            "discounts": {
                "iibDiscountPercent": 0,
                "natcatDiscountPercent": 0
            },

            "sumInsured": {
                "buildingSI": 0,
                "plantAndMachinerySI": 0,
                "stockSI": 0,
                "furnitureFixturesFittingsSI": 0,
                "otherContentsSI": 0,
                "totalSI": 0
            },

            "sections": {

                "section1": {
                    "sectionName": "Fire & Allied Perils",
                    "buildingSI": 0,
                    "plantAndMachinerySI": 0,
                    "stockSI": 0,
                    "furnitureFixturesFittingsSI": 0,
                    "otherContentsSI": 0,
                    "earthquakeSI": 0,
                    "stfiSI": 0,
                    "terrorismSI": 0
                },

                "section2": {
                    "sectionName": "Business Interruption",
                    "businessInterruptionSI": 0,
                    "terrorismSI": 0
                },

                "section3A": {
                    "sectionName": "Machinery Breakdown",
                    "machineryBreakdownSI": 0
                },

                "section3B": {
                    "sectionName": "MLOP",
                    "mlopSI": 0
                }
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

    const handleSectionChange = (sectionKey, field, value) => {
        setForm(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [sectionKey]: {
                    ...prev.sections[sectionKey],
                    [field]: value
                }
            }
        }));
    };

    const onSelectRiskCode = (data) => {
        handleChange("customerDetails", "riskCode", data?.risk_code);
        handleChange("customerDetails", "occupancy", data?.occupancy_desc);
    }

    const onHandleSubmitInput = () => {
        let totalSumInsured =
            Number(form.sumInsured.buildingSI || 0) +
            Number(form.sumInsured.plantAndMachinerySI || 0) +
            Number(form.sumInsured.stockSI || 0) +
            Number(form.sumInsured.furnitureFixturesFittingsSI || 0) +
            Number(form.sumInsured.otherContentsSI || 0);
        console.log("totalSumInsured", totalSumInsured);
        handleChange("sumInsured", "totalSI", totalSumInsured.toString());
        // section1
        handleSectionChange("section1", "buildingSI", form.sumInsured.buildingSI);
        handleSectionChange("section1", "plantAndMachinerySI", form.sumInsured.plantAndMachinerySI);
        handleSectionChange("section1", "stockSI", form.sumInsured.stockSI);
        handleSectionChange("section1", "furnitureFixturesFittingsSI", form.sumInsured.furnitureFixturesFittingsSI);
        handleSectionChange("section1", "otherContentsSI", form.sumInsured.otherContentsSI);
        handleSectionChange("section1", "earthquakeSI", totalSumInsured.toString());
        handleSectionChange("section1", "stfiSI", totalSumInsured.toString());
        handleSectionChange("section1", "terrorismSI", totalSumInsured.toString());
    }

    const getUpdatedRiskCovers = (data) => {
        const sections = data.sections;

        return {
            ...data,

            riskCovers: {
                ...data.riskCovers,

                fireAndAlliedPerils:
                    sections.section1.buildingSI > 0 ||
                    sections.section1.plantAndMachinerySI > 0 ||
                    sections.section1.stockSI > 0 ||
                    sections.section1.furnitureFixturesFittingsSI > 0 ||
                    sections.section1.otherContentsSI > 0 ||
                    sections.section1.earthquakeSI > 0 ||
                    sections.section1.stfiSI > 0 ||
                    sections.section1.terrorismSI > 0,

                businessInterruption:
                    sections.section2.businessInterruptionSI > 0 ||
                    sections.section2.terrorismSI > 0,

                machineryBreakdown:
                    sections.section3A.machineryBreakdownSI > 0,

                mlop:
                    sections.section3B.mlopSI > 0,
            }
        };
    };

    const handleIARCalculate = async () => {
        try {
            setLoading(true);
            let updatedForm = getUpdatedRiskCovers(form);

            let terrorism = riskCover.find(c => c.key == 'terrorism').selected;

            if (terrorism === false) {
                updatedForm.sections.section1.terrorismSI = 0;
                updatedForm.sections.section2.terrorismSI = 0;
            }
            // if (updatedForm?.riskCovers?.terrorism === false) {
            //     updatedForm.sections.section1.terrorismSI = 0;
            //     updatedForm.sections.section2.terrorismSI = 0;
            // }
            console.log("updatedForm", updatedForm);
            setForm(updatedForm);

            const response = await calculatIARIndurance(updatedForm);
            console.log("response", response.data?.data);
            setResult(response.data?.data);

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
        }
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


    return (
        <KeyboardAvoidingView
            behavior='padding'
            style={globalStyles.container}
        >
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <IconComponent size={26} icon={icons.back} tintColor={color.icon} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, }}>
                <View style={{ gap: 12 }}>
                    <View style={{ width: width, alignItems: 'center' }}>
                        <Image source={require('../../assets/logo/header.png')} style={{ width: width * 0.8, height: width * 0.4, resizeMode: 'contain' }} />
                    </View>
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
                                <Text style={{ color: color.mainText, fontSize:14,  fontWeight: '600' }}>Risk Code</Text>
                                <Pressable onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 16, borderRadius: 12, borderColor:color.borderColor, backgroundColor:color.cardBackground }}>
                                    <Text style={{ color: form.customerDetails.riskCode ? color.mainText : color.secondaryText }}>{form.customerDetails.riskCode || 'Risk Code'}</Text>
                                </Pressable>
                            </View>

                            <View style={{ gap: 10, marginBottom: 10 }}>
                                <Text style={{ color: color.mainText, fontSize:14,  fontWeight: '600'}}>Occupancy</Text>
                                <Pressable onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 16, borderRadius: 12, borderColor:color.borderColor, backgroundColor:color.cardBackground }}>
                                    <Text style={{ color: form.customerDetails.occupancy ? color.mainText : color.secondaryText}}>{form.customerDetails.occupancy || 'Occupancy'}</Text>
                                </Pressable>
                            </View>
                            <InputField value={form.customerDetails?.description} onChangeText={(text) => handleChange("customerDetails", "description", text)} placeholder='Description' label={'Description'} containerInputStyle={{ paddingVertical: 6 }} />
                        </View>
                    </View>


                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, rickCover: !prev.rickCover }))}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                    <IconComponent icon={icons.user} tintColor={color.white} size={18} />
                                </View>
                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Rick Cover <Text style={{ color: color.primaryBlueDark }}>(All selected)</Text></Text>
                            </View>

                            {
                                expanded.rickCover ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                            }
                        </TouchableOpacity>


                        <View style={{ display: expanded.rickCover ? 'flex' : 'none', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>

                            {
                                riskCover.map((item, index) => (
                                    <View key={index} style={{ width: width * 0.43, borderWidth: 1, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8, borderColor: color.borderColor }}>
                                        <IconComponent icon={icons.user} size={24} tintColor={item.selected ? color.primaryBlueDark : color.secondaryText} />
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

                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, discounts: !prev.discounts }))}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                    <IconComponent icon={icons.user} tintColor={color.white} size={18} />
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
                            <InputField value={form.discounts?.natcatDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "natcatDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'Natcat Discount %'} containerInputStyle={{ paddingVertical: 6 }} />
                        </View>
                    </View>


                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, sumInsured: !prev.sumInsured }))}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                    <IconComponent icon={icons.user} tintColor={color.white} size={18} />
                                </View>
                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Sum Insured </Text>
                            </View>

                            {
                                expanded.sumInsured ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                            }
                        </TouchableOpacity>

                        <View style={{ display: expanded.sumInsured ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.buildingSI} onChangeText={(text) => handleChange("sumInsured", "buildingSI", text)} keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.plantAndMachinerySI} onChangeText={(text) => handleChange("sumInsured", "plantAndMachinerySI", text)} keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.stockSI} onChangeText={(text) => handleChange("sumInsured", "stockSI", text)} keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.furnitureFixturesFittingsSI} onChangeText={(text) => handleChange("sumInsured", "furnitureFixturesFittingsSI", text)} keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.otherContentsSI} onChangeText={(text) => handleChange("sumInsured", "otherContentsSI", text)} keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sumInsured.totalSI} editable={false} placeholder='0' label={'Total Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                        </View>
                    </View>

                    {/* <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, sumInsured: !prev.sumInsured }))}>
                            <Text style={{ fontSize: 14, color: '#fff' }}> Sum Insured</Text>
                            {
                                expanded.sumInsured ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                            }
                        </TouchableOpacity>

                        <View style={{ display: expanded.sumInsured ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.buildingSI} onChangeText={(text) => handleChange("sumInsured", "buildingSI", text)} keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.plantAndMachinerySI} onChangeText={(text) => handleChange("sumInsured", "plantAndMachinerySI", text)} keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.stockSI} onChangeText={(text) => handleChange("sumInsured", "stockSI", text)} keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.furnitureFixturesFittingsSI} onChangeText={(text) => handleChange("sumInsured", "furnitureFixturesFittingsSI", text)} keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.otherContentsSI} onChangeText={(text) => handleChange("sumInsured", "otherContentsSI", text)} keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sumInsured?.totalSI} editable={false} placeholder='0' label={'Total Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                        </View>
                    </GlassCard> */}


                    <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, fireAllied: !prev.fireAllied }))}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                    <IconComponent icon={icons.user} tintColor={color.white} size={18} />
                                </View>
                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Fire & Allied Perils </Text>
                            </View>

                            {
                                expanded.fireAllied ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                            }
                        </TouchableOpacity>

                        <View style={{ display: expanded.fireAllied ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField value={form.sections.section1.buildingSI} editable={false} placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.plantAndMachinerySI} editable={false} placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.stockSI} editable={false} placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.furnitureFixturesFittingsSI} editable={false} placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.otherContentsSI} editable={false} placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.earthquakeSI} editable={false} placeholder='0' label={'Earthquake'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.stfiSI} editable={false} placeholder='0' label={'STFI'} containerInputStyle={{ paddingVertical: 6 }} />
                            {riskCover.find(c => c.key == 'terrorism').selected && <InputField value={form.sections.section1.terrorismSI} editable={false} placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />}
                        </View>
                    </View>

                    {/* <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, fireAllied: !prev.fireAllied }))}>
                            <Text style={{ fontSize: 14, color: '#fff' }}> Fire & Allied Perils</Text>
                            {
                                expanded.fireAllied ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                            }
                        </TouchableOpacity>
                        <View style={{ display: expanded.fireAllied ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField value={form.sections.section1.buildingSI} editable={false} placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.plantAndMachinerySI} editable={false} placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.stockSI} editable={false} placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.furnitureFixturesFittingsSI} editable={false} placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.otherContentsSI} editable={false} placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.earthquakeSI} editable={false} placeholder='0' label={'Earthquake'} containerInputStyle={{ paddingVertical: 6 }} />
                            <InputField value={form.sections.section1.stfiSI} editable={false} placeholder='0' label={'STFI'} containerInputStyle={{ paddingVertical: 6 }} />
                            {terrorism && <InputField value={form.sections.section1.terrorismSI} editable={false} placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />}
                        </View>
                    </GlassCard> */}


                    {isRiskCoverSelected('business_interruption') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, businessInterruption: !prev.businessInterruption }))}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                    <IconComponent icon={icons.user} tintColor={color.white} size={18} />
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
                                <InputField  onEndEditing={() => handleSectionChange("section2", "terrorismSI", form.sections.section2.businessInterruptionSI)} value={form.sections.section2.businessInterruptionSI} onChangeText={(text) => handleSectionChange("section2", "businessInterruptionSI", text)} keyboardType='numeric'   placeholder='0' label={'Business Interruption Sum Insured (FLOP) - Indemnity 12 months'} containerInputStyle={{ paddingVertical: 6 }} />
                                {riskCover.find(c => c.key == 'terrorism').selected && <InputField value={form.sections.section2.terrorismSI} editable={false} placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />}
                            </View>
                        </View>
                    </View>
                    }

                    {/* <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, businessInterruption: !prev.businessInterruption }))}>
                            <Text style={{ fontSize: 14, color: '#fff' }}> Business Interruption</Text>
                            {
                                expanded.businessInterruption ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                            }
                        </TouchableOpacity>
                        <View style={{ display: expanded.businessInterruption ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField onEndEditing={() => handleSectionChange("section2", "terrorismSI", form.sections.section2.businessInterruptionSI)} value={form.sections.section2.businessInterruptionSI} onChangeText={(text) => handleSectionChange("section2", "businessInterruptionSI", text)} placeholder='0' label={'Business Interruption Sum Insured (FLOP) - Indemnity 12 months'} containerInputStyle={{ paddingVertical: 6 }} />
                            {terrorism && <InputField value={form.sections.section2.terrorismSI} editable={false} placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />}
                        </View>
                    </GlassCard> */}


                    {isRiskCoverSelected('machinery_breakdown') && (<View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, machineryBreakdown: !prev.machineryBreakdown }))}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                    <IconComponent icon={icons.user} tintColor={color.white} size={18} />
                                </View>
                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', }}>Machinery Breakdown</Text>
                            </View>

                            {
                                expanded.machineryBreakdown ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                            }
                        </TouchableOpacity>

                        <View style={{ display: expanded.machineryBreakdown ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField value={form.sections.section3A.machineryBreakdownSI} onChangeText={(text) => handleSectionChange("section3A", "machineryBreakdownSI", text)} keyboardType='numeric' placeholder='0' label={'Machinery Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                        </View>
                    </View>)}

                    {/* <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, machineryBreakdown: !prev.machineryBreakdown }))}>
                            <Text style={{ fontSize: 14, color: '#fff' }}> Machinery Breakdown</Text>
                            {
                                expanded.machineryBreakdown ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                            }
                        </TouchableOpacity>
                        <View style={{ display: expanded.machineryBreakdown ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField value={form.sections.section3A.machineryBreakdownSI} onChangeText={(text) => handleSectionChange("section3A", "machineryBreakdownSI", text)} keyboardType='numeric' placeholder='0' label={'Machinery Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                        </View>
                    </GlassCard> */}


                    {isRiskCoverSelected('mlop') && (<View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, mlop: !prev.mlop }))}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                    <IconComponent icon={icons.user} tintColor={color.white} size={18} />
                                </View>
                                <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', }}>Mlop</Text>
                            </View>

                            {
                                expanded.mlop ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                            }
                        </TouchableOpacity>

                        <View style={{ display: expanded.mlop ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField value={form.sections.section3B.mlopSI} onChangeText={(text) => handleSectionChange("section3B", "mlopSI", text)} keyboardType='numeric' placeholder='0' label={'Mlop Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                        </View>
                    </View>)}

                    {/* <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, mlop: !prev.mlop }))}>
                            <Text style={{ fontSize: 14, color: '#fff' }}> Mlop</Text>
                            {
                                expanded.mlop ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                    : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                            }
                        </TouchableOpacity>
                        <View style={{ display: expanded.mlop ? 'flex' : 'none', marginTop: 10 }}>
                            <InputField value={form.sections.section3B.mlopSI} onChangeText={(text) => handleSectionChange("section3B", "mlopSI", text)} keyboardType='numeric' placeholder='0' label={'Mole Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                        </View>
                    </GlassCard> */}

                    <CustomButton label='CALCULATE PREMIUM' loading={loading} onPress={handleIARCalculate} />
                    {/* <TouchableOpacity
                        style={[styles.calcBtn, loading && styles.calcBtnDisabled]}
                        onPress={handleIARCalculate}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        <Text style={styles.calcBtnText}>
                            {loading ? 'CALCULATING...' : 'CALCULATE PREMIUM'}
                        </Text>
                    </TouchableOpacity> */}

                    {result && <ResultCardComponent heading='Business' value={result?.summary?.grossPremium || 0.00}
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
                            </View>
                        }
                    />}

                </View>
            </ScrollView>
            <CustomAutoSearchModal visible={modalVisible} onClose={() => setModalVisible(false)} onSelect={onSelectRiskCode} />

        </KeyboardAvoidingView>

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