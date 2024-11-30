import {View, Dimensions, FlatList, Modal, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import OrderItems from '../../../custom/cards/OrderItems';
import {screenStyles} from '../../../custom/styles/ScreenStyle';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {useSelector} from 'react-redux';
import {selectUserID} from '../../../../helpers/state/Global/globalSlice';
import Empty from '../../../../assets/images/EmptyFoodFav.svg';
import WaitingModal from '../../../custom/ui/WaitingModal';
import OrderCard from '../../../custom/cards/OrderCard';

export type Items = {
  ArriveAt: string;
  FoodName: string;
  Id: string;
  Image: string;
  Quantity: number;
  Status: string;
  Value: number;
};

type OrderItems = {
  Address: string;
  City: string;
  CreateAt: string;
  Delivery: number;
  District: string;
  Id: string;
  Items: Items[];
  Phone: string;
  TotalValue: number;
  Ward: string;
};

const {width, height} = Dimensions.get('window');
const OrderHistory = () => {
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

  const getOrders = async () => {
    const response = await AxiosInstance().post('/get-user-order-history.php', {
      id: userID,
    });
    setOrder(response.data);
  };
  useEffect(() => {
    getOrders();
  }, []);
  return (
    <View style={[screenStyles.container, {flexGrow: 1}]}>
      <ModalLoad />
      <FlatList
        data={order}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingBottom: 15,
        }}
        scrollEnabled={true}
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
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'gray'}}>
              Bạn chưa có đơn hàng nào
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        renderItem={({item}: {item: OrderItems}) => {
          return (
            <OrderCard
              id={item.Id}
              totalValue={item.TotalValue}
              padding={20}
              orderDate={item.CreateAt.slice(0, 10)}
              items={item.Items}
            />
          );
        }}
      />
    </View>
  );
};

export default OrderHistory;
