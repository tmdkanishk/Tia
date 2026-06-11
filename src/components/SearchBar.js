import React, { memo, useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { color } from '../utility/color';
const SearchBar = ({ value, onChangeText }) => {

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                borderColor:color.borderColor
            }}
        >
            <Icon name="search" size={22} color={color.primaryBlue} />

            <TextInput
                style={{ flex: 1, height: 48 }}
                placeholder="Search"
                value={value}
                onChangeText={onChangeText}
            />

            {value?.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Icon name="x-circle" size={20} color={color.error} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default memo(SearchBar);