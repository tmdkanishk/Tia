import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'

import { color } from '../../utility/color';
import { IconComponent, icons } from '../../components/IconComponent';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';


const HeaderComponent = () => {
    const { width } = Dimensions.get('window');

    const dispatch = useDispatch();


    const onLogoutPress = () => {
        console.log('Logout pressed');
        dispatch(logout());
        // Implement your logout logic here, such as clearing user data and navigating to the login screen.
    }
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Image source={require('../../assets/logo/header.png')} style={{ width: width * 0.4, height: width * 0.250, resizeMode: 'contain' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 6 }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: color.cardBackground, elevation: 2, alignItems: 'center', justifyContent: 'center', opacity:0.3 }}>
                    <IconComponent icon={icons.notification} size={24} tintColor={color.mainText} />
                </View>
                <TouchableOpacity onPress={onLogoutPress} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: color.cardBackground, elevation: 2, alignItems: 'center', justifyContent: 'center', paddingLeft: 6 }}>
                    <IconComponent icon={icons.logoutf} size={22} />
                </TouchableOpacity>

                {/* <Image source={require('../../assets/images/man.png')} style={{ width: 42, height: 42, borderRadius: 21, resizeMode: 'contain', borderWidth: 1, borderColor: color.borderColor, backgroundColor: color.serface }} /> */}
            </View>
        </View>
    )
}

export default memo(HeaderComponent);