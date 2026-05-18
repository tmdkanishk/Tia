import { View, Text, Image } from 'react-native'
import React, { memo } from 'react'

import { color } from '../../utility/color';
import { IconComponent, icons } from '../../components/IconComponent';


const HeaderComponent = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <IconComponent icon={icons.shield} size={52} tintColor={color.primaryBlue} />
                <View>
                    <Text style={{ textTransform: 'uppercase', fontSize: 24, fontWeight: '600', color: color.mainText }}>TIA</Text>
                    <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText }}>Premium calculators</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <IconComponent icon={icons.notification} size={32} tintColor={color.mainText} />
                <Image source={require('../../assets/images/man.png')} style={{ width: 52, height: 52, borderRadius: 26, resizeMode: 'contain', borderWidth: 1, borderColor: color.borderColor, backgroundColor: color.serface }} />
            </View>
        </View>
    )
}

export default memo(HeaderComponent);