import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { color } from '../utility/color'


const CustomButton = ({
    width,
    backgroundColor = color.primaryBlueDark,
    textColor = color.lightText,
    label = 'Continue',
    onPress
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ backgroundColor: backgroundColor, width: width, padding: 14, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ color: textColor, fontSize: 16 }}>{label}</Text>
        </TouchableOpacity>
    )
}

export default memo(CustomButton);