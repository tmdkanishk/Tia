import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AppBackground from '../../components/AppBackground'
import HeaderComponent from '../../components/HeaderComponent'
import GlassCard from '../../components/GlassCard'
import { IconComponent, icons } from '../../components/IconComponent'
import InputField from '../../components/InputField'
import YesNoRadioComponent from '../../components/YesNoRadioComponent'
import CustomAutoSearchModal from '../../components/CustomAutoSearchModal'
import { calculatIARIndurance } from '../../features/iarInsurance/iARInsuranceAPI'
import ResultCardComponent from '../../components/ResultCardComponent'

const IARCalculatorScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [terrorism, setTerrorism] = useState(true);
    const [burglary, setBurglary] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [expanded, setExpanded] = useState({
        insuredDetails: true,
        discounts: false,
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
            if (updatedForm?.riskCovers?.terrorism === false) {
                updatedForm.sections.section1.terrorismSI = 0;
                updatedForm.sections.section2.terrorismSI = 0;
            }
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


    return (
        <AppBackground>
            <View style={{ gap: 12, }}>
                <HeaderComponent heading={'IAR'} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180, paddingHorizontal: 12 }}>
                    <View style={{ height: '100%', gap: 12 }}>
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
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.buildingSI} onChangeText={(text) => handleChange("sumInsured", "buildingSI", text)} keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.plantAndMachinerySI} onChangeText={(text) => handleChange("sumInsured", "plantAndMachinerySI", text)} keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.stockSI} onChangeText={(text) => handleChange("sumInsured", "stockSI", text)} keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.furnitureFixturesFittingsSI} onChangeText={(text) => handleChange("sumInsured", "furnitureFixturesFittingsSI", text)} keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField onEndEditing={onHandleSubmitInput} value={form.sumInsured?.otherContentsSI} onChangeText={(text) => handleChange("sumInsured", "otherContentsSI", text)} keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sumInsured?.totalSI} editable={false} placeholder='0' label={'Total Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
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
                                <InputField value={form.sections.section1.buildingSI} editable={false} placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.plantAndMachinerySI} editable={false} placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.stockSI} editable={false} placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.furnitureFixturesFittingsSI} editable={false} placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.otherContentsSI} editable={false} placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.earthquakeSI} editable={false} placeholder='0' label={'Earthquake'} containerInputStyle={{ paddingVertical: 6 }} />
                                <InputField value={form.sections.section1.stfiSI} editable={false} placeholder='0' label={'STFI'} containerInputStyle={{ paddingVertical: 6 }} />
                                {terrorism && <InputField value={form.sections.section1.terrorismSI} editable={false} placeholder='0' label={'Terrorism'} containerInputStyle={{ paddingVertical: 6 }} />}
                            </View>
                        </GlassCard>

                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
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
                                <InputField value={form.sections.section3A.machineryBreakdownSI} onChangeText={(text) => handleSectionChange("section3A", "machineryBreakdownSI", text)} keyboardType='numeric' placeholder='0' label={'Machinery Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>

                        <GlassCard innerStyle={{ padding: 16, gap: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setExpanded(prev => ({ ...prev, machineryBreakdown: !prev.machineryBreakdown }))}>
                                <Text style={{ fontSize: 14, color: '#fff' }}> Mlop</Text>
                                {
                                    expanded.mlop ? <IconComponent icon={icons.uparrow} size={18} tintColor="#fff" />
                                        : <IconComponent icon={icons.downarrow} size={18} tintColor="#fff" />
                                }
                            </TouchableOpacity>
                            <View style={{ display: expanded.machineryBreakdown ? 'flex' : 'none', marginTop: 10 }}>
                                <InputField value={form.sections.section3B.mlopSI} onChangeText={(text) => handleSectionChange("section3B", "mlopSI", text)} keyboardType='numeric' placeholder='0' label={'Machinery Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                            </View>
                        </GlassCard>


                        <TouchableOpacity
                            style={[styles.calcBtn, loading && styles.calcBtnDisabled]}
                            onPress={handleIARCalculate}
                            activeOpacity={0.85}
                            disabled={loading}
                        >
                            <Text style={styles.calcBtnText}>
                                {loading ? 'CALCULATING...' : 'CALCULATE PREMIUM'}
                            </Text>
                        </TouchableOpacity>

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
            </View>
        </AppBackground>
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