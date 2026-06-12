import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { memo } from 'react'
import { color } from '../utility/color'
import { useSelector } from 'react-redux';

const AppLoader = () => {
    const appLoading = useSelector(
        state => state.app.appLoading
    );
    // console.log("AppLoader", appLoading);
    if (!appLoading) return null;

    return (
        <View style={styles.container}>
            <View style={{ padding: 32, borderRadius: 12, backgroundColor: color.screenBackground }}>
                <ActivityIndicator size="large" color={color.primaryBlueDark} />
            </View>

        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 9999,
    },
});

export default memo(AppLoader);