import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { globalStyles } from '../../utility/globalStyles';
import { IconComponent, icons } from '../../components/IconComponent';
import { color } from '../../utility/color';
import { getActionFromState } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';

const EmailVerificationScreen = () => {
    return (
        <View style={globalStyles.container}>
            <TouchableOpacity>
                <IconComponent size={26} icon={icons.back} tintColor={color.icon} />
            </TouchableOpacity>

            <View style={{ gap: 10 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ textTransform: 'capitalize', fontSize: 24, fontWeight: '600', color: color.mainText, textAlign: 'center' }}> Verify Mobile Number</Text>
                    <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText, textAlign: 'center' }}>Enter the OTP sent to your</Text>
                    <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.primaryBlue, textAlign: 'center', marginTop: 6 }}> +91 868675675</Text>
                </View>

                <Image source={{}} />

                <Text style={{ fontSize: 14, fontWeight: '600', color: color.secondaryText, textAlign: 'center' }}>Enter the 6-digit OTP to verify your mobile number</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: color.secondaryText, textAlign: 'center' }} >Didn't receive OTP? Resend OTP</Text>
                <CustomButton label='Verify & Continue' onPress={''} />
            </View>

        </View>
    )
}

export default EmailVerificationScreen