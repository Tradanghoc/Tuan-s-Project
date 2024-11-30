import {View, Text, Dimensions, Image, ViewStyle} from 'react-native';
import React from 'react';
import {fonts} from '../styles/ComponentStyle';
import Icons, {IconName} from '../../../assets/icons/Icons';
import {Colors} from '../styles/ScreenStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Prop = {
  foodName: string;
  quantity: number;
  foodRate: number;
  restaurantRate: number;
  resImg?: string;
  foodImg?: string;
  status: string;
  restaurantName: string;
  price: number;
  style?: ViewStyle | ViewStyle[];
  padding: number;
  onPress?: () => void;
  showButton?: boolean;
};

const {width, height} = Dimensions.get('window');
const OrderItems = (props: Prop) => {
  const {
    foodName,
    quantity,
    foodRate,
    restaurantRate,
    resImg,
    foodImg,
    status,
    restaurantName,
    price,
    style,
    padding,
    onPress,
    showButton,
  } = props;
  return (
    <View
      style={[
        {
          width: width - padding,
          backgroundColor: Colors.white,
          overflow: 'hidden',
          borderRadius: 18,
          paddingBottom: 15,
          elevation: 5,
        },
        style,
      ]}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: width * 0.2,
            height: width * 0.2,
            overflow: 'hidden',
            borderRadius: 20,
          }}>
          <Image
            source={require('../../../assets/images/baseImage.png')}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View>

        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 15,
                paddingLeft: 10,
                paddingRight: 20,
                flex: 1,
              }}>
              <Text style={[fonts.caption]}>{foodName}</Text>
              <Text style={[fonts.captionBold]}>{'SL: '+quantity.toString()}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 10,
              paddingRight: 20,
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
              }}>
              <Icons name={IconName.star} size={20} color={Colors.yellow} />
              <Text
                style={[
                  fonts.caption,
                  {
                    paddingLeft: 10,
                    paddingRight: 20,
                    paddingVertical: 10,
                    textAlignVertical: 'center',
                  },
                ]}>
                {foodRate.toString()}
              </Text>
            </View>
            <Text style={[fonts.captionBold, {marginLeft: 10}]}>{price} k VNĐ</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 10,
          paddingLeft: 15,
          paddingRight: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingLeft: 15,
          }}>
          <View
            style={{
              width: width * 0.08,
              height: width * 0.08,
              overflow: 'hidden',
              borderRadius: 20,
            }}>
            <Image
              source={require('../../../assets/images/baseImage.png')}
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
              }}>
              <Icons name={IconName.star} size={10} color={Colors.blue} />
              <Text style={[fonts.text, {marginLeft: 5}]}>
                {restaurantRate.toString()}
              </Text>
            </View>
            <Text style={[fonts.textBold, {marginLeft: 10}]}>
              {restaurantName}
            </Text>
          </View>
        </View>
        {showButton ? (
          <TouchableOpacity
            onPress={() => {
              onPress && onPress();
            }}
            style={{
              backgroundColor: Colors.green,
              width: 80,
              alignItems: 'center',
              paddingHorizontal: 5,
              paddingVertical: 10,
              borderRadius: 5,
            }}>
            <Text style={[fonts.button, {color: Colors.white}]}>Hủy</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[fonts.textBold]}>{status}</Text>
        )}
      </View>
    </View>
  );
};

export default OrderItems;
