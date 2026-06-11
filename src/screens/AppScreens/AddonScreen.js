import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { color } from '../../utility/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import BackHeader from '../../components/BackHeader'
import { globalStyles } from '../../utility/globalStyles';

const AddonScreen = ({ route }) => {
    const { item } = route.params || {};
    const navigation = useNavigation();
    const goBack = () => {
        navigation.goBack()
    }


    return (
        <View style={{ flex: 1, backgroundColor: color.screenBackground }}>
            <SafeAreaView>
                <View style={globalStyles.newContainer}>
                    <BackHeader title={'Terms & Conditions'} />
                    <View style={{ flex: 1, backgroundColor: color.screenBackground, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 12 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ gap: 12, padding: 20 }}>
                                <Text style={{ fontSize: 24, color: color.mainText, fontWeight: '600' }}>{item?.addonName}</Text>
                                <Text style={{ fontSize: 14, color: color.secondaryText, paddingBottom: 20, borderBottomWidth: 1, borderColor: color.borderColor }}>{item?.remarksSi}</Text>
                                <Text style={{ fontSize: 14, color: color.secondaryText, textAlign: 'justify' }}>{item?.wording}</Text>
                                <CustomButton
                                    label='CLOSE'
                                    onPress={goBack}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default AddonScreen