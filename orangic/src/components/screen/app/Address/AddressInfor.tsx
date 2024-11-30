import {View, Text, TouchableOpacity, Modal, BackHandler} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserID} from '../../../../helpers/state/Global/globalSlice';
import {
  createAddress,
  selectCity,
  selectCityFocus,
  selectDistrict,
  selectDistrictFocus,
  selectWard,
  selectWardFocus,
  setCity,
  setCityFocus,
  setDistrict,
  setWard,
} from '../../../../helpers/state/AppTab/addressSlice';
import {AppDispatch} from '../../../../helpers/state/store';
import {showMessage} from 'react-native-flash-message';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import {fonts} from '../../../custom/styles/ComponentStyle';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';
import CheckBox from '@react-native-community/checkbox';
import Input from '../../../custom/textinput/Input';
import {Dropdown} from 'react-native-element-dropdown';
import Location from '../../../../components/custom/data/location.json';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import WaitingModal from '../../../custom/ui/WaitingModal';
import AxiosInstance from '../../../../helpers/AxiosInstance';

type Route = RouteProp<ParamList, 'AddressInfor'>;

type Props = {
  route: Route;
};

const AddressInfor = (props: Props) => {
  const {route} = props;
  const title = route.params?.title;
  const id = route.params?.id;
  const navigation = useNavigation<NavigationProp<ParamList, 'AddressInfor'>>();

  const userID = useSelector(selectUserID);
  const [wait, setWait] = useState(false);
  const [address, setAddress] = useState('505/911 Đường Láng');
  const [phone, setPhone] = useState('0801959165');
  const [priority, setPriority] = useState(false);
  const [goON, setGoOn] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  /** Get state from redux */
  const city = useSelector(selectCity);
  const district = useSelector(selectDistrict);
  const ward = useSelector(selectWard);

  const cityFocus = useSelector(selectCityFocus);
  const districtFocus = useSelector(selectDistrictFocus);
  const wardFocus = useSelector(selectWardFocus);

  async function getAddress() {
    const response = await AxiosInstance().post('/get-user-address.php', {
      id,
      userID,
    });
    if (response.status) {
      const data = response.data;
      setAddress(data.Address);
      setPhone(data.Phone);
      dispatch(setCity(data.City));
      dispatch(setDistrict(data.District));
      dispatch(setWard(data.Ward));
      // console.log(data.Priority === 1);
      setPriority(data.Priority === 1);
    }
  }

  useEffect(() => {
    if (id) {
      getAddress();
    }
  },[id]);

  useEffect(() => {
    const backAction = () => {
      navigation.setParams({id: undefined});
      navigation.goBack();
      return true;
    };
    const backHandle = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
  }, []);

  const cityList = useMemo(() => {
    return Location.data.map((item: {name: string}) => ({name: item.name}));
  }, []);
  const cityIndex = useMemo(() => {
    if (!city) return 0;
    return Location.data.findIndex(
      (item: {name: string}) => item.name === city,
    );
  }, [city]);

  const districtList = useMemo(() => {
    return Location.data[cityIndex || 0].level2s.map(
      (item: {name: string}) => ({
        name: item.name,
      }),
    );
  }, [cityIndex]);
  const districtIndex = useMemo(() => {
    if (!district) return 0;
    return Location.data[cityIndex].level2s.findIndex(
      (item: {name: string}) => item.name === district,
    );
  }, [district]);

  const wardList = useMemo(() => {
    return Location.data[cityIndex].level2s[districtIndex].level3s.map(
      (item: {name: string}) => ({name: item.name}),
    );
  }, [cityIndex, districtIndex]);

  const checkField = ([...array]) => {
    if (array.some(item => item === '')) return false;
    return true;
  };

  const addAddress = async () => {
    if (checkField([address, city, district, ward, phone])) {
      setWait(true);
      const body = {
        userID,
        phone,
        address,
        city,
        district,
        ward,
        priority: priority ? '1' : '0',
      };
      await dispatch(createAddress(body));
      setWait(false);
      setGoOn(true);
    } else {
      showMessage({
        message: 'Thông báo',
        description: 'Vui lòng điền đầy đủ thông tin',
        type: 'warning',
        icon: 'warning',
      });
    }
  };

  const changeAddress = async () => {
    const body = {
      id,
      userID,
      phone,
      address,
      city,
      district,
      ward,
      priority: priority ? '1' : '0',
    };
    if (checkField([address, city, district, ward, phone])) {
      const response = await AxiosInstance().post(
        '/post-change-user-address.php',
        body,
      );
      if (response.status) {
        showMessage({
          message: 'Thông báo',
          description: 'Địa chỉ đã được thay đổi',
          type: 'success',
          icon: 'success',
        });
        navigation.goBack();
      } else {
        showMessage({
          message: 'Thông báo',
          description: 'Đã có lỗi xảy ra',
          type: 'danger',
          icon: 'danger',
        });
        // console.log(response)
      }
    } else {
      showMessage({
        message: 'Thông báo',
        description: 'Vui lòng điền đầy đủ thông tin',
        type: 'warning',
        icon: 'warning',
      });
    }
  };

  const WaitModal = () => {
    return (
      <Modal animationType="slide" transparent visible={wait}>
        <WaitingModal />
      </Modal>
    );
  };

  const ContinueModal = () => {
    return (
      <Modal animationType="fade" visible={goON} transparent>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 320,
              height: 200,
              backgroundColor: Colors.white,
              elevation: 5,
              justifyContent: 'space-around',
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <Icons name={IconName.infor} size={50} color={Colors.blue} />
            <Text style={[fonts.captionBold]}>Địa chỉ đã được thêm</Text>
            <View
              style={{
                width: '100%',
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.green,
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  borderRadius: 20,
                }}
                onPress={() => {
                  setAddress('');
                  setPhone('');
                  dispatch(setCity(''));
                  dispatch(setDistrict(''));
                  dispatch(setWard(''));
                  setPriority(false);
                  setGoOn(false);
                }}>
                <Text style={[fonts.subline, {color: Colors.white}]}>
                  Còn nữa không ?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.slate,
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  borderRadius: 20,
                }}
                onPress={() => {
                  setAddress('');
                  setPhone('');
                  dispatch(setCity(''));
                  dispatch(setDistrict(''));
                  dispatch(setWard(''));
                  setPriority(false);
                  setGoOn(false);
                  navigation.navigate('Address');
                }}>
                <Text style={[fonts.subline, {color: Colors.white}]}>
                  Trở về
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <View style={screenStyles.container}>
      <Text style={[fonts.titleBold, {textAlign: 'center'}]}>
        {title || 'Address Infor'}
      </Text>
      <View style={{flex: 1, marginTop: 20}}>
        <Input
          placeholder="Nhập địa chỉ"
          value={address}
          onChange={text => {
            setAddress(text);
          }}
        />

        <ContinueModal />
        <WaitModal />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Input
            placeholder="Số điện thoại"
            value={phone}
            style={{flex: 1}}
            onChange={text => {
              setPhone(text);
            }}
          />
          <CheckBox
            value={priority}
            onValueChange={setPriority}
            tintColors={{true: Colors.orange, false: Colors.slate}}
            style={{width: 20, height: 20, marginHorizontal: 20}}
          />
          <Text
            style={[fonts.subline, {color: Colors.slate}]}
            onPress={() => setPriority(!priority)}>
            Địa chỉ mặc định
          </Text>
        </View>

        <Dropdown
          style={[
            {
              height: 50,
              borderColor: 'gray',
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
          maxHeight={300}
          labelField="name"
          valueField="name"
          placeholder={!cityFocus ? 'Chọn Tỉnh/Thành phố' : '...'}
          searchPlaceholder="Search..."
          value={city}
          onFocus={() => dispatch({type: 'cityFocus', payload: true})}
          onBlur={() => dispatch({type: 'cityFocus', payload: false})}
          onChange={async item => {
            dispatch(dispatch(setCity(item.name)));
            dispatch(setCityFocus(false));
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
              borderRadius: 8,
              marginVertical: 10,
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
          maxHeight={300}
          labelField="name"
          valueField="name"
          placeholder={!districtFocus ? 'Chọn Quận/Tỉnh' : '...'}
          searchPlaceholder="Search..."
          value={district}
          onFocus={() => dispatch({type: 'districtFocus', payload: true})}
          onBlur={() => dispatch({type: 'districtFocus', payload: false})}
          onChange={item => {
            dispatch(dispatch(setDistrict(item.name)));
            dispatch({type: 'districtFocus', payload: false});
            // console.log(item.name);
          }}
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
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingRight: 20,
              backgroundColor: Colors.white,
            },
          ]}
          placeholderStyle={{fontSize: 16}}
          selectedTextStyle={{fontSize: 16}}
          iconStyle={{width: 20, height: 20}}
          data={wardList}
          search
          maxHeight={280}
          labelField="name"
          valueField="name"
          placeholder={!wardFocus ? 'Chọn Phường/Xã' : '...'}
          searchPlaceholder="Search..."
          value={ward}
          onFocus={() => dispatch({type: 'wardFocus', payload: true})}
          onBlur={() => dispatch({type: 'wardFocus', payload: false})}
          onChange={item => {
            dispatch(setWard(item.name));
            dispatch({type: 'wardFocus', payload: false});
          }}
          renderRightIcon={() => (
            <Icons
              color={cityFocus ? Colors.orange : Colors.slate}
              name={IconName.delivery}
              size={20}
            />
          )}
        />
      </View>
      <Fluid_btn
        title="Lưu"
        onPress={() => {
          !id ? addAddress() : changeAddress();
        }}
        style={{marginTop: 20, position: 'relative', bottom: 30}}
      />
    </View>
  );
};

export default AddressInfor;
