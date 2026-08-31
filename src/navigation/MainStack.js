import { StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainLayout from '../screens/Layout/MainLayout'

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <>
            <StatusBar backgroundColor={'#FFFFFF'} barStyle="dark-content" />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    freezeOnBlur: true,
                }}
                initialRouteName='MainLayout'
            >
                <Stack.Screen name="MainLayout" component={MainLayout} />
                {/* Lazy-load heavy calculator/detail screens so first paint of MainLayout stays fast */}
                <Stack.Screen
                    name="BusinessCalculator"
                    getComponent={() => require('../screens/AppScreens/BusinessCalculatorScreen').default}
                />
                <Stack.Screen
                    name="IARCalculator"
                    getComponent={() => require('../screens/AppScreens/IARCalculatorScreen').default}
                />
                <Stack.Screen
                    name="FireCalculator"
                    getComponent={() => require('../screens/AppScreens/FireCalculatorScreen').default}
                />
                <Stack.Screen
                    name="Addon"
                    getComponent={() => require('../screens/AppScreens/AddonScreen').default}
                />
                <Stack.Screen
                    name="QuoteDetail"
                    getComponent={() => require('../screens/AppScreens/QuoteDetailScreen').default}
                />
                <Stack.Screen
                    name="UpdateQuotation"
                    getComponent={() => require('../screens/AppScreens/UpdateQuotationScreen').default}
                />
            </Stack.Navigator>
        </>
    )
}

export default MainStack
