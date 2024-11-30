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
  enable?: boolean;
};

const Fluid_btn = (props: Prop) => {
  const {title, style, textStyle, onPress, underlayColor} = props;
  return (
    <TouchableHighlight
      activeOpacity={0.49}
      disabled={props.enable === true}
      underlayColor={underlayColor || Colors.ember}
      onPress={() => {
        onPress && onPress();
      }}
      style={[buttons.fluid_Cont,{backgroundColor: props.enable === true ? Colors.ember : Colors.orange}, style]}>
      <Text style={[fonts.button, textStyle]}>{title || 'Get Started'}</Text>
    </TouchableHighlight>
  );
};

export default Fluid_btn;
