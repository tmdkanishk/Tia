import { View, Text, KeyboardAvoidingView, ScrollView, Image, Dimensions, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../utility/globalStyles'
import { useNavigation } from '@react-navigation/native'
import { IconComponent, icons } from '../../components/IconComponent'
import { color } from '../../utility/color'
import CustomAutoSearchModal from '../../components/CustomAutoSearchModal'
import InputField from '../../components/InputField'
import { formatIndianCurrency, getRawValue, riskFireCovers } from '../../utility/helper'
import CustomButton from '../../components/CustomButton'
import ResultCardComponent from '../../components/ResultCardComponent'
import { calculateFireInsuranceAPI } from '../../features/fireInsurance/fireInsuranceAPI'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackHeader from '../../components/BackHeader'
import AddonSelector from '../../components/AddonSelector'

const FireCalculatorScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const [modalVisible, setModalVisible] = useState(false);
  const [riskCover, setRiskCover] = useState(riskFireCovers)
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [viewButton, setViewButton] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [expanded, setExpanded] = useState({
    insuredDetails: true,
    rickCover: true,
    discounts: true,
    sumInsured: true,
  });

  const [form, setForm] = useState({
    "customerDetails": {
      "customerName": "",
      "address": "",
      "pinCode": "",
      "riskCode": "",
      "occupancy": ""
    },
    "riskCovers": {
      "terrorism": true,
      "burglary": true
    },
    "discounts": {
      "iibDiscountPercent": "",
      "eqDiscountPercent": "",
      "stfiDiscountPercent": ""
    },
    "sumInsured": null,
    "addons": null
  });

  const [sumInsuredData, setSumInsuredData] = useState({
    buildingSI: '',
    plantAndMachinerySI: '',
    stockSI: '',
    furnitureFixturesFittingsSI: '',
    otherContentsSI: '',
  });
  const [totalSumInsured, setTotalSumInsured] = useState(null);


  const onSelectRiskCode = (data) => {
    handleChange("customerDetails", "riskCode", data?.risk_code);
    handleChange("customerDetails", "occupancy", data?.occupancy_desc);
  }

  const handleChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleRiskCover = (key) => {
    setRiskCover((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };



  // const onChangeText = (key, value) => {
  //   value = getRawValue(value);

  //   setSumInsuredData((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));

  // };

  const onChangeText = (key, value) => {
    value = getRawValue(value);

    setSumInsuredData((prev) => {
      const updatedData = {
        ...prev,
        [key]: value,
      };

      if (key === "buildingSI" || key === "plantAndMachinerySI" || key === "stockSI" || key === "furnitureFixturesFittingsSI" || key === "otherContentsSI") {
        setTotalSumInsured(getTotalSumInsured(updatedData));
      }

      return updatedData;
    });
  };


  const getTotalSumInsured = (data) => {
    return (
      (parseFloat(data.buildingSI) || 0) +
      (parseFloat(data.plantAndMachinerySI) || 0) +
      (parseFloat(data.stockSI) || 0) +
      (parseFloat(data.furnitureFixturesFittingsSI) || 0) +
      (parseFloat(data.otherContentsSI) || 0)
    );
  };



  const handleCalculate = async () => {
    try {
      setLoading(true);
      const updateData = {
        ...form,
        "sumInsured": sumInsuredData,
        "addons": selectedAddons
      };
      console.log("updateData", updateData);
      const response = await calculateFireInsuranceAPI(updateData);
      console.log("response", response);
      setResult(response.data?.data);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong"
      );
      console.log("error", error.response.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.screenBackground }}>
      <SafeAreaView>
        <View style={globalStyles.newContainer}>
          <BackHeader title={'Fire Calculator'} subTitle={'Calculate premium for Fire Insurance policies.'} />
          <KeyboardAvoidingView
            behavior='padding'
            style={{ flex: 1, backgroundColor: color.screenBackground }}
          >
            <View style={globalStyles.innerContainer}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, }}>
                <View style={{ gap: 12, paddingHorizontal: 12, marginTop: 12 }}>
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
                            <Pressable hitSlop={40} onPress={() => { toggleRiskCover(item.key); handleChange("riskCovers", item.key, !item.selected) }}>
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
                      <InputField value={form.discounts?.eqDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "eqDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'Earthquake Discount %'} containerInputStyle={{ paddingVertical: 6 }} />
                      <InputField value={form.discounts?.stfiDiscountPercent} maxLength={3} onChangeText={(text) => handleChange("discounts", "stfiDiscountPercent", text)} keyboardType='numeric' placeholder='0' label={'STFI Discount %'} containerInputStyle={{ paddingVertical: 6 }} />

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
                      <InputField value={formatIndianCurrency(sumInsuredData.buildingSI)} onChangeText={(text) => onChangeText("buildingSI", text)} keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
                      <InputField value={formatIndianCurrency(sumInsuredData.plantAndMachinerySI)} onChangeText={(text) => onChangeText("plantAndMachinerySI", text)} keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
                      <InputField value={formatIndianCurrency(sumInsuredData.stockSI)} onChangeText={(text) => onChangeText("stockSI", text)} keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
                      <InputField value={formatIndianCurrency(sumInsuredData.furnitureFixturesFittingsSI)} onChangeText={(text) => onChangeText("furnitureFixturesFittingsSI", text)} keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
                      <InputField value={formatIndianCurrency(sumInsuredData.otherContentsSI)} onChangeText={(text) => onChangeText("otherContentsSI", text)} keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />
                      <InputField value={formatIndianCurrency(totalSumInsured)} editable={false} placeholder='0' label={'Total Sum Insured'} containerInputStyle={{ paddingVertical: 6 }} />
                    </View>
                  </View>


                  {totalSumInsured > 500000000 && <AddonSelector
                    value={selectedAddons}
                    onChange={setSelectedAddons}
                  />
                  }

                  <CustomButton label='CALCULATE PREMIUM' loading={loading} onPress={handleCalculate} />




                  {result && <ResultCardComponent heading='IAR' value={result?.premium?.grossPremium || 0.00}
                    children={
                      <View style={{ gap: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                          <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>Net Premium</Text>
                          <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.premium?.netPremium || 0}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                          <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>GST</Text>
                          <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.premium?.gst || 0}</Text>
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

                          {result?.rates?.terrorismRate && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                            <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>Terrorism Rate</Text>
                            <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.rates?.terrorismRate}</Text>
                          </View>}

                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEF4FC', marginBottom: 10, padding: 5 }}>
                            <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '600' }}>Final Fire Rate</Text>
                            <Text style={{ fontSize: 13, color: '#1A237E', fontWeight: '700' }}>{result?.rates?.finalFireRate}</Text>
                          </View>

                        </View>}

                        {!viewButton && <TouchableOpacity hitSlop={40} onPress={() => setViewButton(true)} style={{ paddingBottom: 6, paddingRight: 10, alignItems: 'center', alignSelf: 'flex-end' }}>
                          <Text style={{ color: color.primaryBlueDark, textDecorationLine: 'underline' }}>Hide Rates</Text>
                        </TouchableOpacity>}

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

export default FireCalculatorScreen
