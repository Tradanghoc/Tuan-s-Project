import {View, Text, StatusBar, Modal} from 'react-native';
import React, {useReducer, useState} from 'react';
import {Colors, screenStyles} from '../../custom/styles/ScreenStyle';
import {fonts} from '../../custom/styles/ComponentStyle';
import {ParamList} from '../../navigation/RootNavigation';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import WaitingModal from '../../custom/ui/WaitingModal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../helpers/state/store';
import Input from '../../custom/textinput/Input';
import Fluid_btn from '../../custom/buttons/Fluid_btn';
import {IconName} from '../../../assets/icons/Icons';
import {showMessage} from 'react-native-flash-message';
import { isLoading } from '../../../helpers/state/Global/globalSlice';
import AxiosInstance from '../../../helpers/AxiosInstance';

/** Declaring state of reducer */

type ChangePassState = {
  email: string;
  confirm: string;
  password: string;
};

type ChangePassAction = {
  type: keyof ChangePassState;
  payload: ChangePassState[keyof ChangePassState];
};

const initialState: ChangePassState = {
  email: 'anhtt676@gmail.com',
  confirm: '757346',
  password: '123456789123456',
};

const reducer = (state: ChangePassState, action: ChangePassAction) => {
  return {...state, [action.type]: action.payload};
};

const ChangePass = () => {
  const navigation = useNavigation<NavigationProp<ParamList, 'ChangePass'>>();
  const load = useSelector((state: RootState) => state.global.loading);
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchGlobal = useDispatch();

  const LoadingModal = () => {
    return (
      <Modal animationType="slide" visible={load} transparent={true}>
        <WaitingModal />
      </Modal>
    );
  };

  const isEmailValid = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const checkField = (email: string, ...fields: string[]) => {
    if (email.length === 0) {
      showMessage({
        message: 'Email không được để trống',
        type: 'danger',
        icon: 'warning',
      });
      return false;
    }

    if (!isEmailValid(email)) {
      showMessage({
        message: 'Email không hợp lệ',
        type: 'danger',
        icon: 'warning',
      });
      return false;
    }

    for (const field of fields) {
      if (field.length === 0) {
        showMessage({
          message: 'Xin hãy điền đầy đủ thông tin',
          type: 'danger',
          icon: 'warning',
        });
        return false;
      }
    }

    return true;
  };

  /** Create OTP */
  const createOTP = async() =>{
    const {email} = state;
    showMessage({
      message: 'Đang gửi mã xác thực',
      type: 'info',
      icon: 'info',
    });
    if(!isEmailValid(email)) return showMessage({
      message: 'Email không hợp lệ',
      type: 'danger',
      icon: 'warning',
    })
    const response = await AxiosInstance().post('post-send-email.php', {
      email,
      token: '757346',
      type: 'Đổi mật khẩu'
    });
    console.log(response);
    if(response.status){
      showMessage({
        message: 'Mã xác thực đã được gửi',
        type: 'success',
        icon: 'info',
      });
    }else {
      showMessage({
        message: response.statusText,
        type: 'danger',
        icon: 'warning',
      })
    }
  }

  const changePassword = async () => {
    const {email, password, confirm} = state;
    if (!checkField(email, password, confirm)) {
      return showMessage({
        message: 'Xin hãy điền đầy đủ thông tin',
        type: 'danger',
        icon: 'warning',
      });
    }
    dispatchGlobal(isLoading(true));
    const body = {
      email,
      password,
      token: confirm,
    }
    const response = await AxiosInstance().post('post-change-password.php', body);
    dispatchGlobal(isLoading(false));
    if(response.status){
      showMessage({
        message: 'Đổi mật khẩu thành công',
        type: 'success',
        icon: 'success',
      });
      navigation.goBack();
    } else {
      showMessage({
        message: response.statusText,
        type: 'danger',
        icon: 'warning',
      });
      console.log(response.statusText)
    }
  };

  return (
    <View style={[screenStyles.container, {backgroundColor: Colors.white}]}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <LoadingModal />
      <Text style={[fonts.headline, {marginTop: 20}]}>Quên mật khẩu ?!</Text>
      <Text style={[fonts.subline, {marginTop: 10, width: 320}]}>
        Hãy nhanh chóng lấy lại và giúp bạn{' '}
        <Text
          style={[{color: Colors.orange}]}
          onPress={() => {
            navigation.goBack();
          }}>
          Đăng nhập ngay
        </Text>
      </Text>

      <View
        style={{
          flex: 1,
          marginTop: 30,
          paddingTop: 20,
        }}>
        <Input
          placeholder="Email của bạn"
          onChange={text => {
            dispatch({type: 'email', payload: text});
          }}
          value={state.email}
          showButton
          SVG={IconName.send}
          onPress={() => {
            createOTP();
          }}
        />

        <Input
          placeholder="Mật khẩu mới"
          onChange={text => {
            dispatch({type: 'password', payload: text});
          }}
          value={state.password}
        />
        <Input
          placeholder="Mã xác thực"
          onChange={text => {
            dispatch({type: 'confirm', payload: text});
          }}
          value={state.confirm}
        />

        <Fluid_btn
          title="Đổi mật khẩu"
          style={{marginVertical: 20}}
          onPress={() => {
            changePassword();
          }}
        />
      </View>
    </View>
  );
};

export default ChangePass;
