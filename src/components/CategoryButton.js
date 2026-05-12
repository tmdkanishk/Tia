// src/components/CategoryButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * CategoryButton
 * Props:
 *   icon       — emoji string
 *   label      — display name
 *   bg         — background color string
 *   border     — border color string
 *   labelColor — text color (optional, defaults to white)
 *   selected   — boolean, highlights with gold border
 *   onPress    — callback
 */
const CategoryButton = ({ icon, label, bg, border, labelColor = '#fff', selected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.btn,
      { backgroundColor: bg, borderColor: border },
      selected && styles.selected,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.icon}>{icon}</Text>
    <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    width: '47.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  selected: {
    borderColor: '#FFD700',
    borderWidth: 2.5,
    shadowColor: '#FFD700',
    shadowOpacity: 0.6,
  },
  icon: { fontSize: 26, marginRight: 10 },
  label: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
});

export default CategoryButton;
