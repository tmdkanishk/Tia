import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar, Animated,
  Image,
} from 'react-native';

const RoleButton = ({ role, selected, onPress }) => {
  const isDark = role.labelColor === '#fff';

  return (
    <TouchableOpacity
      style={[
        styles.roleBtn,
        {
          backgroundColor: role.bg[0],
          borderColor: selected ? '#FFD700' : role.border,
          borderWidth: selected ? 2.5 : 1.5,
          shadowColor: selected ? '#FFD700' : role.glow,
          shadowOpacity: selected ? 0.8 : 0.35,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Inner gradient overlay for depth */}
      <View style={[styles.roleBtnInner, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.45)' }]}>
        {/* Sparkle top-left accent */}
        <View style={styles.sparkleWrap}>
          <Text style={styles.sparkle}>✦</Text>
        </View>

        <Image source={role.image} style={styles.roleImage} />
        <Text style={[styles.roleLabel, { color: role.labelColor }]}>{role.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
// Role button
  roleBtn: {
    width: '47%',
    borderRadius: 18,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12, elevation: 8,
  },
  roleBtnInner: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sparkleWrap: {
    position: 'absolute', top: 8, left: 10,
  },
  sparkle: {
    color: 'rgba(255,255,255,0.5)', fontSize: 10,
  },
  roleIcon: { fontSize: 44, marginBottom: 10 },
  roleLabel: {
    fontSize: 15, fontWeight: '800', letterSpacing: 0.5,
  },
  roleImage: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  marginBottom: 6,
},
});


export default RoleButton
