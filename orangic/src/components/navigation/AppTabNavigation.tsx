import {View, Text, StatusBar, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ParamList} from './RootNavigation';
import Home from '../screen/app/Home';
import Store from '../screen/app/Store';
import Favorite from '../screen/app/Favorite';
import Cart from '../screen/app/Cart';
import Address from '../screen/app/Address';
import US_Restaurant from '../screen/app/US_Restaurant';
import US_FoodDetail from '../screen/app/US_FoodDetail';
import Profile from '../screen/app/Drawer/Profile';
import SS_FoodDetail from '../screen/app/SS_FoodDetail';
import Icons, {IconName} from '../../assets/icons/Icons';
import {Colors} from '../custom/styles/ScreenStyle';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItem,
} from '@react-navigation/drawer';
import OrderManagement from '../screen/app/Drawer/OrderManagement';
import Schedules from '../screen/app/Drawer/Schedules';
import Avatar from '../../assets/images/avatar.svg';
import {fonts} from '../custom/styles/ComponentStyle';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Rank from '../screen/app/Drawer/Rank';
import Animated from 'react-native-reanimated';
import CreateRestaurant from '../screen/app/Store/CreateRestaurant';
import ChangeRestaurantInfor from '../screen/app/Store/ChangeRestaurantInfor';
import CreateFood from '../screen/app/Store/CreateFood';
import AddressInfor from '../screen/app/Address/AddressInfor';
import Notifications from '../screen/app/Drawer/Notifications';
import {useDispatch, useSelector} from 'react-redux';
import {selectHost, selectImage, selectName, selectPoint} from '../../helpers/state/Global/globalSlice';
import ChangeInformation from '../screen/app/Drawer/ChangeInformation';
import NotificationDetails from '../screen/app/Drawer/NotificationDetails';
import RestaurantOrders from '../screen/app/Store/RestaurantOrders';
import OrderDetail from '../screen/app/Store/OrderDetail';
import Search from '../screen/app/Drawer/Search';
import AllFood from '../screen/app/Store/AllFood';
import RestaurantStatistic from '../screen/app/Store/RestaurantStatistic';
import Report from '../screen/app/Report';

const Tab = createBottomTabNavigator<ParamList>();
const Drawer = createDrawerNavigator<ParamList>();

export function convertPoint(point: number) {
  if (point < 1000) {
    return 'Đồng';
  } else if (point < 2000) {
    return 'Bạc';
  } else if (point < 3000) {
    return 'Vàng';
  } else if (point < 6000) {
    return 'Bạc kim';
  } else if (point < 10000) {
    return 'Kim cương';
  } else {
    return 'Vip';
  }
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {state} = props;
  const point = useSelector(selectPoint);
  const name = useSelector(selectName);
  const host = useSelector(selectHost);
  const image = useSelector(selectImage);

  const navigate = useNavigation<NavigationProp<ParamList, 'HomeDrawer'>>();
  return (
    <View style={{padding: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <Avatar width={70} height={70} /> */}
        <Image source={{uri: `${host}/uploads/${image}.jpg`}} style={{width: 35, height: 35, borderRadius: 15, marginRight: 15}}/>
        <View style={{alignItems: 'flex-start'}}>
          <Text style={[fonts.captionBold]}>{name}</Text>
          <Text style={[fonts.sublineBold]}>Rank: {convertPoint(point)}</Text>
        </View>
      </View>
      <DrawerItem
        label="Thông tin cá nhân"
        focused={state.routeNames[state.index] === 'Profile'}
        onPress={() => {
          navigate.navigate('Profile');
        }}
        icon={({color}) => {
          return <Icons name={IconName.profile} color={color} />;
        }}
        activeTintColor={Colors.orange}
        inactiveTintColor={Colors.slate}
      />
      <DrawerItem
        label="Bảng xếp hạng"
        focused={state.routeNames[state.index] === 'Rank'}
        onPress={() => {
          navigate.navigate('Rank');
        }}
        icon={({color}) => {
          return <Icons name={IconName.rank} color={color} />;
        }}
        activeTintColor={Colors.orange}
        inactiveTintColor={Colors.slate}
      />
      <DrawerItem
        label="Quản lý đơn hàng"
        focused={state.routeNames[state.index] === 'OrderManagement'}
        onPress={() => {
          navigate.navigate('OrderManagement');
        }}
        icon={({color}) => {
          return <Icons name={IconName.order} color={color} />;
        }}
        inactiveTintColor={Colors.slate}
        activeTintColor={Colors.orange}
      />
      <DrawerItem
        label="Lịch trình"
        focused={state.routeNames[state.index] === 'Shecdules'}
        onPress={() => {
          navigate.navigate('Schedules');
        }}
        icon={({color}) => {
          return <Icons name={IconName.calendar} color={color} />;
        }}
        inactiveTintColor={Colors.slate}
        activeTintColor={Colors.orange}
      />
    </View>
  );
}

const AppDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={({route}) => ({
        drawerActiveTintColor: Colors.orange,
        drawerInactiveTintColor: Colors.silver,
        drawerStyle: {
          paddingTop: 20,
        },
        headerShown: false,
      })}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Search" component={Search} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="OrderManagement" component={OrderManagement} />
      <Drawer.Screen name="Schedules" component={Schedules} />
      <Drawer.Screen name="Rank" component={Rank} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="ChangeInformation" component={ChangeInformation} />
      <Drawer.Screen
        name="NotificationDetails"
        component={NotificationDetails}
      />
    </Drawer.Navigator>
  );
};
const AppTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => {
          let label;
          let iconName;
          switch (route.name) {
            case 'HomeDrawer':
              iconName = focused ? (
                <Icons name={IconName.home} color={color} />
              ) : (
                <Icons name={IconName.home} color={color} />
              );
              label='Trang chủ';
              break;
            case 'Store':
              iconName = focused ? (
                <Icons name={IconName.store} color={color} />
              ) : (
                <Icons name={IconName.store} color={color} />
              );
              break;
            case 'Favorite':
              iconName = focused ? (
                <Icons name={IconName.favorite} color={color} />
              ) : (
                <Icons name={IconName.favorite} color={color} />
              );
              break;
            case 'Cart':
              iconName = focused ? (
                <Icons name={IconName.cart} color={color} />
              ) : (
                <Icons name={IconName.cart} color={color} />
              );
              break;
            case 'Address':
              iconName = focused ? (
                <Icons name={IconName.address} color={color} />
              ) : (
                <Icons name={IconName.address} color={color} />
              );
              break;
          }
          return iconName;
        },
        headerShown: false,
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: Colors.silver,
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 5,
          height: 60,
        },
      })}>
      <Tab.Screen
        name="HomeDrawer"
        component={AppDrawerNavigation}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('HomeDrawer', {screen: 'Home'});
          },
        })}
        options={{
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen name="Favorite" component={Favorite} options={{
        tabBarLabel: 'Yêu thích'
      }} />
      <Tab.Screen name="Address" component={Address} options={{
        tabBarLabel: 'Địa chỉ'
      }} />
      <Tab.Screen name="Store" component={Store} 
      options={{
        tabBarLabel: 'Cửa hàng'
      }}
      />
      <Tab.Screen name="Cart" component={Cart} 
      options={{
        tabBarLabel: 'Giỏ hàng'
      }}
      />

      <Tab.Screen
        name="US_Restaurant"
        component={US_Restaurant}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="US_FoodDetail"
        component={US_FoodDetail}
        initialParams={{id: ''}}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="SS_FoodDetail"
        component={SS_FoodDetail}
        initialParams={{id: ''}}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="AllFood"
        component={AllFood}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />

      <Tab.Screen
        name="RestaurantStatistic"
        component={RestaurantStatistic}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ChangeRestaurantInfor"
        component={ChangeRestaurantInfor}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="RestaurantOrders"
        component={RestaurantOrders}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="CreateRestaurant"
        component={CreateRestaurant}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="CreateFood"
        component={CreateFood}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="AddressInfor"
        component={AddressInfor}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Report"
        component={Report}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};
export default AppTabNavigation;
