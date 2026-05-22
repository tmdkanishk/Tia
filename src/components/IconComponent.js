import { Image } from 'react-native'
import React from 'react'
import downarrow from '../assets/images/downarrow.png'
import uparrow from '../assets/images/uparrow.png'
import back from '../assets/images/leftarrow.png'
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
import danger from '../assets/images/danger.png'
import switchleft from '../assets/images/switchleft.png'
import switchright from '../assets/images/switchright.png'
import phone from '../assets/images/phone.png'
import threat from '../assets/images/threat.png'
import tag from '../assets/images/tag.png'
import indured from '../assets/images/indured.png'
import housefire from '../assets/images/housefire.png'
import process from '../assets/images/process.png'
import boiler from '../assets/images/boiler.png'
import electrical from '../assets/images/electrical.png'
import devices from '../assets/images/devices.png'
import money from '../assets/images/money.png'
import car from '../assets/images/car.png'
import mansafe from '../assets/images/mansafe.png'
import protection from '../assets/images/protection.png'
import thief from '../assets/images/thief.png'
import growth from '../assets/images/growth.png'
import home from '../assets/images/home.png'
import policy from '../assets/images/policy.png'
import service from '../assets/images/service.png'
import logout from '../assets/images/logout.png'
import round from '../assets/images/round.png'
import logoutf from '../assets/images/logoutf.png'



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
    checkmark: checkmark,
    danger: danger,
    switchleft: switchleft,
    switchright: switchright,
    phone: phone,
    threat: threat,
    tag: tag,
    indured: indured,
    housefire: housefire,
    process: process,
    boiler: boiler,
    electrical: electrical,
    devices: devices,
    money: money,
    car: car,
    mansafe: mansafe,
    protection: protection,
    thief: thief,
    growth: growth,
    home: home,
    policy: policy,
    service: service,
    logout: logout,
    round: round,
    logoutf: logoutf


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

