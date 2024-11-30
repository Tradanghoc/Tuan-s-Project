import {
  View,
  Text,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserID} from '../../../helpers/state/Global/globalSlice';
import AxiosInstance from '../../../helpers/AxiosInstance';
import {Colors, screenStyles} from '../../custom/styles/ScreenStyle';
import {fonts} from '../../custom/styles/ComponentStyle';
import AddressList from '../../custom/cards/AddressList';
import TitleList from '../../custom/cards/TitleList';
import Icons, {IconName} from '../../../assets/icons/Icons';
import {
  NavigationProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {ParamList} from '../../navigation/RootNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {showMessage} from 'react-native-flash-message';

/** Declaring type address response */
type AddressType = {
  Id: string;
  Address: string;
  City: string;
  District: string;
  Ward: string;
  Priority: string;
  OwnerID: string;
  Phone: string;
};
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const center = (Dimensions.get('window').width - 50) / 2;

const Address = () => {
  const isFocused = useIsFocused();
  const userID = useSelector(selectUserID);
  const [mainAddress, setMainAddress] = useState<AddressType[]>([]);
  const [otherAddress, setOtherAddress] = useState<AddressType[]>([]);
  const navigation = useNavigation<NavigationProp<ParamList>>();
  const [mainRefresh, setMainRefresh] = useState<boolean>(false);
  const [otherRefresh, setOtherRefresh] = useState<boolean>(false);

  /** Start of delete address */
  const deleteAddress = async (id: string) => {
    const response = await AxiosInstance().post('/post-delete-address.php', {
      addressID: id,
      status: 'Removed'
    });
    if (response.status) {
      getMainAddress(userID as string);
      getOtherAddress(userID as string);
      showMessage({
        message: 'Xóa địa chỉ thành công',
        type: 'success',
        icon: 'info',
      });
    } else {
      showMessage({
        message: 'Xóa địa chỉ thất bại',
        type: 'danger',
        icon: 'info',
      });
      console.log(response.statusText)
    }
  };

  /** Start of get main address */

  const getMainAddress = async (userID: string) => {
    const response = await AxiosInstance().post('/get-user-main-address.php', {
      id: userID,
    });
    if (response.status) {
      setMainAddress(response.data);
    }
  };

  const getOtherAddress = async (userID: string) => {
    const response = await AxiosInstance().post('/get-user-other-address.php', {
      id: userID,
    });
    if (response.status) {
      setOtherAddress(response.data);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getMainAddress(userID as string);
      getOtherAddress(userID as string);
    }
  }, [isFocused]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

        <View
          style={[
            screenStyles.container,
            {
              alignItems: 'center',
              paddingHorizontal: 20,
            },
          ]}>
          <TitleList
            barStyle={{backgroundColor: Colors.orange}}
            title="Địa chỉ chính của bạn"
          />

          <FlatList
            data={mainAddress}
            style={{height: height / 2}}
            refreshing={mainRefresh}
            onRefresh={() => {
              setMainRefresh(true);
              getMainAddress(userID as string);
              setMainRefresh(false);
            }}
            keyExtractor={item => item.Id}
            ListEmptyComponent={
              <Text style={[fonts.subline, {color: Colors.slate}]}>
                Xin lỗi nhưng chúng tôi không tìm địa chỉ chính của bạn
              </Text>
            }
            renderItem={({item}) => (
              <AddressList
                key={item.Id}
                onDel={() => {
                  deleteAddress(item.Id);
                }}
                onPress={() => {
                  navigation.navigate('AddressInfor', {
                    title: 'Chỉnh sửa địa chỉ',
                    id: item.Id,
                  });
                }}
                address={item.Address}
                detail={`${item.Ward}, ${item.District}, ${item.City}`}
              />
            )}
          />

          <TitleList
            barStyle={{backgroundColor: Colors.slate}}
            title="Địa chỉ khác"
          />

          <FlatList
            data={otherAddress}
            keyExtractor={item => item.Id}
            refreshing={otherRefresh}
            onRefresh={() => {
              setOtherRefresh(true);
              getOtherAddress(userID as string);
              setOtherRefresh(false);
            }}
            style={{height: height / 2}}
            ListEmptyComponent={
              <Text style={[fonts.subline, {color: Colors.slate}]}>
                Xin lỗi nhưng chúng tôi không tìm địa chỉ phụ của bạn
              </Text>
            }
            renderItem={({item}) => (
              <AddressList
                key={item.Id}
                onDel={() => {
                  deleteAddress(item.Id);
                }}
                onPress={() => {
                  navigation.navigate('AddressInfor', {
                    title: 'Chỉnh sửa địa chỉ',
                    id: item.Id,
                  });
                }}
                address={item.Address}
                detail={`${item.Ward}, ${item.District}, ${item.City}`}
              />
            )}
          />
        </View>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={Colors.ember}
          onPress={() => {
            navigation.navigate('AddressInfor', {title: 'Thêm địa chỉ'});
          }}
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: Colors.orange,
            position: 'absolute',
            bottom: 20,
            transform: [{translateX: center}],
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
          }}>
          <Icons name={IconName.add} size={20} color={Colors.white} />
        </TouchableHighlight>
      </View>
    </GestureHandlerRootView>
  );
};

export default Address;
