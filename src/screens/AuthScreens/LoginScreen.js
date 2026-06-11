import { View, Text, KeyboardAvoidingView, ScrollView, Alert, Image, Dimensions, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../utility/globalStyles'
import { IconComponent, icons } from '../../components/IconComponent';
import { color } from '../../utility/color';
import { useDispatch } from 'react-redux';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { loginAPI } from '../../features/auth/authAPI';
import { useNavigation } from '@react-navigation/native';
import { setCredentials } from '../../features/auth/authSlice';
import AuthScreenHeader from './AuthScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
    const { width } = Dimensions.get('window');
    const navigation = useNavigation();
    const [emailLoginForm, setEmailLoginForm] = useState({
        identifier: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        identifier: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleEmailLogin = async () => {
        // Stop if form is invalid
        if (!validateForm()) {
            return;
        }
        try {
            setLoading(true);
            const response = await loginAPI(emailLoginForm);
            console.log("response", response.data);
            dispatch(
                setCredentials({
                    accessToken: response.data?.accessToken,
                    refreshToken: response.data?.refreshToken,
                    role: response.data?.data?.role,
                    isAuthenticated: true,
                    isVerified: true,
                    user: response.data?.data,
                })
            );

        } catch (error) {
            console.log("error", error?.response?.data);
            if (error?.response?.data?.data == null) {
                Alert.alert(
                    'Login Failed',
                    error?.response?.data?.message,
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                        }
                    ]
                );
            } else if (error?.response?.data?.data != null) {
                console.log("error.response.data", error.response.data);
                navigation.replace('VerificationScreen', { identifier: error.response.data?.data?.verificationType == 'SMS' ? error.response.data?.data?.mobile : error.response.data?.data?.email, sentOtp: error.response.data?.data?.otp });

            } else {
                Alert.alert(
                    'Login Failed',
                    "Something went wrong!",
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                        }
                    ]
                );
            }


        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setEmailLoginForm(prev => ({
            ...prev,
            [key]: value
        }));

        // Remove error while typing
        setErrors(prev => ({
            ...prev,
            [key]: ''
        }));
    };


    const validateForm = () => {
        let valid = true;
        let newErrors = {
            identifier: '',
            password: ''
        };

        if (!emailLoginForm.identifier?.trim()) {
            newErrors.identifier = 'Email is required';
            valid = false;
        }

        if (!emailLoginForm.password?.trim()) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);

        return valid;
    };




    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <SafeAreaView>
                <View style={[globalStyles.newContainer, { backgroundColor: color.screenBackground }]}>
                    <KeyboardAvoidingView
                        behavior='padding'
                        style={{ flex: 1 }}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ gap: 10, paddingHorizontal: 12 }}>
                                <AuthScreenHeader />

                                <Image source={require('../../assets/logo/loginImg.png')} style={{ width: width * 0.6, height: width * 0.5, alignSelf: 'center' }} />

                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 24, fontWeight: '600', color: color.mainText, textAlign: 'center' }}> Welcome Back</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: color.secondaryText, textAlign: 'center' }}>Login to access your account</Text>
                                </View>

                                <View style={{ gap: 12 }}>
                                    <InputField
                                        label={'Email or mobile number'}
                                        icon={icons.user}
                                        iconStyle={{ width: 24, height: 24, tintColor: color.secondaryText }}
                                        placeholder={'Email or mobile number'}
                                        onChangeText={(text) => handleChange("identifier", text)}
                                        value={emailLoginForm.identifier}
                                        error={errors.identifier}
                                    />

                                    <InputField
                                        label={'Password'}
                                        icon={icons.password}
                                        iconStyle={{ width: 32, height: 32, tintColor: color.secondaryText }}
                                        placeholder={'Enter password'}
                                        secureTextEntry
                                        onChangeText={(text) => handleChange("password", text)}
                                        value={emailLoginForm.password}
                                        error={errors.password}
                                    />

                                    <Text onPress={() => navigation.navigate('ForgotPassword')} style={{ fontSize: 16, color: color.primaryBlueDark, textAlign: 'right', marginVertical: 6 }}>Forgot Password ?</Text>

                                    <CustomButton label='Login' onPress={handleEmailLogin} loading={loading} />
                                    <Text onPress={() => navigation.navigate('Register')} style={{ fontSize: 16, color: color.mainText, textAlign: 'center' }}>Don't have an account? <Text style={{ color: color.primaryBlueDark }}>Register</Text></Text>

                                </View>

                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default LoginScreen