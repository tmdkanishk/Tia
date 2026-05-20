import { View, Text, StyleSheet } from 'react-native'
import React, { Children, memo } from 'react'
import { color } from '../utility/color';

const ResultCardComponent = ({
    heading = 'Heading',
    value = 0,
    children
}) => {
    return (
        <View style={{ borderWidth: 1, borderRadius: 12, borderColor: color.borderColor, padding: 10 , gap:10}}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: color.mainText }}>Premimum Business Summary</Text>
            <View style={{ borderWidth: 1, borderRadius: 10, borderColor: color.primaryBlueDark, padding: 20, gap:12 ,backgroundColor: color.lightBlueBackground }}>
                <Text style={{ textAlign: 'center', color: color.primaryBlueDark, fontSize: 16 }}>Final Premimum (Incl GST)</Text>
                <Text style={{ textAlign: 'center', color: color.primaryBlueDark, fontSize: 24, fontWeight:'600' }}>₹ {value}</Text>
            </View>
            {
                children
            }
        </View>
    )
}

export default memo(ResultCardComponent);


const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    },
    sectionLine: { flex: 1, height: 1, backgroundColor: '#C5D8F0' },
    sectionHeaderText: {
        color: '#fff', fontWeight: '700', fontSize: 14, letterSpacing: 0.5,
        backgroundColor: '#1565C0', paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 20, marginHorizontal: 8,
    },

    resultRowHighlight: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: 12, alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    resultLabelHighlight: {
        fontSize: 16, color: '#2E7D32', fontWeight: '800',
    },
    resultValueHighlight: {
        fontSize: 20, color: '#2E7D32', fontWeight: '900',
    },
})