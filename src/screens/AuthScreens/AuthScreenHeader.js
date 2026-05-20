import { View, Text, Image, Dimensions } from 'react-native'
import React, { memo } from 'react'

const AuthScreenHeader = () => {
    const { width } = Dimensions.get('window');
    return (
        <View style={{ width: '100%', alignItems: 'center', }}>
            <Image source={require('../../assets/logo/header.png')} style={{ width: width * 0.6, height: width * 0.3, }} />
        </View>
    )
}

export default memo(AuthScreenHeader);
