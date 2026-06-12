import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native';
import { textStyles } from '../utility/textStyles';
import { color } from '../utility/color';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../features/app/appSlice';

const CustomModal = () => {
    const { visible, title, message } = useSelector(state => state.app.modal);
    const dispatch = useDispatch();


    const onClose = () => {
        dispatch(hideModal());
    }

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>

                            {/* Header */}
                            <Text style={styles.title}>{title}</Text>

                            {/* Content */}
                            <View style={styles.body}>
                                <Text style={[textStyles.body, { textAlign: 'center' }]}>{message}</Text>
                                <TouchableOpacity onPress={onClose} style={{ height: 48, backgroundColor: color.primaryBlueDark, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={[textStyles.body, { textAlign: 'center', color: color.lightText }]}>Close</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center'
    },
    close: {
        fontSize: 20,
    },
    body: {
        marginTop: 10,
        gap: 12
    },
});