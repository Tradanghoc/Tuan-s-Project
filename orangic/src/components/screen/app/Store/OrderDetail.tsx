import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  NavigationProp,
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import {fonts} from '../../../custom/styles/ComponentStyle';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import {PieChart} from 'react-native-chart-kit';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {useSelector} from 'react-redux';
import {selectHost} from '../../../../helpers/state/Global/globalSlice';
import {convertPoint} from '../../../navigation/AppTabNavigation';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';
import { convertStatus } from './RestaurantOrders';

type Props = {
  route: RouteProp<ParamList, 'OrderDetail'>;
};

const chartConfig = {
  backgroundGradientFrom: Colors.orange,
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: Colors.ember,
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(265, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

type Order = {
  CancelOrders: number;
  CompleteOrders: number;
  InProgressOrders: number;
  TotalOrders: number;
};

type Infor = {
  CreateAt: string;
  FoodName: string;
  Id: string;
  Quantity: number;
  Status: string;
  UserAddress: string;
  UserEmail: string;
  UserID: string;
  UserImage: string;
  UserName: string;
  UserPhone: string;
  UserRank: number;
  UserStatistics: Order;
  Value: number;
};

const screenWidth = Dimensions.get('window').width;
const OrderDetail = (props: Props) => {
  const id = props.route.params?.id;
  const host = useSelector(selectHost);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const naviagtion = useNavigation<NavigationProp<ParamList, 'OrderDetail'>>();
  const [infor, setInfor] = useState<Infor>();

  const getOrderDetails = async () => {
    const respsonse = await AxiosInstance().post(
      '/get-order-item-details.php',
      {
        id,
      },
    );
    if (respsonse.status) setInfor(respsonse.data);
  };

  useEffect(() => {
    if (isFocused) getOrderDetails();
  }, [isFocused]);

  const data = [
    {
      name: 'Bị Hủy',
      population: infor?.UserStatistics.CancelOrders || 0,
      color: Colors.orange,
      legendFontColor: Colors.black,
      legendFontSize: 13,
    },
    {
      name: 'Đang làm',
      population: infor?.UserStatistics.InProgressOrders || 0,
      color: Colors.blue,
      legendFontColor: Colors.black,
      legendFontSize: 13,
    },
    {
      name: 'Hoàn thành',
      population: infor?.UserStatistics.CompleteOrders || 0,
      color: Colors.green,
      legendFontColor: Colors.black,
      legendFontSize: 13,
    },
  ];

  const updateStatus = async (id: string, status: string) => {
    // console.log(id, status);
    const response = await AxiosInstance().post(
      `/post-update-orderitems-status.php`,
      {
        id,
        status,
      },
    );
    // console.log(response);
  };

  const StatusModal = () => {
    return (
      <Modal visible={visible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.white,
              elevation: 5,
              width: (screenWidth * 2) / 3,
              borderRadius: 15,
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 20,
            }}>
            <Text
              style={[
                fonts.sublineBold,
                {textAlign: 'center', marginBottom: 10},
              ]}>
              Chọn trạng thái
            </Text>
            <Text
              style={[
                fonts.text,
                {
                  paddingVertical: 15,
                },
              ]}
              onPress={() => {
                updateStatus(id as string, 'Approved');
                setVisible(false);
                if (infor) {
                  setInfor({...infor, Status: 'Approved'});
                }
              }}>
              Chấp nhận đơn hàng
            </Text>

            <Text
              onPress={() => {
                updateStatus(id as string, 'Made');
                setVisible(false);
                if (infor) {
                  setInfor({...infor, Status: 'Made'});
                }
              }}
              style={[
                fonts.text,
                {
                  paddingVertical: 15,
                },
              ]}>
              Đã làm xong
            </Text>

            <Text
              onPress={() => {
                updateStatus(id as string, 'In Delivery');
                setVisible(false);
                if (infor) {
                  setInfor({...infor, Status: 'In Delivery'});
                }
              }}
              style={[
                fonts.text,
                {
                  paddingVertical: 15,
                },
              ]}>
              Vận chuyển đơn hàng
            </Text>

            <Text
              onPress={() => {
                updateStatus(id as string, 'Done');
                setVisible(false);
                if (infor) {
                  setInfor({...infor, Status: 'Done'});
                }
              }}
              style={[
                fonts.text,
                {
                  paddingVertical: 15,
                },
              ]}>
              Hoàn thành
            </Text>

            <Text
              onPress={() => {
                updateStatus(id as string, 'Denied');
                setVisible(false);
                if (infor) {
                  setInfor({...infor, Status: 'Denied'});
                }
              }}
              style={[
                fonts.text,
                {
                  paddingVertical: 15,
                },
              ]}>
              Từ chối đơn hàng
            </Text>
            <Fluid_btn
              title="Hủy"
              style={{marginTop: 30}}
              onPress={() => setVisible(false)}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[screenStyles.container, {alignContent: 'center'}]}>
      <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />

      <StatusModal />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            naviagtion.navigate('RestaurantOrders');
          }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 10,
            backgroundColor: Colors.white,
            elevation: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icons name={IconName.back} size={18} color={Colors.orange} />
        </TouchableOpacity>

        <Text style={[fonts.captionBold]}>Thông tin đơn hàng</Text>

        <View style={{width: 45}} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <Image
            source={
              infor?.UserImage
                ? {uri: `${host}/uploads/${infor?.UserImage}.jpg`}
                : require('../../../../assets/images/baseImage.png')
            }
            style={{
              width: 100,
              height: 100,
              marginBottom: 20,
              borderRadius: 50,
            }}
          />

          <View style={{flex: 1}}>
            <Text style={[fonts.sublineBold, {marginBottom: 10}]}>
              Thông tin liên hệ
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <Text style={[fonts.textBold]}>Số điện thoại:</Text>
              <Text style={[fonts.text]}>01234567895</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <Text style={[fonts.textBold]}>Email:</Text>
              <Text style={[fonts.text]}>anhtt676@gmail.com</Text>
            </View>

            <Text style={[fonts.textBold, {marginVertical: 5}]}>
              Địa chỉ: <Text style={[fonts.text]}>{infor?.UserAddress}</Text>
            </Text>
          </View>
        </View>

        <Text style={[fonts.captionBold]}>{infor?.UserName}</Text>
        <Text style={[fonts.subline]}>
          {convertPoint(infor?.UserRank as number)}
        </Text>

        <View
          style={{
            backgroundColor: Colors.white,
            paddingHorizontal: 10,
            paddingBottom: 15,
            borderRadius: 10,
            marginTop: 20,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 25,
              marginBottom: 5,
              alignItems: 'center',
            }}>
            <Text style={[fonts.textBold]}>Tên món ăn:</Text>
            <Text style={[fonts.text]}>{infor?.FoodName}</Text>
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
              alignItems: 'center',
            }}>
            <Text style={[fonts.textBold]}>Số lượng:</Text>
            <Text style={[fonts.text]}>{infor?.Quantity}</Text>
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
              alignItems: 'center',
            }}>
            <Text style={[fonts.textBold]}>Ngày tạo</Text>
            <Text style={[fonts.text]}>{infor?.CreateAt}</Text>
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
              alignItems: 'center',
            }}>
            <Text style={[fonts.textBold]}>Trạng thái:</Text>
            <Text style={[fonts.text]}>{convertStatus(infor?.Status as string)}</Text>
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
              alignItems: 'center',
            }}>
            <Text style={[fonts.textBold]}>Tổng giá trị</Text>
            <Text style={[fonts.text]}>{infor?.Value}$</Text>
          </View>
        </View>

        <PieChart
          data={data}
          width={screenWidth - 40}
          height={250}
          xAxisLabel="Trạng thái đơn hàng"
          style={{marginTop: 20, borderRadius: 20}}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={Colors.white}
          paddingLeft={'15'}
        />

        <Fluid_btn
          title="Thay đổi trạng thái đơn hàng"
          style={{marginTop: 20}}
          onPress={() => setVisible(true)}
          enable={
            infor?.Status === 'Done' ||
            infor?.Status === 'Canceled' ||
            infor?.Status === 'Denied'
          }
        />
      </ScrollView>
    </View>
  );
};

export default OrderDetail;
