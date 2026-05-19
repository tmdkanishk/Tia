import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { memo } from 'react'
import { color } from '../utility/color';

const SelectableRoleCard = ({
    title,
    description,
    icon,
    selected,
    onPress,
    activeColor = "#2563FF",
    iconBackground = "#EEF4FF",
}) => {

    const { width, height } = Dimensions.get('window');

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={{
                borderWidth: 2,
                borderColor: selected ? activeColor : color.borderColor,
                borderRadius: 12,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: color.cardBackground,
            }}
        >
            {/* Left Icon */}
            <View
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 27,
                    backgroundColor: iconBackground,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 18,
                }}
            >
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{
                        width: 36,
                        height: 36,
                    }}
                />
            </View>

            {/* Text Content */}
            <View
                style={{
                    flex: 1,
                    paddingRight: 12,
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#0F172A",
                        marginBottom: 8,
                    }}
                >
                    {title}
                </Text>

                <Text
                    style={{
                        fontSize: 13,
                        color: color.mainText,
                    }}
                >
                    {description}
                </Text>
            </View>

            {/* Radio Indicator */}
            {/* <View
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    borderWidth: 3,
                    borderColor: selected ? activeColor : "#C7CED9",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {selected && (
                    <View
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: activeColor,
                        }}
                    />
                )}
            </View> */}
        </TouchableOpacity>
    )
}

export default memo(SelectableRoleCard);