import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectUserID} from '../../../helpers/state/Global/globalSlice';
import {Colors, screenStyles} from '../../custom/styles/ScreenStyle';
import Icons, {IconName} from '../../../assets/icons/Icons';
import {fonts} from '../../custom/styles/ComponentStyle';
import {
  NavigationProp,
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ParamList} from '../../navigation/RootNavigation';
import Input from '../../custom/textinput/Input';
import TextArea from '../../custom/textinput/TextArea';
import Fluid_btn from '../../custom/buttons/Fluid_btn';
import Icons2, {Icon2Name} from '../../../assets/icons/Icons2';
import {Image} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import AxiosInstance from '../../../helpers/AxiosInstance';
import {generateID} from './Store/CreateRestaurant';

type ReportType = {
  Title: string;
  Content: string;
  Author: string;
  TargetID: string;
  Status: string;
};

const checkField = (report: ReportType) => {
  console.log(report);
  const isFieldFilled = Object.values(report).every(value => {
    if (value === '') {
      showMessage({
        message: 'Xin lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        type: 'warning',
        icon: 'warning',
      });
      return false;
    }
    return true;
  });
  return isFieldFilled;
};

const {width} = Dimensions.get('window');
const Report = () => {
  const userID = useSelector(selectUserID);
  const navigation = useNavigation<NavigationProp<ParamList, 'Report'>>();
  const route = useRoute<RouteProp<ParamList, 'Report'>>();
  const title = route.params?.title;
  const id = route.params?.id;
  const isFocused = useIsFocused();

  useEffect(()=>{
    if(!isFocused){
      setReport(initialReport);
      setImage('');
    }
  },[isFocused])

  const initialReport: ReportType = {
    Title: '',
    Content: '',
    Author: userID as string,
    TargetID: id as string,
    Status: 'Waiting',
  };

  const [report, setReport] = useState<ReportType>(initialReport);
  const [image, setImage] = useState<string>('');

  const requestCameraPermission = async () => {
    try {
      // console.log('take photo', img.length);
      if (image.length == 1) {
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
          console.log(result.assets[0].uri);
          setImage(result.assets[0].uri);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestLibaryPermission = async () => {
    if (image.length == 1) {
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
              setImage(uris[0]);
            }
          },
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const uploadImage = async (reportID: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      const id = generateID('IMG');
      const result = await AxiosInstance('multipart/form-data').post(
        '/upload-file.php',
        formData,
      );
      
      const body = {
        id: id,
        ownerID: reportID,
      }
      await AxiosInstance().post('/insert-image.php', body);
      await AxiosInstance().post('/post-update-report.php', body);
    } catch (error) {
      console.log(error);
    }
  };

  const createReport = async () => {
    if (!checkField(report)) return;
    const body = {
      title: report.Title,
      content: report.Content,
      author: userID,
      targetID: id,
      status: report.Status,
    };
    const respsonse = await AxiosInstance().post(
      '/post-create-report.php',
      body,
    );
    console.log(respsonse)
    if (respsonse.status && image.length > 0) {
        uploadImage(respsonse.data);
    }
  };

  return (
    <View style={[screenStyles.container, {alignContent: 'center'}]}>
      <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 10,
            backgroundColor: Colors.white,
            elevation: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icons name={IconName.back} size={18} color={Colors.orange} />
        </TouchableOpacity>

        <Text style={[fonts.captionBold]}>{title}</Text>

        <View style={{width: 45}} />
      </View>
      <Text style={[fonts.text, {textAlign: 'center', marginBottom: 20}]}>
        <Text style={[fonts.textBold, {color: 'red'}]}>*</Text>
        Xin vui lòng điền đầy đủ thông tin và nơi kiểm tra hoạt động bị báo cáo
        trong nội dung báo cáo
      </Text>

      <View style={{width: width - 40, height: 200}}>
        {image && (
          <TouchableOpacity
            onPress={() => {
              setImage('');
            }}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: Colors.white,
              elevation: 5,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 10,
              zIndex: 1,
              right: 10,
            }}>
            <Icons2 name={Icon2Name.close} size={14} color={Colors.orange} />
          </TouchableOpacity>
        )}
        <Image
          source={
            image
              ? {uri: image}
              : require('../../../assets/images/baseImage.png')
          }
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={requestCameraPermission}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: Colors.white,
              elevation: 5,
              alignItems: 'center',
              justifyContent: 'center',
              margin: 5,
            }}>
            <Icons name={IconName.camera} size={14} color={Colors.orange} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={requestLibaryPermission}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: Colors.white,
              elevation: 5,
              alignItems: 'center',
              justifyContent: 'center',
              margin: 5,
            }}>
            <Icons name={IconName.library} size={14} color={Colors.orange} />
          </TouchableOpacity>
        </View>
      </View>

      <Input
        style={{marginTop: 30}}
        placeholder={'Tiêu đề'}
        value={report.Title}
        onChange={text => setReport({...report, Title: text})}
      />

      <TextArea
        placeholder={'Nội dung'}
        value={report.Content}
        onChange={text => setReport({...report, Content: text})}
      />

      <View style={{flex: 1}} />

      <Fluid_btn
        title="Gửi báo cáo"
        onPress={() => {
          createReport();
        }}
      />
    </View>
  );
};

export default Report;
