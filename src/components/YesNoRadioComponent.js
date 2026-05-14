import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const YesNoRadioComponent = ({
    label = 'Select Option',
    value = false,
    onChange,
}) => {

    const handleSelect = (selectedValue) => {
        onChange && onChange(selectedValue);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.radioContainer}>
                {/* YES */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.outerCircle}>
                        {value === true && <View style={styles.innerCircle} />}
                    </View>

                    <Text style={styles.optionText}>Yes</Text>
                </TouchableOpacity>

                {/* NO */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(false)}
                    activeOpacity={0.8}
                >
                    <View style={styles.outerCircle}>
                        {value === false && <View style={styles.innerCircle} />}
                    </View>

                    <Text style={styles.optionText}>No</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default memo(YesNoRadioComponent);


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
    },

    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#fff',
    },

    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 25,
    },

    outerCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },

    optionText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#fff',
    },
});