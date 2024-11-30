import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React, { useEffect } from 'react';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import {StatusBar} from 'react-native';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import {fonts} from '../../../custom/styles/ComponentStyle';
import {NavigationProp, useIsFocused, useNavigation} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import {BarChart, PieChart} from 'react-native-chart-kit';
import {ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {selectRestaurantID} from '../../../../helpers/state/AppTab/storeSlice';
import AxiosInstance from '../../../../helpers/AxiosInstance';

type Statistic = {
  OrderStatistic: {
    TotalOrders: number;
    CancelOrders: number;
    CompletedOrders: number;
    PendingOrders: number;
  };
  BestSeller: {
    Name: string;
    TotalQuantity: number;
  };
  TotalSell: number;
  MonthRevenue: number;
  PreMonthRevenue: number;
  YearRevenue: number;
  PreYearRevenue: number;
};

const initialStatistic: Statistic = {
  OrderStatistic: {
    TotalOrders: 0,
    CancelOrders: 0,
    CompletedOrders: 0,
    PendingOrders: 0,
  },
  BestSeller: {
    Name: '',
    TotalQuantity: 0,
  },
  TotalSell: 0,
  MonthRevenue: 0,
  PreMonthRevenue: 0,
  YearRevenue: 0,
  PreYearRevenue: 0,
};

const screenWidth = Dimensions.get('window').width;
const RestaurantStatistic = () => {
  const naviagtion = useNavigation<NavigationProp<ParamList>>();
  const resID = useSelector(selectRestaurantID);
  const isFocused = useIsFocused();
  const [statistic, setStatistic] = React.useState<Statistic>(initialStatistic);

  const getStatistic = async () => {
    const response = await AxiosInstance().post(
      'get-restaurant-user-statisticts.php',
      {id: resID},
    );

    if (response.status) {
      setStatistic(response.data);
    } else {
      setStatistic(initialStatistic);
      console.log(response.statusText);
    }
  };

  useEffect(()=>{
    if(isFocused){
      getStatistic();
    }
  },[isFocused])
  return (
    <View style={[screenStyles.container, {alignContent: 'center'}]}>
      <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />

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
            naviagtion.navigate('Store');
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

        <Text style={[fonts.captionBold]}>Thống kê của nhà hàng</Text>

        <View style={{width: 45}} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            elevation: 5,
            alignItems: 'center',
            marginVertical: 15,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 15,
            }}>
            <Text style={[fonts.captionBold, {color: Colors.orange}]}>
              Tổng đơn hàng
            </Text>
            <Text style={[fonts.captionBold, {color: Colors.orange}]}>
              {statistic.OrderStatistic.TotalOrders}
            </Text>
          </View>

          <PieChart
            data={[
              {
                name: 'Bị Hủy',
                population: statistic.OrderStatistic.CancelOrders,
                color: Colors.orange,
                legendFontColor: Colors.black,
                legendFontSize: 13,
              },
              {
                name: 'Đang làm',
                population: statistic.OrderStatistic.PendingOrders,
                color: Colors.blue,
                legendFontColor: Colors.black,
                legendFontSize: 13,
              },
              {
                name: 'Hoàn thành',
                population: statistic.OrderStatistic.CompletedOrders,
                color: Colors.green,
                legendFontColor: Colors.black,
                legendFontSize: 13,
              },
            ]}
            width={screenWidth - 40}
            height={250}
            xAxisLabel="Trạng thái đơn hàng"
            style={{marginTop: 20, borderRadius: 20}}
            chartConfig={{
              backgroundGradientFrom: Colors.orange,
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: Colors.ember,
              backgroundGradientToOpacity: 0.5,
              color: (opacity = 1) => `rgba(265, 255, 146, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // optional
            }}
            accessor={'population'}
            backgroundColor={Colors.white}
            paddingLeft={'15'}
          />
        </View>

        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            elevation: 5,
            alignItems: 'center',
            marginVertical: 15,
          }}>
          <View
            style={{
              width: '100%',
              paddingVertical: 15,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text style={[fonts.captionBold, {color: Colors.orange}]}>
              Sản phẩm có lượt tiêu thụ cao
            </Text>

            <View style={{marginTop: 15}}>
              <BarChart
                data={{
                  labels: ['Món ăn khác', statistic.BestSeller.Name],
                  datasets: [
                    {
                      data: [statistic.TotalSell, statistic.BestSeller.TotalQuantity],
                    },
                  ],
                }}
                fromZero={true}
                width={screenWidth - 80}
                height={220}
                yAxisLabel=""
                yAxisSuffix=" đơn"
                chartConfig={{
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientFromOpacity: 1,
                  backgroundGradientTo: Colors.white,
                  backgroundGradientToOpacity: 0.7,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2, // optional, default 3
                  barPercentage: 0.5,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            elevation: 5,
            alignItems: 'center',
            marginVertical: 15,
          }}>
          <View
            style={{
              width: '100%',
              paddingVertical: 15,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text style={[fonts.captionBold, {color: Colors.orange}]}>
              Thống kê doanh thu theo tháng
            </Text>

            <View style={{marginTop: 15}}>
              <BarChart
                data={{
                  labels: [ 'Tháng trước', 'Tháng này'],
                  datasets: [
                    {
                      data: [statistic.PreMonthRevenue, statistic.MonthRevenue],
                    },
                  ],
                }}
                width={screenWidth - 80}
                height={220}
                yAxisLabel="$"
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientFromOpacity: 1,
                  backgroundGradientTo: Colors.white,
                  backgroundGradientToOpacity: 0.7,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2, // optional, default 3
                  barPercentage: 0.5,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            elevation: 5,
            alignItems: 'center',
            marginVertical: 15,
          }}>
          <View
            style={{
              width: '100%',
              paddingVertical: 15,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text style={[fonts.captionBold, {color: Colors.orange}]}>
              Thống kê doanh thu theo năm
            </Text>

            <View style={{marginTop: 15}}>
              <BarChart
                data={{
                  labels: ['Năm trước', 'Năm nay'],
                  datasets: [
                    {
                      data: [statistic.PreYearRevenue, statistic.YearRevenue],
                    },
                  ],
                }}
                width={screenWidth - 80}
                height={220}
                yAxisLabel="$"
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientFromOpacity: 1,
                  backgroundGradientTo: Colors.white,
                  backgroundGradientToOpacity: 0.7,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2, // optional, default 3
                  barPercentage: 0.5,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RestaurantStatistic;
