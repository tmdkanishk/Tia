import { Image } from 'react-native'
import React from 'react'
import downarrow from '../assets/images/downarrow.png'
import uparrow from '../assets/images/uparrow.png'
import back from '../assets/images/back.png'
import shield from '../assets/images/shield.png'
import notification from '../assets/images/notification.png'
import fire from '../assets/images/fire.png'
import docs from '../assets/images/docs.png'
import rightarrow from '../assets/images/rightarrow.png'
import businessins from '../assets/images/businessins.png'
import industry from '../assets/images/industry.png'
import verified from '../assets/images/verified.png'
import user from '../assets/images/user.png'
import email from '../assets/images/email.png'
import password from '../assets/images/password.png'
import checkmark from '../assets/images/checkmark.png'

export const icons = {
    downarrow: downarrow,
    uparrow: uparrow,
    shield: shield,
    back: back,
    notification: notification,
    fire: fire,
    docs: docs,
    rightarrow: rightarrow,
    businessins: businessins,
    industry: industry,
    verified: verified,
    user: user,
    email: email,
    password: password,
    checkmark: checkmark
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

