import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import CustomButton from '../../components/CustomButton';

const ProfileComponent = () => {
  const dispatch = useDispatch();


  const onLogoutPress = () => {
    console.log('Logout pressed');
    dispatch(logout());
    // Implement your logout logic here, such as clearing user data and navigating to the login screen.
  }

  return (
    <View style={{ flex:1, padding:12 }}>
      <CustomButton label='Logout' onPress={onLogoutPress}/>
    </View>
  )
}

export default memo(ProfileComponent);