import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../utility/globalStyles'
import { IconComponent, icons } from '../../components/IconComponent';
import { color } from '../../utility/color';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { forgotPassword } from '../../features/auth/authAPI';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState(null);

  const handleForgotPassword = async () => {
   
    if (!identifier) {
      setError('Email or mobile number is required');
      return;
    }
    try {
      setLoading(true);

      const response = await forgotPassword({ identifier: identifier });
      if (response.data.success) {
        console.log("Forgot Password Response:", response.data);
        navigation.replace('ResetPassword', { identifier: response.data.data.verificationType == 'SMS' ? response.data.data.mobile : response.data.data.email });
      } else {
        setBackendError(response.data?.message || 'An error occurred. Please try again.');
      }


    } catch (error) {
      console.log("error.response?.data", error.response?.data);
      setBackendError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={globalStyles.container}>
      <View style={{ gap: 20 }}>
        <View style={{ gap: 6, alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
          <IconComponent icon={icons.shield} size={56} tintColor={color.primaryBlue} />
          <View>
            <Text style={{ textTransform: 'uppercase', fontSize: 24, fontWeight: '600', color: color.mainText }}>TIA</Text>
            <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText }}>Premium calculators</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ textTransform: 'capitalize', fontSize: 24, fontWeight: '600', color: color.mainText, textAlign: 'center' }}> Forgot Password</Text>
        </View>

        <InputField
          label={'Email or mobile number'}
          icon={icons.email}
          iconStyle={{ width: 24, height: 24, tintColor: color.secondaryText }}
          placeholder={'Email or mobile number'}
          onChangeText={(text) => { setIdentifier(text); setError(null); setBackendError(null); }}
          value={identifier}
          error={error}
        />

        {
          backendError && <Text style={{ color: color.error }}>{backendError}</Text>
        }

        <CustomButton label='Forgot Password' onPress={handleForgotPassword} loading={loading}/>

      </View>
    </View>
  )
}

export default ForgotPasswordScreen