import React, { memo, useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { color } from '../utility/color';
import { textStyles } from '../utility/textStyles';
const SearchBar = ({ value, onChangeText }) => {

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 8,
                paddingLeft: 10,
                borderColor: color.borderColor
            }}
        >
            <Icon name="search" size={22} color={color.primaryBlue} />

            <TextInput
                style={{ flex: 1, height: 48 }}
                placeholder="Search by Name or Quotation No."
                value={value}
                onChangeText={onChangeText}
            />

            {value?.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')} style={{ padding: 12, borderRadius: 5, backgroundColor: color.lightSerface }}>
                    <Text style={textStyles.caption}>Clear</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default memo(SearchBar);