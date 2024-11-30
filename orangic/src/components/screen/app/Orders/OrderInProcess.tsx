import {View, Text, Dimensions, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import OrderItems from '../../../custom/cards/OrderItems';
import {screenStyles} from '../../../custom/styles/ScreenStyle';
import {useSelector} from 'react-redux';
import {selectUserID} from '../../../../helpers/state/Global/globalSlice';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import Empty from '../../../../assets/images/EmptyFoodFav.svg';
import {Modal} from 'react-native';
import WaitingModal from '../../../custom/ui/WaitingModal';
import {showMessage} from 'react-native-flash-message';
import {set} from 'mongoose';

type OrderItems = {
  Id: string;
  OrderID: string;
  FoodID: string;
  Quantity: 79;
  Pick: 0;
  Status: string | null;
  Value: number;
  UserID: string;
  TotalValue: number;
  PaymentMethod: string;
  FoodName: string;
  RestaurantName: string;
  RestaurantID: string;
  ResImage: string;
  ResRating: number;
  FoodImage: string | null;
  FoodRating: number;
};
const {width, height} = Dimensions.get('window');

const OrderInProcess = () => {
  const userID = useSelector(selectUserID);
  const [order, setOrder] = useState<OrderItems[]>([]);
  const [resfresh, setRefresh] = useState(false);

  const ModalLoad = () => {
    return (
      <Modal animationType="fade" transparent visible={resfresh}>
        <WaitingModal />
      </Modal>
    );
  };

  const CancelItem = async (id: string) => {
    const response = await AxiosInstance().post(
      '/post-update-orderitems-status.php',
      {
        id,
        status: 'Canceled',
      },
    );
    if (response.status) {
      showMessage({
        message: 'Hủy đơn hàng thành công',
        type: 'success',
        icon: 'info',
      });

      setOrder(order.filter(item => item.Id !== id));
    }
  };

  const getOrders = async () => {
    const response = await AxiosInstance().post('/get-user-order-now.php', {
      id: userID,
    });
    // console.log(response.data);
    setOrder(response.data);
  };
  useEffect(() => {
    getOrders();
  }, []);
  return (
    <View style={[screenStyles.container, {flexGrow: 1}]}>
      <FlatList
        data={order}
        contentContainerStyle={{
          paddingBottom: 15,
        }}
        refreshing={resfresh}
        onRefresh={() => {
          setRefresh(true);
          getOrders();
          setRefresh(false);
        }}
        keyExtractor={item => item.Id}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Empty width={width} height={width} />

            <Text
              style={{
                width: width - 100,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: 'gray',
              }}>
              Bạn không có đơn hàng nào đang cần xử lý
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        renderItem={({item}: {item: OrderItems}) => {
          return (
            <OrderItems
              padding={60}
              foodName={
                item.FoodName.length > 20
                  ? item.FoodName.slice(0, 20) + '...'
                  : item.FoodName
              }
              onPress={async () => {
                setRefresh(true);
                await CancelItem(item.Id);
                setRefresh(false);
              }}
              showButton={item.Status === 'Waiting' ? true : false}
              restaurantName={item.RestaurantName}
              foodRate={item.FoodRating}
              price={item.Value}
              quantity={item.Quantity}
              restaurantRate={item.ResRating}
              status={item.Status ? item.Status : 'Không thấy'}
              style={{marginTop: 15, marginHorizontal: 10}}
            />
          );
        }}
      />
    </View>
  );
};

export default OrderInProcess;
