import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screen/user/Login';
import ChangePass from '../screen/user/ChangePass';
import Register from '../screen/user/Register';

const Stack = createNativeStackNavigator();

const UserStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="Register"
        component={Register}
        options={() => ({
          presentation: 'fullScreenModal',
          animation: 'slide_from_left',
        })}
      />
      <Stack.Screen
        name="ChangePass"
        component={ChangePass}
        options={() => ({
          presentation: 'fullScreenModal',
          animation: 'slide_from_right',
        })}
      />
    </Stack.Navigator>
  );
};

export default UserStackNavigation;
