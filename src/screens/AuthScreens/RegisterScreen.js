import { View, Text, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../utility/globalStyles'
import { IconComponent, icons } from '../../components/IconComponent'
import { color } from '../../utility/color'
import InputField from '../../components/InputField'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

import { registerAPI } from '../../features/auth/authAPI'
import AuthScreenHeader from './AuthScreenHeader'

const RegisterScreen = () => {
    const navigation = useNavigation();
    const role = useSelector((state) => state.auth.role);
    const [form, setForm] = useState({
        fullName: null,
        mobile: null,
        email: null,
        password: null,
        confirmPassword: null,
    });
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState(null);
    const [loading, setLoading] = useState(false);




    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        // Clear error for this field when user starts typing
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
        // Clear backend error when user starts typing
        if (backendError) {
            setBackendError(null);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        // Check for empty fields
        if (!form.fullName) newErrors.fullName = 'Full name is required';
        if (!form.mobile) newErrors.mobile = 'Mobile number is required';
        if (!form.email) newErrors.email = 'Email is required';
        if (!form.password) newErrors.password = 'Password is required';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';

        // Password strength validation
        if (form.password) {
            if (form.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            } else if (!/[A-Z]/.test(form.password)) {
                newErrors.password = 'Password must contain at least one uppercase letter';
            } else if (!/[0-9]/.test(form.password)) {
                newErrors.password = 'Password must contain at least one number';
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
                newErrors.password = 'Password must contain at least one special character';
            }
        }

        // Check if passwords match
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Email format validation
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Mobile number validation (10 digits)
        if (form.mobile && !/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) {
            newErrors.mobile = 'Please enter a valid 10-digit number';
        }

        return newErrors;
    };

    const handleSignUp = async () => {
        // Clear previous errors
        setErrors({});
        setBackendError(null);

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {

            setLoading(true);
            const payload = {
                name: form.fullName,
                mobile: form.mobile,
                email: form.email,
                password: form.password,
                role,
            };

            const response = await registerAPI(payload);
            navigation.replace('VerificationScreen', { identifier: response.data.data?.verificationType == 'SMS' ? response.data.data?.mobile : response.data.data?.email });

        } catch (error) {
            console.log("error in register api", error);
            // Handle backend validation errors
            if (error?.response?.data?.message) {
                setBackendError(error.response.data.message);
            } else {
                const errorMessage = error?.message || 'Registration failed. Please try again.';
                setBackendError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }




    return (

        <View style={globalStyles.container}>
            <KeyboardAvoidingView
                behavior='height'
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ gap: 20 }}>
                        {/* <View style={{ gap: 6, alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                            <IconComponent icon={icons.shield} size={56} tintColor={color.primaryBlue} />
                            <View>
                                <Text style={{ textTransform: 'uppercase', fontSize: 24, fontWeight: '600', color: color.mainText }}>TIA</Text>
                                <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText }}>Premium calculators</Text>
                            </View>
                        </View> */}
                        <AuthScreenHeader/>

                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ textTransform: 'capitalize', fontSize: 24, fontWeight: '600', color: color.mainText, textAlign: 'center' }}> Create Your Account</Text>
                            <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText, textAlign: 'center' }}>Enter your details to get started</Text>
                        </View>

                        <InputField
                            label={'Full Name'}
                            icon={icons.user}
                            iconStyle={{ width: 24, height: 24, tintColor: color.secondaryText }}
                            placeholder={'Enter your fullName'}
                            onChangeText={(text) => handleChange("fullName", text)}
                            value={form.fullName}
                            error={errors.fullName}
                        />

                        <InputField
                            label={'Mobile Number'}
                            icon={icons.user}
                            iconStyle={{ width: 24, height: 24, tintColor: color.secondaryText }}
                            placeholder={'Enter mobile number'}
                            keyboardType="phone-pad"
                            maxLength={10}
                            onChangeText={(text) => handleChange("mobile", text)}
                            value={form.mobile}
                            error={errors.mobile}

                        />

                        <InputField
                            label={'Email Address'}
                            icon={icons.email}
                            iconStyle={{ width: 24, height: 24, tintColor: color.secondaryText }}
                            placeholder={'Enter email address'}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => handleChange("email", text)}
                            value={form.email}
                            error={errors.email}
                        />

                        <InputField
                            label={'Password'}
                            icon={icons.password}
                            iconStyle={{ width: 32, height: 32, tintColor: color.secondaryText }}
                            placeholder={'Enter password'}
                            secureTextEntry
                            onChangeText={(text) => handleChange("password", text)}
                            value={form.password}
                            error={errors.password}
                        />
                        <InputField
                            label={'Confirm Password'}
                            icon={icons.password}
                            iconStyle={{ width: 32, height: 32, tintColor: color.secondaryText }}
                            placeholder={'Confirm Password'}
                            secureTextEntry
                            onChangeText={(text) => handleChange("confirmPassword", text)}
                            value={form.confirmPassword}
                            error={errors.confirmPassword}
                        />

                        <View style={{ gap: 8 }}>
                            <Text style={{ alignItems: 'center' }}><IconComponent icon={icons.checkmark} size={18} /> Minimum 8 characters</Text>
                            <Text style={{ alignItems: 'center' }}><IconComponent icon={icons.checkmark} size={18} /> At least 1 number</Text>
                            <Text style={{ alignItems: 'center' }}><IconComponent icon={icons.checkmark} size={18} /> At least 1 special character</Text>
                            <Text style={{ alignItems: 'center' }}><IconComponent icon={icons.checkmark} size={18} /> At least 1 uppercase letter</Text>
                        </View>

                        <CustomButton label='Sign Up' onPress={handleSignUp} loading={loading} />
                        <Text onPress={() => navigation.goBack()} style={{ fontSize: 16, color: color.mainText, textAlign: 'center' }}>Already have an account? <Text style={{ color: color.primaryBlueDark }}>Login</Text></Text>

                    </View>

                </ScrollView >
            </KeyboardAvoidingView>
        </View >

    )
}

export default RegisterScreen