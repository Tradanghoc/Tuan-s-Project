import {
  View,
  Dimensions,
  PermissionsAndroid,
  Image,
  Touchable,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useCallback, useMemo, useReducer, useRef, useState} from 'react';
import Avatar from '../../../assets/images/avatar.svg';
import FastFood from '../../../assets/images/fast-food.svg';
import {Colors} from '../../custom/styles/ScreenStyle';
import Input from '../../custom/textinput/Input';
import Fluid_btn from '../../custom/buttons/Fluid_btn';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icons, {IconName} from '../../../assets/icons/Icons';
import {showMessage} from 'react-native-flash-message';
import AxiosInstance from '../../../helpers/AxiosInstance';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ParamList} from '../../navigation/RootNavigation';
import {generateID} from '../app/Store/CreateRestaurant';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height * 0.4;

const avatarSize = width * 0.3;

/** Declaring state of reducer */

type RegisterState = {
  name: string;
  email: string;
  password: string;
  image: string;
  confirm: string;
};

type RegisterAction = {
  type: keyof RegisterState;
  payload: RegisterState[keyof RegisterState];
};

const initialState: RegisterState = {
  name: 'Anh Tuấn',
  email: 'anhtt676@gmail.com',
  password: '123456',
  image: '',
  confirm: '',
};

const reducer = (state: RegisterState, action: RegisterAction) => {
  return {...state, [action.type]: action.payload};
};

const Register = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation<NavigationProp<ParamList>>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['20%', '30%'], []);

  const openCamera = async () => {
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
        dispatch({type: 'image', payload: result.assets[0].uri});
      }
    }
  };

  const openLibrary = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
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
              dispatch({type: 'image', payload: uris[0]});
            }
          },
        );
      }
    } catch (err) {
      console.warn(err);
    }
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

  /** Start of register account for user */
  const createOTP = async () => {
    const {email} = state;
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
    const response = await AxiosInstance().post(
      '/post-send-register-email.php',
      {
        email,
        token: '757346',
        type: 'Đăng ký tài khoản',
      },
    );
    console.log(response);
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

  const registerAccount = async () => {
    const {name, email, password, confirm, image} = state;
    if (image.length === 0) {
      showMessage({
        message: 'Xin hãy chọn ảnh đại diện',
        type: 'danger',
        icon: 'warning',
      });
      return;
    }

    showMessage({
      message: 'Đang đăng ký tài khoản',
      type: 'info',
      icon: 'info',
    });
    if (!checkField(email, name, password, confirm)) return;
    const body = {
      name,
      email,
      token: confirm,
      password,
    };
    const response = await AxiosInstance().post('/register-user.php', body);
    if (response.status) {
      showMessage({
        message: 'Đăng ký thành công',
        type: 'success',
        icon: 'success',
      });
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
      const upload: any = await AxiosInstance().post('/insert-image.php', data);
      navigation.navigate('Login');
    } else {
      showMessage({
        message: response.statusText,
        type: 'danger',
        icon: 'warning',
      });
      console.log(response.statusText);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <FastFood width={width} height={height} />

        {state.image.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              handlePresentModalPress();
            }}
            style={{
              width: avatarSize,
              height: avatarSize,
              position: 'absolute',
              top: height - avatarSize / 1.5,
              left: width / 2 - avatarSize / 2,
              borderRadius: avatarSize / 2,
              borderWidth: 5,
              borderColor: Colors.ember,
              overflow: 'hidden',
            }}>
            <Image
              source={{uri: state.image}}
              style={{
                width: avatarSize,
                height: avatarSize,
              }}
            />
          </TouchableOpacity>
        ) : (
          <Avatar
            width={avatarSize}
            height={avatarSize}
            style={{
              position: 'absolute',
              top: height - avatarSize / 1.5,
              left: width / 2 - avatarSize / 2,
              borderRadius: avatarSize / 2,
              borderWidth: 5,
              borderColor: Colors.ember,
            }}
            onPress={() => {
              handlePresentModalPress();
            }}
          />
        )}

        <View
          style={{
            flex: 1,
            marginTop: 30,
            paddingTop: 20,
            paddingHorizontal: 20,
          }}>
          <Input
            placeholder="Tên của bạn"
            onChange={text => {
              dispatch({type: 'name', payload: text});
            }}
            value={state.name}
          />
          <Input
            placeholder="Email"
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
            placeholder="Mật khẩu"
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
            title="Đăng ký"
            onPress={() => {
              registerAccount();
            }}
          />
        </View>

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            style={{
              backgroundColor: Colors.white,
              elevation: 5,
              paddingHorizontal: 20,
            }}
            snapPoints={snapPoints}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 30,
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => {
                  handleCloseModalPress();
                  openCamera();
                }}>
                <Icons name={IconName.camera} size={30} color={Colors.ember} />
                <Text style={{fontSize: 20, color: Colors.ember}}>
                  Chụp ảnh
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => {
                  handleCloseModalPress();
                  openLibrary();
                }}>
                <Icons name={IconName.library} size={30} color={Colors.ember} />
                <Text style={{fontSize: 20, color: Colors.ember}}>
                  Chọn ảnh
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
  );
};

export default Register;
