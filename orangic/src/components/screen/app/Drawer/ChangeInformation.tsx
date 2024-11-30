import {View, Text, Image, Dimensions, Modal} from 'react-native';
import React, {useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import {fonts} from '../../../custom/styles/ComponentStyle';
import {screenStyles} from '../../../custom/styles/ScreenStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Input from '../../../custom/textinput/Input';
import {Information, initialState} from './Profile';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';
import {IconName} from '../../../../assets/icons/Icons';
import {showMessage} from 'react-native-flash-message';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import WaitingModal from '../../../custom/ui/WaitingModal';
import { useSelector } from 'react-redux';
import { selectHost } from '../../../../helpers/state/Global/globalSlice';

type Props = {
  route: RouteProp<ParamList, 'ChangeInformation'>;
};

const isEmailValid = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
};

const {width, height} = Dimensions.get('window');
const ChangeInformation = (props: Props) => {
  const infor = props.route.params?.infor;
  const host = useSelector(selectHost);
  const [state, setState] = useState<Information>(infor || initialState);
  const [confirm, setConfirm] = useState('');
  const [request, setRequest] = useState(false);

  /** Create OTP */
  const createOTP = async () => {
    const email = infor?.Email as string;
    showMessage({
      message: 'Đang gửi mã xác thực',
      type: 'info',
      icon: 'info',
    });
    if (!isEmailValid(email))
      return showMessage({
        message: 'Email không hợp lệ',
        type: 'danger',
        icon: 'warning',
      });
    const response = await AxiosInstance().post('post-send-email.php', {
      email,
      token: '757346',
      type: 'Đổi Thông Tin',
    });
    // console.log(response);
    if (response.status) {
      showMessage({
        message: 'Mã xác thực đã được gửi',
        type: 'success',
        icon: 'info',
      });
    } else {
      showMessage({
        message: response.statusText,
        type: 'danger',
        icon: 'warning',
      });
    }
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

  const changeInfor = async () => {
    const email = infor?.Email as string;
    const {Password, Name, Email} = state;
    if (!checkField(Email, Name, Password, confirm)) {
      return showMessage({
        message: 'Xin hãy điền đầy đủ thông tin',
        type: 'danger',
        icon: 'warning',
      });
    }
    setRequest(true);
    const body = {
      name: Name,
      email: email,
      newEmail: Email,
      password: Password,
      confirm,
    };
    const response = await AxiosInstance().post(
      'post-update-user-informations.php',
      body,
    );
    setRequest(false);

    if (response.status) {
      showMessage({
        message: 'Đổi Thông tin thành công',
        type: 'success',
        icon: 'success',
      });
    } else {
      showMessage({
        message: response.statusText,
        type: 'danger',
        icon: 'warning',
      });
      // console.log(response);
    }
  };

  const ModalLoad = () => {
    return (
      <Modal animationType="fade" transparent visible={request}>
        <WaitingModal />
      </Modal>
    );
  };

  return (
    <View style={[screenStyles.container]}>
      <ModalLoad />
      <Text
        style={[fonts.captionBold, {textAlign: 'center', marginVertical: 15}]}>
        Thay đổi thông tin
      </Text>

      <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
        <TouchableOpacity>
          <Image
            source={
              infor?.Image
                ? {uri: `${host}/uploads/${infor?.Image}.jpg`}
                : require('../../../../assets/images/baseImage.png')
            }
            style={{width: 100, height: 100, borderRadius: 50}}
          />
        </TouchableOpacity>

        <View style={{marginLeft: 15}}>
          <Text style={{paddingVertical: 10}}>Tạo ngày: {state.CreateAt}</Text>
          <Text style={{paddingVertical: 10}}>
            Cập nhật ngày: {state.UpdateAt}
          </Text>
        </View>
      </View>

      <Input
        placeholder="Họ và tên"
        value={state.Name}
        style={{width: width - 40, height: 50, marginVertical: 15}}
        onChange={text => {
          setState({...state, Name: text});
        }}
      />

      <Input
        placeholder="Mật khẩu"
        value={state.Password}
        style={{width: width - 40, height: 50}}
        onChange={text => {
          setState({...state, Name: text});
        }}
      />

      <Input
        placeholder="Email"
        showButton={true}
        SVG={IconName.send}
        onPress={() => {
          createOTP();
        }}
        value={state.Email}
        style={{width: width - 40, height: 50}}
        onChange={text => {
          setState({...state, Email: text});
        }}
      />

      <Input
        placeholder="Mã xác nhận"
        value={confirm}
        type='number-pad'
        style={{width: width - 40, height: 50}}
        onChange={text => {
          setConfirm(text);
        }}
      />

      <Fluid_btn
        title="Lưu"
        style={{marginTop: 40}}
        onPress={() => {
          changeInfor();
        }}
      />
    </View>
  );
};

export default ChangeInformation;
