import { StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainLayout from '../screens/Layout/MainLayout';
import BusinessCalculatorScreen from '../screens/AppScreens/BusinessCalculatorScreen';
import IARCalculatorScreen from '../screens/AppScreens/IARCalculatorScreen';
import FireCalculatorScreen from '../screens/AppScreens/FireCalculatorScreen'
import AddonScreen from '../screens/AppScreens/AddonScreen'
import QuoteDetailScreen from '../screens/AppScreens/QuoteDetailScreen'



const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <>
            <StatusBar backgroundColor={'#FFFFFF'} barStyle="dark-content" />
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName='MainLayout'
            >
                <Stack.Screen name="MainLayout" component={MainLayout} />
                <Stack.Screen name="BusinessCalculator" component={BusinessCalculatorScreen} />
                <Stack.Screen name="IARCalculator" component={IARCalculatorScreen} />
                <Stack.Screen name="FireCalculator" component={FireCalculatorScreen} />
                <Stack.Screen name="Addon" component={AddonScreen} />
                <Stack.Screen name="QuoteDetail" component={QuoteDetailScreen} />


            </Stack.Navigator>
        </>
    )
}

export default MainStack
