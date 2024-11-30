import {View, Text, ColorValue} from 'react-native';
import React, {PropsWithChildren} from 'react';
import FontAwesome from 'react-native-vector-icons/AntDesign';

type IconProps = PropsWithChildren<{
  name: string;
  color?: ColorValue;
  size?: number;
}>;

export enum Icon2Name {
  love = 'heart',
  trophy = 'Trophy',
  search = 'search1',
  pin = 'pushpino',
  flag = 'flag',
  star = 'star',
  close = 'close'
}
const Icons2 = ({name, color, size}: IconProps) => {
  return <FontAwesome name={name} size={size || 20} color={color} />;
};

export default Icons2;
