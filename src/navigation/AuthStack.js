import { StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import EmailVerificationScreen from '../screens/AuthScreens/EmailVerificationScreen';
import RoleSelectionScreen from '../screens/AuthScreens/RoleSelectionScreen';
import ForgotScreen from '../screens/AuthScreens/ForgotScreen';
import ResetPasswordScreen from '../screens/AuthScreens/ResetPasswordScreen';
import { useSelector } from 'react-redux';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
    const { role } = useSelector((state) => state.auth);

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                // initialRouteName={'RoleSelection'}
                 initialRouteName={role==null?'EmailVerification':'Register'}
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
