import {
  TouchableOpacity,
  TouchableHighlight,
  Text,
  ColorValue,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { buttons } from '../styles/ComponentStyle';
import { Colors } from '../styles/ScreenStyle';
import Icons, { IconName } from '../../../assets/icons/Icons';

type Prop = {
  style?: ViewStyle | ViewStyle[];
  type: 'plus' | 'minus';
  color?: ColorValue;
  onPress?: () => void;
};

const Quantity_btn = (props: Prop) => {
  const {style, type, color, onPress} = props;

  return (
    type === 'minus' ? (
      <TouchableOpacity
      activeOpacity={0.6}
        style={[buttons.minus_Cont, style]}
        onPress={() => {
          onPress && onPress();
        }}>
          <Icons name={IconName.minus} size={12} color={Colors.orange} />
      </TouchableOpacity>
    ) : (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor={Colors.ember}
        style={[buttons.add_Cont, style]}
        onPress={() => {
          onPress && onPress();
        }}>
        <Icons name={IconName.add} size={12} color={Colors.white} />
      </TouchableHighlight>
    )
  );
};

export default Quantity_btn;
