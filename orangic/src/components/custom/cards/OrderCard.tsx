import {
  View,
  Text,
  Dimensions,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors} from '../styles/ScreenStyle';
import Icons2, {Icon2Name} from '../../../assets/icons/Icons2';
import {fonts} from '../styles/ComponentStyle';
import { Items } from '../../screen/app/Orders/OrderHistory';
import { useSelector } from 'react-redux';
import { selectHost } from '../../../helpers/state/Global/globalSlice';

const {width, height} = Dimensions.get('window');
const padding = 20;

type Prop = {
  id: string;
  totalValue: number;
  orderDate: string;
  style?: ViewStyle | ViewStyle[];
  items: Items[];
  padding: number;
};

type OrderItemDetailProp = {
  name: string;
  quantity: number;
  status: string;
  value: number;
  image: string;
}

const OrderItemDetail = (props: OrderItemDetailProp ) => {
  const {
    name,
    quantity,
    status,
    value,
    image,
  } = props;

  return (
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
          flex: 1,
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
            source={{uri: image}}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View>

        <View>
          <Text style={[fonts.text, {marginLeft: 5, marginBottom: 5}]}>{name}</Text>
          <Text style={[fonts.textBold, {marginLeft: 10}]}>
            Số lượng: {quantity}
          </Text>
        </View>

        <View style={{flex: 1}} />

        <View style={{alignItems: 'flex-end'}}>
          <Text style={[fonts.text, {marginLeft: 5, marginBottom: 5}]}>Tiền: {value}k VNĐ</Text>
          <Text style={[fonts.textBold, {marginLeft: 10}]}>Trạng thái: {status}</Text>
        </View>
      </View>
    </View>
  );
};

const OrderCard = (props: Prop) => {
  const {
    id,
    totalValue,
    orderDate,
    style,
    items,
    padding,
  } = props;
  const host = useSelector(selectHost);
  return (
    <View
      style={[
        {
          width: width - padding * 2,
          backgroundColor: Colors.white,
          overflow: 'hidden',
          borderRadius: 18,
          paddingBottom: 15,
          paddingTop: 15,
          paddingHorizontal: padding,
          elevation: 5,
        },
        style,
      ]}>
      <Text style={[fonts.sublineBold, {marginVertical: 5}]}>{id}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: 25,
        }}>
        <Text>
          Tổng giá tiền: <Text style={fonts.textBold}>{totalValue?.toString()}k VNĐ</Text>
        </Text>
        <Text>
          Ngày đặt: <Text style={fonts.textBold}>{orderDate}</Text>
        </Text>
      </View>
      <View>
        {items.map((item, index) => {
          return (
            <OrderItemDetail
              key={item.Id}
              image={`${host}/uploads/${item.Image}.jpg`}
              quantity={item.Quantity}
              name={item.FoodName}
              status={item.Status}
              value={item.Value}
            />
          )
        })}
      </View>
    </View>
  );
};

export default OrderCard;
