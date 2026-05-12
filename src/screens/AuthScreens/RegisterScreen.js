import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

import AppBackground from '../../components/AppBackground';
import GlassCard from '../../components/GlassCard';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import AuthContext from "../../context/AuthContext";
import userIcon from '../../assets/images/user.png';
import phoneIcon from '../../assets/images/telephone.png';
import emailIcon from '../../assets/images/email.png';
import lockIcon from '../../assets/images/padlock.png';
import { registerAPI } from '../../features/auth/authAPI';
import { setCredentials } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const RegisterScreen = ({ navigation }) => {
  const PASSWORD_RULES = [
    { id: 'len', label: 'At least 8 characters' },
    { id: 'upper', label: 'One uppercase letter' },
    { id: 'number', label: 'One number' },
    { id: 'special', label: 'One special character' },
  ];
  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  // const { login } = useContext(AuthContext);

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

  const role = useSelector((state) => state.auth.role);

  const validateForm = () => {
    const newErrors = {};
    
    // Check for empty fields
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
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
    setBackendError('');
    
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

      dispatch(
        setCredentials({
          accessToken: response.data.data.accessToken,
          refreshToken: response.data.refreshToken,
          role: response.data.data.role,
        })
      );

      // Show success message without Alert, navigate directly
      navigation.replace('EmailVerification', {otp: response?.data?.otp, email:form.email});
    } catch (error) {
      console.log("error in register api", error?.response);
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
          <Text style={styles.cardTitle}>REGISTER ACCOUNT</Text>

          {/* Backend Error Message */}
          {backendError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{backendError}</Text>
            </View>
          ) : null}

          <InputField 
            icon={userIcon} 
            placeholder="Full Name"
            value={form.fullName} 
            onChangeText={v => handleChange('fullName', v)} 
            error={!!errors.fullName}
          />
          {errors.fullName ? <Text style={styles.fieldErrorText}>{errors.fullName}</Text> : null}

          <InputField 
            icon={phoneIcon} 
            placeholder="Mobile Number"
            value={form.mobile} 
            onChangeText={v => handleChange('mobile', v)}
            keyboardType="phone-pad" 
            error={!!errors.mobile}
          />
          {errors.mobile ? <Text style={styles.fieldErrorText}>{errors.mobile}</Text> : null}

          <InputField 
            icon={emailIcon} 
            placeholder="Email Address"
            value={form.email} 
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address" 
            autoCapitalize="none" 
            error={!!errors.email}
          />
          {errors.email ? <Text style={styles.fieldErrorText}>{errors.email}</Text> : null}

          <InputField 
            icon={lockIcon} 
            placeholder="Password"
            value={form.password} 
            onChangeText={v => handleChange('password', v)}
            secureTextEntry 
            error={!!errors.password}
          />
          {errors.password ? <Text style={styles.fieldErrorText}>{errors.password}</Text> : null}

          <InputField 
            icon={lockIcon} 
            placeholder="Confirm Password"
            value={form.confirmPassword} 
            onChangeText={v => handleChange('confirmPassword', v)}
            secureTextEntry 
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword ? <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text> : null}

          <PrimaryButton label="Sign Up" onPress={handleSignUp} loading={loading} />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rulesCard}>
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
          </View>
        </GlassCard>

      </ScrollView>
    </AppBackground>
  );
};

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
});

export default RegisterScreen;