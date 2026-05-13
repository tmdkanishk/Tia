import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AppBackground from '../../components/AppBackground'
import GlassCard from '../../components/GlassCard'
import InputField from '../../components/InputField'
import PrimaryButton from '../../components/PrimaryButton'
import emailIcon from '../../assets/images/email.png';
import { forgotPassword } from '../../features/auth/authAPI'

const ForgotScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [backendError, setBackendError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        try {
            if (!email) {
                setError('Email is required');
                return;
            }

            setLoading(true);
            const response = await forgotPassword({ email: email });
            if (response.data.success) {
                console.log("Forgot Password Response:", response.data);
                navigation.replace('ResetPassword', { email: email });
            } else {
                setBackendError(response.data?.message || 'An error occurred. Please try again.');
            }

        } catch (err) {
            console.error("Forgot Password Error:", err.response?.data || err);
            setBackendError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const onChangeEmailText = (text) => {
        setEmail(text);
        if (error) {
            setError('');
        }
        if (backendError) {
            setBackendError('');
        }
    }

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
                    <Text style={styles.cardTitle}>FORGOT PASSWORD</Text>

                    {/* Backend Error Message */}
                    {backendError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{backendError}</Text>
                        </View>
                    ) : null}

                    <InputField
                        icon={emailIcon}
                        placeholder="Email"
                        value={email}
                        onChangeText={onChangeEmailText}
                        error={error}
                    />
                    <PrimaryButton label="Continue" onPress={handleContinue} loading={loading} />
                </GlassCard>
            </ScrollView>
        </AppBackground>
    )
}

export default ForgotScreen;

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
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
    loginText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
    loginLink: { color: '#fff', fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
    rulesCard: {
        width: '100%',
        // backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: 18,
        // borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        // paddingHorizontal: 18, 
        paddingVertical: 16,
        marginTop: 20
        // shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
    },
    rulesTitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 12 },
    rulesBold: { fontWeight: '800', color: '#fff' },
    rulesGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    },
    ruleItem: {
        flexDirection: 'row', alignItems: 'center',
        width: '47%', gap: 7,
    },
    ruleCheck: {
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: '#2E7D32',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4, shadowRadius: 4, elevation: 3,
    },
    ruleCheckMark: { color: '#fff', fontSize: 11, fontWeight: '800' },
    ruleLabel: { fontSize: 12, color: 'rgba(255,255,255,0.9)', flex: 1 },

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
    fieldErrorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: -6,
        marginBottom: 10,
        marginLeft: 4,
    },
})