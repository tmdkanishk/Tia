/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // useEffect(() => {
  //   SplashScreen.hide();
  // }, [])

  return (

    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>

  );
}



export default App;
