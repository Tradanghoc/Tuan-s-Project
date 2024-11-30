import { View, Text } from 'react-native'
import React from 'react'
import { screenStyles } from '../styles/ScreenStyle'
import LottieView from 'lottie-react-native';
const Loading = () => {
  return (
    <View style={screenStyles.parent_container}>
      <LottieView
        source={require('../../../assets/lottie/Loading.json')}
        autoPlay
        loop
        style={{ flex: 1}}
      />
      <Text style={{
        position: 'absolute',
        bottom: 200,
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
      }}>Đang tải, hãy đợi một chút...</Text>
    </View>
  )
}

export default Loading