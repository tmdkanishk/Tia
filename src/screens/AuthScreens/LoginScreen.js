// src/screens/AuthScreens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';


import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { loginAPI } from '../../features/auth/authAPI';
import AppBackground from '../../components/AppBackground';
import GlassCard from '../../components/GlassCard';
import InputField from '../../components/InputField';
import emailIcon from '../../assets/images/email.png';
import lockIcon from '../../assets/images/padlock.png';
import PrimaryButton from '../../components/PrimaryButton';


const LoginScreen = ({navigation}) => {

    const [form, setForm] = useState({
      email: '', password: '',
    });
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

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

  const validateForm = () => {
    const newErrors = {};
    
    // Check for empty fields
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    
    // Email format validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    return newErrors;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});
    setBackendError('');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await loginAPI({
        email: form.email,
        password: form.password,
      });

      // Handle different response structures
      let accessToken, refreshToken, role;
      
      // Case 1: response.data has the fields directly (like Postman response)
      if (response.data.accessToken) {
        accessToken = response.data.accessToken;
        refreshToken = response.data.refreshToken;
        role = response.data.data?.role || response.data.role;
      } 
      // Case 2: response.data.data has the fields (nested)
      else if (response.data.data?.accessToken) {
        accessToken = response.data.data.accessToken;
        refreshToken = response.data.refreshToken || response.data.data.refreshToken;
        role = response.data.data.role;
      } 
      // Fallback
      else {
        throw new Error('Invalid response format from server');
      }

      // Dispatch credentials to Redux
      // This will set isAuthenticated and isVerified to true,
      // causing RootNavigator to automatically switch to MainStack (Dashboard)
      dispatch(setCredentials({ accessToken, refreshToken, role }));

    } catch (err) {
      console.log(err);
      // Handle backend validation errors
      if (err?.response?.data?.message) {
        setBackendError(err.response.data.message);
      } else {
        const errorMessage = err?.message || 'Login failed. Please try again.';
        setBackendError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <AppBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
          <Text style={styles.cardTitle}>LOGIN ACCOUNT</Text>

          {/* Backend Error Message */}
          {backendError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{backendError}</Text>
            </View>
          ) : null}

          <InputField 
            icon={emailIcon} 
            placeholder="Email Address"
            value={form.email} 
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address" 
            autoCapitalize="none" 
            error={errors.email}
          />
         

          <InputField 
            icon={lockIcon} 
            placeholder="Password"
            value={form.password} 
            onChangeText={v => handleChange('password', v)}
            secureTextEntry 
            error={errors.password}
          />
         

          <PrimaryButton label="Login" onPress={handleLogin} loading={loading} />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('Register')}}>
              <Text style={styles.loginLink}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Forgot Password ? </Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('Forgot')}}>
              <Text style={styles.loginLink}>Click Here</Text>
            </TouchableOpacity>
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
})

export default LoginScreen; // Ensure this is "default"
