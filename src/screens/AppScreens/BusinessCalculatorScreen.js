import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Dimensions, Image, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IconComponent, icons } from '../../components/IconComponent'
import InputField from '../../components/InputField'
import CustomAutoSearchModal from '../../components/CustomAutoSearchModal'
import { calculatBusinessIndurance } from '../../features/businessInsurance/businessInsuranceAPI'
import ResultCardComponent from '../../components/ResultCardComponent'
import { color } from '../../utility/color'
import { globalStyles } from '../../utility/globalStyles'
import { riskCovers } from '../../utility/helper'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'


const BusinessCalculatorScreen = () => {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');
    const [modalVisible, setModalVisible] = useState(false);
    const [expanded, setExpanded] = useState({
        rickCover: true,
        insuredDetails: true,
        discounts: true,
        sumInsured: true,
        fireAllied: false,
        burglaryHousebreaking: false,
        machineryBreakdown: false,
        boilerPressure: false,
        electronicEquipment: false,
        portable: false,
        money: false,
        fidelityGuarantee: false,
        personalAccident: false,
        businessInterruption: false,
        publicLiability: false,
        plateGlassInsurance: false
    });

    const [riskCover, setRiskCover] = useState(riskCovers)
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
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
            "machineryBreakdown": false,
            "boilerPressurePlant": false,
            "electronicEquipment": false,
            "portableEquipment": false,
            "moneyInsurance": false,
            "fidelityGuarantee": false,
            "personalAccident": false,
            "businessInterruption": false,
            "publicLiability": false,
            "plateGlass": false
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
                "sectionName": "Burglary & Housebreaking with theft & RSMD",
                "totalBurglarySI": 0,
                "plantAndMachinerySI": 0,
                "stockSI": 0,
                "furnitureFixturesFittingsSI": 0,
                "otherContentsSI": 0
            },

            "section3A": {
                "sectionName": "Machinery Breakdown",
                "machineryBreakdownSI": 0,
                "remarks": "Machinery details to be provided before policy binding and subject to underwriting approval"
            },

            "section3B": {
                "sectionName": "Boiler Pressure Plant",
                "boilerPressurePlantSI": 0,
                "ownersSurroundingPropertySI": 0,
                "thirdPartyLiabilitySI": 0
            },

            "section4": {
                "sectionName": "Electronic Equipment",
                "electronicEquipmentSI": 0
            },

            "section5": {
                "sectionName": "Portable Computer/Mobile Phone/Laptop etc",
                "portableEquipmentSI": 0
            },

            "section6": {
                "sectionName": "Money",
                "moneyInTransitSI": 0,
                "moneyInCounterSI": 0,
                "moneyInSafeSI": 0
            },

            "section7": {
                "sectionName": "Fidelity Guarantee",
                "numberOfEmployees": 0,
                "perEmployeeSI": 0
            },

            "section8": {
                "sectionName": "Personal Accident",
                "tableA_DeathBenefitOnlySI": 0,
                "tableB_DeathPlusPTDSI": 0,
                "tableC_DeathPTDPPDSI": 0,
                "tableD_DeathPTDPPDTTDSI": 0,
                "totalEmployees": 0
            },

            "section9": {
                "sectionName": "Business Interruption",
                "businessInterruptionSI": 0,
                "businessInterruptionTerrorismSI": 0
            },

            "section10": {
                "sectionName": "Public Liability - Liability Insurance (AOA:AOY::1:1)",
                "publicLiabilitySI": 0
            },

            "section11": {
                "sectionName": "Plate Glass Insurance",
                "plateGlassSI": 0
            }
        }
    });


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

                machineryBreakdown:
                    sections.section3A.machineryBreakdownSI > 0,

                boilerPressurePlant:
                    sections.section3B.boilerPressurePlantSI > 0 ||
                    sections.section3B.ownersSurroundingPropertySI > 0 ||
                    sections.section3B.thirdPartyLiabilitySI > 0,

                electronicEquipment:
                    sections.section4.electronicEquipmentSI > 0,

                portableEquipment:
                    sections.section5.portableEquipmentSI > 0,

                moneyInsurance:
                    sections.section6.moneyInTransitSI > 0 ||
                    sections.section6.moneyInCounterSI > 0 ||
                    sections.section6.moneyInSafeSI > 0,

                fidelityGuarantee:
                    sections.section7.numberOfEmployees > 0 ||
                    sections.section7.perEmployeeSI > 0,

                personalAccident:
                    sections.section8.tableA_DeathBenefitOnlySI > 0 ||
                    sections.section8.tableB_DeathPlusPTDSI > 0 ||
                    sections.section8.tableC_DeathPTDPPDSI > 0 ||
                    sections.section8.tableD_DeathPTDPPDTTDSI > 0 ||
                    sections.section8.totalEmployees > 0,

                businessInterruption:
                    sections.section9.businessInterruptionSI > 0 ||
                    sections.section9.businessInterruptionTerrorismSI > 0,

                publicLiability:
                    sections.section10.publicLiabilitySI > 0,

                plateGlass:
                    sections.section11.plateGlassSI > 0,
            }
        };
    };

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

    const handleCalculate = async () => {
        try {
            setLoading(true);
            let updatedForm = getUpdatedRiskCovers(form);

            let terrorism = riskCover.find(c => c.key == 'terrorism').selected;

            if (terrorism === false) {
                updatedForm.sections.section1.terrorismSI = 0;
            }
            console.log("updatedForm", updatedForm);
            // update state
            setForm(updatedForm);
            const response = await calculatBusinessIndurance(updatedForm);
            console.log("response", response);
            setResult(response.data?.data);

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
        }
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


        // section2
        let totalBurglarySI =
            Number(form.sumInsured.plantAndMachinerySI || 0) +
            Number(form.sumInsured.stockSI || 0) +
            Number(form.sumInsured.furnitureFixturesFittingsSI || 0) +
            Number(form.sumInsured.otherContentsSI || 0);

        handleSectionChange("section2", "totalBurglarySI", totalBurglarySI.toString());

        handleSectionChange("section2", "plantAndMachinerySI", form.sumInsured.plantAndMachinerySI);
        handleSectionChange("section2", "stockSI", form.sumInsured.stockSI);
        handleSectionChange("section2", "furnitureFixturesFittingsSI", form.sumInsured.furnitureFixturesFittingsSI)
        handleSectionChange("section2", "otherContentsSI", form.sumInsured.otherContentsSI)

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
        <View style={{ flex: 1, backgroundColor: color.screenBackground}}>
        <SafeAreaView>
            <View style={globalStyles.newContainer}>
                <KeyboardAvoidingView
                    behavior='padding'
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, }}>
                        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                            <IconComponent size={26} icon={icons.back} tintColor={color.icon} />
                        </TouchableOpacity> */}
                        <View style={{ gap: 12 }}>
                            <View style={{ width: '100%', alignItems: 'center', }}>
                                <Image source={require('../../assets/logo/header.png')} style={{ width: width * 0.6, height: width * 0.3, }} />
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
                                        <Text style={{ color: color.mainText, fontWeight: '600' }}>Risk Code</Text>
                                        <Pressable onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 16, borderRadius: 12, borderColor: color.borderColor, backgroundColor: color.cardBackground, }}>
                                            <Text style={{ color: form.customerDetails.riskCode ? color.mainText : color.secondaryText }}>{form.customerDetails.riskCode || 'Risk Code'}</Text>
                                        </Pressable>
                                    </View>

                                    <View style={{ gap: 10, marginBottom: 10 }}>
                                        <Text style={{ color: color.mainText, fontWeight: '600' }}>Occupancy</Text>
                                        <Pressable onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 16, borderRadius: 12, borderColor: color.borderColor, backgroundColor: color.cardBackground, }}>
                                            <Text style={{ color: form.customerDetails.occupancy ? color.mainText : color.secondaryText }}>{form.customerDetails.occupancy || 'Occupancy'}</Text>
                                        </Pressable>
                                    </View>
                                    <InputField value={form.customerDetails?.description} onChangeText={(text) => handleChange("customerDetails", "description", text)} placeholder='Description' label={'Description'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>

                            <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, rickCover: !prev.rickCover }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.shield} tintColor={color.white} size={18} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600' }}>Optional Covers</Text>
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
                                    <InputField value={form.discounts?.natcatDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "natcatDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'Natcat Discount %'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>

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
                                    <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.buildingSI} onChangeText={(text) => handleChange("sumInsured", "buildingSI", text)} keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.plantAndMachinerySI} onChangeText={(text) => handleChange("sumInsured", "plantAndMachinerySI", text)} keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.stockSI} onChangeText={(text) => handleChange("sumInsured", "stockSI", text)} keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.furnitureFixturesFittingsSI} onChangeText={(text) => handleChange("sumInsured", "furnitureFixturesFittingsSI", text)} keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured.otherContentsSI} onChangeText={(text) => handleChange("sumInsured", "otherContentsSI", text)} keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sumInsured.totalSI} editable={false} placeholder='0' label={'Total Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>

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


                            <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, burglaryHousebreaking: !prev.burglaryHousebreaking }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.housefire} tintColor={color.white} size={18} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', width: '80%' }} numberOfLines={1}>Burglary & Housebreaking with theft & RSMD </Text>
                                    </View>

                                    {
                                        expanded.burglaryHousebreaking ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>

                                <View style={{ display: expanded.burglaryHousebreaking ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section2.totalBurglarySI} editable={false} placeholder='0' label={'Burglary & Housebreaking with theft & RSMD'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section2.plantAndMachinerySI} editable={false} placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section2.stockSI} editable={false} placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section2.furnitureFixturesFittingsSI} editable={false} placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section2.otherContentsSI} editable={false} placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>

                            {isRiskCoverSelected('machinery_breakdown') && (<View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

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
                                    <InputField value={form.sections.section3A.machineryBreakdownSI} onChangeText={(text) => handleSectionChange("section3A", "machineryBreakdownSI", text)} keyboardType='numeric' placeholder='0' label={'Machinery Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section3A.remarks} onChangeText={(text) => handleSectionChange("section3A", "remarks", text)} placeholder='eg. Remarks' label={'Remarks'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>)}



                            {isRiskCoverSelected('boiler_pressure_plant') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, boilerPressure: !prev.boilerPressure }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.boiler} tintColor={color.white} size={18} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', }}>Boiler Pressure</Text>
                                    </View>

                                    {
                                        expanded.boilerPressure ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>

                                <View style={{ display: expanded.boilerPressure ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section3B.boilerPressurePlantSI} onChangeText={(text) => handleSectionChange("section3B", "boilerPressurePlantSI", text)} keyboardType='numeric' placeholder='0' label={'BPP Value'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section3B.ownersSurroundingPropertySI} onChangeText={(text) => handleSectionChange("section3B", "ownersSurroundingPropertySI", text)} keyboardType='numeric' placeholder={'0'} label={`BPP-Owner's Surroding Property`} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section3B.thirdPartyLiabilitySI} onChangeText={(text) => handleSectionChange("section3B", "thirdPartyLiabilitySI", text)} keyboardType='numeric' placeholder={'0'} label={`BPP-Third Party Liabiilty`} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>}

                            {isRiskCoverSelected('electronic_equipment') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, electronicEquipment: !prev.electronicEquipment }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.electrical} tintColor={color.white} size={18} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', }}> Electronic Equipment</Text>
                                    </View>

                                    {
                                        expanded.electronicEquipment ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>

                                <View style={{ display: expanded.electronicEquipment ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section4.electronicEquipmentSI} onChangeText={(text) => handleSectionChange("section4", "electronicEquipmentSI", text)} keyboardType='numeric' placeholder='0' label={'EEI Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>

                            </View>}



                            {isRiskCoverSelected('portable_equipment') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, portable: !prev.portable }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.devices} tintColor={color.white} size={20} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', width: '80%' }} numberOfLines={1}>Portable Computer/Mobile Phone/Laptop etc</Text>
                                    </View>

                                    {
                                        expanded.portable ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>

                                <View style={{ display: expanded.portable ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section5.portableEquipmentSI} onChangeText={(text) => handleSectionChange("section5", "portableEquipmentSI", text)} keyboardType='numeric' placeholder='0' label={'Portable Equipments Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>}



                            {isRiskCoverSelected('money_insurance') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, money: !prev.money }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.money} tintColor={color.white} size={18} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', width: '80%' }} numberOfLines={1}>Money</Text>
                                    </View>

                                    {
                                        expanded.money ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>


                                <View style={{ display: expanded.money ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section6.moneyInTransitSI} onChangeText={(text) => handleSectionChange("section6", "moneyInTransitSI", text)} keyboardType='numeric' placeholder='0' label={'Money in transit'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section6.moneyInCounterSI} onChangeText={(text) => handleSectionChange("section6", "moneyInCounterSI", text)} keyboardType='numeric' placeholder='0' label={'Money in Counter'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section6.moneyInSafeSI} onChangeText={(text) => handleSectionChange("section6", "moneyInSafeSI", text)} keyboardType='numeric' placeholder='0' label={'Money in Safe'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>}



                            {isRiskCoverSelected('fidelity_guarantee') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, fidelityGuarantee: !prev.fidelityGuarantee }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.industry} tintColor={color.white} size={18} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', width: '80%' }} numberOfLines={1}>Fidelity Guarantee</Text>
                                    </View>

                                    {
                                        expanded.fidelityGuarantee ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>

                                <View style={{ display: expanded.fidelityGuarantee ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section7.numberOfEmployees} onChangeText={(text) => { "section7", "numberOfEmployees", text }} keyboardType='numeric' placeholder='0' label={'No of Employees'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section7.perEmployeeSI} onChangeText={(text) => { "section7", "perEmployeeSI", text }} keyboardType='numeric' placeholder='0' label={'Per Employee Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>}



                            {isRiskCoverSelected('personal_accident') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, personalAccident: !prev.personalAccident }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.car} tintColor={color.white} size={22} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', width: '80%' }} numberOfLines={1}> Personal Accident</Text>
                                    </View>

                                    {
                                        expanded.personalAccident ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>

                                <View style={{ display: expanded.personalAccident ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section8.tableA_DeathBenefitOnlySI} onChangeText={(text) => handleSectionChange("section8", "tableA_DeathBenefitOnlySI", text)} keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table A - Death Benefit Only)'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section8.tableB_DeathPlusPTDSI} onChangeText={(text) => handleSectionChange("section8", "tableB_DeathPlusPTDSI", text)} keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table B - Death + PTD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section8.tableC_DeathPTDPPDSI} onChangeText={(text) => handleSectionChange("section8", "tableC_DeathPTDPPDSI", text)} keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table C - Death + PTD + PPD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section8.tableD_DeathPTDPPDTTDSI} onChangeText={(text) => handleSectionChange("section8", "tableD_DeathPTDPPDTTDSI", text)} keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table D-Death+PTD + PPD + TTD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section8.totalEmployees} onChangeText={(text) => handleSectionChange("section8", "totalEmployees", text)} keyboardType='numeric' placeholder='0' label={'Total Employee'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>}


                            {isRiskCoverSelected('business_interruption') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

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
                                    <InputField value={form.sections.section9.businessInterruptionSI} onChangeText={(text) => handleSectionChange("section9", "grossProfitSumInsured", text)} keyboardType='numeric' placeholder='0' label={'Business Interruption Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                    <InputField value={form.sections.section9.businessInterruptionTerrorismSI} onChangeText={(text) => handleSectionChange("section9", "businessInterruptionTerrorismSI", text)} keyboardType='numeric' placeholder='0' label={'Business Interruption Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>
                            }
                            {isRiskCoverSelected('public_liability') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, publicLiability: !prev.publicLiability }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.mansafe} tintColor={color.white} size={18} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', width: '80%' }} numberOfLines={1}>Public Liability - Liability Insurance</Text>
                                    </View>

                                    {
                                        expanded.publicLiability ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>

                                <View style={{ display: expanded.publicLiability ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section10.publicLiabilitySI} onChangeText={(text) => handleSectionChange("section10", "publicLiabilitySI", text)} keyboardType='numeric' placeholder='0' label={'Public Liability Insurance Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>}


                            {isRiskCoverSelected('plate_glass') && <View style={{ borderWidth: 1, borderColor: color.borderColor, padding: 10, borderRadius: 10 }}>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => setExpanded(prev => ({ ...prev, plateGlassInsurance: !prev.plateGlassInsurance }))}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
                                            <IconComponent icon={icons.protection} tintColor={color.white} size={18} />
                                        </View>
                                        <Text style={{ fontSize: 16, color: color.mainText, fontWeight: '600', width: '80%' }} numberOfLines={1}>Plate Glass Insurance</Text>
                                    </View>

                                    {
                                        expanded.plateGlassInsurance ? <IconComponent icon={icons.uparrow} size={18} tintColor={color.icon} />
                                            : <IconComponent icon={icons.downarrow} size={18} tintColor={color.icon} />
                                    }
                                </TouchableOpacity>


                                <View style={{ display: expanded.plateGlassInsurance ? 'flex' : 'none', marginTop: 10 }}>
                                    <InputField value={form.sections.section11.plateGlassSI} onChangeText={(text) => handleSectionChange("section11", "plateGlassSI", text)} keyboardType='numeric' placeholder='0' label={'Plate Glass Insurance Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                </View>
                            </View>}

                            <CustomButton label='CALCULATE PREMIUM' loading={loading} onPress={handleCalculate} />

                            {result && <ResultCardComponent heading='Business' value={result?.premiumSummary?.grossPremium || 0.00}
                                children={
                                    <View style={{ gap: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: color.borderColor, marginBottom: 10, padding: 5 }}>
                                            <Text style={{ fontSize: 13, color: color.primaryBlueDark, fontWeight: '600' }}>Net Premium</Text>
                                            <Text style={{ fontSize: 13, color: color.primaryBlueDark, fontWeight: '700' }}>{result?.premiumSummary?.netPremium || 0}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: color.borderColor, marginBottom: 10, padding: 5 }}>
                                            <Text style={{ fontSize: 13, color: color.primaryBlueDark, fontWeight: '600' }}>GST</Text>
                                            <Text style={{ fontSize: 13, color: color.primaryBlueDark, fontWeight: '700' }}>{result?.premiumSummary?.gst || 0}</Text>
                                        </View>
                                    </View>
                                }
                            />}



                        </View>

                    </ScrollView>
                    <CustomAutoSearchModal visible={modalVisible} onClose={() => setModalVisible(false)} onSelect={onSelectRiskCode} />

                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
        </View>
    )
}

export default BusinessCalculatorScreen

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