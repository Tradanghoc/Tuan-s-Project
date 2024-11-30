import {View, Text, ViewStyle, TouchableOpacity} from 'react-native';
import React from 'react';
import Icons, {IconName} from '../../../assets/icons/Icons';
import {Colors} from '../styles/ScreenStyle';
import Icons2, {Icon2Name} from '../../../assets/icons/Icons2';

type Prop = {
  point: number;
  editable?: boolean;
  onChange: (p: number) => void;
  size?: number;
  style: ViewStyle | ViewStyle[];
};

const CustomRating = (props: Prop) => {
  const {point, onChange, style, editable, size} = props;
  const rank = [1, 2, 3, 4, 5];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          width: 150,
          justifyContent: 'space-evenly',
        },
        style,
      ]}>
      {rank.map((_, index) => {
        return index + 1 > point ? (
          <TouchableOpacity disabled={editable} key={index} onPress={() => onChange(index + 1)}>
            <Icons name={IconName.star} size={size || 20} color={Colors.yellow} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled={editable} key={index} onPress={() => onChange(index + 1)}>
            <Icons2 name={Icon2Name.star} size={size || 20} color={Colors.yellow} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomRating;
