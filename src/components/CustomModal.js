import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../features/app/appSlice';
import { color } from '../utility/color';

const AUTO_HIDE_MS = 2200;
const TAB_BAR_OFFSET = 78;

const resolveVariant = (title = '') => {
    const value = String(title).toLowerCase();
    if (value.includes('fail') || value.includes('error')) return 'error';
    return 'success';
};

const CustomModal = () => {
    const { visible, title, message } = useSelector((state) => state.app.modal);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const timerRef = useRef(null);
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(16)).current;

    const isError = useMemo(() => resolveVariant(title) === 'error', [title]);

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const onClose = () => {
        clearTimer();
        Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 16, duration: 160, useNativeDriver: true }),
        ]).start(({ finished }) => {
            if (finished) dispatch(hideModal());
        });
    };

    useEffect(() => {
        if (!visible) return undefined;

        opacity.setValue(0);
        translateY.setValue(16);

        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]).start();

        clearTimer();
        timerRef.current = setTimeout(onClose, AUTO_HIDE_MS);

        return clearTimer;
    }, [visible, title, message]);

    if (!visible) return null;

    return (
        <View pointerEvents="none" style={styles.host}>
            <Animated.View
                style={[
                    styles.toast,
                    isError ? styles.toastError : styles.toastSuccess,
                    {
                        bottom: Math.max(insets.bottom, 8) + TAB_BAR_OFFSET,
                        opacity,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <Text style={[styles.text, isError ? styles.textError : styles.textSuccess]} numberOfLines={2}>
                    {message || title}
                </Text>
            </Animated.View>
        </View>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    host: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        elevation: 9999,
        alignItems: 'center',
    },
    toast: {
        position: 'absolute',
        maxWidth: '92%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    toastSuccess: {
        backgroundColor: color.lightSuccessBackground,
        borderColor: '#BBF7D0',
    },
    toastError: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    text: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    textSuccess: {
        color: color.successGreen,
    },
    textError: {
        color: '#DC2626',
    },
});
