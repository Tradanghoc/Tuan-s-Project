import {
  View,
  Dimensions,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import React, {useReducer} from 'react';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import EmptyFood from '../../../../assets/images/BlankFood.svg';
import Input from '../../../custom/textinput/Input';
import {fonts} from '../../../custom/styles/ComponentStyle';
import CheckBox from '@react-native-community/checkbox';
import {Dropdown} from 'react-native-element-dropdown';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import TextArea from '../../../custom/textinput/TextArea';

/** Declaring reducer state */

type InforState = {
  resID: string;
  name: string;
  description: string;
  timeMade: string;
  featureItem: boolean;
  price: number;
  status: string;
  discount: number;
};

type InforAction = {
  type: keyof InforState;
  payload: InforState[keyof InforState];
};

const handleReducer = (state: InforState, action: InforAction) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

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
  route: RouteProp<ParamList, 'CreateFood'>;
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CheckField = ([...array]) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].length == 0) {
      showMessage({
        message: 'Xin lỗi',
        description: 'Bạn chưa nhập đủ thông tin',
        type: 'warning',
        icon: 'warning',
      });
      return false;
    }
  }
  return true;
};

const createFood = async (infor: InforState, img: string[]) => {
  const check = CheckField([
    infor.name,
    infor.description,
    infor.timeMade,
    infor.price.toString(),
    infor.status,
    infor.discount.toString(),
  ]);
  if (!check) {
    return;
  }
  if (img.length == 0) {
    showMessage({
      message: 'Xin lỗi',
      description: 'Bạn chưa tải lên hình ảnh',
      type: 'warning',
      icon: 'warning',
    });
    return;
  }
  const body = {
    resID: infor.resID,
    name: infor.name,
    desc: infor.description,
    time: infor.timeMade,
    featured: infor.featureItem ? 1 : 0,
    price: infor.price,
    status: infor.status,
    disc: infor.discount,
    image: img,
  };

  const response = await AxiosInstance().post(
    '/post-create-food-for-restaurant.php',
    body,
  );
  if (response.status) {
    showMessage({
      message: 'Thành công',
      description: 'Bạn đã tạo món ăn thành công',
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
        ownerID: response.data 
      }
      const upload: any = await AxiosInstance().post('/insert-image.php', data);
      // console.log(upload)
    });
  } else {
    showMessage({
      message: 'Xin lỗi',
      description: 'Có lỗi xảy ra, vui lòng thử lại',
      type: 'warning',
      icon: 'warning',
    });
    // console.log(response);
  }
};

const CreateFood = (props: Prop) => {
  const id = props.route.params?.id;
  const initialState: InforState = {
    resID: id as string,
    name: 'Há cảo Tứ Xuyên',
    description: 'Món ăn ngon nhất từ xưa đến nay, không thể bỏ qua',
    timeMade: '00:10:39',
    featureItem: false,
    price: 20,
    status: 'Sale',
    discount: 30,
  };
  const navigation = useNavigation<NavigationProp<ParamList, 'CreateFood'>>();
  const [infor, setInfor] = useReducer(handleReducer, initialState);
  const [img, setImg] = React.useState<string[]>([]);

  /** Request camera permision */

  const requestCameraPermission = async () => {
    try {
      // console.log('take photo', img.length);
      if (img.length == 5) {
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

  return (
    <View style={[screenStyles.parent_container]}>
      <Text
        style={[fonts.captionBold, {marginVertical: 10, textAlign: 'center'}]}>
        {infor.name || 'Tạo món ăn'}
      </Text>
      <View style={{height: width - 150}}>
        <FlatList
          data={img}
          contentContainerStyle={{flexGrow: 0, justifyContent: 'center'}}
          horizontal
          snapToAlignment="center"
          decelerationRate={'normal'}
          pagingEnabled
          snapToInterval={width}
          disableIntervalMomentum={true}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyFood width={width} height={width - 100} />}
          renderItem={({item, index}) => {
            return (
              <Image
                key={index.toString()}
                source={{uri: item}}
                style={{
                  width: width,
                  height: 'auto',
                  resizeMode: 'contain',
                }}
              />
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

      <Input
        value={infor.name}
        placeholder="Tên món ăn"
        style={{marginTop: 10, marginHorizontal: 20}}
        onChange={text => setInfor({type: 'name', payload: text})}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Input
          value={infor.price ? infor.price.toString() : ''}
          type="numeric"
          placeholder={'Giá tiền'}
          style={{marginTop: 5, marginHorizontal: 20, flex: 1}}
          onChange={text => setInfor({type: 'price', payload: +text})}
        />
        <Input
          value={infor.discount ? infor.discount.toString() : ''}
          type="numeric"
          placeholder={infor.discount ? infor.discount.toString() : 'Giảm giá'}
          style={{marginTop: 5, marginHorizontal: 20, flex: 1}}
          onChange={text => setInfor({type: 'discount', payload: +text})}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 25,
          }}>
          <CheckBox
            value={infor.featureItem}
            onChange={() =>
              setInfor({type: 'featureItem', payload: !infor.featureItem})
            }
            tintColors={{true: Colors.orange, false: Colors.slate}}
          />
          <Text
            style={[fonts.textBold]}
            onPress={() =>
              setInfor({type: 'featureItem', payload: !infor.featureItem})
            }>
            Đặc sản
          </Text>
        </View>
      </View>

      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Input
          value={infor.timeMade}
          placeholder="hh:mm:ss"
          style={{marginTop: 5, marginHorizontal: 20, flex: 1}}
          onChange={text => setInfor({type: 'timeMade', payload: text})}
        />
        <Dropdown
          data={[
            {label: 'Mở bán', value: 'Sale'},
            {label: 'Tạm ngưng', value: 'Inactive'},
          ]}
          maxHeight={200}
          placeholder="Trạng thái"
          labelField={'label'}
          valueField={'value'}
          value={infor.status}
          onChange={text => setInfor({type: 'status', payload: text.value})}
          style={{
            height: 50,
            borderWidth: 1,
            borderColor: Colors.slate,
            marginTop: 5,
            padding: 10,
            borderRadius: 10,
            marginHorizontal: 20,
            flex: 1,
            backgroundColor: Colors.white,
          }}
        />
      </View>

      <View style={{paddingHorizontal: 20}}>
        <TextArea
          value={infor.description}
          placeholder="Mô tả"
          style={{marginTop: 5}}
          onChange={text => setInfor({type: 'description', payload: text})}
        />
        <Fluid_btn
          title="Lưu"
          onPress={() => {
            createFood(infor, img);
          }}
          style={{marginTop: 10}}
        />
      </View>
    </View>
  );
};

export default CreateFood;
