import {View, Text, ViewStyle} from 'react-native';
import React from 'react';
import Star from '../../../../assets/ics/star.svg';
import {fonts, lists} from '../styles/ComponentStyle';
import {Colors} from '../styles/ScreenStyle';
import Icons from '../../../assets/icons/Icons';
import {IconName} from '../../../assets/icons/Icons';

type Prop = {
  rate?: number;
  rateCount?: number;
  style?: ViewStyle | ViewStyle[];
};

const CardRate = (props: Prop) => {
  return (
    <View style={[lists.cardRate_Cont, {alignItems: 'center'}, props?.style]}>
      <Text style={[fonts.text, {textAlignVertical: 'center', marginRight: 2}]}>
        {props?.rate?.toString() || '0'}
      </Text>
      <Icons color={Colors.yellow} name={IconName.star} size={12} />
      <Text
        style={[
          fonts.text,
          {color: Colors.slate, textAlignVertical: 'center', marginLeft: 2},
        ]}>
        {props?.rateCount?.toString() || '0'}
      </Text>
    </View>
  );
};

export default CardRate;
