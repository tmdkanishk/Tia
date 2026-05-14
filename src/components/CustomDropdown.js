import React, { memo, useState } from "react";
import {
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    Text,
} from "react-native";

const CustomDropdown = ({
    data = [],
    placeholder = "Select",
    value,
    onSelect,
    width = "100%",
    label,
    placeholderStyle,
    labelStyle,
    conatinerStyle,
    disabled = false,
    error,
}) => {
    const [visible, setVisible] = useState(false);

    const dropdownData = [
        { label: placeholder, value: "" },
        ...data
    ];

    const selectedItem = data.find((item) => item.value === value || value?.value);

    return (
        <View style={{ width }}>
            {/* label */}
            {label && <Text style={[{ fontSize: 14, color: '#fff', marginBottom: 8 }, labelStyle]} >{label}</Text>}
            {/* Select Box */}
            <TouchableOpacity
                disabled={disabled}
                style={[styles.selectBox, conatinerStyle, { opacity: disabled ? 0.5 : 1, borderColor: error ? 'red' : 'rgba(255,255,255,0.6)' }]}
                onPress={() => setVisible(true)}
            >
                <Text ellipsizeMode="tail" numberOfLines={1} style={[selectedItem ? styles.selectedText : styles.placeholder, { width: '90%' }, placeholderStyle]}>
                    {selectedItem ? selectedItem.label : placeholder}
                </Text>
                {/* <IconComponentSortDown color={'gray'} /> */}
            </TouchableOpacity>
            {error && <Text style={{ color: 'red' }}>{error}</Text>}

            {/* Dropdown Modal */}
            <Modal transparent visible={visible} animationType="fade">
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <FlatList
                            data={dropdownData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.item,
                                        { borderBottomWidth: index === dropdownData?.length - 1 ? 0 : 1 }]
                                    }
                                    onPress={() => {
                                        onSelect(item.value, item);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={styles.itemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default memo(CustomDropdown);

const styles = StyleSheet.create({
    selectBox: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    placeholder: {
        color: "#999",
    },
    selectedText: {
        color: "#000",
        fontSize:14
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    dropdown: {
        backgroundColor: "#fff",
        borderRadius: 8,
        maxHeight: 600,
    },
    item: {
        padding: 15,
        borderBottomColor: 'gray'
    },
    itemText: {
        fontSize: 16,
    },
});