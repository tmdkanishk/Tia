import { View, Text, StyleSheet } from 'react-native'
import React, { Children, memo } from 'react'

const ResultCardComponent = ({
    heading = 'Heading',
    value = 0,
    children
}) => {
    return (
        <View style={{
            marginTop: 16,
            borderWidth: 2,
            borderColor: '#4CAF50',
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 14,
            shadowColor: '#1565C0',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 4,
        }}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionLine} />
                <Text style={styles.sectionHeaderText}>{heading}</Text>
                <View style={styles.sectionLine} />
            </View>

            {
                children
            }


            <View style={styles.resultRowHighlight}>
                <Text style={styles.resultLabelHighlight}>Gross Premium</Text>
                <Text style={styles.resultValueHighlight}>₹{value}</Text>
            </View>

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