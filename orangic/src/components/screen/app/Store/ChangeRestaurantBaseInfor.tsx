import {View, Text} from 'react-native';
import React from 'react';
import {screenStyles} from '../../../custom/styles/ScreenStyle';
import Input from '../../../custom/textinput/Input';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';
import TextArea from '../../../custom/textinput/TextArea';
import {InforState} from './HasRestaurantScreen';
import {InforAction} from './ChangeRestaurantInfor';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {showMessage} from 'react-native-flash-message';
import {useSelector} from 'react-redux';
import {selectRestaurantID} from '../../../../helpers/state/AppTab/storeSlice';
import {set} from 'mongoose';

type Prop = {
  infor: InforState;
  setInfor: React.Dispatch<InforAction>;
};

const ChangeRestaurantBaseInfor = (props: Prop) => {
  const {infor, setInfor} = props;
  const resID = useSelector(selectRestaurantID);

  const checkField = () => {
    const arr = [infor.Name, infor.Email, infor.Phone, infor.Introduction];
    return arr.every(item => item !== '');
  };

  const saveInfor = async () => {
    try {
      if (!checkField()) {
        throw new Error('Các trường không được để trống');
      }
      const body = {
        id: resID,
        name: infor.Name,
        email: infor.Email,
        phone: infor.Phone,
        intro: infor.Introduction,
      };
      const response = await AxiosInstance().post(
        'post-update-restaurant-baseInfor.php',
        body,
      );
      console.log(body);
      if (response.status) {
        showMessage({
          message: 'Cập nhật thông tin thành công',
          type: 'success',
        });
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Lỗi cập nhật thông tin',
        type: 'danger',
      });
    }
  };
  return (
    <View style={[screenStyles.container]}>
      <Input
        placeholder="Tên nhà hàng"
        value={infor.Name}
        onChange={text => {
          setInfor({field: 'Name', value: text});
        }}
      />

      <Input
        placeholder="Email"
        value={infor.Email}
        onChange={text => {
          setInfor({field: 'Email', value: text});
        }}
      />

      <Input
        placeholder="Số điện thoại"
        value={infor.Phone}
        type="numeric"
        onChange={text => {
          setInfor({field: 'Phone', value: text});
        }}
      />

      <TextArea
        placeholder="Giới thiệu"
        value={infor.Introduction}
        onChange={text => {
          setInfor({field: 'Introduction', value: text});
        }}
      />

      <View style={{flex: 1}} />

      <Fluid_btn
        title="Lưu"
        onPress={async () => {
          await saveInfor();
        }}
      />
    </View>
  );
};

export default ChangeRestaurantBaseInfor;
