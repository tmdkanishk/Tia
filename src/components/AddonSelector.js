import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { IconComponent, icons } from './IconComponent';
import { color } from '../utility/color';
import { useNavigation } from '@react-navigation/native';
import { searchAddon } from '../features/addon/addon';
import { formatIndianCurrency, getRawValue } from '../utility/helper';

const AddonSelector = ({
  value = [],
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [addons, setAddons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [errors, setErrors] = useState({});


  // Search API Call
  useEffect(() => {
    const timer = setTimeout(() => {
      getAddons(search, 1);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const toggleAddon = addon => {
    const exists = value.find(
      item => item.id === addon.id,
    );

    if (exists) {
      onChange(
        value.filter(
          item => item.id !== addon.id,
        ),
      );
    } else {
      onChange([
        ...value,
        {
          id: addon.id,
          addonName: addon.addonName,
          value: '',
        },
      ]);
    }
  };

  const updateValue = (addonId, inputValue) => {

    inputValue = getRawValue(inputValue);
    const numValue = Number(inputValue);

    // Validation
    if (inputValue && numValue > 50000000) {
      setErrors(prev => ({
        ...prev,
        [addonId]: 'Max allowed 5 Cr',
      }));
      return;
    }

    // Clear error
    setErrors(prev => ({
      ...prev,
      [addonId]: '',
    }));

    const updated = value.map(item =>
      item.id === addonId
        ? {
          ...item,
          value: inputValue,
        }
        : item,
    );

    onChange(updated);
  };

  const clearAll = () => {
    onChange([]);
  };


  const getAddons = async (keyword, pageNo) => {
    try {
      setLoading(true);
      const response = await searchAddon(keyword, pageNo);
      console.log('response.data', response.data?.data);
      if (pageNo == 1) {
        setAddons(response.data?.data || []);
        setTotalPage(response.data?.pagination?.totalPages);
      } else {
        setAddons(prev => [...prev, ...response.data?.data]);
      }

    } catch (error) {
      setAddons([]);
    } finally {
      setLoading(false);
    }
  };


  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    const isBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - 20;

    if (isBottom) {
      loadMore();
    }
  };

  const loadMore = async () => {
    if (page < totalPage) {
      setPage(prev => prev + 1);
      await getAddons(search, page + 1);
    }

  }

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.container}>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent icon={icons.plugin} tintColor={color.white} size={17} />
          </View>
          <Text style={styles.heading}>
            Add-ons ({value.length} Selected)
          </Text>
        </View>

        <TextInput
          placeholder="Search add-ons..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {value.length > 0 && (
          <View style={styles.selectedContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.selectedTitle}>
                Selected Add-ons ({value.length})
              </Text>

              <TouchableOpacity onPress={clearAll}>
                <Text style={styles.clearText}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipContainer}>
              {value.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.chip}
                  onPress={() =>
                    toggleAddon({
                      id: item.id,
                    })
                  }>
                  <Text style={styles.chipText}>
                    {item.addonName} ✕
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <ScrollView style={{ height: 400 }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {
            addons.map((item, index) => {
              const checked = value.some(
                addon =>
                  addon.id === item.id,
              );

              return (
                <View key={index} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottomWidth: 1, borderBottomColor: '#eee', }}>
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => toggleAddon(item)}>
                    <View
                      style={[
                        styles.checkbox,
                        checked && styles.checkedBox,
                      ]}>
                      {checked && (
                        <IconComponent icon={icons.checkmark} tintColor={color.lightText} size={16} />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.name} numberOfLines={1} ellipsizeMode='tail'>
                        {item.addonName}
                      </Text>

                      <Text style={styles.description} numberOfLines={2} ellipsizeMode='tail'>
                        {item.insurerRemarks}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity hitSlop={42} onPress={() => navigation.navigate('Addon', { item: item })}>
                    <IconComponent icon={icons.exlamation} tintColor={color.primaryBlue} size={24} />
                  </TouchableOpacity>
                </View>
              )

            })
          }


          {
            addons.length == 0 && <Text style={{ textAlign: 'center', marginVertical: 10, color: color.secondaryText }}>Addon not found</Text>
          }

          {
            loading && <ActivityIndicator size={40} color={color.primaryBlue} />
          }

        </ScrollView>


      </View>

      {value.length > 0 &&
        (<View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
              <IconComponent icon={icons.plugin} tintColor={color.white} size={17} />
            </View>
            <Text style={styles.heading}>
              Selected Addons
            </Text>
          </View>

          {value.map(item => (
            <View
              key={item.id}
              style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={[styles.label, { width: '90%' }]} numberOfLines={1}>
                  {item.addonName}
                </Text>

                <TouchableOpacity
                  hitSlop={42}
                  onPress={() =>
                    onChange(
                      value.filter(
                        x =>
                          x.id !==
                          item.id,
                      ),
                    )
                  }>
                  <IconComponent icon={icons.delete} tintColor={color.error} size={24} />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: color.secondaryText }}>Ammount (₹)</Text>

                <View style={{ width: '50%' }}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="10,000"
                    value={formatIndianCurrency(item.value)}
                    onChangeText={text => updateValue(item.id, text)}
                    style={[
                      styles.valueInput,
                      errors[item.id] && styles.errorInput,
                    ]}
                    placeholderTextColor={'#c7c7c7'}
                  />

                  {errors[item.id] ? (
                    <Text style={styles.errorText}>
                      {errors[item.id]}
                    </Text>
                  ) : null}
                </View>
                {/* <TextInput
                  keyboardType="numeric"
                  placeholder="Enter value"
                  value={item.value}
                  onChangeText={(text) => {
                    const num = Number(text);

                    if (text === '' || num <= 50000000) {
                      updateValue(item.id, text);
                    } else {
                      Alert.alert('Maximum value allowed is ₹5 Crore');
                    }
                  }}
                  style={styles.valueInput}
                /> */}
              </View>
            </View>
          ))}

        </View>)
      }

    </View>
  );
};

export default AddonSelector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 10,
    borderWidth: 1,
    borderColor: color.borderColor,
    borderRadius: 10
  },

  heading: {
    fontSize: 16,
    color: color.mainText,
    fontWeight: '600',
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 15,
  },

  selectedContainer: {
    marginBottom: 15,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  selectedTitle: {
    fontWeight: '600',
  },

  clearText: {
    color: '#2D6CDF',
    fontWeight: '600',
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    fontSize: 12,
  },

  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    width: '90%'
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },

  checkedBox: {
    backgroundColor: '#2D6CDF',
    borderColor: '#2D6CDF',
  },

  checkMark: {
    color: '#fff',
    fontSize: 12,
  },

  name: {
    fontWeight: '600',
    marginBottom: 4,
  },

  description: {
    color: '#666',
    fontSize: 12,
  },

  inputSection: {
    marginTop: 20,
  },

  inputTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },

  inputCard: {
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 6, borderColor: color.borderColor
  },

  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    width: '100%'
  },

  label: {
    fontWeight: '500',
  },

  removeText: {
    color: 'red',
  },

  valueInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 12,
  },

  errorInput: {
    borderWidth: 1,
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
    marginRight: 6
  },
});