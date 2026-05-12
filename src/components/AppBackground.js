import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AppBackground = ({ children, colors }) => {
  const gradientColors = colors || ['#0D47A1', '#1565C0', '#1976D2', '#42A5F5'];

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {children}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gradient: { flex: 1 },
});

export default AppBackground;