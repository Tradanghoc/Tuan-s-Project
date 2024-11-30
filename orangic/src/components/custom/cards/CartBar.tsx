import {View, Text, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import { fonts } from '../styles/ComponentStyle';
import { Colors } from '../styles/ScreenStyle';

type Prop = {
  title?: string;
  onPress?: () => void;
  value?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
};

const CartBar = (props: Prop) => {
  const [check, setCheck] = useState(false);
  return (
    <View
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        props?.style,
      ]}>
      <Text style={[fonts.titleBold, {}]}>Giỏ hàng</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[fonts.subline, {marginRight: 5}]}>Chọn tất cả</Text>
        <CheckBox
          value={typeof props?.value != undefined ? props?.value : check}
          onChange={() => {
            props?.onPress && props?.onPress();
          }}
          tintColors={{true: Colors.orange, false: Colors.silver}}
        />
      </View>
    </View>
  );
};

export default CartBar;
