import { StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import VerificationScreen from '../screens/AuthScreens/VerificationScreen';
import RoleSelectionScreen from '../screens/AuthScreens/RoleSelectionScreen';
import ResetPasswordScreen from '../screens/AuthScreens/ResetPasswordScreen';
import VerifiedAccountSuccess from '../screens/AuthScreens/VerifiedAccountSuccess';
import ForgotPasswordScreen from '../screens/AuthScreens/ForgotPasswordScreen';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <>
            <StatusBar backgroundColor={'#F8FAFC'} barStyle="dark-content" />
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={'RoleSelection'}
            >
                <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                <Stack.Screen name="VerifiedAccountSuccess" component={VerifiedAccountSuccess} />
                

            </Stack.Navigator>
        </>
    )
}

export default AuthStack
