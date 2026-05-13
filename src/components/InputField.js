import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';

const InputField = ({ icon, placeholder, secureTextEntry, iconStyle, error, ...props }) => {

  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View>
      <View style={[styles.inputRow, error && styles.inputRowError]}>

        {/* Left Icon */}
        <Image source={icon} style={[styles.inputIcon, iconStyle]} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={hidden}
          {...props}
         
        />

        {/* Eye Icon */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden(h => !h)}
            style={styles.eyeBtn}
          >
            <Image
              source={
                hidden
                  ? require('../assets/images/visible.png')
                  : require('../assets/images/hide.png')
              }
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.fieldErrorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  inputRowError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },

  inputIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    resizeMode: 'contain',
    // tintColor: '#555', // 👈 keeps all icons consistent
  },

  input: {
    flex: 1,
    fontSize: 14,
    // color: '#222',
  },

  eyeBtn: {
    paddingLeft: 8,
  },

  eyeIcon: {
    width: 18,
    height: 18,
    tintColor: '#555',
  },

  fieldErrorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 10,
    marginLeft: 4,
  },
});

export default InputField;