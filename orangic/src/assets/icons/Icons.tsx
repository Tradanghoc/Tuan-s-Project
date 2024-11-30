import {View, Text, ColorValue} from 'react-native';
import React, {PropsWithChildren} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

type IconProps = PropsWithChildren<{
  name: string;
  color?: ColorValue;
  size?: number;
}>;

export enum IconName {
  menu='bars',
  back = 'chevron-left',
  next = 'caret-right',
  eye = 'eye',
  location = 'location-arrow',
  phone = 'phone',
  email = 'inbox',
  eyeClose = 'eye-slash',
  food = 'hotdog',
  store = 'store',
  times = 'times',
  send = 'paper-plane',
  search = 'share',
  address = 'address-card',
  infor = 'info-circle',
  cart = 'cart-arrow-down',
  profile = 'user',
  rank = 'list-ol',
  star = 'star',
  delivery = 'truck',
  edit = 'pen-square',
  favorite = 'cloud',
  like = 'heart',
  love = 'gratipay',
  home = 'building',
  order = 'clock',
  box = 'box',
  calendar = 'calendar-alt',
  report = 'pennant',
  add = 'plus',
  minus= 'minus',
  camera = 'camera',
  library = 'images',
  rule = 'swatchbook',
  setting = 'toolbox',
  warning = 'exclamation-triangle',
  close = 'stop',
  pin = 'thumbtack',
  flag = 'flag',
}
const Icons = ({name, color, size}: IconProps) => {
  return <FontAwesome name={name} size={size || 20} color={color} />;
};

export default Icons;
