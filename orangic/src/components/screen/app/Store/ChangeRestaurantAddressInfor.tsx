import {View, Text} from 'react-native';
import React, {useMemo, useState} from 'react';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import Input from '../../../custom/textinput/Input';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectCityFocus,
  selectDistrictFocus,
  selectWardFocus,
} from '../../../../helpers/state/AppTab/addressSlice';
import Location from '../../../custom/data/location.json';
import {Modal} from 'react-native';
import WaitingModal from '../../../custom/ui/WaitingModal';
import {Dropdown} from 'react-native-element-dropdown';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import {InforState} from './HasRestaurantScreen';
import {InforAction} from './ChangeRestaurantInfor';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {selectRestaurantID} from '../../../../helpers/state/AppTab/storeSlice';
import {showMessage} from 'react-native-flash-message';

type Prop = {
  infor: InforState;
  setInfor: React.Dispatch<InforAction>;
};

const ChangeRestaurantAddressInfor = (props: Prop) => {
  const {infor, setInfor} = props;
  const [wait, setWait] = useState(false);
  const resID = useSelector(selectRestaurantID);
  const dispatch = useDispatch();

  const cityFocus = useSelector(selectCityFocus);
  const districtFocus = useSelector(selectDistrictFocus);
  const wardFocus = useSelector(selectWardFocus);

  const cityList = useMemo(() => {
    return Location.data.map((item: {name: string}) => ({name: item.name}));
  }, []);
  const cityIndex = useMemo(() => {
    if (!infor.City) return 0;
    return Location.data.findIndex(
      (item: {name: string}) => item.name === infor.City,
    );
  }, [infor.City]);

  const districtList = useMemo(() => {
    return Location.data[cityIndex || 0].level2s.map(
      (item: {name: string}) => ({
        name: item.name,
      }),
    );
  }, [cityIndex]);
  const districtIndex = useMemo(() => {
    if (!infor.District) return 0;
    return Location.data[cityIndex].level2s.findIndex(
      (item: {name: string}) => item.name === infor.District,
    );
  }, [infor.District]);

  const wardList = useMemo(() => {
    return Location.data[cityIndex].level2s[districtIndex].level3s.map(
      (item: {name: string}) => ({name: item.name}),
    );
  }, [cityIndex, districtIndex]);

  const checkField = (infor: InforState) => {
    const arr = [infor.Address, infor.City, infor.District, infor.Ward]
    return Array.from(arr).some((item) => item === '');
  };

  const updateInfor = async () => {
    try {
      console.log('checkField result:', checkField(infor));
      if (checkField(infor)) {
        console.log("met")
        throw new Error('Vui lòng nhập đầy đủ thông tin');
      }
      setWait(true);
      const body = {
        id: resID,
        address: infor.Address,
        city: infor.City,
        district: infor.District,
        ward: infor.Ward,
      };
      const response = await AxiosInstance().post(
        '/post-update-restaurant-addressInfor.php',
        body,
      );
      if (response.status) {
        showMessage({
          message: 'Thành công',
          description: 'Cập nhật thông tin thành công',
          type: 'success',
        });
      } else {
        showMessage({
          message: 'Thất bại',
          description: 'Cập nhật thông tin thất bại',
          type: 'danger',
        });
      }
      setWait(false);
    } catch (error) {
      setWait(false);
      showMessage({
        message: 'Thất bại',
        description: "Vui lòng kiểm tra lại thông tin",
        type: 'danger',
      });
    }
  };

  return (
    <View style={[screenStyles.container]}>
      <Input
        placeholder="Địa chỉ"
        value={infor.Address as string}
        onChange={(text) => {
          setInfor({field: 'Address', value: text});
        }}
      />

      <Dropdown
        style={[
          {
            height: 50,
            borderColor: 'gray',
            marginBottom: 10,
            borderWidth: 0.5,
            borderRadius: 8,
            paddingHorizontal: 8,
            backgroundColor: Colors.white,
            paddingRight: 20,
          },
        ]}
        placeholderStyle={{fontSize: 16}}
        selectedTextStyle={{fontSize: 16}}
        iconStyle={{width: 20, height: 20}}
        data={cityList}
        search
        maxHeight={240}
        labelField="name"
        valueField="name"
        placeholder={!cityFocus ? 'Chọn Tỉnh/Thành phố' : '...'}
        searchPlaceholder="Search..."
        value={infor.City}
        onFocus={() => dispatch({type: 'cityFocus', payload: true})}
        onBlur={() => dispatch({type: 'cityFocus', payload: false})}
        onChange={async item => {
          setInfor({field: 'City', value: item.name});
        }}
        iconColor={Colors.orange}
        renderRightIcon={() => (
          <Icons
            color={cityFocus ? Colors.orange : Colors.slate}
            name={IconName.delivery}
            size={20}
          />
        )}
      />

      <Dropdown
        style={[
          {
            height: 50,
            borderColor: 'gray',
            borderWidth: 0.5,
            marginBottom: 10,
            borderRadius: 8,
            paddingHorizontal: 8,
            backgroundColor: Colors.white,
            paddingRight: 20,
          },
        ]}
        placeholderStyle={{fontSize: 16}}
        selectedTextStyle={{fontSize: 16}}
        iconStyle={{width: 20, height: 20}}
        data={districtList}
        search
        maxHeight={180}
        labelField="name"
        valueField="name"
        placeholder={!districtFocus ? 'Chọn Quận/Huyện' : '...'}
        searchPlaceholder="Search..."
        value={infor.District}
        onFocus={() => dispatch({type: 'districtFocus', payload: true})}
        onBlur={() => dispatch({type: 'districtFocus', payload: false})}
        onChange={async item => {
          setInfor({field: 'District', value: item.name});
        }}
        iconColor={Colors.orange}
        renderRightIcon={() => (
          <Icons
            color={cityFocus ? Colors.orange : Colors.slate}
            name={IconName.delivery}
            size={20}
          />
        )}
      />

      <Dropdown
        style={[
          {
            height: 50,
            borderColor: 'gray',
            borderWidth: 0.5,
            marginBottom: 10,
            borderRadius: 8,
            paddingHorizontal: 8,
            backgroundColor: Colors.white,
            paddingRight: 20,
          },
        ]}
        placeholderStyle={{fontSize: 16}}
        selectedTextStyle={{fontSize: 16}}
        iconStyle={{width: 20, height: 20}}
        data={wardList}
        search
        maxHeight={230}
        dropdownPosition="top"
        labelField="name"
        valueField="name"
        placeholder={!wardFocus ? 'Chọn Phường/Xã' : '...'}
        searchPlaceholder="Search..."
        value={infor.Ward}
        onFocus={() => dispatch({type: 'wardFocus', payload: true})}
        onBlur={() => dispatch({type: 'wardFocus', payload: false})}
        onChange={async item => {
          setInfor({field: 'Ward', value: item.name});
        }}
        iconColor={Colors.orange}
        renderRightIcon={() => (
          <Icons
            color={cityFocus ? Colors.orange : Colors.slate}
            name={IconName.delivery}
            size={20}
          />
        )}
      />

      <View style={{flex: 1}} />
      <Fluid_btn
        title="Lưu"
        onPress={async () => {
          await updateInfor();
        }}
      />
    </View>
  );
};

export default ChangeRestaurantAddressInfor;
