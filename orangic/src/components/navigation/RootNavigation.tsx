import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import UserStackNavigation from './UserStackNavigation';
import FlashMessage from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../helpers/state/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppTabNavigation from './AppTabNavigation';
import {set} from 'mongoose';
import {
  isLogin,
  selectUserID,
  setHost,
  setImage,
  setName,
  setPoint,
  setUserID,
} from '../../helpers/state/Global/globalSlice';
import AxiosInstance from '../../helpers/AxiosInstance';
import {Information} from '../screen/app/Drawer/Profile';
import { InforState } from '../screen/app/Store/HasRestaurantScreen';

/** Type param */

export type ParamList = {
  /** User Stack */
  Login: undefined;
  Register: undefined;
  ChangePass: undefined;
  EnterAddress: undefined;

  /** App Tab */
  Home: undefined;
  Favorite: undefined | {id: string};
  Store: undefined;
  Cart: undefined;
  Address: undefined;

  /** Drawer Tab */
  HomeDrawer: undefined;
  Rank: undefined;
  Profile: undefined;
  AppTabNavigation: undefined;
  OrderManagement: undefined;
  Schedules: undefined;
  Notifications: undefined;
  Search: undefined | {search: string};
  ChangeInformation: undefined | {infor: Information};
  NotificationDetails: undefined | {context: NotifyDetail};

  /** Hide Tab */
  CommentList: undefined;
  UserComment: undefined;
  DishFavoriteScreen: undefined;
  RestaurantFavoriteScreen: undefined;
  RestaurantOrders: undefined;
  RestaurantStatistic: undefined;
  CreateRestaurant: undefined;
  ChangeFoodInfor: undefined;
  AllFood: undefined;
  Report: undefined | {id: string, title: string,};
  SS_FoodDetail: undefined | {id: string};
  OrderDetail: undefined | {id: string};
  ChangeRestaurantInfor: undefined | {infor: InforState};
  ChangeRestaurantBaseInfor: undefined | {id: string};
  ChangeRestaurantAddressInfor: undefined | {id: string};
  US_FoodDetail: undefined | {id: string};
  US_Restaurant: undefined | {id: string};
  CreateFood: undefined | {id: string};
  AddressInfor: undefined | {title: string; id?: string};
};

/** Type for notification's detail */

export type NotifyDetail = {
  Content: string;
  CreateAt: string;
  Creator: string;
  GiftID: string | null;
  Id: string;
  IsRead: number;
  TargetID: string;
  Title: string;
  AdminImage: string;
  AdminName: string;
  CouponCode: string;
};

/** Type for user comment */

export type UserComment = {
  Id: string;
  Point: number;
  UserID: string;
  TargetID: string;
  Comment: string;
  Status: string;
  CreateAt: string;
  UpdateAt: string;
  ImageID: string;
  UserName: string;
  UserRank: number;
};

const RootNavigation = () => {
  const login = useSelector((state: RootState) => state.global.login);
  const dispatch = useDispatch();
  const id = useSelector(selectUserID);

  useEffect(() => {
    dispatch(setHost('http://172.16.92.199:8686'));
  }, []);

  const getInfor = async () => {
    const response = await AxiosInstance().post('/get-user-information.php', {
      id: id,
    });
    console.log('get user infor', response.data);
    dispatch(setName(response.data.Name));
    dispatch(setPoint(response.data.Rank));
    dispatch(setImage(response.data.Image));
  };

  useEffect(() => {
    const getID = async () => {
      await AsyncStorage.getItem('userID').then(res => {
        if (res) {
          console.log('root navigation id', res);
          dispatch(isLogin(true));
          dispatch(setUserID(res));
        } else {
          console.log('root navigation id', 'no id');
          dispatch(isLogin(false));
          dispatch(setUserID(''));
        }
      });
      if (id !== '') await getInfor();
    };
    getID();
  }, [id]);
  return (
    <NavigationContainer>
      {login ? <AppTabNavigation /> : <UserStackNavigation />}
      <FlashMessage position="top" />
    </NavigationContainer>
  );
};

export default RootNavigation;
