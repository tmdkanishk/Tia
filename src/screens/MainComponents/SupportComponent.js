import { View, Text } from 'react-native'
import React, { memo } from 'react'

const SupportComponent = () => {
  return (
    <View>
      <Text>SupportComponent</Text>
    </View>
  )
}

export default memo(SupportComponent);