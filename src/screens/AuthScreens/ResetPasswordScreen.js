import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputField from '../../components/InputField';
import { globalStyles } from '../../utility/globalStyles';
import { color } from '../../utility/color';
import { IconComponent, icons } from '../../components/IconComponent';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { forgotPassword, resendOtp, resetPassword } from '../../features/auth/authAPI';
import AuthScreenHeader from './AuthScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResetPasswordScreen = ({ route }) => {
    const navigation = useNavigation();
    const { identifier, sentOtp } = route.params;
    const [loading, setLoading] = useState(false);
    const [demo, setDemo] = useState(sentOtp);
    const [resetForm, setResetForm] = useState({
        password: '',
        confirmPassword: '',
        otp: ''
    })

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        otp: ''
    })
    const [backendError, setBackendError] = useState(null);

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
            const response = await forgotPassword({ identifier: identifier });
            console.log("response", response?.data);
            setCountdown(60);
        } catch (error) {
            console.log("error", error.response?.data);
        }
    }

    const handleChange = (key, value) => {
        setResetForm(prev => ({
            ...prev,
            [key]: value
        }));

        // Remove error while typing
        setErrors(prev => ({
            ...prev,
            [key]: ''
        }));
    };

    const handleResetPassword = async () => {
        try {
            setLoading(true);
            if (!validateForm()) {
                return;
            }
            const payload = {
                identifier: identifier,
                otp: resetForm.otp,
                newPassword: resetForm.password
            }
            const response = await resetPassword(payload);
            if (response?.data?.success) {
                Alert.alert(
                    'Success!',
                    response?.data?.message,
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            }
        } catch (error) {
            setBackendError(error.response.data?.message || 'something Went wrong!')
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
        }
    }




    const validateForm = () => {
        let valid = true;
        let newErrors = {
            password: '',
            confirmPassword: '',
            otp: ''
        };


        if (!resetForm.password?.trim()) {
            newErrors.password = 'New password is required';
            valid = false;
        }

        if (resetForm.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            valid = false;
        }

        if (!/[A-Z]/.test(resetForm.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
            valid = false;
        }

        if (!/[0-9]/.test(resetForm.password)) {
            newErrors.password = 'Password must contain at least one number';
            valid = false;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(resetForm.password)) {
            newErrors.password = "Password must contain at least one special character";
            valid = false;
        }

        if (!resetForm.confirmPassword?.trim()) {
            newErrors.confirmPassword = 'New password is required';
            valid = false;
        }

        if (resetForm.password != resetForm.confirmPassword) {
            newErrors.confirmPassword = 'Password and confirm password must be same';
            valid = false;
        }

        if (!resetForm.otp?.trim()) {
            newErrors.otp = 'OTP is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    return (
        <SafeAreaView>
            <View style={globalStyles.newContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IconComponent size={26} icon={icons.back} tintColor={color.icon} />
                </TouchableOpacity>
                <View style={{ gap: 12 }}>
                    {/* <View style={{ gap: 6, alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                    <IconComponent icon={icons.shield} size={56} tintColor={color.primaryBlue} />
                    <View>
                        <Text style={{ textTransform: 'uppercase', fontSize: 24, fontWeight: '600', color: color.mainText }}>TIA</Text>
                        <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText }}>Premium calculators</Text>
                    </View>
                </View> */}
                    <AuthScreenHeader />

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ textTransform: 'capitalize', fontSize: 24, fontWeight: '600', color: color.mainText, textAlign: 'center' }}> Reset Password</Text>
                    </View>

                    <InputField
                        label={'New Password'}
                        icon={icons.password}
                        iconStyle={{ width: 32, height: 32, tintColor: color.secondaryText }}
                        placeholder={'Enter new password'}
                        secureTextEntry
                        onChangeText={(text) => handleChange("password", text)}
                        value={resetForm.password}
                        error={errors.password}
                    />
                    <InputField
                        label={'Confirm Password'}
                        icon={icons.password}
                        iconStyle={{ width: 32, height: 32, tintColor: color.secondaryText }}
                        placeholder={'Enter confirm password'}
                        secureTextEntry
                        onChangeText={(text) => handleChange("confirmPassword", text)}
                        value={resetForm.confirmPassword}
                        error={errors.confirmPassword}
                    />


                    <InputField
                        label={'OTP'}
                        icon={icons.password}
                        iconStyle={{ width: 32, height: 32, tintColor: color.secondaryText }}
                        placeholder={'OTP'}
                        onChangeText={(text) => handleChange("otp", text)}
                        value={resetForm.otp}
                        error={errors.otp}
                        maxLength={6}
                        keyboardType='number-pad'
                    />
                    {demo && <Text style={{ color: color.successGreen, fontWeight: '600', textAlign:'right' }}>Demo OTP : {demo}</Text>}

                    {backendError && <Text style={{ color: color.error }}>{backendError}</Text>}

                    {countdown == 0 &&
                        <View style={{ paddingHorizontal: 12 }}>
                            <Text onPress={handleResend} style={{ color: color.primaryBlueDark, textAlign: 'left' }}>Resend OTP</Text>
                        </View>
                    }

                    <CustomButton label='Reset Password' onPress={() => handleResetPassword()} loading={loading} />
                    {countdown > 0 && <Text style={{ color: color.primaryBlueDark, textAlign: 'left' }}>Resend OTP in {countdown}s</Text>}

                </View>
            </View>
        </SafeAreaView>
    )
}

export default ResetPasswordScreen