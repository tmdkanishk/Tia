import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../utility/globalStyles';
import { IconComponent, icons } from '../../components/IconComponent';
import { color } from '../../utility/color';
import CustomButton from '../../components/CustomButton';
import CustomOTPInput from '../../components/CustomOTPInput';
import { useNavigation } from '@react-navigation/native';
import { resendOtp, verifyOtp } from '../../features/auth/authAPI';

const VerificationScreen = ({ route }) => {
    const { identifier } = route.params;
    const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    
    // timer effect
    useEffect(() => {

        let interval;

        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };

    }, [countdown]);

    const handleResend = async () => {
        // prevent multiple clicks
        if (countdown > 0) return;

        try {
            const payload = {
                identifier: identifier
            }
            console.log("payload", payload);
            const response = await resendOtp(payload);
            console.log("response", response?.data);
            setCountdown(60);
        } catch (error) {
            console.log("error", error.response?.data);
        }
    }

    const handleChangeOtp = (otp) => {
        setOtp(otp);
    }

    const isButtonDisabled = otp.length !== 6;

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            const payload = {
                identifier: identifier,
                otp: otp
            }
            const response = await verifyOtp(payload);
            if (response.status == 200) {
                navigation.replace('VerifiedAccountSuccess');
            }

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={globalStyles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <IconComponent size={26} icon={icons.back} tintColor={color.icon} />
            </TouchableOpacity>

            <View style={{ gap: 20, alignItems: 'center', }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ textTransform: 'capitalize', fontSize: 24, fontWeight: '600', color: color.mainText, textAlign: 'center' }}> Verify Account</Text>
                    <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText, textAlign: 'center' }}>Enter the OTP sent to your</Text>
                    <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.primaryBlue, textAlign: 'center', marginTop: 6 }}> {identifier}</Text>
                </View>

                <Image source={require('../../assets/images/otp.png')} style={{ width: width * 0.4, height: width * 0.4, marginVertical: 32, resizeMode: 'contain', tintColor: color.primaryBlueDark }} />

                <Text style={{ fontSize: 14, fontWeight: '600', color: color.secondaryText, textAlign: 'center' }}>Enter the 6-digit OTP to verify your mobile number</Text>
                <CustomOTPInput onChangeOTP={handleChangeOtp} />
                {countdown == 0 &&
                    <View style={{ width: width, paddingHorizontal: 12 }}>
                        <Text onPress={handleResend} style={{ color: color.primaryBlueDark, textAlign: 'left' }}>Resend OTP</Text>
                    </View>
                }
                <View style={{ width: width, paddingHorizontal: 12, gap: 10 }}>
                    <CustomButton label='Verify & Continue' onPress={handleVerifyOtp} disabled={isButtonDisabled} loading={loading} />
                    {countdown > 0 && <Text style={{ color: color.primaryBlueDark, textAlign: 'left' }}>Resend OTP in {countdown}s</Text>}
                </View>

            </View>

        </View>
    )
}

export default VerificationScreen