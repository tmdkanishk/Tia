import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store } from '../store';

const RootContent = () => {
  // Get authentication state from Redux store
  const { isAuthenticated, isVerified, user } = useSelector((state) => state.auth);

  const isLogin = isVerified && isAuthenticated;



  return (
    <NavigationContainer>
      {/* Show MainStack only when user is authenticated AND verified */}
      {isLogin ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const RootNavigator = () => (
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <RootContent />
    {/* </PersistGate> */}
  </Provider>
);

export default RootNavigator;
