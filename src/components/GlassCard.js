import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';

const GlassCard = ({ children, style }) => {
  // BlurView works natively on iOS; on Android we fall back to a semi-transparent View
  // if (Platform.OS === 'ios') {
  //   return (
  //     <BlurView
  //       style={[styles.card, style]}
  //       blurType="light"
  //       blurAmount={18}
  //       reducedTransparencyFallbackColor="rgba(255,255,255,0.2)"
  //     >
  //       <View style={styles.overlay}>{children}</View>
  //     </BlurView>
  //   );
  // }

  // Android fallback — layered Views simulate the glass look
  return (
    <View style={[styles.card, styles.androidCard, style]}>
      <View style={styles.androidInner}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 22,
  },
  androidCard: {

  },
  androidInner: {
    padding: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});

export default GlassCard;