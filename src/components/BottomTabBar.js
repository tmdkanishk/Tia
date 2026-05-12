// src/components/BottomTabBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = [
  { id: 'Home',     icon: '🏠', screen: 'Dashboard' },
  { id: 'Policies', icon: '🛡️', screen: 'Policies' },
  { id: 'Profile',  icon: '👤', screen: 'Profile' },
  { id: 'Support',  icon: '🎧', screen: 'Support' },
];

const BottomTabBar = ({ navigation, active }) => (
  <View style={styles.tabBar}>
    {TABS.map(tab => {
      const isActive = active === tab.id;
      return (
        <TouchableOpacity
          key={tab.id}
          style={styles.tabItem}
          onPress={() => navigation?.navigate(tab.screen)}
          activeOpacity={0.7}
        >
          {isActive && <View style={styles.activeIndicator} />}
          <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
            {tab.icon}
          </Text>
          <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
            {tab.id}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(220,235,255,0.97)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingVertical: 10,
    paddingBottom: 24, // safe area space
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    width: 28,
    height: 3,
    backgroundColor: '#1565C0',
    borderRadius: 2,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 3,
    opacity: 0.45,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: '#5C7A9E',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#1565C0',
    fontWeight: '700',
  },
});

export default BottomTabBar;
