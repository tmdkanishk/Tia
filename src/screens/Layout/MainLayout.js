import { View, Text, ScrollView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import BottomTabBar from '../../components/BottomTabBar'
import HomeComponent from '../MainComponents/HomeComponent'
import QuotationsComponent from '../MainComponents/QuotationsComponent'
import ProfileComponent from '../MainComponents/ProfileComponent'
import SupportComponent from '../MainComponents/SupportComponent'
import { color } from '../../utility/color';
import { globalStyles } from '../../utility/globalStyles'
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderComponent from '../MainComponents/HeaderComponent'


const MainLayout = () => {
  const [activeScreen, setActiveScreen] = useState('home');

  const handleTabPress = (screen) => {
    setActiveScreen(screen);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeComponent />;

      case 'quotations':
        return <QuotationsComponent />;

      case 'profile':
        return <ProfileComponent />;

      case 'support':
        return <SupportComponent />;

      default:
        return <HomeComponent />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.screenBackground }}>
      <SafeAreaView>
        <View style={globalStyles.mainContainer}>
          <View style={{ paddingHorizontal: 12, height:'100%' }}>
          <HeaderComponent />
          {renderScreen()}
          </View>
          <View style={{ position: 'absolute', bottom: 0, width: '100%', }}>
            <BottomTabBar onButtonClick={handleTabPress} active={activeScreen} />
          </View>
        </View>
      </SafeAreaView>
    </View>

  )
}

export default MainLayout