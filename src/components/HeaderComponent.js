import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { memo } from 'react'
import { useNavigation } from '@react-navigation/native';
import { IconComponent, icons } from './IconComponent';

const HeaderComponent = ({heading}) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.calcIconBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                <IconComponent icon={icons.back} size={24} tintColor="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
                <Text style={styles.headerTitle}>{heading || 'FIRE INSURANCE'}</Text>
                <View style={styles.headerDividerRow}>
                    <View style={styles.headerDivLine} />
                    <Text style={styles.headerSub}>CALCULATOR</Text>
                    <View style={styles.headerDivLine} />
                </View>
            </View>
            <View style={styles.calcIconBtn}>
                <Text style={styles.calcIcon}>🧮</Text>
            </View>
        </View>
    )
}

export default memo(HeaderComponent);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#1565C0',
    },
    headerTitleWrap: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
    headerDividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    headerDivLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 6 },
    headerSub: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 2 },
    calcIconBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
    },
    calcIcon: { fontSize: 18 },

})