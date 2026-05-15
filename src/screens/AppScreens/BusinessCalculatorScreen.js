import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet, Keyboard, } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppBackground from '../../components/AppBackground'
import GlassCard from '../../components/GlassCard'
import { IconComponent, icons } from '../../components/IconComponent'
import HeaderComponent from '../../components/HeaderComponent'
import InputField from '../../components/InputField'
import YesNoRadioComponent from '../../components/YesNoRadioComponent'
import CustomAutoSearchModal from '../../components/CustomAutoSearchModal'
import { calculatBusinessIndurance } from '../../features/businessInsurance/businessInsuranceAPI'
import ResultCardComponent from '../../components/ResultCardComponent'


const BusinessCalculatorScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [expanded, setExpanded] = useState({
        insuredDetails: true,
        discounts: false,
        sumInsured: false,
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
    const [terrorism, setTerrorism] = useState(true);
    const [burglary, setBurglary] = useState(true);
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
                "machinerySumInsured": 0,
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

    const getUpdatedRiskCovers = (data) => {
        const sections = data.sections;

        return {
            ...data,

            riskCovers: {
                ...data.riskCovers,

                machineryBreakdown:
                    sections.section3A.machinerySumInsured > 0,

                boilerPressurePlant:
                    sections.section3B.bppValue > 0 ||
                    sections.section3B.ownersSurroundingProperty > 0 ||
                    sections.section3B.thirdPartyLiability > 0,

                electronicEquipment:
                    sections.section4.equipmentSumInsured > 0,

                portableEquipment:
                    sections.section5.portableEquipmentSumInsured > 0,

                moneyInsurance:
                    sections.section6.moneyInTransit > 0 ||
                    sections.section6.moneyInCounter > 0 ||
                    sections.section6.moneyInSafe > 0,

                fidelityGuarantee:
                    sections.section7.numberOfEmployees > 0 ||
                    sections.section7.perEmployeeSumInsured > 0,

                personalAccident:
                    sections.section8.tableA_DeathBenefitOnly > 0 ||
                    sections.section8.tableB_DeathPlusPTD > 0 ||
                    sections.section8.tableC_DeathPTDPPD > 0 ||
                    sections.section8.tableD_DeathPTDPPDTTD > 0 ||
                    sections.section8.totalEmployees > 0,

                businessInterruption:
                    sections.section9.grossProfitSumInsured > 0 ||
                    sections.section9.indemnityPeriodMonths > 0,

                publicLiability:
                    sections.section10.liabilitySumInsured > 0,

                plateGlass:
                    sections.section11.plateGlassSumInsured > 0,
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
            if (updatedForm?.riskCovers?.terrorism === false) {
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
            Number(form.sumInsured.building || 0) +
            Number(form.sumInsured.plantAndMachinery || 0) +
            Number(form.sumInsured.stock || 0) +
            Number(form.sumInsured.furnitureFixturesFittings || 0) +
            Number(form.sumInsured.otherContents || 0);

        console.log("totalSumInsured", totalSumInsured);

        handleChange("sumInsured", "totalSumInsured", totalSumInsured.toString());

        // section1
        handleSectionChange("section1", "building", form.sumInsured.building);
        handleSectionChange("section1", "plantAndMachinery", form.sumInsured.plantAndMachinery);
        handleSectionChange("section1", "stock", form.sumInsured.stock);
        handleSectionChange("section1", "furnitureFixturesFittings", form.sumInsured.furnitureFixturesFittings);
        handleSectionChange("section1", "otherContents", form.sumInsured.otherContents);
        handleSectionChange("section1", "earthquakeSI", totalSumInsured.toString());
        handleSectionChange("section1", "stfiSI", totalSumInsured.toString());
        handleSectionChange("section1", "terrorismSI", totalSumInsured.toString());


        // section2
        let totalBurglarySI =
            Number(form.sumInsured.plantAndMachinery || 0) +
            Number(form.sumInsured.stock || 0) +
            Number(form.sumInsured.furnitureFixturesFittings || 0) +
            Number(form.sumInsured.otherContents || 0);

        handleSectionChange("section2", "totalBurglarySI", totalBurglarySI.toString());

        handleSectionChange("section2", "plantAndMachinery", form.sumInsured.plantAndMachinery);
        handleSectionChange("section2", "stock", form.sumInsured.stock);
        handleSectionChange("section2", "furnitureFixturesFittings", form.sumInsured.furnitureFixturesFittings)
        handleSectionChange("section2", "otherContents", form.sumInsured.otherContents)

    }


    return (
        <AppBackground>
            <View style={{ gap: 12,}}>
                <HeaderComponent heading={'BUSINESS'} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100, paddingHorizontal: 12 }}>
                    <View style={{height:'100%', gap: 12 }}>
                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, insuredDetails: !prev.insuredDetails }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Insured Details</Text>
                                {
                                    expanded.insuredDetails ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.insuredDetails ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField value={form.customerDetails?.customerName} onChangeText={(text) => handleChange("customerDetails", "customerName", text)} placeholder='Customer Name' label={'Customer Name'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.customerDetails?.address} onChangeText={(text) => handleChange("customerDetails", "address", text)} placeholder='Address' label={'Address'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.customerDetails?.pinCode} onChangeText={(text) => handleChange("customerDetails", "pinCode", text)} keyboardType='numeric' placeholder='eg.141001' label={'Pin Code'} containerInputStyle={{ paddingVertical: 6 }} />

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
                                <InputField value={form.customerDetails?.description} onChangeText={(text) => handleChange("customerDetails", "description", text)} placeholder='Description' label={'Description'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>

                        <YesNoRadioComponent label='Terrorism' onChange={(val) => { setTerrorism(val); handleChange("riskCovers", "terrorism", val) }} value={terrorism} />
                        <YesNoRadioComponent label='Burglary' onChange={(val) => { setBurglary(val); handleChange("riskCovers", "burglary", val) }} value={burglary} />

                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, discounts: !prev.discounts }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Discounts</Text>
                                {
                                    expanded.discounts ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.discounts ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField value={form.discounts?.iibDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "iibDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'IIB Discount %'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.discounts?.natcatDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "natcatDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'Natcat Discount %'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>

                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, sumInsured: !prev.sumInsured }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Sum Insured</Text>
                                {
                                    expanded.sumInsured ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>

                            <View style={{ display: expanded.sumInsured ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.building} onChangeText={(text) => handleChange("sumInsured", "building", text)} keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.plantAndMachinery} onChangeText={(text) => handleChange("sumInsured", "plantAndMachinery", text)} keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.stock} onChangeText={(text) => handleChange("sumInsured", "stock", text)} keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.furnitureFixturesFittings} onChangeText={(text) => handleChange("sumInsured", "furnitureFixturesFittings", text)} keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.otherContents} onChangeText={(text) => handleChange("sumInsured", "otherContents", text)} keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sumInsured?.totalSumInsured} editable={false} placeholder='0' label={'Total Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>

                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, fireAllied: !prev.fireAllied }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Fire & Allied Perils</Text>
                                {
                                    expanded.fireAllied ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>
                            <View style={{ display: expanded.fireAllied ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField value={form.sections.section1.building} editable={false} placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.plantAndMachinery} editable={false} placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.stock} editable={false} placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.furnitureFixturesFittings} editable={false} placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.otherContents} editable={false} placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.earthquakeSI} editable={false} placeholder='0' label={'Earthquake'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.stfiSI} editable={false} placeholder='0' label={'STFI'} containerInputStyle={{ paddingVertical: 6 }} />
                                {terrorism && <InputField value={form.sections.section1.terrorismSI} editable={false} placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />}
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
                                <InputField value={form.sections.section2.totalBurglarySI} editable={false} placeholder='0' label={'Burglary & Housebreaking with theft & RSMD'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section2.plantAndMachinery} editable={false} placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section2.stock} editable={false} placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section2.furnitureFixturesFittings} editable={false} placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section2.otherContents} editable={false} placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section3A.machinerySumInsured} onChangeText={(text) => handleSectionChange("section3A", "machinerySumInsured", text)} keyboardType='numeric' placeholder='0' label={'Machinery Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section3A.remarks} onChangeText={(text) => handleSectionChange("section3A", "remarks", text)} placeholder='eg. Remarks' label={'Remarks'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section3B.bppValue} onChangeText={(text) => handleSectionChange("section3B", "bppValue", text)} keyboardType='numeric' placeholder='0' label={'BPP Value'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section3B.ownersSurroundingProperty} onChangeText={(text) => handleSectionChange("section3B", "ownersSurroundingProperty", text)} keyboardType='numeric' placeholder={'0'} label={`BPP-Owner's Surroding Property`} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section3B.thirdPartyLiability} onChangeText={(text) => handleSectionChange("section3B", "thirdPartyLiability", text)} keyboardType='numeric' placeholder={'0'} label={`BPP-Third Party Liabiilty`} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section4.equipmentSumInsured} onChangeText={(text) => handleSectionChange("section4", "equipmentSumInsured", text)} keyboardType='numeric' placeholder='0' label={'EEI Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section5.portableEquipmentSumInsured} onChangeText={(text) => handleSectionChange("section5", "portableEquipmentSumInsured", text)} keyboardType='numeric' placeholder='0' label={'Portable Equipments Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section6.moneyInTransit} onChangeText={(text) => handleSectionChange("section6", "moneyInTransit", text)} keyboardType='numeric' placeholder='0' label={'Money in transit'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section6.moneyInCounter} onChangeText={(text) => handleSectionChange("section6", "moneyInCounter", text)} keyboardType='numeric' placeholder='0' label={'Money in Counter'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section6.moneyInSafe} onChangeText={(text) => handleSectionChange("section6", "moneyInSafe", text)} keyboardType='numeric' placeholder='0' label={'Money in Safe'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section7.numberOfEmployees} onChangeText={(text) => { "section7", "numberOfEmployees", text }} keyboardType='numeric' placeholder='0' label={'No of Employees'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section7.perEmployeeSumInsured} onChangeText={(text) => { "section7", "perEmployeeSumInsured", text }} keyboardType='numeric' placeholder='0' label={'Per Employee Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section8.tableA_DeathBenefitOnly} onChangeText={(text) => handleSectionChange("section8", "tableA_DeathBenefitOnly", text)} keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table A - Death Benefit Only)'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section8.tableB_DeathPlusPTD} onChangeText={(text) => handleSectionChange("section8", "tableB_DeathPlusPTD", text)} keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table B - Death + PTD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section8.tableC_DeathPTDPPD} onChangeText={(text) => handleSectionChange("section8", "tableC_DeathPTDPPD", text)} keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table C - Death + PTD + PPD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section8.tableD_DeathPTDPPDTTD} onChangeText={(text) => handleSectionChange("section8", "tableD_DeathPTDPPDTTD", text)} keyboardType='numeric' placeholder='0' label={'Personal Accident  (Table D-Death+PTD + PPD + TTD)'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section8.totalEmployees} onChangeText={(text) => handleSectionChange("section8", "totalEmployees", text)} keyboardType='numeric' placeholder='0' label={'Total Employee'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section9.grossProfitSumInsured} onChangeText={(text) => handleSectionChange("section9", "grossProfitSumInsured", text)} keyboardType='numeric' placeholder='0' label={'Business Interruption Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section9.indemnityPeriodMonths} onChangeText={(text) => handleSectionChange("section9", "indemnityPeriodMonths", text)} keyboardType='numeric' placeholder='0' label={'Business Interruption Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section10.liabilitySumInsured} onChangeText={(text) => handleSectionChange("section10", "liabilitySumInsured", text)} keyboardType='numeric' placeholder='0' label={'Public Liability Insurance Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section11.plateGlassSumInsured} onChangeText={(text) => handleSectionChange("section11", "plateGlassSumInsured", text)} keyboardType='numeric' placeholder='0' label={'Plate Glass Insurance Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
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

                        {result && <ResultCardComponent heading='Business' value={result?.premiumSummary?.grossPremium || 0.00}
                            children={
                                <View style={{ gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>Net Premium</Text>
                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.premiumSummary?.netPremium || 0}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>GST</Text>
                                        <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.premiumSummary?.gst || 0}</Text>
                                    </View>
                                </View>
                            }
                        />}



                    </View>
                </ScrollView>
            </View >
            <CustomAutoSearchModal visible={modalVisible} onClose={() => setModalVisible(false)} onSelect={onSelectRiskCode} />
        </AppBackground >
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