import { StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import EmailVerificationScreen from '../screens/AuthScreens/EmailVerificationScreen';
import RoleSelectionScreen from './../screens/AuthScreens/RoleSelectionScreen';
import ForgotScreen from '../screens/AuthScreens/ForgotScreen';
import ResetPasswordScreen from '../screens/AuthScreens/ResetPasswordScreen';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <>
            <StatusBar backgroundColor={'#0D47A1'} barStyle={'light-content'} />
            <Stack.Navigator 
                screenOptions={{ headerShown: false }} 
                initialRouteName='RoleSelection'
            >
                <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} /> 
                <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
                <Stack.Screen name="Forgot" component={ForgotScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                
            </Stack.Navigator>
        </>
    )
}

export default AuthStack
