import {View, Text, ViewStyle, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {cards, fonts} from '../styles/ComponentStyle';
import CardRate from './CardRate';
import Icons, {IconName} from '../../../assets/icons/Icons';
import {Colors} from '../styles/ScreenStyle';
import Icons2, {Icon2Name} from '../../../assets/icons/Icons2';

type Prop = {
  style?: ViewStyle | ViewStyle[];
  name?: string;
  intro?: string;
  time?: string;
  image?: string;
  rate?: number;
  rateCount?: number;
  price?: number;
  discount?: number;
  favorite?: number;
  onLongPress?: () => void;
  onPress?: () => void;
  type?: 'Restaurant' | 'Food';
};

const BigCard = (props: Prop) => {
  //delaying render icon in big card
  const [isBlurViewReady, setIsBlurViewReady] = useState(false);
  const onLayout = () => {
    setIsBlurViewReady(true);
  };

  return (
    <TouchableOpacity
      style={[cards.big_Cont, {elevation: 5, flex: 1}, props.style]}
      onLongPress={() => {
        props?.onLongPress && props?.onLongPress();
      }}
      onPress={() => {
        props?.onPress && props.onPress();
      }}>
      <Image
        style={[{height: 147, width: '100%'}]}
        borderRadius={15}
        resizeMode="cover"
        source={
          props?.image
            ? {uri: props.image}
            : require('../../../assets/images/baseImage.png')
        }
      />

      <CardRate
        style={[{top: 20, left: 10}]}
        rate={props?.rate || 0}
        rateCount={props?.rateCount}
      />
      <View
        style={{
          width: 45,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 25,
          elevation: 5,
          position: 'absolute',
          backgroundColor: Colors.white,
          top: 10,
          right: 20,
          zIndex: 1,
        }}>
        {props?.favorite == 1 ? (
          <Icons2 name={Icon2Name.love} color={Colors.orange} size={18} />
        ) : (
          <Icons name={IconName.like} color={Colors.black} size={18} />
        )}
      </View>

      {props?.type && props?.type == 'Food' ? (
        <View style={[cards.small_NameCont]}>
          <Text style={fonts.sublineBold}>
            {props?.name || 'HomeCardSmall'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icons name={IconName.delivery} color={Colors.ember} size={16} />
              <Text
                style={[
                  fonts.subline,
                  {marginLeft: 5, textAlignVertical: 'center'},
                ]}>
                {props?.price
                  ? Math.round(
                      props?.price *
                        (1 - (props?.discount ? props?.discount : 0) / 100) *
                        0.1,
                    ) == 0
                    ? 'Miễn phí'
                    : Math.round(
                        props?.price *
                          (1 - (props?.discount ? props?.discount : 0) / 100) *
                          0.1,
                      ) + 'k VNĐ'
                  : 'Miễn phí'}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <TimeMade width={20} height={20} fill={Colors.orange} /> */}
              <Icons name={IconName.order} color={Colors.orange} size={16} />
              <Text
                style={[
                  fonts.subline,
                  {marginLeft: 5, textAlignVertical: 'center'},
                ]}>
                {props?.time || '10 - 15 mins'}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={[cards.small_NameCont]}>
          <Text style={fonts.sublineBold}>
            {props?.name || 'HomeCardSmall'}
          </Text>
          <Text style={fonts.subline}>
            {props?.intro || 'HomeCardSmall Introduction'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BigCard;
