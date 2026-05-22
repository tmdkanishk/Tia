import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { globalStyles } from '../../utility/globalStyles'
import { color } from '../../utility/color'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const VerifiedAccountSuccess = () => {
    const navigation = useNavigation();
    const { width } = Dimensions.get('window');
    return (
        <SafeAreaView>
            <View style={globalStyles.newContainer}>
                <View style={{ alignItems: 'center', gap: 10 }}>
                    <Image source={require('../../assets/images/success.png')} style={{ width: width * 0.4, height: width * 0.4, marginVertical: 40, resizeMode: 'contain', }} />
                    <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', color: color.mainText }}>Account Verified Successfully!</Text>
                    <Text style={{ fontSize: 16, fontWeight: '400', textAlign: 'center', color: color.secondaryText }}>Your account has been created and verified Successfully.</Text>
                    <View style={{ borderWidth: 1, padding: 10, width: width * 0.8, borderColor: color.successGreen, borderRadius: 12, backgroundColor: '#f2faf5', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>
                        <Image source={require('../../assets/images/shilduser.png')} style={{ width: width * 0.2, height: width * 0.3, resizeMode: 'contain', tintColor: color.successGreen }} />
                        <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', color: color.mainText }}>Welcome to TIA!</Text>
                        <Text style={{ fontSize: 16, fontWeight: '400', textAlign: 'center', color: color.secondaryText }}>You can now login and access dashboard.</Text>
                    </View>
                    <View style={{ width: '100%', marginTop: 20 }}>
                        <CustomButton label='Go to Login' onPress={() => navigation.goBack()} />
                    </View>

                </View>
            </View>
        </SafeAreaView>
    )
}

export default VerifiedAccountSuccess