import {
  View,
  Text,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  ColorValue,
  TextStyle,
} from 'react-native';
import React from 'react';
import {fonts, forms} from '../styles/ComponentStyle';
import Icon, {IconName} from '../../../assets/icons/Icons';

type Prop = {
  onChange: (text: string) => void;
  value: string;
  placeholder: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  SVG?: IconName;
  type?: 'email-address' | 'numeric' | 'phone-pad' | 'default' | 'number-pad' | 'decimal-pad' | 'visible-password' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'name-phone-pad' | 'twitter' | 'web-search' | 'visible-password';
  color?: ColorValue;
  secureTextEntry?: boolean;
  showButton?: boolean;
};

const Input = (props: Prop) => {
  const {
    onChange,
    value,
    placeholder,
    onPress,
    style,
    textStyle,
    secureTextEntry,
    showButton,
    type
  } = props;

  return (
    <View style={[forms.input_Cont, {marginBottom: 10}, style]}>
      <TextInput
        style={[fonts.text, {flex: 1}, textStyle]}
        placeholder={placeholder}
        onChangeText={onChange}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={type || 'default'}
      />

      {showButton && (
        <TouchableOpacity onPress={onPress}>
          <Icon name={props?.SVG || 'eye'} color={props?.color} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;
