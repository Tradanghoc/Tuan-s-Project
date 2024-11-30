import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  BackHandler,
  TouchableOpacity,
  Button,
  Modal,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {ParamList, UserComment} from '../../navigation/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {
  isLoading,
  selectHost,
  selectLoading,
  selectUserID,
} from '../../../helpers/state/Global/globalSlice';
import Loading from '../../custom/ui/Loading';
import AxiosInstance from '../../../helpers/AxiosInstance';
import {showMessage} from 'react-native-flash-message';
import {ScrollView} from 'react-native';
import {Colors, screenStyles} from '../../custom/styles/ScreenStyle';
import {StatusBar} from 'react-native';
import {fonts} from '../../custom/styles/ComponentStyle';
import Icons, {IconName} from '../../../assets/icons/Icons';
import BigCard from '../../custom/cards/BigCard';
import Fluid_btn from '../../custom/buttons/Fluid_btn';
import Quantity_btn from '../../custom/buttons/Quantity_btn';
import Icons2, {Icon2Name} from '../../../assets/icons/Icons2';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ReviewCard from '../../custom/cards/ReviewCard';
import Linear_btn from '../../custom/buttons/Linear_btn';
import {convertPoint} from '../../navigation/AppTabNavigation';
import TextArea from '../../custom/textinput/TextArea';
import CustomRating from '../../custom/ui/CustomRating';
import WaitingModal from '../../custom/ui/WaitingModal';
/** Type access data */

type SideFoodType = {
  Id: string;
  Name: string;
  TimeMade: string;
  FeatureItem: number;
  Price: number;
  Discount: number;
  ReviewCount: number;
  Rating: number;
  userFavorite: number;
  Images: string[];
};

type FoodDetailType = {
  Id: string;
  Name: string;
  Description: string;
  TimeMade: string;
  FeatureItem: number;
  Price: number;
  Discount: number;
  RestaurantID: string;
  RestaurantStatus: string;
  RestaurantName: string;
  ReviewCount: number;
  Rating: number;
  Comment: string;
  userFavorite: number;
  hasUseService: number;
  Opinion: UserComment | boolean;
  Reviews: UserComment[];
  Images: string[];
  RestaurantImages: string[];
  FeatureList: SideFoodType[];
  OtherList: SideFoodType[];
};

type CreateReview = {
  point: number;
  content: string;
  userID: string;
  targetID: string;
};

const initialComment: UserComment = {
  Id: '',
  Point: 0,
  UserID: '',
  TargetID: '',
  Comment: '',
  Status: 'Active',
  CreateAt: '',
  UpdateAt: '',
  ImageID: '',
  UserName: '',
  UserRank: 0,
};

/** Prop for screen */

type Route = RouteProp<ParamList, 'US_FoodDetail'>;
type Props = {
  route: Route;
};

function converTime(time: string): string {
  const parts = time.split(':');
  const hours = parseInt(parts[0]);
  let minutes = parseInt(parts[1]);
  const secs = parseInt(parts[2]);

  if (secs > 30) minutes++;

  if (hours === 0) {
    return `${minutes} mins`;
  } else {
    return `${hours}hr ${minutes} mins`;
  }
}

const addCart = async (userID: string, foodID: string, quantity: number) => {
  const data = {
    userID: userID,
    foodID: foodID,
    quantity: quantity,
  };
  const repsonse = await AxiosInstance().post('/post-orders.php', data);
  if (repsonse.status !== 400 && repsonse.status !== 500) {
    showMessage({
      message: 'Thêm món ăn vào giỏ hàng thành công',
      type: 'success',
      icon: 'success',
    });
  } else {
    showMessage({
      message: 'Thêm món ăn vào giỏ hàng thất bại',
      description: 'Bạn cần có địa chỉ để đặt hàng',
      type: 'danger',
      icon: 'danger',
    });
  }
};

const width = Dimensions.get('window').width;

const US_FoodDetail = (props: Props) => {
  const load = useSelector(selectLoading);
  const userID = useSelector(selectUserID);
  const host = useSelector(selectHost);
  const isFocused = useIsFocused();
  const [wait, setWait] = useState(false);
  const naviagtion =
    useNavigation<NavigationProp<ParamList, 'US_Restaurant'>>();
  let id = props.route?.params?.id;
  const [quantity, setQuantity] = useState(1);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const CreatebottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['50%', '65%'], []);
  const handlePresentModalPress = useCallback(() => {
    CreatebottomSheetModalRef.current?.close();
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentCommentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.collapse();
    CreatebottomSheetModalRef.current?.present();
  }, []);

  const createReview = async (data: CreateReview) => {
    const response = await AxiosInstance().post(
      '/post-create-reviews.php',
      data,
    );
  };

  const saveReview = async (data: {
    id: string;
    content: string;
    point: number;
    userID: string;
  }) => {
    setWait(true);
    const response = await AxiosInstance().post(
      '/post-update-reviews.php',
      data,
    );
  };

  const dispatch = useDispatch();
  let image: any[] = [];
  const [state, setState] = useState<FoodDetailType>({
    Description: 'This is food details description if api not response',
    Discount: 0,
    FeatureItem: 0,
    Id: 'Id',
    Images: [],
    Name: 'Food name if api not response',
    Price: 0,
    RestaurantID: 'ResID',
    TimeMade: '00:00:00',
    Opinion: false,
    Reviews: [],
    userFavorite: 0,
    RestaurantStatus: 'Open',
    RestaurantName: 'ResName',
    ReviewCount: 0,
    Rating: 0,
    hasUseService: 0,
    RestaurantImages: [],
    Comment: '',
    FeatureList: [],
    OtherList: [],
  });

  const [comment, setComment] = useState<UserComment>(initialComment);

  useEffect(() => {
    if (!isFocused) naviagtion.setParams({id: ''});
  }, [isFocused]);

  const getFoodDetail = async () => {
    const data = {
      id,
      user: userID,
    };
    try {
      const response = await AxiosInstance().post('/get-detail-food.php', data);
      console.log(response.data.OtherList[0].Images)
      if (response.status) {
        let data: FoodDetailType = response.data;
        data.TimeMade = converTime(data.TimeMade);
        setState(data);
        if (data.Opinion != false) {
          setComment(data.Opinion as UserComment);
        }
      }
    } catch (error) {
      console.log('US Food Detail 255:', error);
      dispatch(isLoading(false));
    }
  };

  useEffect(() => {
    dispatch(isLoading(true));
    if (id !== '') getFoodDetail();
    dispatch(isLoading(false));
  }, [id]);

  const addFavorite = async (target: string, user: string) => {
    const body = {
      target,
      user,
    };
    const response = await AxiosInstance().post('/post-add-favorite.php', body);
    // console.log('add favorite', response);
    if (response.status) {
      setState({...state, userFavorite: 1});
    }
  };

  const removeFavorite = async (target: string, user: string) => {
    const body = {
      target,
      user,
    };
    const response = await AxiosInstance().post(
      '/post-remove-favorite.php',
      body,
    );
    // console.log('remove favorite', response);
    if (response.status) {
      setState({...state, userFavorite: 0});
    }
  };

  useEffect(() => {
    const backAction = () => {
      naviagtion.setParams({id: ''});
      naviagtion.goBack();
      return true;
    };
    const backHandle = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
  }, []);

  const LoadModal = () => {
    return (
      <Modal visible={wait} transparent animationType="fade">
        <WaitingModal />
      </Modal>
    );
  };

  return load ? (
    <Loading />
  ) : (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <LoadModal />

        <ScrollView
          style={{flex: 1, backgroundColor: Colors.white}}
          showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

          <View>
            <FlatList
              data={state.Images}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <Image
                  style={{height: 200, width: width, resizeMode: 'cover'}}
                  source={require('../../../assets/images/baseImage.png')}
                />
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <Image
                  style={{height: 200, width}}
                  source={{uri: `${host}/uploads/${state.Images[index]}.jpg`}}
                  resizeMode="cover"
                />
              )}
            />

            <TouchableOpacity
              onPress={() => {
                if (state.userFavorite) {
                  removeFavorite(state.Id, userID);
                } else {
                  addFavorite(state.Id, userID);
                }
              }}
              style={{
                width: 50,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25,
                elevation: 5,
                position: 'absolute',
                backgroundColor: Colors.white,
                top: 20,
                right: 20,
                zIndex: 1,
              }}>
              {state.userFavorite ? (
                <Icons2 name={Icon2Name.love} color={Colors.orange} size={25} />
              ) : (
                <Icons name={IconName.like} color={Colors.black} size={25} />
              )}
            </TouchableOpacity>
          </View>

          <Text
            style={[
              fonts.titleBold,
              {marginLeft: 20, marginTop: 20, marginBottom: 15},
            ]}>
            {state.Name}
          </Text>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 7,
                alignItems: 'center',
              }}>
              <Icons name={IconName.star} color={Colors.yellow} size={18} />

              <Text style={[fonts.sublineBold]}>{state.Rating}</Text>
              <Text style={[fonts.text, {textAlignVertical: 'top'}]}>
                {`(${state.ReviewCount})`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 7,
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 5,
                  alignItems: 'center',
                }}>
                <Icons
                  name={IconName.delivery}
                  color={Colors.orange}
                  size={18}
                />
                <Text>
                  {Math.round(state.Price * (1 - state.Discount / 100) * 0.1) +
                    'k VNĐ'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 5,
                  alignItems: 'center',
                }}>
                <Icons name={IconName.order} color={Colors.green} size={18} />
                <Text>{state.TimeMade}</Text>
              </View>
            </View>
          </View>

          <View
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                paddingVertical: 15,
                paddingLeft: 15,
                marginVertical: 20,
              },
            ]}>
            <Text style={[fonts.captionBold, {color: Colors.green}]}>
              {Math.round(state.Price * (1 - state.Discount / 100))}k VNĐ
            </Text>
            <View
              style={[
                {flexDirection: 'row', columnGap: 10, alignItems: 'center'},
              ]}>
              <Quantity_btn
                type="minus"
                onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                style={{width: 20}}
              />
              <Text style={[fonts.sublineBold, {color: Colors.black}]}>
                {quantity}
              </Text>
              <Quantity_btn
                type="plus"
                onPress={() => setQuantity(quantity <= 10 ? quantity + 1 : 10)}
                style={{width: 20}}
              />
            </View>
          </View>
          <Text
            style={[
              fonts.sublineBold,
              {marginHorizontal: 20, color: Colors.slate},
            ]}>
            {state.Description}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
              marginVertical: 20,
            }}>
            <TouchableOpacity
              style={{
                height: 50,
                width: 50,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.white,
                elevation: 5,
              }}>
              <Icons2 name={Icon2Name.pin} color={Colors.black} size={25} />
              {/* <Icons name={IconName.pin} color={Colors.blue} size={25} /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePresentModalPress}
              style={{
                height: 50,
                flex: 1,
                marginLeft: 15,
                borderRadius: 10,
                backgroundColor: Colors.white,
                elevation: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={[fonts.button, {color: Colors.black}]}>
                Đánh giá và bình luận
              </Text>
            </TouchableOpacity>
          </View>

          {state.hasUseService != 0 && state.Comment && (
            <Text
              style={[
                fonts.sublineBold,
                {
                  marginHorizontal: 20,
                  color: Colors.black,
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                  marginVertical: 20,
                  paddingLeft: 15,
                  elevation: 5,
                },
              ]}>
              {state.Comment}
            </Text>
          )}
          {state.FeatureList.length !== 0 && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 15,
                  marginTop: 30,
                  marginHorizontal: 20,
                }}>
                <Text style={[fonts.sublineBold, {flex: 1}]}>
                  Món ăn đặc biệt của nhà hàng
                </Text>
                <Text style={[fonts.link, {color: Colors.green}]}>See all</Text>
              </View>

              <FlatList
                data={state.FeatureList}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <BigCard
                    type="Food"
                    discount={item.Discount}
                    favorite={item.userFavorite}
                    name={item.Name}
                    price={item.Price}
                    onPress={async () => {
                      naviagtion.setParams({id: item.Id});
                      await getFoodDetail();
                    }}
                    rate={item.Rating}
                    rateCount={item.ReviewCount}
                    time={converTime(item.TimeMade)}
                    key={item.Id}
                    image={`${host}/uploads/${item.Images[0]}.jpg`}
                    style={{
                      width: 300,
                      marginHorizontal: 20,
                      marginTop: 15,
                      marginBottom: 30,
                    }}
                  />
                )}
              />
            </View>
          )}

          {state.OtherList.length != 0 && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 15,
                  marginTop: 30,
                  marginHorizontal: 20,
                }}>
                <Text style={[fonts.sublineBold, {flex: 1}]}>
                  Món ăn khác của nhà hàng
                </Text>
                <Text style={[fonts.link, {color: Colors.green}]}>See all</Text>
              </View>
              <FlatList
                data={state.OtherList}
                horizontal
                style={{marginBottom: 50}}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <BigCard
                      type="Food"
                      discount={item.Discount}
                      favorite={item.userFavorite}
                      name={item.Name}
                      price={item.Price}
                      rate={item.Rating}
                      onPress={async () => {
                        naviagtion.setParams({id: item.Id});
                        await getFoodDetail();
                      }}
                      rateCount={item.ReviewCount}
                      time={converTime(item.TimeMade)}
                      key={item.Id}
                      image={`${host}/uploads/${item.Images[0]}.jpg`}
                      style={{
                        width: 300,
                        marginHorizontal: 20,
                        marginTop: 15,
                        marginBottom: 30,
                      }}
                    />
                  );
                }}
              />
            </View>
          )}
        </ScrollView>
        <BottomSheetModalProvider>
          <View
            style={{
              width: '100%',
              height: 50,
              position: 'absolute',
              bottom: 15,
              zIndex: 0,
              paddingHorizontal: 25,
              flexDirection: 'row',
            }}>
            <Fluid_btn
              title="Thêm vào giỏ hàng"
              style={{
                flex: 1,
                elevation: 5,
              }}
              onPress={() => {
                addCart(userID as string, state.Id, quantity);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                naviagtion.navigate('Report', {
                  id: state.Id,
                  title: 'Tố cáo món ăn',
                });
              }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 10,
                marginLeft: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.white,
                elevation: 5,
              }}>
              <Icons2 name={Icon2Name.flag} color={Colors.black} size={25} />
            </TouchableOpacity>
          </View>
          <BottomSheetModal
            ref={CreatebottomSheetModalRef}
            index={1}
            style={{
              flex: 1,
              elevation: 5,
              paddingHorizontal: 20,
            }}
            snapPoints={snapPoints}>
            <Text
              style={[
                fonts.captionBold,
                {marginVertical: 10, textAlign: 'center'},
              ]}>
              {typeof state.Opinion == 'object'
                ? 'Chỉnh sửa bình luận'
                : 'Bạn nghĩ gì về món ăn này ?'}
            </Text>

            <CustomRating
              style={{alignSelf: 'center', marginVertical: 15}}
              point={comment.Point}
              onChange={p => {
                setComment({...comment, Point: p});
              }}
            />

            <View>
              <TextArea
                onChange={text => setComment({...comment, Comment: text})}
                value={comment.Comment}
                style={{height: 100}}
              />

              <Fluid_btn
                title="Lưu bình luận"
                onPress={async () => {
                  setWait(true);
                  typeof state.Opinion == 'boolean'
                    ? await createReview({
                        point: comment.Point,
                        content: comment.Comment,
                        userID: userID,
                        targetID: id as string,
                      })
                    : await saveReview({
                        id: comment.Id,
                        point: comment.Point,
                        content: comment.Comment,
                        userID: userID as string,
                      });
                  await getFoodDetail();
                  setWait(false);
                  handlePresentModalPress();
                }}
                style={{marginTop: 20}}
              />
            </View>
          </BottomSheetModal>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            style={{
              backgroundColor: Colors.white,
              elevation: 5,
              paddingHorizontal: 20,
            }}
            snapPoints={snapPoints}>
            {typeof state.Opinion == 'boolean' ? (
              <Linear_btn
                onPress={() => {
                  state.hasUseService != 0
                    ? handlePresentCommentModalPress()
                    : showMessage({
                        message:
                          'Bạn cần sử dụng dịch vụ của nhà hàng để có thể bình luận và đánh giá',
                        type: 'warning',
                        icon: 'info',
                      });
                }}
                title="Để lại bình luận & đánh giá"
                style={{marginVertical: 20}}
              />
            ) : (
              <TouchableOpacity onPress={handlePresentCommentModalPress}>
                <ReviewCard
                  name={state.Opinion.UserName}
                  point={state.Opinion.Point}
                  rank={convertPoint(state.Opinion.UserRank)}
                  createAt={state.Opinion.CreateAt}
                  content={state.Opinion.Comment}
                />
              </TouchableOpacity>
            )}
            <BottomSheetFlatList
              data={state.Reviews}
              ItemSeparatorComponent={() => <View style={{height: 15}} />}
              contentContainerStyle={{paddingVertical: 20}}
              renderItem={({item}) => (
                <ReviewCard
                  name={item.UserName}
                  point={item.Point}
                  rank={convertPoint(item.UserRank)}
                  createAt={item.CreateAt}
                  content={item.Comment}
                  onDel={() => {
                    naviagtion.navigate('Report', {
                      id: item.Id,
                      title: 'Tố cáo người dùng',
                    });
                  }}
                />
              )}
            />
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
  );
};

export default US_FoodDetail;
