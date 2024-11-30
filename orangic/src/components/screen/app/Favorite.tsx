import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors, screenStyles } from '../../custom/styles/ScreenStyle';
import Icons, { IconName } from '../../../assets/icons/Icons';
import DishFavoriteScreen from './Favorite/DishFavoriteScreen';
import RestaurantFavoriteScreen from './Favorite/RestaurantFavoriteScreen';

const Tab = createMaterialTopTabNavigator();


const Favorite = () => {
  return (
    <View style={[screenStyles.parent_container]}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarLabel: ({focused, color}) => {
            let label;
            color = focused ? Colors.orange : Colors.slate;
            let nameIcon = '';
            if (route.name === 'Favorite Dishes') {
              nameIcon = IconName.food;
              label = 'Món ăn yêu thích';
            } else if (route.name === 'Favorite Restaurants') {
              nameIcon = IconName.store;
              label = 'Nhà hàng yêu thích';
            }

            return (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icons size={20} name={nameIcon} color={color} />
                <Text style={{ color, marginLeft: 8 }}>{label}</Text>
              </View>
            );
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors.orange,
          }
        })}>
        <Tab.Screen name="Favorite Dishes" component={DishFavoriteScreen}/>
        <Tab.Screen
          name="Favorite Restaurants"
          component={RestaurantFavoriteScreen}
        />
      </Tab.Navigator>
    </View>
  )
}

export default Favorite