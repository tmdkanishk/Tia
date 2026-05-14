import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import { getRiskCodeAndOccupancy } from '../features/businessInsurance/businessInsuranceAPI'

const CustomAutoSearchModal = ({
    visible,
    onClose,
    onSelect,
}) => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // API Search Function
    const searchAPI = async (text) => {
        try {
            setLoading(true);
            const response = await getRiskCodeAndOccupancy(text);
            setData(response?.data?.data || []);
            console.log("response", response);
        } catch (error) {
            console.log('Search Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auto Search While Typing
    useEffect(() => {
        if (search.trim().length > 0) {
            const timer = setTimeout(() => {
                searchAPI(search);
            }, 700);

            return () => clearTimeout(timer);
        } else {
            setData([]);
        }
    }, [search]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
                onSelect(item);
                setSearch('');
                setData([]);
                onClose();
            }}
        >
            <Text style={styles.itemText}>
                <Text style={{ fontWeight: 'bold' }}>{item?.risk_code} - </Text> {item.occupancy_desc}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Risk Code & Occupancy
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                setSearch('');
                                setData([]);
                                onClose();
                            }}
                        >
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <TextInput
                        placeholder="Search..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />

                    {/* Loader */}
                    {loading && (
                        <ActivityIndicator
                            size="large"
                            style={{ marginTop: 20 }}
                        />
                    )}

                    {/* Search Result */}
                    {!loading && (
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={
                                search.length > 0 ? (
                                    <Text style={styles.emptyText}>
                                        No Data Found
                                    </Text>
                                ) : null
                            }
                        />
                    )}

                </View>
            </View>
        </Modal>
    );
};

export default CustomAutoSearchModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 20,
    },

    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        maxHeight: '80%',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    closeText: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    searchInput: {
        height: 45,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
    },

    itemContainer: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    itemText: {
        fontSize: 16,
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
    },
});