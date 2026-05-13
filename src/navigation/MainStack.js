import { StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InsuranceCalculatorScreen from "../screens/CommonScreens/InsuranceCalculatorScreen";
import PolicyRecordsScreen from "../screens/CommonScreens/PolicyRecordsScreen";
import MainLayout from '../screens/Layout/MainLayout';
import BusinessCalculatorScreen from '../screens/AppScreens/BusinessCalculatorScreen';
import IARCalculatorScreen from '../screens/AppScreens/IARCalculatorScreen';


const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <>
            <StatusBar backgroundColor={'#0D47A1'} barStyle={'light-content'} />
            <Stack.Navigator 
                screenOptions={{ headerShown: false }} 
                initialRouteName='MainLayout'
            >
                <Stack.Screen name="MainLayout" component={MainLayout} />
                <Stack.Screen name="InsuranceCalculator" component={InsuranceCalculatorScreen} />
                <Stack.Screen name="Policies" component={PolicyRecordsScreen} />
                <Stack.Screen name="BusinessCalculator" component={BusinessCalculatorScreen} />
                <Stack.Screen name="IARCalculator" component={IARCalculatorScreen} />
              
                
            </Stack.Navigator>
        </>
    )
}

export default MainStack
