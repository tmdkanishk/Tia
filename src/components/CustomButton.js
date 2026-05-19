import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { memo } from 'react'
import { color } from '../utility/color'


const CustomButton = ({
    width,
    backgroundColor = color.primaryBlueDark,
    textColor = color.lightText,
    label = 'Continue',
    onPress,
    disabled = false,
    loading = false

}) => {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={{ backgroundColor: backgroundColor, width: width, padding: 14, borderRadius: 10, alignItems: 'center', opacity: disabled ? 0.5 : 1 }}>
            {loading ? <ActivityIndicator size={'small'} color={color.lightText} />
                : <Text style={{ color: textColor, fontSize: 16 }}>{label}</Text>}
        </TouchableOpacity>
    )
}

export default memo(CustomButton);