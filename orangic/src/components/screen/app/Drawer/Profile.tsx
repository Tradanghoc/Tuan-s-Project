import {View, Text, Button, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  isLogin,
  selectHost,
  selectIsLogin,
  selectUserID,
  setUserID,
} from '../../../../helpers/state/Global/globalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import TitleBar from '../../../custom/topbars/TitleBar';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {
  DrawerActions,
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {ParamList} from '../../../navigation/RootNavigation';

export type Information = {
  Name: string;
  RestaurantName: string;
  Email: string;
  Phone: string;
  Address: string;
  CreateAt: string;
  UpdateAt: string;
  Rank: number;
  Image: string;
  Status: string;
  Password: string;
  Id: string;
  DeleteAt: string | null;
};

export const initialState: Information = {
  Name: '',
  RestaurantName: '',
  Email: '',
  Phone: '',
  Address: '',
  CreateAt: '',
  UpdateAt: '',
  Rank: 0,
  Image: '',
  Status: '',
  Password: '',
  Id: '',
  DeleteAt: '',
};

function convertPoint(point: number) {
  if (point < 1000) {
    return 'Đồng';
  } else if (point < 2000) {
    return 'Bạc';
  } else if (point < 3000) {
    return 'Vàng';
  } else if (point < 6000) {
    return 'Bạc Kim';
  } else if (point < 10000) {
    return 'Kim Cương';
  } else {
    return 'Vip';
  }
}

const Profile = () => {
  const dispatch = useDispatch();
  const userID = useSelector(selectUserID);
  const host = useSelector(selectHost);
  const checkLogin = useSelector(selectIsLogin);
  const [information, setInformation] =
    React.useState<Information>(initialState);
  const isFocused = useIsFocused();

  const navigate = useNavigation<NavigationProp<ParamList, 'HomeDrawer'>>();

  const logOut = async () => {
    try {
      dispatch(isLogin(false));
      // await AsyncStorage.removeItem('userID', err => console.log('userID', err));
      await AsyncStorage.setItem('userID', '');
      // const temp = await AsyncStorage.getItem('userID');

      dispatch(setUserID(''));
      console.log('log out');
      // console.log(checkLogin);
      // console.log("useerid",temp);
    } catch (error) {
      console.error('Failed to remove the item', error);
    }
    dispatch(isLogin(false));
    dispatch(setUserID(''));
  };

  const getInfor = async () => {
    const response = await AxiosInstance().post('/get-user-information.php', {
      id: userID,
    });
    if (response.status) {
      setInformation(response.data);
    } else {
      setInformation(initialState);
    }
  };

  useEffect(() => {
    if (isFocused) getInfor();
  }, [isFocused]);

  return (
    <View style={screenStyles.parent_container}>
      <TitleBar
        value="Thông tin người dùng"
        style={{paddingHorizontal: 20, backgroundColor: 'transparent'}}
        textStyle={{color: 'black'}}
        notify={0}
        onLeftPress={() => {
          navigate.dispatch(DrawerActions.openDrawer());
        }}
        onRightPress={() => {
          navigate.navigate('Notifications');
        }}
      />

      <View
        style={{
          width: 150,
          padding: 20,
          marginVertical: 15,
          borderWidth: 2,
          borderColor: Colors.ember,
          borderRadius: 100,
          alignSelf: 'center',
        }}>
        <Image
          source={
            information.Image.length != 0
              ? {uri: `${host}/uploads/${information.Image}.jpg`}
              : require('../../../../assets/images/baseImage.png')
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            alignSelf: 'center',
          }}
        />
      </View>

      <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
        {information.Name}
      </Text>

      <Text style={{textAlign: 'center', fontSize: 16, color: Colors.ember}}>
        Rank: {convertPoint(information.Rank)}
      </Text>

      <View
        style={{
          backgroundColor: Colors.white,
          margin: 20,
          position: 'relative',
          padding: 5,
        }}>
        <Text style={{padding: 10}}>Email: {information.Email}</Text>
        <Text style={{padding: 10}}>Số điện thoại: {information.Phone}</Text>
        <Text style={{padding: 10}}>Địa chỉ: {information.Address}</Text>
        <Text style={{padding: 10}}>Điểm: {information.Rank}</Text>
        <Text style={{padding: 10}}>Tạo ngày: {information.CreateAt}</Text>
        <Text style={{padding: 10}}>Cập nhật ngày: {information.UpdateAt}</Text>
        <Text style={{padding: 10}}>
          Nhà hàng: {information.RestaurantName}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigate.navigate('ChangeInformation', {infor: information});
          }}
          style={{
            backgroundColor: Colors.orange,
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: 0,
            top: -70,
          }}>
          <Icons name={IconName.edit} color={Colors.white} size={20} />
        </TouchableOpacity>
      </View>

      <View style={{padding: 20}}>
        <Fluid_btn
          title="Đăng xuất"
          onPress={async () => {
            await logOut();
          }}
        />
      </View>
    </View>
  );
};

export default Profile;
