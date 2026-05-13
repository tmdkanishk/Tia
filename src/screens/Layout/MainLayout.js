import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import AppBackground from '../../components/AppBackground'
import BottomTabBar from '../../components/BottomTabBar'
import HomeComponent from '../MainComponents/HomeComponent'
import PoliciesComponent from '../MainComponents/PoliciesComponent'
import ProfileComponent from '../MainComponents/ProfileComponent'
import SupportComponent from '../MainComponents/SupportComponent'

const MainLayout = () => {
  const [activeScreen, setActiveScreen] = useState('home');

  const handleTabPress = (screen) => {
    setActiveScreen(screen);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeComponent />;

      case 'policies':
        return <PoliciesComponent />;

      case 'profile':
        return <ProfileComponent />;

      case 'support':
        return <SupportComponent />;

      default:
        return <HomeComponent />;
    }
  };

  return (
    <AppBackground>
      <ScrollView contentContainerStyle={{paddingBottom: 140,}} showsVerticalScrollIndicator={false}>
        {renderScreen()}
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 136 }}>
        <BottomTabBar onButtonClick={handleTabPress} active={activeScreen} />
      </View>

    </AppBackground>
  )
}

export default MainLayout