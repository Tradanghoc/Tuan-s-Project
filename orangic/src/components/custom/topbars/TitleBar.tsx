import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import Input from '../textinput/Input';
import Icons, {IconName} from '../../../assets/icons/Icons';
import {fonts} from '../styles/ComponentStyle';
import {Colors} from '../styles/ScreenStyle';
import {Image} from 'react-native';
import Avatar from '../../../assets/images/avatar.svg';

type Prop = {
  value: string;
  onLeftPress: () => void;
  onRightPress: () => void;
  notify: number;
  avatar?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

const TitleBar = (props: Prop) => {
  const {onLeftPress, onRightPress, value, style, avatar, textStyle} = props;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.orange
        },
        style,
      ]}>
      <TouchableOpacity
        onPress={() => {
          onLeftPress && onLeftPress();
        }}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          backgroundColor: Colors.white,
        }}>
        <Icons name={IconName.menu} size={16} color={Colors.black} />
      </TouchableOpacity>

      <Text style={[fonts.titleBold, {color: Colors.white},textStyle]}>{value}</Text>

      <TouchableOpacity
        onPress={() => {
          onRightPress && onRightPress();
        }}>
        {avatar ? (
          <Image source={{uri: 'uri'}} style={{width: 20, height: 20}} />
        ) : (
          <Avatar width={50} height={50} />
        )}
      </TouchableOpacity>

      {props.notify ? (
        <View
          style={{
            width: 15,
            height: 15,
            borderRadius: 10,
            position: 'absolute',
            top: 10,
            right: 25,
            alignItems: 'center',
            backgroundColor: Colors.blue,
          }}>
          <Text
            style={[
              fonts.text,
              {color: Colors.white, textAlign: 'center', fontSize: 10},
            ]}>
            {props.notify.toString()}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default TitleBar;
