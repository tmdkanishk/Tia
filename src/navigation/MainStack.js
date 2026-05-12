import { StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from "../screens/CommonScreens/DashboardScreen";
import InsuranceCalculatorScreen from "../screens/CommonScreens/InsuranceCalculatorScreen";
import PolicyRecordsScreen from "../screens/CommonScreens/PolicyRecordsScreen";

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <>
            <StatusBar backgroundColor={'#0D47A1'} barStyle={'light-content'} />
            <Stack.Navigator 
                screenOptions={{ headerShown: false }} 
                initialRouteName='Dashboard'
            >
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="InsuranceCalculator" component={InsuranceCalculatorScreen} />
                <Stack.Screen name="Policies" component={PolicyRecordsScreen} />
            </Stack.Navigator>
        </>
    )
}

export default MainStack
