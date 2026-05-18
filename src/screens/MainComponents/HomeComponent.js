import { View, Text, Dimensions, Pressable } from 'react-native'
import React, { memo } from 'react'
import HeaderComponent from '../MainComponents/HeaderComponent';
import { color } from '../../utility/color';
import { IconComponent, icons } from '../../components/IconComponent';
import { useNavigation } from '@react-navigation/native';


const HomeComponent = () => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();

  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 40, paddingTop: 50, gap: 10 }}>
      <HeaderComponent />

      <View style={{ borderBottomWidth: 1, paddingBottom: 20, borderColor: color.borderColor }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: color.mainText }}>Good Morning, Rahul</Text>
        <Text style={{ fontSize: 14, color: color.secondaryText }}>Select a calculator to get started</Text>
      </View>

      <View>
        <Text style={{ fontSize: 18, fontWeight: '600', color: color.mainText }}>Choose a Calculator</Text>
        <Text style={{ fontSize: 14, color: color.secondaryText }}> Select the calculator that matches your insurance requirement.</Text>
      </View>

      {/* Fire Calculator */}
      <Pressable onPress={() => navigation.navigate('FireCalculator')} style={{ padding: 10, borderWidth: 2, borderRadius: 10, borderLeftWidth: 5, borderColor: color.borderColor, borderLeftColor: '#fc4f05', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ width: width * 0.150, height: width * 0.150, borderRadius: 8, backgroundColor: '#fff5f2', alignItems: 'center', justifyContent: 'center' }}>
          <IconComponent icon={icons.fire} size={46} tintColor={'#fc4f05'} />
        </View>

        <View style={{ width: width * 0.6, gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: color.mainText }}>Fire Calculator</Text>
          <Text style={{ fontSize: 14, color: color.secondaryText }}>Calculate premium for Fire Insurance policies.</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <IconComponent icon={icons.docs} size={16} tintColor={'#fc4f05'} />
            <Text style={{ fontSize: 14, color: color.secondaryText }}>120 Quotes Generated</Text>
          </View>
        </View>

        <IconComponent icon={icons.rightarrow} size={16} tintColor={color.icon} />

      </Pressable>


      {/* Business Calculator */}
      <Pressable onPress={() => navigation.navigate('BusinessCalculator')} style={{ padding: 10, borderWidth: 2, borderRadius: 10, borderLeftWidth: 5, borderColor: color.borderColor, borderLeftColor: color.primaryBlue, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ width: width * 0.150, height: width * 0.150, borderRadius: 8, backgroundColor: color.lightBlueBackground, alignItems: 'center', justifyContent: 'center' }}>
          <IconComponent icon={icons.businessins} size={46} tintColor={color.primaryBlue} />
        </View>

        <View style={{ width: width * 0.6, gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: color.mainText }}>Business Calculator</Text>
          <Text style={{ fontSize: 14, color: color.secondaryText }}>Calculate premium for Business Insurance policies.</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <IconComponent icon={icons.docs} size={16} tintColor={color.primaryBlue} />
            <Text style={{ fontSize: 14, color: color.secondaryText }}>248 Quotes Generated</Text>
          </View>
        </View>

        <IconComponent icon={icons.rightarrow} size={16} tintColor={color.icon} />

      </Pressable>

      {/* IAR Calculator */}
      <Pressable onPress={() => navigation.navigate('IARCalculator')} style={{ padding: 10, borderWidth: 2, borderRadius: 10, borderLeftWidth: 5, borderColor: color.borderColor, borderLeftColor: color.mainText, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ width: width * 0.150, height: width * 0.150, borderRadius: 8, backgroundColor: color.lightBlueBackground, alignItems: 'center', justifyContent: 'center' }}>
          <IconComponent icon={icons.industry} size={46} tintColor={color.mainText} />
        </View>

        <View style={{ width: width * 0.6, gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: color.mainText }}>IAR Calculator</Text>
          <Text style={{ fontSize: 14, color: color.secondaryText }}>Calculate premium for Industrial All Risk policies.</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <IconComponent icon={icons.docs} size={16} tintColor={color.mainText} />
            <Text style={{ fontSize: 14, color: color.secondaryText }}>98 Quotes Generated</Text>
          </View>
        </View>

        <IconComponent icon={icons.rightarrow} size={16} tintColor={color.icon} />

      </Pressable>

      <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: color.lightBlueBackground, gap: 16 }}>
        <View style={{ backgroundColor: color.lightBlueBackground, width: width * 0.150, height: width * 0.150, borderRadius: width * 0.75, borderWidth: 1, elevation: 2, borderColor: color.lightBlueBackground, alignItems: 'center', justifyContent: 'center' }}>
          <IconComponent icon={icons.verified} size={42} tintColor={color.primaryBlueDark} />
        </View>
        <View style={{ width: width * 0.7 }}>
          <Text style={{ fontSize: 13, color: color.mainText }} >All calculations are indicative and subject to underwriting and policy terms.</Text>
        </View>
      </View>
    </View>
  )
}

export default memo(HomeComponent);