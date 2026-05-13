import { View, Text } from 'react-native'
import React from 'react'
import AppBackground from '../../components/AppBackground'

const BusinessCalculatorScreen = () => {
    return (
        <AppBackground>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, color: '#fff' }}>Business Calculator Coming Soon!</Text>
            </View>
        </AppBackground>
    )
}

export default BusinessCalculatorScreen