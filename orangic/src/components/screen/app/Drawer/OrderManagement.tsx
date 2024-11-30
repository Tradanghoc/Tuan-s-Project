import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import OrderHistory from '../Orders/OrderHistory';
import OrderInProcess from '../Orders/OrderInProcess';
import TitleBar from '../../../custom/topbars/TitleBar';
import {
  DrawerActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';

const Tab = createMaterialTopTabNavigator();

const OrderManagement = () => {
  const navigation = useNavigation<NavigationProp<ParamList, 'HomeDrawer'>>();

  return (
    <View style={[screenStyles.parent_container]}>
      <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />
      <TitleBar
        value="Quản lý đơn hàng"
        style={{paddingHorizontal: 20}}
        onLeftPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        notify={0}
        onRightPress={() => {
          navigation.navigate('Profile');
        }}
      />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarLabel: ({focused, color}) => {
            let label;
            color = focused ? Colors.orange : Colors.slate;
            let nameIcon = '';
            if (route.name === 'Order In Process') {
              nameIcon = IconName.delivery;
              label = 'Đang xử lý';
            } else if (route.name === 'Orders History') {
              nameIcon = IconName.order;
              label = 'Lịch sử';
            }

            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icons size={20} name={nameIcon} color={color} />
                <Text style={{color, marginLeft: 8}}>{label}</Text>
              </View>
            );
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors.orange,
          },
        })}>
        <Tab.Screen name="Orders History" component={OrderHistory}/>
        <Tab.Screen name="Order In Process" component={OrderInProcess} />
      </Tab.Navigator>
    </View>
  );
};

export default OrderManagement;
