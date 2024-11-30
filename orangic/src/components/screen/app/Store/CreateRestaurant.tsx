import {
  View,
  Dimensions,
  PermissionsAndroid,
  TouchableHighlight,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useReducer, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectHost,
  selectUserID,
} from '../../../../helpers/state/Global/globalSlice';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import Input from '../../../custom/textinput/Input';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';
import TextArea from '../../../custom/textinput/TextArea';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import Shop from '../../../../assets/images/Shop.svg';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import {AppDispatch} from '../../../../helpers/state/store';
import {
  fetchRestaurantID,
  setRestaurantID,
} from '../../../../helpers/state/AppTab/storeSlice';
import Icons2, { Icon2Name } from '../../../../assets/icons/Icons2';

/** Start of declare reducer option */

type InforState = {
  name: string;
  introduction: string;
  email: string;
};

type InforAction = {
  field: keyof InforState;
  value: string;
};

function inforReducer(state: InforState, payload: InforAction) {
  return {
    ...state,
    [payload.field]: payload.value,
  };
}

const initialState = {
  name: 'Bà Mụa huyện nội',
  introduction: 'Quán ăn ấm cúng tại Hà Nội',
  email: 'banam@gmail.com',
};

export const generateID = (prefix: string) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = prefix;
  for (let i = 0; i < 17; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const CreateRestaurant = () => {
  const size = Dimensions.get('window').width;
  const [img, setImg] = useState<any[]>([]);
  const userID = useSelector(selectUserID);
  const navigation =
    useNavigation<NavigationProp<ParamList, 'CreateRestaurant'>>();

  const [infor, setInfor] = useReducer(inforReducer, initialState);
  const flashRef = useRef<FlashMessage | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  /** Request camera permision */

  const requestCameraPermission = async () => {
    try {
      // console.log('take photo', img.length);
      if (img.length == 5) {
        // How to cancel image picker
        showMessage({
          message: 'Xin lỗi',
          description: 'You can only upload 5 images',
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
          setImg([...img, result.assets[0].uri]);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestLibaryPermission = async () => {
    if (img.length == 5) {
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
              setImg([...img, ...uris]);
            }
          },
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  /** function for creating restaurant */

  const checkEmpry = () => {
    if (img.length < 1) {
      if (flashRef.current) {
        flashRef.current.showMessage({
          message: 'Xin lỗi',
          description: 'Người dùng cần ảnh để phân biệt bạn',
          type: 'warning',
          icon: 'warning',
        });
      }
      return false;
    }

    if (infor.name.length < 1) {
      if (flashRef.current) {
        flashRef.current.showMessage({
          message: 'Xin lỗi',
          description: 'Tên nhà hàng không được để trống',
          type: 'warning',
          icon: 'warning',
        });
      }
      return false;
    }
    if (infor.introduction.length < 1) {
      if (flashRef.current) {
        flashRef.current.showMessage({
          message: 'Xin lỗi',
          description: 'Giới thiệu nhà hàng không được để trống',
          type: 'warning',
          icon: 'warning',
        });
      }
      return false;
    }
    if (infor.email.length < 10) {
      if (flashRef.current) {
        flashRef.current.showMessage({
          message: 'Xin lỗi',
          description: 'Email phải có ít nhất 10 ký tự',
          type: 'warning',
          icon: 'warning',
        });
      }
      return false;
    }
    return true;
  };

  const createRestaurant = async () => {
    if (!checkEmpry()) return;
    const body = {
      userID,
      name: infor.name,
      intro: infor.introduction,
      email: infor.email,
    };

    console.log(body);

    const response = await AxiosInstance().post(
      'post-create-restaurant-for-user.php',
      body,
    );

    console.log(response);

    if (response.status) {
      await dispatch(fetchRestaurantID(userID));
      showMessage({
        message: 'Thành công',
        description: 'Nhà hàng của bạn đã được tạo',
        type: 'success',
        icon: 'success',
      });

      img.forEach(async image => {
        const formData = new FormData();
        const id = generateID('IMG');
        formData.append('image', {
          uri: image,
          name: `${id}.jpg`,
          type: 'image/jpg',
        });
        const result = await AxiosInstance('multipart/form-data').post(
          '/upload-file.php',
          formData,
        );
        const data = {
          id: id,
          ownerID: response.data,
        };
        const upload: any = await AxiosInstance().post(
          '/insert-image.php',
          data,
        );
      });
      navigation.navigate('Store');
    } else {
      showMessage({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra, vui lòng thử lại',
        type: 'danger',
        icon: 'danger',
      });
    }
  };

  return (
    <View style={screenStyles.parent_container}>
      <View style={{height: size - 100}}>
        <FlatList
          data={img}
          keyExtractor={item => item.toString()}
          contentContainerStyle={{flexGrow: 0, justifyContent: 'center'}}
          horizontal
          snapToAlignment="center"
          decelerationRate={'fast'}
          pagingEnabled
          snapToInterval={size}
          disableIntervalMomentum={true}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Shop width={size} height={size - 100} />}
          renderItem={({item}) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setImg(img.filter(i => i !== item));
                  }}
                  style={{
                    position: 'absolute',
                    top: 30,
                    right: 30,
                    width: 30,
                    height: 30,
                    backgroundColor: Colors.white,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icons2
                    name={Icon2Name.close}
                    color={Colors.orange}
                    size={20}
                  />
                </TouchableOpacity>
                <Image
                  source={{uri: item}}
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
          justifyContent: 'space-around',
          flexDirection: 'row',
          marginVertical: 30,
        }}>
        <TouchableHighlight
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.orange,
          }}
          activeOpacity={0.6}
          underlayColor={Colors.ember}
          onPress={() => requestCameraPermission()}>
          <Icons name={IconName.camera} color={Colors.white} size={20} />
        </TouchableHighlight>

        <TouchableHighlight
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.orange,
          }}
          activeOpacity={0.6}
          underlayColor={Colors.ember}
          onPress={() => requestLibaryPermission()}>
          <Icons name={IconName.library} color={Colors.white} size={20} />
        </TouchableHighlight>
      </View>

      <View style={{marginHorizontal: 20, flex: 1}}>
        <Input
          placeholder="Tên nhà hàng của bạn"
          onChange={text => {
            setInfor({field: 'name', value: text});
          }}
          value={infor.name}
        />

        <Input
          placeholder="Địa chỉ email của nhà hàng"
          onChange={text => {
            setInfor({field: 'email', value: text});
          }}
          value={infor.email}
        />

        <TextArea
          placeholder="Giới thiệu về nhà hàng của bạn"
          onChange={(text: string) => {
            setInfor({field: 'introduction', value: text});
          }}
          value={infor.introduction}
        />

        <Fluid_btn
          title="Tạo nhà hàng"
          style={{marginTop: 20}}
          onPress={createRestaurant}
        />
      </View>

      <FlashMessage ref={flashRef} position="top" />
    </View>
  );
};

export default CreateRestaurant;
