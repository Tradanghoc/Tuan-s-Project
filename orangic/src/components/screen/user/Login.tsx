import {View, Text, Button, StatusBar, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ParamList} from '../../navigation/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../helpers/state/store';
import Loading from '../../custom/ui/Loading';
import {Colors, screenStyles} from '../../custom/styles/ScreenStyle';
import {fonts} from '../../custom/styles/ComponentStyle';
import Fluid_btn from '../../custom/buttons/Fluid_btn';
import Input from '../../custom/textinput/Input';
import {showMessage} from 'react-native-flash-message';
import AxiosInstance from '../../../helpers/AxiosInstance';
import {
  isLoading,
  isLogin,
  selectIsLogin,
  selectLoading,
  selectUserID,
  setUserID,
} from '../../../helpers/state/Global/globalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconName } from '../../../assets/icons/Icons';

const Login = () => {
  const navigation = useNavigation<NavigationProp<ParamList, 'Login'>>();
  const dispatch = useDispatch();

  const load = useSelector(selectLoading);
  const login = useSelector(selectIsLogin);
  const userID = useSelector(selectUserID);

  const [email, setEmail] = useState('anhtt676@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    console.log("useEffect login id", userID);
    if(userID){
      dispatch(isLogin(true));
      const saveID = async () => {
        await AsyncStorage.setItem('userID', userID);
      }
      saveID();
    }

  }, [userID]);

  const isValidEmail = () => {
    if (email === '') {
      showMessage({
        message: 'Vui lòng nhập email',
        type: 'warning',
        icon: 'warning',
      });
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (isValidEmail() && password !== '') {
      dispatch(isLoading(true));
      const body = {email, password};
      const result = await AxiosInstance().post('/login-user.php', body);
      console.log(result);
      if (result.status) {
        dispatch(isLoading(false));
        const user = result.data.Id;
        console.log("login user", user)
        dispatch(setUserID(user));
        console.log(result.data)
        
        showMessage({
          message: 'Đăng nhập thành công',
          type: 'success',
          icon: 'success',
        });
      }else {
        showMessage({
          message: 'Sai thông tin đăng nhập',
          type: 'warning',
          icon: 'warning',
        });
      }
      dispatch(isLoading(false));
    } else {
      dispatch(isLogin(false));
      showMessage({
        message: 'Xin mời kiểm tra lại thông tin',
        type: 'warning',
        icon: 'warning',
      });
    }
  };

  return load ? (
    <Loading />
  ) : (
    <View style={[screenStyles.container, {backgroundColor: Colors.white}]}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <Text style={[fonts.headline, {marginTop: 20}]}>Xin chào đằng đó !</Text>
      <Text style={[fonts.subline, {marginTop: 10, width: 320}]}>
        Sao chưa nhập email và mật khẩu để gọi món ngon, hay là{' '}
        <Text
          style={[{color: Colors.orange}]}
          onPress={() => {
            navigation.navigate('Register');
          }}>
          Bạn chưa có tài khoản?
        </Text>
      </Text>

      <View
        style={{
          width: '100%',
          height: 300,
          paddingTop: 100,
        }}>
        <Input onChange={setEmail} value={email} placeholder="Email" />

        <Input
          onChange={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={!showPass}
          showButton={true}
          SVG={showPass ? IconName.eye : IconName.eyeClose}
          color={Colors.black}
          onPress={() => {
            setShowPass(!showPass);
          }}
        />

        <Text
          style={[
            {color: Colors.orange, marginVertical: 15, alignSelf: 'center'},
          ]}
          onPress={() => {
            navigation.navigate('ChangePass');
          }}>
          Bạn quên mật khẩu?
        </Text>
      </View>

      <Fluid_btn title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
};

export default Login;
