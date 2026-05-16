import React from 'react';
import { StyleSheet,  Platform, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AppBackground = ({ children, colors }) => {
  const gradientColors = colors || ['#0D47A1', '#1565C0', '#1976D2', '#42A5F5'];

  return (

    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // behavior='position'
        style={styles.flex}
      > */}
       
          {children}
      
      {/* </KeyboardAvoidingView> */}
    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  flex: { height: '100%' },
  gradient: { height: '100%' },

  
});

export default AppBackground;