import {
  View,
  Text,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TitleList from '../../../custom/cards/TitleList';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import TitleBar from '../../../custom/topbars/TitleBar';
import {fonts} from '../../../custom/styles/ComponentStyle';
import ScheduleItems from '../../../custom/cards/ScheduleItems';
import Empty from '../../../../assets/images/fast-food.svg';
import {useSelector} from 'react-redux';
import {DrawerActions, NavigationProp, useIsFocused, useNavigation} from '@react-navigation/native';
import {
  selectHost,
  selectUserID,
  setHost,
} from '../../../../helpers/state/Global/globalSlice';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import { ParamList } from '../../../navigation/RootNavigation';

/** Declare Item  */

type Item = {
  Id: string;
  AddressID: string;
  Interval: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  Time: string;
  Pick: number;
  Rate: number;
  FoodID: string;
  UserID: string;
  Quantity: number;
  Name: string;
  Price: number;
  Discount: number;
  RestaurantName: string;
  RestaurantID: string;
  FoodImage: string | null;
  RestaurantImageID: string | null;
};

/** Decalre data response */

type ScheduleItems = {
  Breakfast: Item[];
  Lunch: Item[];
  Dinner: Item[];
  Snack: Item[];
};

const initialData: ScheduleItems = {
  Breakfast: [],
  Lunch: [],
  Dinner: [],
  Snack: [],
};

const {width, height} = Dimensions.get('window');
const Schedules = () => {
  const [data, setData] = useState<ScheduleItems>(initialData);
  const navigate = useNavigation<NavigationProp<ParamList, 'HomeDrawer'>>();
  const id = useSelector(selectUserID);
  const host = useSelector(selectHost);
  const isFocused = useIsFocused();
  const getSchedule = async () => {
    try {
      const response = await AxiosInstance().post('get-users-schedule.php', {
        id,
      });
      // console.log(response.data.Breakfast[0].RestaurantImageID);
      setData(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (isFocused) {
      getSchedule();
    }
  }, [isFocused]);
  return (
    <View style={[screenStyles.parent_container]}>
      <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />
      <TitleBar
        value="Lịch trình ăn uống"
        style={{paddingHorizontal: 20}}
        notify={0}
        onLeftPress={() => {
          navigate.dispatch(DrawerActions.openDrawer());
        }}
        onRightPress={() => {
          navigate.navigate('Notifications')
        }}
      />

      <ScrollView
        style={{flex: 1, paddingTop: 50}}
        showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 20}}>
          <TitleList
            title="Buổi sáng"
            action={true}
            barStyle={{backgroundColor: Colors.blue}}
          />
        </View>

        <Text style={[fonts.sublineBold, {marginLeft: 20, marginVertical: 20}]}>
          Đặt hàng lúc
        </Text>

        <FlatList
          style={{width, height: 200}}
          data={data.Breakfast}
          snapToAlignment="center"
          pagingEnabled
          disableIntervalMomentum={true}
          snapToInterval={width + 10}
          horizontal
          contentContainerStyle={{flexGrow: 0, justifyContent: 'center'}}
          ListEmptyComponent={<Empty width={width} height={150} />}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}: {item: Item}) => (
            <ScheduleItems
              editCheck={false}
              rate={item.Rate.toString()}
              value={item.Pick === 1}
              name={item.Name}
              price={item.Price.toString()}
              restaurantImage={`${host}/uploads/${item.RestaurantImageID}.jpg`}
              from={item.RestaurantName}
              quantity={item.Quantity}
              style={{
                width: width - 30,
              }}
            />
          )}
          keyExtractor={item => item.Id}
        />

        <View style={{paddingHorizontal: 20}}>
          <TitleList
            title="Buổi trưa"
            action={true}
            barStyle={{backgroundColor: Colors.blue}}
          />
        </View>

        <Text style={[fonts.sublineBold, {marginLeft: 20, marginVertical: 20}]}>
          Đặt hàng lúc
        </Text>

        <FlatList
          style={{height: 200}}
          data={data.Lunch}
          snapToAlignment="center"
          pagingEnabled
          disableIntervalMomentum={true}
          snapToInterval={width + 10}
          contentContainerStyle={{flexGrow: 0, justifyContent: 'center'}}
          ListEmptyComponent={<Empty width={width} height={150} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}: {item: Item}) => (
            <ScheduleItems
              rate={item.Rate.toString()}
              editCheck={false}
              value={item.Pick === 1}
              name={item.Name}
              price={item.Price.toString()}
              restaurantImage={`${host}/uploads/${item.RestaurantImageID}.jpg`}
              from={item.RestaurantName}
              quantity={item.Quantity}
              style={{
                width: width - 30,
              }}
            />
          )}
          keyExtractor={item => item.Id}
        />

        <View style={{paddingHorizontal: 20}}>
          <TitleList
            title="Buổi tối"
            action={true}
            barStyle={{backgroundColor: Colors.blue}}
          />
        </View>

        <Text style={[fonts.sublineBold, {marginLeft: 20, marginVertical: 20}]}>
          Đặt hàng lúc
        </Text>

        <FlatList
          style={{height: 200}}
          data={data.Dinner}
          snapToAlignment="center"
          pagingEnabled
          disableIntervalMomentum={true}
          snapToInterval={width + 10}
          contentContainerStyle={{flexGrow: 0, justifyContent: 'center'}}
          ListEmptyComponent={<Empty width={width} height={150} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}: {item: Item}) => (
            <ScheduleItems
              rate={item.Rate.toString()}
              editCheck={false}
              value={item.Pick === 1}
              name={item.Name}
              price={item.Price.toString()}
              restaurantImage={`${host}/uploads/${item.RestaurantImageID}.jpg`}
              from={item.RestaurantName}
              quantity={item.Quantity}
              style={{
                width: width - 30,
              }}
            />
          )}
          keyExtractor={item => item.Id}
        />

        <View style={{paddingHorizontal: 20}}>
          <TitleList
            title="Buổi tối"
            action={true}
            barStyle={{backgroundColor: Colors.blue}}
          />
        </View>

        <Text style={[fonts.sublineBold, {marginLeft: 20, marginVertical: 20}]}>
          Đặt hàng lúc
        </Text>

        <FlatList
          style={{height: 200, marginBottom: 20}}
          data={data.Snack}
          snapToAlignment="center"
          pagingEnabled
          disableIntervalMomentum={true}
          contentContainerStyle={{flexGrow: 0, justifyContent: 'center'}}
          ListEmptyComponent={<Empty width={width} height={150} />}
          snapToInterval={width + 10}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}: {item: Item}) => (
            <ScheduleItems
              rate={item.Rate.toString()}
              editCheck={false}
              value={item.Pick === 1}
              name={item.Name}
              price={item.Price.toString()}
              restaurantImage={`${host}/uploads/${item.RestaurantImageID}.jpg`}
              from={item.RestaurantName}
              quantity={item.Quantity}
              style={{
                width: width - 30,
              }}
            />
          )}
          keyExtractor={item => item.Id}
        />
      </ScrollView>
    </View>
  );
};

export default Schedules;
