import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  TextInput,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
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
import {Image} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AxiosInstance from '../../../helpers/AxiosInstance';
import Empty from './../../../assets/images/BlankFood.svg';
import {useSelector} from 'react-redux';
import {selectHost} from '../../../helpers/state/Global/globalSlice';
import TextArea from '../../custom/textinput/TextArea';
import Fluid_btn from '../../custom/buttons/Fluid_btn';
import {BarChart, PieChart} from 'react-native-chart-kit';
import {Dropdown} from 'react-native-element-dropdown';
import Icons2, {Icon2Name} from '../../../assets/icons/Icons2';
import {showMessage} from 'react-native-flash-message';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {generateID} from './Store/CreateRestaurant';

type FoodStatistics = {
  Infor: {
    Id: string;
    Name: string;
    Description: string;
    TimeMade: string;
    CreateAt: string;
    FeatureItem: number;
    Price: number;
    Status: string;
    Discount: number;
    RestaurantID: string;
    UpdateAt: string;
    Image: string[];
  };
  OrderStatistic: {
    TotalOrders: number;
    CancelOrders: number;
    CompletedOrders: number;
    PendingOrders: number;
  };
  MonthRevenue: number;
  PreMonthRevenue: number;
  YearRevenue: number;
  PreYearRevenue: number;
};

type UpdateFood = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  feature: number;
  status: string;
  timeMade: string;
};

const initialInfor: FoodStatistics = {
  Infor: {
    Id: '',
    Name: '',
    Description: '',
    TimeMade: '',
    CreateAt: '',
    FeatureItem: 0,
    Price: 0,
    Status: '',
    Discount: 0,
    RestaurantID: '',
    UpdateAt: '',
    Image: [],
  },
  OrderStatistic: {
    TotalOrders: 0,
    CancelOrders: 0,
    CompletedOrders: 0,
    PendingOrders: 0,
  },
  MonthRevenue: 0,
  PreMonthRevenue: 0,
  YearRevenue: 0,
  PreYearRevenue: 0,
};

const {width, height} = Dimensions.get('window');
const SS_FoodDetail = () => {
  const naviagtion = useNavigation<NavigationProp<ParamList>>();
  const route = useRoute<RouteProp<ParamList, 'SS_FoodDetail'>>();
  const host = useSelector(selectHost);
  const isFocused = useIsFocused();
  const [statistics, setStatistics] =
    React.useState<FoodStatistics>(initialInfor);

  const getFoodStatistics = async () => {
    const response = await AxiosInstance().post('/get-food-statistics.php', {
      id: route.params?.id,
    });
    console.log('get food statistics', response.data);
    setStatistics(response.data);
  };

  React.useEffect(() => {
    getFoodStatistics();
  }, [isFocused]);

  const updateFood = async (data: UpdateFood) => {
    const response = await AxiosInstance().post(
      '/post-update-food-infor.php',
      data,
    );
    console.log('update food', response.data);
  };

  const requestCameraPermission = async () => {
    try {
      console.log("Why")
      if (statistics.Infor.Image.length == 5) {
        console.log("Dont")
        showMessage({
          message: 'Xin lỗi',
          description: 'Bạn chỉ có thể tải lên 5 hình ảnh',
          type: 'warning',
          icon: 'warning',
        });
        console.log("You")
        return;
      }
      console.log("run")

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      console.log("like")
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("i")
        const result: any = await launchCamera({
          mediaType: 'photo',
          cameraType: 'front',
        });
        console.log("expected")

        if (result.didCancel) {
          console.log('User cancelled image picker');
        }

        // Kiểm tra nếu `result` không phải null và `result.assets` có ít nhất một phần tử
        if (result && result.assets && result.assets.length > 0) {
          console.log("you")
          const image = result.assets[0];
          const formData = new FormData();
          const id = generateID('IMG');
          formData.append('image', {
            uri: image.uri,
            name: `${id}.jpg`,
            type: 'image/jpg',
          });
          console.log("image", image)
          console.log("to")
          const data = {
            id: id,
            ownerID: statistics.Infor.Id,
          };
          await AxiosInstance('multipart/form-data')
                  .post('/upload-file.php', formData)
                  .then(() => {
                    AxiosInstance().post('/insert-image.php', data);
                  });
          console.log("?")

          setStatistics({
            ...statistics,
            Infor: {
              ...statistics.Infor,
              Image: [...statistics.Infor.Image, id],
            },
          });
          console.log("answer me")
        }
      }
    } catch (err) {
      console.warn("Loi:",err);
    }
  };

  const requestLibaryPermission = async () => {
    if (statistics.Infor.Image.length == 5) {
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
      selectionLimit: 5 - statistics.Infor.Image.length,
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
                  ownerID: statistics.Infor.Id,
                };
                AxiosInstance('multipart/form-data')
                  .post('/upload-file.php', formData)
                  .then(() => {
                    AxiosInstance().post('/insert-image.php', data);
                  });
                setStatistics({
                  ...statistics,
                  Infor: {
                    ...statistics.Infor,
                    Image: [...statistics.Infor.Image, id],
                  },
                });
              });
            }
          },
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const removeImage = async (id: string) => {
    const newImg: string[] = statistics.Infor.Image.filter(item => {
      return item!= id;
    });

    const response = await AxiosInstance().post('/delete-file.php', {id});
    console.log(response);

    setStatistics({...statistics, Infor: {...statistics.Infor, Image: newImg}});
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
            naviagtion.navigate('Store');
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

        <Text style={[fonts.captionBold]}>Thông tin món ăn</Text>

        <View style={{width: 45}} />
      </View>

      <View>
        <FlatList
          data={statistics.Infor.Image}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => <Empty width={width - 40} height={200} />}
          pagingEnabled
          snapToAlignment="center"
          snapToInterval={width - 40}
          disableIntervalMomentum={true}
          renderItem={({item}) => {
            return (
              <View style={{width: width - 40, height: 200}}>
                <TouchableOpacity
                  onPress={() => {
                    removeImage(item);
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
                  <Icons2
                    name={Icon2Name.close}
                    size={14}
                    color={Colors.orange}
                  />
                </TouchableOpacity>
                <Image
                  source={{uri: `${host}/uploads/${item}.jpg`}}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    marginBottom: 20,
                  }}
                />
              </View>
            );
          }}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: '100%',
            padding: 20,
            backgroundColor: Colors.white,
            borderRadius: 10,
            elevation: 5,
          }}>
          <TextInput
            style={[
              fonts.captionBold,
              {
                textAlign: 'center',
                borderWidth: 1,
                borderRadius: 5,
              },
            ]}
            value={statistics.Infor.Name}
            onChangeText={text => {
              setStatistics({
                ...statistics,
                Infor: {...statistics.Infor, Name: text},
              });
            }}
          />

          <TextArea
            value={statistics.Infor.Description}
            onChange={text => {
              setStatistics({
                ...statistics,
                Infor: {...statistics.Infor, Description: text},
              });
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              alignItems: 'center',
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                }}>
                <Text style={[fonts.captionBold]}>Giá: </Text>

                <TextInput
                  style={[
                    fonts.captionBold,
                    {
                      width: 100,
                      height: 40,
                      padding: 0,
                      textAlign: 'center',
                      borderWidth: 1,
                      borderRadius: 5,
                    },
                  ]}
                  value={statistics.Infor.Price.toString()}
                  onChangeText={text => {
                    setStatistics({
                      ...statistics,
                      Infor: {...statistics.Infor, Price: parseInt(text)},
                    });
                  }}
                  keyboardType="numeric"
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                }}>
                <Text style={[fonts.caption, {marginTop: 15}]}>Tạo ngày: </Text>

                <Text style={[fonts.caption, {marginTop: 15}]}>
                  {statistics.Infor.CreateAt.slice(0, 10)}
                </Text>
              </View>
            </View>

            <View style={{alignItems: 'flex-end'}}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                }}>
                <Text style={[fonts.captionBold]}>Giảm: </Text>

                <TextInput
                  style={[
                    fonts.captionBold,
                    {
                      width: 60,
                      height: 40,
                      padding: 0,
                      textAlign: 'center',
                      borderWidth: 1,
                      borderRadius: 5,
                    },
                  ]}
                  value={statistics.Infor.Discount.toString()}
                  onChangeText={text => {
                    setStatistics({
                      ...statistics,
                      Infor: {...statistics.Infor, Discount: parseInt(text)},
                    });
                  }}
                  keyboardType="numeric"
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                }}>
                <Text style={[fonts.caption, {marginTop: 10}]}>Đặc sản</Text>
                <CheckBox
                  value={statistics.Infor.FeatureItem === 1}
                  style={{marginTop: 10}}
                  tintColors={{true: Colors.orange, false: Colors.silver}}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Dropdown
              data={[
                {label: 'Ngừng bán', value: 'InActive'},
                {label: 'Xóa món ăn', value: 'Removed'},
                {label: 'Đang bán', value: 'Sale'},
              ]}
              dropdownPosition="top"
              value={statistics.Infor.Status}
              style={{
                width: 200,
                marginTop: 20,
                borderRadius: 5,
                borderWidth: 1,
                padding: 5,
              }}
              labelField={'label'}
              valueField={'value'}
              onChange={value => {
                setStatistics({
                  ...statistics,
                  Infor: {...statistics.Infor, Status: value.value},
                });
              }}
            />

            <TextInput
              style={[
                fonts.caption,
                {
                  width: 100,
                  height: 40,
                  padding: 0,
                  marginTop: 20,
                  textAlign: 'center',
                  borderWidth: 1,
                  borderRadius: 5,
                },
              ]}
              value={statistics.Infor.TimeMade}
              onChangeText={text => {
                setStatistics({
                  ...statistics,
                  Infor: {...statistics.Infor, TimeMade: text},
                });
              }}
            />
          </View>

          <Fluid_btn
            title="Cập nhật"
            style={{marginTop: 20}}
            onPress={() => {
              updateFood({
                id: statistics.Infor.Id,
                name: statistics.Infor.Name,
                description: statistics.Infor.Description,
                price: statistics.Infor.Price,
                discount: statistics.Infor.Discount,
                feature: statistics.Infor.FeatureItem,
                status: statistics.Infor.Status,
                timeMade: statistics.Infor.TimeMade,
              });
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            elevation: 5,
            alignItems: 'center',
            marginVertical: 15,
          }}>
          <PieChart
            data={[
              {
                name: 'Đã hủy',
                population: statistics.OrderStatistic.CancelOrders,
                color: Colors.orange,
                legendFontColor: Colors.black,
                legendFontSize: 13,
              },
              {
                name: 'Đang chờ',
                population: statistics.OrderStatistic.PendingOrders,
                color: Colors.blue,
                legendFontColor: Colors.black,
                legendFontSize: 13,
              },
              {
                name: 'Hoàn thành',
                population: statistics.OrderStatistic.CompletedOrders,
                color: Colors.green,
                legendFontColor: Colors.black,
                legendFontSize: 13,
              },
            ]}
            width={width - 40}
            height={250}
            xAxisLabel="Trạng thái đơn hàng"
            style={{marginTop: 20, borderRadius: 20}}
            chartConfig={{
              backgroundGradientFrom: Colors.orange,
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: Colors.ember,
              backgroundGradientToOpacity: 0.5,
              color: (opacity = 1) => `rgba(265, 255, 146, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // optional
            }}
            accessor={'population'}
            backgroundColor={Colors.white}
            paddingLeft={'15'}
          />
        </View>

        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            elevation: 5,
            alignItems: 'center',
            marginVertical: 15,
          }}>
          <View
            style={{
              width: '100%',
              paddingVertical: 15,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text style={[fonts.captionBold, {color: Colors.orange}]}>
              Thống kê doanh thu theo tháng
            </Text>

            <View style={{marginTop: 15}}>
              <BarChart
                data={{
                  labels: ['Tháng trước', 'Tháng này'],
                  datasets: [
                    {
                      data: [
                        statistics.PreMonthRevenue,
                        statistics.MonthRevenue,
                      ],
                    },
                  ],
                }}
                width={width - 80}
                height={220}
                yAxisLabel="k VNĐ"
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientFromOpacity: 1,
                  backgroundGradientTo: Colors.white,
                  backgroundGradientToOpacity: 0.7,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2, // optional, default 3
                  barPercentage: 0.5,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            elevation: 5,
            alignItems: 'center',
            marginVertical: 15,
          }}>
          <View
            style={{
              width: '100%',
              paddingVertical: 15,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text style={[fonts.captionBold, {color: Colors.orange}]}>
              Thống kê doanh thu theo năm
            </Text>

            <View style={{marginTop: 15}}>
              <BarChart
                data={{
                  labels: ['Năm trước', 'Năm nay'],
                  datasets: [
                    {
                      data: [statistics.PreYearRevenue, statistics.YearRevenue],
                    },
                  ],
                }}
                width={width - 80}
                height={220}
                yAxisLabel="k VNĐ"
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientFromOpacity: 1,
                  backgroundGradientTo: Colors.white,
                  backgroundGradientToOpacity: 0.7,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2, // optional, default 3
                  barPercentage: 0.5,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SS_FoodDetail;
