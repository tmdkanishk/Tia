import React, { memo } from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { color } from '../utility/color';

const QuotationSkeleton = () => {
    return (

        <SkeletonPlaceholder>
            <View
                style={{
                    paddingVertical: 10,
                    paddingHorizontal: 6,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    height: 180,
                    borderWidth: 1, borderColor: color.borderColor,
                }}
            >
                {/* Left Section */}
                <View
                    style={{
                        width: '65%',
                        flexDirection: 'row',
                    }}
                >
                    {/* Icon */}
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 6,
                        }}
                    />

                    {/* Content */}
                    <View
                        style={{
                            marginLeft: 10,
                            flex: 1,
                        }}
                    >
                        {/* Customer Name */}
                        <View
                            style={{
                                width: '70%',
                                height: 18,
                                borderRadius: 4,
                            }}
                        />

                        {/* Quote No */}
                        <View
                            style={{
                                width: '50%',
                                height: 14,
                                borderRadius: 4,
                                marginTop: 8,
                            }}
                        />

                        {/* Occupancy */}
                        <View
                            style={{
                                width: '80%',
                                height: 28,
                                borderRadius: 6,
                                marginTop: 14,
                            }}
                        />

                        {/* Date */}
                        <View
                            style={{
                                width: '60%',
                                height: 14,
                                borderRadius: 4,
                                marginTop: 14,
                            }}
                        />
                    </View>
                </View>

                {/* Right Section */}
                <View
                    style={{
                        width: '30%',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <View
                            style={{
                                width: '60%',
                                height: 12,
                                borderRadius: 4,
                            }}
                        />

                        <View
                            style={{
                                width: '90%',
                                height: 16,
                                borderRadius: 4,
                                marginTop: 6,
                            }}
                        />

                        <View
                            style={{
                                width: '70%',
                                height: 12,
                                borderRadius: 4,
                                marginTop: 12,
                            }}
                        />

                        <View
                            style={{
                                width: '90%',
                                height: 16,
                                borderRadius: 4,
                                marginTop: 6,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            width: '100%',
                            height: 30,
                            borderRadius: 6,
                        }}
                    />
                </View>
            </View>
        </SkeletonPlaceholder>
    );
};

export default memo(QuotationSkeleton);