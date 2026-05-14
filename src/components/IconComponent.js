import { Image } from 'react-native'
import React from 'react'
import downarrow from '../assets/images/downarrow.png'
import uparrow from '../assets/images/uparrow.png'
import back from '../assets/images/back.png'


export const icons = {
    downarrow: downarrow,
    uparrow: uparrow,
    back:back,
}



export const IconComponent = ({ icon, size, tintColor }) => {
    return (
        <Image
            source={icon}
            style={{
                width: size,
                height: size,
                tintColor: tintColor,
            }}
        />
    )
}

