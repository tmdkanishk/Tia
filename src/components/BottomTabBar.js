// src/components/BottomTabBar.js
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { color } from '../utility/color';
import { IconComponent, icons } from './IconComponent';


const TABS = [
  { id: 'Home', icon: icons.home, screen: 'home' },
  { id: 'Policies', icon: icons.policy, screen: 'policies' },
  { id: 'Profile', icon: icons.user, screen: 'profile' },
  { id: 'Support', icon: icons.service, screen: 'support' },
];

const BottomTabBar = ({ onButtonClick, active }) => (
  <View style={styles.tabBar}>
    {TABS.map(tab => {
      const isActive = active === tab.screen;
      return (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tabItem, isActive && styles.activeTab]}
          onPress={() => onButtonClick(tab.screen)}
          activeOpacity={0.7}
          disabled={tab.id == 'Home' ? false : true}
        >
          {/* {isActive && <View style={styles.activeIndicator} />} */}
          <IconComponent icon={tab.icon} size={24} tintColor={isActive ? color.primaryBlueDark : color.secondaryText} />
          {/* <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
            {tab.icon}
          </Text> */}
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
    backgroundColor: color.cardBackground,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  tabItem: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 10,
    height: 56,
    width: 56
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
    color: color.secondaryText,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#1565C0',
    fontWeight: '700',
  },
  activeTab: {
    backgroundColor: color.lightBlueBackground
  }
});

export default memo(BottomTabBar);
