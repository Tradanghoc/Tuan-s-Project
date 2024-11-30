import {
  TouchableHighlight,
  Text,
  ColorValue,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import {Colors} from '../styles/ScreenStyle';
import {buttons, fonts} from '../styles/ComponentStyle';

type Prop = {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  title?: string;
  underlayColor?: ColorValue;
};

const Linear_btn = (props: Prop) => {
  const {title, style, textStyle, onPress, underlayColor} = props;
  return (
    <TouchableHighlight
      activeOpacity={0.49}
      underlayColor={underlayColor || Colors.ember}
      onPress={() => {
        onPress && onPress();
      }}
      style={[buttons.linear_Cont, style]}>
      <Text style={[fonts.button, {color: Colors.black}, textStyle]}>{title || 'Get Started'}</Text>
    </TouchableHighlight>
  );
};

export default Linear_btn;
