import {View, Text, Dimensions, ViewStyle} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {Colors} from '../styles/ScreenStyle';

const width = (Dimensions.get('window').width * 4) / 5;
const height = Dimensions.get('window').height * 0.3;

type Prop = {
  style?: ViewStyle | ViewStyle[];
};
const WaitingModal = (prop: Prop) => {
  const {style} = prop;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={[
          {
            width: width,
            height: height,
            elevation: 5,
            marginTop: -50,
            backgroundColor: Colors.white,
            borderRadius: 20,
          },
          style,
        ]}>
        <LottieView
          source={require('../../../assets/lottie/waiting.json')}
          autoPlay
          loop
          style={{flex: 1, marginTop: 10, marginHorizontal: 20, marginBottom: 10}}
        />
        <Text
        style={{
          alignSelf: 'center',
          fontSize: 20,
          marginBottom: 25,
          fontWeight: 'bold',
        }}>
        Xin hãy đợi 1 chút...
      </Text>
      </View>
    </View>
  );
};

export default WaitingModal;
