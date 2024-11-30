import {View, Text, ViewStyle, TextStyle} from 'react-native';
import React from 'react';
import {fonts} from '../styles/ComponentStyle';

type Prop = {
  name: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  actionStyle?: TextStyle | TextStyle[];
  showAction?: boolean;
};

const SectionBar = (props: Prop) => {
  const {name, onPress, style, textStyle, actionStyle, showAction = true} = props;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        },
        style,
      ]}>
      <Text style={[fonts.sublineBold, textStyle]}>{name}</Text>
      {showAction && <Text
        style={[fonts.text, actionStyle]}
        onPress={() => {
          onPress && onPress();
        }}>
        Xem thêm
      </Text>}
    </View>
  );
};

export default SectionBar;
