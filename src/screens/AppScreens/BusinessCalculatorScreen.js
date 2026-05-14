import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet, } from 'react-native'
import React, { useState } from 'react'
import AppBackground from '../../components/AppBackground'
import GlassCard from '../../components/GlassCard'
import { IconComponent, icons } from '../../components/IconComponent'
import HeaderComponent from '../../components/HeaderComponent'
import InputField from '../../components/InputField'
import CustomDropdown from '../../components/CustomDropdown'
import YesNoRadioComponent from '../../components/YesNoRadioComponent'
import CustomAutoSearchModal from '../../components/CustomAutoSearchModal'

const BusinessCalculatorScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [expanded, setExpanded] = useState({
        insuredDetails: false,
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
    const [terrorism, setTerrorism] = useState(false);
    const [burglary, setBurglary] = useState(false);
    const [loading, setLoading] = useState(false);



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
            "building": 0,
            "plantAndMachinery": 0,
            "stock": 0,
            "furnitureFixturesFittings": 0,
            "otherContents": 0,
            "totalSumInsured": 0
        },

        "sections": {

            "section1": {
                "sectionName": "Fire & Allied Perils",

                "building": 0,
                "plantAndMachinery": 0,
                "stock": 0,
                "furnitureFixturesFittings": 0,
                "otherContents": 0,

                "earthquakeSI": 0,
                "stfiSI": 0,
                "terrorismSI": 0
            },

            "section2": {
                "sectionName": "Burglary & Housebreaking with theft & RSMD",

                "totalBurglarySI": 0,

                "plantAndMachinery": 0,
                "stock": 0,
                "furnitureFixturesFittings": 0,
                "otherContents": 0
            },

            "section3A": {
                "sectionName": "Machinery Breakdown",
                "machinerySumInsured": 89621374,
                "remarks": ""
            },

            "section3B": {
                "sectionName": "Boiler Pressure Plant",

                "bppValue": 0,
                "ownersSurroundingProperty": 0,
                "thirdPartyLiability": 0
            },

            "section4": {
                "sectionName": "Electronic Equipment",
                "equipmentSumInsured": 0
            },

            "section5": {
                "sectionName": "Portable Computer/Mobile Phone/Laptop etc",
                "portableEquipmentSumInsured": 0
            },

            "section6": {
                "sectionName": "Money",
                "moneyInTransit": 0,
                "moneyInCounter": 0,
                "moneyInSafe": 0
            },

            "section7": {
                "sectionName": "Fidelity Guarantee",

                "numberOfEmployees": 0,
                "perEmployeeSumInsured": 0
            },

            "section8": {
                "sectionName": "Personal Accident",

                "tableA_DeathBenefitOnly": 0,
                "tableB_DeathPlusPTD": 0,
                "tableC_DeathPTDPPD": 0,
                "tableD_DeathPTDPPDTTD": 0,
                "totalEmployees": 0,
            },

            "section9": {
                "sectionName": "Business Interruption",

                "grossProfitSumInsured": 0,
                "indemnityPeriodMonths": 0
            },

            "section10": {
                "sectionName": "Public Liability - Liability Insurance (AOA:AOY::1:1)",
                "liabilitySumInsured": 0
            },

            "section11": {
                "sectionName": "Plate Glass Insurance",
                "plateGlassSumInsured": 0
            }
        }
    });



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
        console.log("data", data);
        handleChange("customerDetails", "riskCode", data?.risk_code);
        handleChange("customerDetails", "occupancy", data?.occupancy_desc);
    }

    const handleCalculate = () => {
        console.log("submit from", form);
    }


    return (
        <AppBackground>
            <View style={{ flex: 1, gap: 12, }}>
                <HeaderComponent heading={'BUSINESS'} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 12 }}>
                    <View style={{ flex: 1, gap: 12 }}>
                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, insuredDetails: !prev.insuredDetails }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Insured Details</Text>
                                {
                                    expanded.insuredDetails ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.insuredDetails ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField onChangeText={(text) => handleChange("customerDetails", "customerName", text)} placeholder='Customer Name' label={'Customer Name'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onChangeText={(text) => handleChange("customerDetails", "address", text)} placeholder='Address' label={'Address'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onChangeText={(text) => handleChange("customerDetails", "pinCode", text)} keyboardType='numeric' placeholder='eg.141001' label={'Pin Code'} containerInputStyle={{ paddingVertical: 6 }} />

                                <View style={{ gap: 10, marginBottom: 10 }}>
                                    <Text style={{ color: '#fff' }}>Risk Code</Text>
                                    <Pressable onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 16, borderRadius: 12, borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.92)', }}>
                                        <Text style={{ color: form.customerDetails.riskCode ? '#000' : '#999' }}>{form.customerDetails.riskCode || 'Risk Code'}</Text>
                                    </Pressable>
                                </View>

                                <View style={{ gap: 10, marginBottom: 10 }}>
                                    <Text style={{ color: '#fff' }}>Occupancy</Text>
                                    <Pressable onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 16, borderRadius: 12, borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.92)', }}>
                                        <Text style={{ color: form.customerDetails.occupancy ? '#000' : '#999' }}>{form.customerDetails.occupancy || 'Occupancy'}</Text>
                                    </Pressable>
                                </View>
                                <InputField onChangeText={(text) => handleChange("customerDetails", "description", text)} placeholder='Description' label={'Description'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>

                        <YesNoRadioComponent label='Terrorism' onChange={(val) => setTerrorism(val)} value={terrorism} />
                        <YesNoRadioComponent label='Burglary' onChange={(val) => setBurglary(val)} value={burglary} />

                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, fireAllied: !prev.fireAllied }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Fire & Allied Perils</Text>
                                {
                                    expanded.fireAllied ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>
                            <View style={{ display: expanded.fireAllied ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Earthquake'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'STFI'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>


                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, burglaryHousebreaking: !prev.burglaryHousebreaking }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Burglary & Housebreaking with theft & RSMD</Text>
                                {
                                    expanded.burglaryHousebreaking ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>
                            <View style={{ display: expanded.burglaryHousebreaking ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Burglary & Housebreaking with theft & RSMD'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>


                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, machineryBreakdown: !prev.machineryBreakdown }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Machinery Breakdown</Text>
                                {
                                    expanded.machineryBreakdown ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>
                            <View style={{ display: expanded.machineryBreakdown ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Machinery Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField placeholder='eg. Remarks' label={'Remarks'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>



                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, boilerPressure: !prev.boilerPressure }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Boiler Pressure</Text>
                                {
                                    expanded.boilerPressure ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.boilerPressure ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'BPP Value'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder={'0'} label={`BPP-Owner's Surroding Property`} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder={'0'} label={`BPP-Third Party Liabiilty`} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>



                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, electronicEquipment: !prev.electronicEquipment }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Electronic Equipment</Text>
                                {
                                    expanded.electronicEquipment ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.electronicEquipment ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'EEI Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>

                        </GlassCard>



                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, portable: !prev.portable }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Portable Computer/Mobile Phone/Laptop etc</Text>
                                {
                                    expanded.portable ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.portable ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Portable Equipments Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>



                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, money: !prev.money }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Money</Text>
                                {
                                    expanded.money ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.money ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Money in transit'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Money in Counter'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Money in Safe'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>



                        <GlassCard innerStyle={{ padding: 16 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, fidelityGuarantee: !prev.fidelityGuarantee }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Fidelity Guarantee</Text>
                                {
                                    expanded.fidelityGuarantee ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.fidelityGuarantee ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'No of Employees'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Per Employee Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>



                        <GlassCard innerStyle={{ padding: 16 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, personalAccident: !prev.personalAccident }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Personal Accident</Text>
                                {
                                    expanded.personalAccident ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.personalAccident ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table A - Death Benefit Only)'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table B - Death + PTD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table C - Death + PTD + PPD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table D - Death + PTD + PPD + TTD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>


                        <GlassCard innerStyle={{ padding: 16 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, businessInterruption: !prev.businessInterruption }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Business Interruption</Text>
                                {
                                    expanded.businessInterruption ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.businessInterruption ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Business Interruption Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField keyboardType='numeric' placeholder='0' label={'Business Interruption Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>



                        <GlassCard innerStyle={{ padding: 16 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, publicLiability: !prev.publicLiability }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Public Liability - Liability Insurance </Text>
                                {
                                    expanded.publicLiability ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.publicLiability ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Public Liability Insurance Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>



                        <GlassCard innerStyle={{ padding: 16 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, plateGlassInsurance: !prev.plateGlassInsurance }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Plate Glass Insurance</Text>
                                {
                                    expanded.plateGlassInsurance ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.plateGlassInsurance ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField keyboardType='numeric' placeholder='0' label={'Plate Glass Insurance Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>

                        <TouchableOpacity
                            style={[styles.calcBtn, loading && styles.calcBtnDisabled]}
                            onPress={handleCalculate}
                            activeOpacity={0.85}
                            disabled={loading}
                        >
                            <Text style={styles.calcBtnText}>
                                {loading ? 'CALCULATING...' : 'CALCULATE PREMIUM'}
                            </Text>
                        </TouchableOpacity>


                    </View>
                </ScrollView>
            </View>

            <CustomAutoSearchModal visible={modalVisible} onClose={() => setModalVisible(false)} onSelect={onSelectRiskCode} />
        </AppBackground>
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