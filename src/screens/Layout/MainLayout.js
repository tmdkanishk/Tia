import { View, Text, ScrollView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import BottomTabBar from '../../components/BottomTabBar'
import HomeComponent from '../MainComponents/HomeComponent'
import PoliciesComponent from '../MainComponents/PoliciesComponent'
import ProfileComponent from '../MainComponents/ProfileComponent'
import SupportComponent from '../MainComponents/SupportComponent'
import { color } from '../../utility/color';
import { globalStyles } from '../../utility/globalStyles'
import { SafeAreaView } from 'react-native-safe-area-context'


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
    <View style={{ flex: 1, backgroundColor: color.screenBackground}}>
    <SafeAreaView>
      <View style={globalStyles.mainContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {renderScreen()}
        </ScrollView>
        <View style={{ position: 'absolute', bottom: 0, width: '100%',}}>
          <BottomTabBar onButtonClick={handleTabPress} active={activeScreen} />
        </View>
      </View>
    </SafeAreaView>
    </View>

  )
}

export default MainLayout