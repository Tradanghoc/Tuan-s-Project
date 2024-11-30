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
import {IconName} from '../../../assets/icons/Icons';
import {fonts, forms} from '../styles/ComponentStyle';
import {Colors} from '../styles/ScreenStyle';
import {Image} from 'react-native';
import Avatar from '../../../assets/images/avatar.svg';
import {TextInput} from 'react-native-gesture-handler';
import Icons2, {Icon2Name} from '../../../assets/icons/Icons2';

type Prop = {
  onChange: (value: string) => void;
  value: string;
  onLeftPress: () => void;
  onRightPress: () => void;
  searchContainStyle?: ViewStyle | ViewStyle[];
  onSearch: () => void;
  notify: number;
  avatar?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

const HomeBar = (props: Prop) => {
  const {
    onLeftPress,
    onRightPress,
    onChange,
    value,
    onSearch,
    style,
    avatar,
    textStyle,
    searchContainStyle,
  } = props;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        style,
      ]}>
      <TouchableOpacity
        onPress={() => {
          onLeftPress && onLeftPress();
        }}>
        <Image
          source={require('../../../assets/icons/iconLogo.png')}
          style={{width: 20, height: 20, borderRadius: 10}}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View
        style={[
          forms.input_Cont,
          {flex: 1, marginHorizontal: 10, marginVertical: 10},
        ]}>
        <TextInput
          style={[fonts.text, {flex: 1}, textStyle]}
          placeholder={'Bạn muốn tìm gì ?'}
          onChangeText={onChange}
          value={value}
        />

        <TouchableOpacity
          onPress={() => {
            onSearch && onSearch();
          }}>
          <Icons2 name={Icon2Name.search} size={20} color={Colors.black} />
        </TouchableOpacity>
      </View>

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

export default HomeBar;
