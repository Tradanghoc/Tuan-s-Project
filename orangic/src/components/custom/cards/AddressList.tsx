import {View, Text, ViewStyle, TouchableOpacity} from 'react-native';
import React from 'react';
import {fonts} from '../styles/ComponentStyle';
import Icons, {IconName} from '../../../assets/icons/Icons';
import {Colors} from '../styles/ScreenStyle';
import {Swipeable} from 'react-native-gesture-handler';

type Prop = {
  style?: ViewStyle | ViewStyle[];
  address?: string;
  detail?: string;
  onPress?: () => void;
  onDel?: () => void;
};

const AddressList = (props: Prop) => {
  const leftAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props?.onDel && props?.onDel();
        }}
        style={{
          width: 70,
          marginLeft: 20,
          backgroundColor: Colors.ember,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            fonts.titleBold,
            {
              color: Colors.white,
            },
          ]}>
          Xóa
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <Swipeable renderRightActions={leftAction}>
      <View
        style={[
          {
            width: '100%',
            paddingLeft: 20,
            paddingVertical: 10,
            paddingRight: 5,
            backgroundColor: Colors.white,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          props?.style,
        ]}>
        <View style={{flex: 1, justifyContent: 'space-between', height: 50}}>
          <Text style={[fonts.sublineBold, {}]}>
            {props?.address || 'Address'}
          </Text>
          <Text style={[fonts.subline, {flex: 1}]}>
            {props?.detail || "Address's detail"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            props?.onPress && props?.onPress();
          }}>
          <Icons name={IconName.edit} color={Colors.ember} size={20} />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

export default AddressList;
