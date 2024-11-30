import {
  View,
  Text,
  Dimensions,
  PermissionsAndroid,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectHost,
} from '../../../../helpers/state/Global/globalSlice';
import {
  NavigationProp,
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {AppDispatch} from '../../../../helpers/state/store';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import {StatusBar} from 'react-native';
import Shop from '../../../../assets/images/Shop.svg';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ChangeRestaurantBaseInfor from './ChangeRestaurantBaseInfor';
import ChangeRestaurantAddressInfor from './ChangeRestaurantAddressInfor';
import {InforState} from './HasRestaurantScreen';
import {selectRestaurantID} from '../../../../helpers/state/AppTab/storeSlice';
import Icons2, {Icon2Name} from '../../../../assets/icons/Icons2';

/** Start of declare reducer option */

export type InforAction = {
  field: keyof InforState;
  value: InforState[keyof InforState];
};

function inforReducer(state: InforState, payload: InforAction) {
  return {
    ...state,
    [payload.field]: payload.value,
  };
}


const generateID = (prefix: string) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = prefix;
  for (let i = 0; i < 17; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

type Prop = {
  route: RouteProp<ParamList, 'ChangeRestaurantInfor'>;
};

const ChangeRestaurantInfor = (props: Prop) => {
  const infors = props.route.params?.infor as InforState;
  const size = Dimensions.get('window').width;
  const isFocused = useIsFocused();
  const [img, setImg] = useState<any[]>([]);
  const host = useSelector(selectHost);
  const resID = useSelector(selectRestaurantID);
  const navigation =
    useNavigation<NavigationProp<ParamList, 'CreateRestaurant'>>();
  const Tab = createMaterialTopTabNavigator();

  const [infor, setInfor] = useReducer(inforReducer, infors);
  const flashRef = useRef<FlashMessage | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const requestCameraPermission = async () => {
    try {
      // console.log('take photo', img.length);
      if (infor.Images.length == 5) {
        // How to cancel image picker
        showMessage({
          message: 'Xin lỗi',
          description: 'Bạn chỉ có thể tải lên 5 hình ảnh',
          type: 'warning',
          icon: 'warning',
        });
        return;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result: any = await launchCamera({
          mediaType: 'photo',
          cameraType: 'front',
        });

        if (result.didCancel) {
          console.log('User cancelled image picker');
        }

        // Kiểm tra nếu `result` không phải null và `result.assets` có ít nhất một phần tử
        if (result && result.assets && result.assets.length > 0) {
          const image = result.assets[0].uri;
          const formData = new FormData();
          const id = generateID('IMG');
          formData.append('image', {
            uri: image,
            name: `${id}.jpg`,
            type: 'image/jpg',
          });
          const outcome = await AxiosInstance('multipart/form-data').post(
            '/upload-file.php',
            formData,
          );
          const data = {
            id: id,
            ownerID: resID,
          };
          const upload: any = await AxiosInstance().post(
            '/insert-image.php',
            data,
          );

          setInfor({field: 'Images', value: [...infor.Images, {Id: id}]});
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestLibaryPermission = async () => {
    if (infor.Images.length == 5) {
      showMessage({
        message: 'Xin lỗi',
        description: 'You can only upload 5 images',
        type: 'warning',
        icon: 'warning',
      });
      return;
    }
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 5 - img.length,
    };
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result: any = launchImageLibrary(
          options,
          (response: ImagePickerResponse) => {
            if (response.didCancel || response.errorCode) {
              return;
            }
            // Process the selected images
            if (response && response.assets && response.assets.length > 0) {
              const uris: any[] = response.assets.map(asset => asset.uri);
              const formData = new FormData();
              uris.forEach((uri, index) => {
                const id = generateID('IMG');
                formData.append('image', {
                  uri: uri,
                  name: `${id}.jpg`,
                  type: 'image/jpg',
                });
                const data = {
                  id: id,
                  ownerID: resID,
                };
                AxiosInstance('multipart/form-data')
                  .post('/upload-file.php', formData)
                  .then(() => {
                    AxiosInstance().post('/insert-image.php', data);
                  });
                setInfor({field: 'Images', value: [...infor.Images, {Id: id}]});
              });
            }
          },
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const deleteImg = async (id: string) => {
    const newImg: {Id: string}[] = infor.Images.filter(item => {
      return item.Id != id;
    });

    const response = await AxiosInstance().post('/delete-file.php', {id});
    console.log(response);

    setInfor({field: 'Images', value: newImg});
  };

  return (
    <View style={[screenStyles.parent_container]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={{height: size - 150}}>
        <FlatList
          data={infor.Images}
          contentContainerStyle={{flexGrow: 0, justifyContent: 'center'}}
          horizontal
          snapToAlignment="center"
          decelerationRate={'fast'}
          pagingEnabled
          snapToInterval={size}
          disableIntervalMomentum={true}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Shop width={size} height={size - 150} />}
          renderItem={({item, index}) => {
            return (
              <View style={{width: size}}>
                <TouchableOpacity
                  onPress={() => deleteImg(item.Id)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icons2
                    name={Icon2Name.close}
                    size={20}
                    color={Colors.black}
                  />
                </TouchableOpacity>
                <Image
                  key={index}
                  source={{uri: `${host}/uploads/${item.Id}.jpg`}}
                  style={{
                    width: size,
                    height: 'auto',
                    resizeMode: 'contain',
                  }}
                />
              </View>
            );
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginVertical: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            requestCameraPermission();
          }}>
          <Icons name={IconName.camera} size={30} color={Colors.orange} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            requestLibaryPermission();
          }}>
          <Icons name={IconName.library} size={30} color={Colors.orange} />
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarLabel: ({focused, color}) => {
            let label;
            color = focused ? Colors.orange : Colors.slate;
            let nameIcon = '';
            if (route.name === 'Base Infor') {
              nameIcon = IconName.home;
              label = 'Thông tin liên lạc';
            } else if (route.name === 'Address Infor') {
              nameIcon = IconName.address;
              label = 'Địa chỉ';
            }

            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icons size={20} name={nameIcon} color={color} />
                <Text style={{color, marginLeft: 8}}>{label}</Text>
              </View>
            );
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors.orange,
          },
        })}>
        <Tab.Screen
          name="Base Infor">
            {props => <ChangeRestaurantBaseInfor setInfor={setInfor} infor={infor} {...props} />}
          </Tab.Screen>
        <Tab.Screen
          name="Address Infor">
            {props => <ChangeRestaurantAddressInfor setInfor={setInfor} infor={infor} {...props} />}
          </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default ChangeRestaurantInfor;
