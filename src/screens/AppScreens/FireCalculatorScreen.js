import { View, Text, KeyboardAvoidingView, ScrollView, Image, Dimensions, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../utility/globalStyles'
import { useNavigation } from '@react-navigation/native'
import { IconComponent, icons } from '../../components/IconComponent'
import { color } from '../../utility/color'
import CustomAutoSearchModal from '../../components/CustomAutoSearchModal'
import InputField from '../../components/InputField'
import { riskFireCovers } from '../../utility/helper'
import CustomButton from '../../components/CustomButton'
import ResultCardComponent from '../../components/ResultCardComponent'
import { calculateFireInsuranceAPI } from '../../features/fireInsurance/fireInsuranceAPI'

const FireCalculatorScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const [modalVisible, setModalVisible] = useState(false);
  const [riskCover, setRiskCover] = useState(riskFireCovers)
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState({
    insuredDetails: true,
    rickCover: true,
    discounts: true,
    sumInsured: true,
  });

  const [form, setForm] = useState({
    "customerDetails": {
      "customerName": null,
      "address": null,
      "pinCode": null,
      "riskCode": null,
      "occupancy": null
    },
    "riskCovers": {
      "terrorism": true,
      "burglary": true
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
      "otherContentsSI": 0
    }

  });


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

  const handleCalculate = async () => {
    try {
      setLoading(true);
      console.log("from", form);
      const response = await calculateFireInsuranceAPI(form);
      console.log("response", response);
      setResult(response.data?.data);

    } catch (error) {
      console.log("error", error.response.data);
    } finally {
      setLoading(false);
    }
  }

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
              <InputField value={form.sumInsured.buildingSI} onChangeText={(text) => handleChange("sumInsured", "buildingSI", text)} keyboardType='numeric' placeholder='0' label={'Building'} containerInputStyle={{ paddingVertical: 6 }} />
              <InputField value={form.sumInsured.plantAndMachinerySI} onChangeText={(text) => handleChange("sumInsured", "plantAndMachinerySI", text)} keyboardType='numeric' placeholder='0' label={'Plant & Machinery'} containerInputStyle={{ paddingVertical: 6 }} />
              <InputField value={form.sumInsured.stockSI} onChangeText={(text) => handleChange("sumInsured", "stockSI", text)} keyboardType='numeric' placeholder='0' label={'Stock'} containerInputStyle={{ paddingVertical: 6 }} />
              <InputField value={form.sumInsured.furnitureFixturesFittingsSI} onChangeText={(text) => handleChange("sumInsured", "furnitureFixturesFittingsSI", text)} keyboardType='numeric' placeholder='0' label={'Furniture Fixtures & Fittings'} containerInputStyle={{ paddingVertical: 6 }} />
              <InputField value={form.sumInsured.otherContentsSI} onChangeText={(text) => handleChange("sumInsured", "otherContentsSI", text)} keyboardType='numeric' placeholder='0' label={'Other Contents'} containerInputStyle={{ paddingVertical: 6 }} />

            </View>
          </View>


          <CustomButton label='CALCULATE PREMIUM' loading={loading} onPress={handleCalculate} />

          {result && <ResultCardComponent heading='Fire' value={result?.premium?.grossPremium || 0.00}
            children={
              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: color.borderColor, marginBottom: 10, padding: 5 }}>
                  <Text style={{ fontSize: 13, color: color.primaryBlueDark, fontWeight: '600' }}>Net Premium</Text>
                  <Text style={{ fontSize: 13, color: color.primaryBlueDark, fontWeight: '700' }}>{result?.premium?.netPremium || 0}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: color.borderColor, marginBottom: 10, padding: 5 }}>
                  <Text style={{ fontSize: 13, color: color.primaryBlueDark, fontWeight: '600' }}>GST</Text>
                  <Text style={{ fontSize: 13, color: color.primaryBlueDark, fontWeight: '700' }}>{result?.premium?.gst || 0}</Text>
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

export default FireCalculatorScreen
