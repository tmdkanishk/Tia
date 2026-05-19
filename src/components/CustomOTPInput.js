import React, { memo, useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { color } from '../utility/color';

const CustomOTPInput = ({ length = 6, onChangeOTP }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        // 🔹 Handle PASTE (text length > 1)
        if (text.length > 1) {
            const digits = text.replace(/\D/g, '').slice(0, length);
            const newOtp = Array(length).fill('');

            digits.split('').forEach((d, i) => {
                newOtp[i] = d;
            });

            setOtp(newOtp);
            onChangeOTP?.(newOtp.join(''));

            // Focus last filled input
            const lastIndex = Math.min(digits.length, length) - 1;
            inputs.current[lastIndex]?.focus();
            return;
        }

        // 🔹 Single digit input
        if (!/^\d?$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        onChangeOTP?.(newOtp.join(''));

        if (text && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
                onChangeOTP?.(newOtp.join(''));
            } else if (index > 0) {
                inputs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <View style={styles.container}>
            {otp.map((value, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    style={styles.input}
                    keyboardType="number-pad"
                    placeholderTextColor={'gray'}
                    maxLength={index === 0 ? length : 1} // 👈 IMPORTANT
                    value={value}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    textContentType="oneTimeCode" // iOS autofill
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        width: 45,
        height: 48,
        borderWidth: 1,
        borderColor: color.borderColor,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
    },
});

export default memo(CustomOTPInput);