import { View, Text, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { color } from '../../utility/color'
import { IconComponent, icons } from '../../components/IconComponent'
import SelectableRoleCard from '../../components/SelectableRoleCard'
import CustomButton from '../../components/CustomButton'
import { useDispatch } from 'react-redux'
import { setRole } from '../../features/auth/authSlice'
import { useNavigation } from '@react-navigation/native'
import {globalStyles} from '../../utility/globalStyles'

const roles = [
    {
        id: "customer",
        title: "Customer",
        description:
            "Access policies, view documents and calculate premium.",
        icon: require('../../assets/images/man.png'),
        activeColor: "#2563FF",
        iconBackground: "#EEF4FF",
    },
    {
        id: "employee",
        title: "Employee",
        description:
            "Manage policies, quotes and operations.",
        icon: require('../../assets/images/businessman.png'),
        activeColor: "#22C55E",
        iconBackground: "#EEFDF4",
    },
    {
        id: "agent",
        title: "Agent",
        description:
            "Create quotes, manage customers and grow your business.",
        icon: require('../../assets/images/manager.png'),
        activeColor: "#7C3AED",
        iconBackground: "#F5F3FF",
    },
];

const RoleSelectionScreen = () => {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');
    const [selectedRole, setSelectedRole] = useState("customer");
    const dispatch = useDispatch()

    const handleSelect = () => {
        dispatch(setRole(selectedRole));
        setTimeout(() => {
            navigation.navigate('Register');
        }, 180);
    };


    return (
        <View style={globalStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ gap: 20 }}>
                    <View style={{ gap: 6, alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                        <IconComponent icon={icons.shield} size={56} tintColor={color.primaryBlue} />
                        <View>
                            <Text style={{ textTransform: 'uppercase', fontSize: 24, fontWeight: '600', color: color.mainText }}>TIA</Text>
                            <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText }}>Premium calculators</Text>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ textTransform: 'capitalize', fontSize: 24, fontWeight: '600', color: color.mainText, textAlign: 'center' }}> Create Your Account</Text>
                        <Text style={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '600', color: color.secondaryText, textAlign: 'center' }}>Select the role that best describes you</Text>
                    </View>

                    {roles.map((item) => (
                        <SelectableRoleCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            icon={item.icon}
                            selected={selectedRole === item.id}
                            onPress={() => setSelectedRole(item.id)}
                            activeColor={item.activeColor}
                            iconBackground={item.iconBackground}
                        />
                    ))}


                    <View style={{ flexDirection: 'row', backgroundColor: color.lightBlueBackground, padding: 10, borderRadius: 10, gap: 12 }}>
                        <IconComponent icon={icons.businessins} size={24} tintColor={color.primaryBlue} />
                        <Text style={{ fontSize: 14, color: color.mainText, width: width * 0.7 }}>Selected role will be permanently assigned to your account.</Text>
                    </View>

                    <CustomButton onPress={() => handleSelect()} />
                    <Text onPress={() => navigation.navigate('Login')} style={{ fontSize: 16, color: color.mainText, textAlign: 'center' }}>Already have an account? <Text style={{ color: color.primaryBlueDark }}>Login</Text></Text>

                </View>

            </ScrollView>
        </View>
    )
}

export default RoleSelectionScreen