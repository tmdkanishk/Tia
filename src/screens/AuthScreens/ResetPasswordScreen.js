import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import AppBackground from '../../components/AppBackground'
import GlassCard from '../../components/GlassCard';
import PrimaryButton from '../../components/PrimaryButton';
import InputField from '../../components/InputField';
import { resetPassword } from '../../features/auth/authAPI';
import lockIcon from '../../assets/images/padlock.png';
import password from '../../assets/images/password.png';

const ResetPasswordScreen = ({ route, navigation }) => {
    const { email } = route.params || {};
    const [form, setForm] = useState({ password: '', confirmPassword: '', otp: '' });
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        try {
            const isValid = validateResetPassword();
            if (!isValid) {
                return;
            }
            setLoading(true);
            const response = await resetPassword({ email: email, newPassword: form.password, otp: form.otp });
            console.log("Reset Password Response:", response.data);
            if (response.data?.success) {
                // Handle success (e.g., show a success message or navigate to login)
                Alert.alert(
                    'Success',
                    response.data?.message || 'Your password has been reset successfully.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.replace('Login'),
                        },
                    ]
                );
            } else {
                setBackendError(response.data?.message || 'An error occurred. Please try again.');
            }
            // Handle success (e.g., show a success message or navigate to login)
        } catch (error) {
            console.error("Reset Password Error:", error.response?.data || error);
            setBackendError(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        // Clear error for this field when user starts typing
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
        // Clear backend error when user starts typing
        if (backendError) {
            setBackendError('');
        }
    };

    const validateResetPassword = () => {
        let errors = {};
        if (!form.password) {
            errors.password = 'Password is required';
        }

        if (!form.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        }

        if (
            form.password &&
            form.confirmPassword &&
            form.password !== form.confirmPassword
        ) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!form.otp) {
            errors.otp = 'OTP is required';
        }


        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <AppBackground>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Logo */}
                <View style={styles.logoArea}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoIcon}>🛡️</Text>
                    </View>
                    <Text style={styles.logoTitle}>Tia</Text>
                    <Text style={styles.logoSub}>One App. All Insurance. Zero Hassle.</Text>
                </View>

                {/* Glass Card */}
                <GlassCard>
                    <Text style={styles.cardTitle}>RESET PASSWORD</Text>

                    {/* Backend Error Message */}
                    {backendError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{backendError}</Text>
                        </View>
                    ) : null}

                    <InputField
                        icon={lockIcon}
                        placeholder="New Password"
                        value={form.password}
                        onChangeText={v => handleChange('password', v)}
                        secureTextEntry
                        error={errors.password}


                    />

                    <InputField
                        icon={lockIcon}
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChangeText={v => handleChange('confirmPassword', v)}
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    <InputField
                        icon={password}
                        placeholder="OTP"
                        value={form.otp}
                        onChangeText={v => handleChange('otp', v)}
                        error={errors.otp}
                        maxLength={6}
                        keyboardType='numeric'
                        iconStyle={{ width: 24, height: 24 }}
                    />

                    <PrimaryButton label="Reset Password" onPress={handleResetPassword} loading={loading} />
                </GlassCard>
            </ScrollView>
        </AppBackground>
    )
}

export default ResetPasswordScreen

const styles = StyleSheet.create({
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
    logoArea: { alignItems: 'center', paddingTop: 50, marginBottom: 24 },
    logoPlaceholder: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    },
    logoIcon: { fontSize: 40 },
    logoTitle: {
        fontSize: 36, fontWeight: '800', color: '#fff', letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
    },
    logoSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2, letterSpacing: 0.5 },
    cardTitle: {
        textAlign: 'center', color: '#fff', fontWeight: '700',
        fontSize: 16, letterSpacing: 2, marginBottom: 18,
    },

    // Error styles
    errorContainer: {
        backgroundColor: 'rgba(255, 59, 48, 0.15)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
})