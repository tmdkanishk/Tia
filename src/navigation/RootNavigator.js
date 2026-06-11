import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from '../store';
import { ActivityIndicator, View } from 'react-native';
import { color } from '../utility/color';
import SplashScreen from 'react-native-splash-screen';
import AppLoader from '../components/AppLoader'

const RootContent = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, [])
  // Get authentication state from Redux store
  const { isAuthenticated, isVerified, user } = useSelector((state) => state.auth);

  const isLogin = isVerified && isAuthenticated;
  return (
    <>
      <NavigationContainer>
        {/* Show MainStack only when user is authenticated AND verified */}
        {isLogin ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
      <AppLoader />
    </>
  );
};

const SplashLoader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color={color.primaryBlueDark} />
    </View>
  );
};

const RootNavigator = () => (
  <Provider store={store}>
    <PersistGate loading={<SplashLoader />} persistor={persistor}>
      <RootContent />
    </PersistGate>
  </Provider>
);

export default RootNavigator;
