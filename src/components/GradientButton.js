import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = memo(({ label, onPress, loading = false, disabled = false }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.82}
    style={styles.wrapper}
  >
    <LinearGradient
      colors={disabled ? ['#78909C', '#90A4AE'] : ['#1565C0', '#1E88E5', '#42A5F5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      {loading
        ? <ActivityIndicator color="#fff" size="small" />
        : <Text style={styles.label}>{label}</Text>
      }
    </LinearGradient>
  </TouchableOpacity>
));

GradientButton.displayName = 'GradientButton';

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    marginTop: 6,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  gradient: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});

export default GradientButton;