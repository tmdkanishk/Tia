// src/screens/AuthScreens/EmailVerificationScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, Keyboard,
    Alert,
} from 'react-native';
import AppBackground from '../../components/AppBackground';
import PrimaryButton from '../../components/PrimaryButton';
import GlassCard from '../../components/GlassCard';
import { verifyOtp } from '../../features/auth/authAPI';
import { useDispatch } from 'react-redux';
import { setVerified } from '../../features/auth/authSlice';

const OTP_LENGTH = 6;

const PASSWORD_RULES = [
    { id: 'len', label: 'At least 8 characters' },
    { id: 'upper', label: 'One uppercase letter' },
    { id: 'number', label: 'One number' },
    { id: 'special', label: 'One special character' },
];

/* ─── Main Screen ────────────────────────────────────────────── */
const EmailVerificationScreen = ({ navigation, route }) => {
    const email = route?.params?.email || "test1@gmail.com"
    const OtpParam = route?.params?.otp

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [resendSec, setResendSec] = useState(0);   // countdown
    const inputRefs = useRef([]);

    const dispatch = useDispatch();

    // Start resend countdown
    const startCountdown = () => {
        setResendSec(30);
    };

    useEffect(() => {
        startCountdown();
    }, []);

    useEffect(() => {
        if (resendSec <= 0) return;
        const t = setTimeout(() => setResendSec(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendSec]);

    /* ── OTP helpers ── */
    const handleOtpChange = (text, idx) => {
        const digit = text.replace(/[^0-9]/g, '').slice(-1);
        const next = [...otp];
        next[idx] = digit;
        setOtp(next);
        if (digit && idx < OTP_LENGTH - 1) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleOtpKeyPress = ({ nativeEvent }, idx) => {
        if (nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };



    const handleVerify = async () => {
        Keyboard.dismiss();
        const code = otp.join('');
                console.log("function working", code, OTP_LENGTH)
        if (code.length < OTP_LENGTH) return;
        setLoading(true);
        try {
            const payload = {
                email: email,
                otp: code
            };

            const response = await verifyOtp(payload);

            dispatch(setVerified());   // ✅ VERIFIED
            // RootNavigator will automatically switch to MainStack (Dashboard) 
            // when isVerified becomes true

            // TODO: call your verify API here
            console.log('Verify OTP:', code);
        } finally {
            //  Alert.alert('Invalid OTP');
            setLoading(false);
        }
    };

    const handleResend = () => {
        if (resendSec > 0) return;
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        startCountdown();
        console.log('Resend OTP');
    };

    const filledCount = otp.filter(d => d !== '').length;

    return (
        <AppBackground>

            <View style={styles.container}>

                {/* ── Logo ── */}
                <View style={styles.logoArea}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoEmoji}>🛡️</Text>
                    </View>
                    <Text style={styles.logoTitle}>Tia</Text>
                    <Text style={styles.logoSub}>One App. All Insurance. Zero Hassle.</Text>
                </View>

                {/* ── Glass Card ── */}
                <GlassCard>

                    {/* Title */}
                    <View style={styles.cardTitleRow}>
                        <View style={styles.titleLine} />
                        <Text style={styles.cardTitle}>EMAIL VERIFICATION</Text>
                        <View style={styles.titleLine} />
                    </View>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                        Enter the 6-digit code sent to your email
                    </Text>
                    <Text style={styles.emailHighlight}>{email}</Text>
                    <Text style={styles.subtitle2}>
                        We need to verify your email to proceed.
                    </Text>

                    {/* ── OTP Boxes ── */}
                    <View style={styles.otpRow}>
                        {otp.map((digit, idx) => {
                            const isLast = idx === OTP_LENGTH - 1;
                            const isFilled = digit !== '';
                            return (
                                <View
                                    key={idx}
                                    style={[
                                        styles.otpBox,
                                        isFilled && !isLast && styles.otpBoxFilled,
                                        isLast && isFilled && styles.otpBoxLast,
                                        isLast && !isFilled && styles.otpBoxLastEmpty,
                                    ]}
                                >
                                    {isLast && isFilled ? (
                                        <Text style={styles.checkMark}>✓</Text>
                                    ) : (
                                        <TextInput
                                            ref={r => (inputRefs.current[idx] = r)}
                                            style={[styles.otpInput, isFilled && styles.otpInputFilled]}
                                            value={digit}
                                            onChangeText={t => handleOtpChange(t, idx)}
                                            onKeyPress={e => handleOtpKeyPress(e, idx)}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            selectTextOnFocus
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    {/* Verify Button */}
                    <PrimaryButton
                        label="Verify"
                        onPress={handleVerify}
                        loading={loading}
                        style={styles.verifyBtn}
                    />

                    {/* Resend row */}
                    <View style={styles.resendRow}>
                        <Text style={styles.resendText}>Didn't receive the code? </Text>
                        <TouchableOpacity onPress={handleResend} disabled={resendSec > 0} activeOpacity={0.7}>
                            <Text style={[styles.resendLink, resendSec > 0 && styles.resendDisabled]}>
                                {resendSec > 0 ? `Resend in ${resendSec}s` : 'Resend Code'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </GlassCard>

                {/* ── Password Rules ── */}
                {/* <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>
            <Text style={styles.rulesBold}>Password </Text>
            must contain:
          </Text>
          <View style={styles.rulesGrid}>
            {PASSWORD_RULES.map(rule => (
              <View key={rule.id} style={styles.ruleItem}>
                <View style={styles.ruleCheck}>
                  <Text style={styles.ruleCheckMark}>✓</Text>
                </View>
                <Text style={styles.ruleLabel}>{rule.label}</Text>
              </View>
            ))}
          </View>
        </View> */}

            </View>
        </AppBackground>
    );
};

/* ─── Styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 22,
        paddingVertical: 20,
    },

    // Logo
    logoArea: { alignItems: 'center', marginBottom: 26 },
    logoPlaceholder: {
        width: 76, height: 76, borderRadius: 38,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center', marginBottom: 8,
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
        shadowColor: '#42A5F5', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
    },
    logoEmoji: { fontSize: 38 },
    logoTitle: {
        fontSize: 36, fontWeight: '800', color: '#fff', letterSpacing: 3,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
    },
    logoSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.4, marginTop: 3 },

    // Glass card

    // Card title
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    titleLine: { flex: 1, height: 1.5, backgroundColor: 'rgba(255,255,255,0.4)' },
    cardTitle: {
        color: '#1A237E', fontWeight: '800', fontSize: 15,
        letterSpacing: 1.5, marginHorizontal: 10,
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingHorizontal: 12, paddingVertical: 5,
        borderRadius: 20,
    },

    // Text
    subtitle: {
        textAlign: 'center', color: 'rgba(255,255,255,0.9)',
        fontSize: 13, lineHeight: 20,
    },
    emailHighlight: {
        textAlign: 'center', color: '#1A237E',
        fontWeight: '800', fontSize: 15, marginVertical: 4,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3,
        alignSelf: 'center',
    },
    subtitle2: {
        textAlign: 'center', color: 'rgba(255,255,255,0.85)',
        fontSize: 12, marginBottom: 22,
    },

    // OTP
    otpRow: {
        flexDirection: 'row', justifyContent: 'center',
        gap: 8, marginBottom: 22,
    },
    otpBox: {
        width: 46, height: 52,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 12,
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    },
    otpBoxFilled: {
        borderColor: '#1565C0',
        backgroundColor: '#fff',
    },
    otpBoxLast: {
        backgroundColor: '#1565C0',
        borderColor: '#1565C0',
    },
    otpBoxLastEmpty: {
        borderColor: 'rgba(255,255,255,0.5)',
    },
    otpInput: {
        width: '100%', height: '100%',
        textAlign: 'center', fontSize: 22,
        fontWeight: '700', color: '#1A237E',
    },
    otpInputFilled: { color: '#1565C0' },
    checkMark: { color: '#fff', fontSize: 22, fontWeight: '800' },

    // Verify button
    verifyBtn: { marginTop: 0 },

    // Resend
    resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
    resendText: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
    resendLink: { color: '#fff', fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
    resendDisabled: { color: 'rgba(255,255,255,0.45)', textDecorationLine: 'none' },

    // Password rules card
    rulesCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: 18, borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 18, paddingVertical: 16,
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
});

export default EmailVerificationScreen;