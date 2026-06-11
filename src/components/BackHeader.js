import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { IconComponent, icons } from '../components/IconComponent'
import { color } from '../utility/color'

const BackHeader = ({ title, subTitle }) => {
    const navigation = useNavigation();

    const goBack = () => {
        navigation.goBack();
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, marginTop: 36 }}>
            <TouchableOpacity onPress={goBack}>
                <IconComponent size={22} icon={icons.back} tintColor={color.lightText} />
            </TouchableOpacity>
            <View>
                <Text style={{ color: color.lightText, fontSize: 18, fontWeight: '600' }}>{title}</Text>
                {subTitle && <Text style={{ color: color.lightText, fontSize: 12, fontWeight: '600' }}>{subTitle}</Text>}
            </View>
        </View>
    )
}

export default memo(BackHeader);