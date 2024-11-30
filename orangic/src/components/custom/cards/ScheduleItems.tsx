import {View, Text, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {Colors} from '../styles/ScreenStyle';
import {fonts} from '../styles/ComponentStyle';
import CheckBox from '@react-native-community/checkbox';
import Quantity_btn from '../buttons/Quantity_btn';
import Icons, {IconName} from '../../../assets/icons/Icons';


/** Decalre prop */
type Prop = {
  name?: string;
  rate?: string;
  from?: string;
  foodImage?: string;
  restaurantImage?: string;
  price?: string;
  quantity?: number;
  onMinus?: () => void;
  onAdd?: () => void;
  editCheck?: boolean;
  value?: boolean;
  style?: ViewStyle | ViewStyle[];
};

const ScheduleItems = (props: Prop) => {
  const {
    name,
    rate,
    from,
    foodImage,
    restaurantImage,
    price,
    quantity,
    onMinus,
    onAdd,
    editCheck,
    value,
    style,
  } = props;

  return (
    <View
      style={[
        {
          height: 110,
          backgroundColor: Colors.white,
          margin: 5,
          marginHorizontal: 20,
          borderRadius: 10,
          padding: 10,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}>
      <Image
        source={
          foodImage
            ? {uri: foodImage}
            : require('../../../assets/images/baseImage.png')
        }
        style={{width: 80, height: 80, borderRadius: 10}}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginLeft: 10,
          height: 90,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[fonts.captionBold]}>{name}</Text>
          <CheckBox disabled={editCheck} value={value} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 5,
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Icons name={IconName.star} size={10} color={Colors.orange} />
            <Text style={[fonts.textBold, {marginLeft: 4}]}>{rate}</Text>
          </View>
          <Text style={[fonts.textBold]}>{price}k VNĐ</Text>
        </View>

        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[fonts.textBold]}>Từ</Text>
            <Image
              source={
                restaurantImage
                  ? {uri: restaurantImage}
                  : require('../../../assets/images/baseImage.png')
              }
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                marginHorizontal: 5,
              }}
            />
            <Text style={[fonts.textBold]}>{from || 'Nhà hàng'}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Quantity_btn
              type="minus"
              onPress={() => {
                onMinus && onMinus();
              }}
            />
            <Text style={[fonts.subline, {marginHorizontal: 10}]}>
              {quantity || '0'}
            </Text>
            <Quantity_btn
              type="plus"
              onPress={() => {
                onAdd && onAdd();
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ScheduleItems;
