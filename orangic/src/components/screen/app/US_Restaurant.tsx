import {View, Text, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {ParamList} from '../../navigation/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {
  isLoading,
  selectHost,
  selectLoading,
  selectUserID,
} from '../../../helpers/state/Global/globalSlice';
import AxiosInstance from '../../../helpers/AxiosInstance';
import Loading from '../../custom/ui/Loading';
import {ScrollView} from 'react-native';
import {Colors} from '../../custom/styles/ScreenStyle';
import {StatusBar} from 'react-native';
import {Image} from 'react-native';
import {fonts} from '../../custom/styles/ComponentStyle';
import Icons, {IconName} from '../../../assets/icons/Icons';
import BigCard from '../../custom/cards/BigCard';
import SectionBar from '../../custom/topbars/SectionBar';
import FastFood from '../../../assets/images/fast-food.svg';
import Icons2, {Icon2Name} from '../../../assets/icons/Icons2';

/** Type of food */
type FoodDetailType = {
  Id: string;
  Name: string;
  Description: string;
  TimeMade: string;
  FeatureItem: number;
  Price: number;
  Discount: number;
  userFavorite: number;
  ReviewCount: number;
  Ratinng: number;
  Images: string[];
};

/** Type of restaurant detail */

type RestaurantDetailType = {
  Id: string;
  Name: string;
  Introduction: string;
  Status: string;
  Address: string;
  City: string;
  District: string;
  Ward: string;
  Phone: string;
  Email: string;
  ReviewCount: number;
  Rating: number;
  userFavorite: number;
  hasUseService: number;
  Images: string[];
  FeatureList: FoodDetailType[];
  OtherList: FoodDetailType[];
};

const initialState: RestaurantDetailType = {
  Id: '',
  Name: '',
  Introduction: '',
  Status: '',
  City: '',
  Address: '',
  District: '',
  Ward: '',
  Phone: '',
  Email: '',
  ReviewCount: 0,
  Rating: 0,
  userFavorite: 0,
  hasUseService: 0,
  Images: [],
  FeatureList: [],
  OtherList: [],
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

type Route = RouteProp<ParamList, 'US_Restaurant'>;
type Props = {
  route: Route;
};

const {width} = Dimensions.get('window');
const US_Restaurant = (props: Props) => {
  const load = useSelector(selectLoading);
  const userID = useSelector(selectUserID);
  const host = useSelector(selectHost);
  const isFocused = useIsFocused();
  const naviagtion =
    useNavigation<NavigationProp<ParamList, 'US_Restaurant'>>();
  let id = props.route?.params?.id;
  const dispatch = useDispatch();

  const [state, setState] = React.useState<RestaurantDetailType>(initialState);

  const getRestaurantDetail = async () => {
    const data = {
      id,
      user: userID,
    };
    try {
      const response = await AxiosInstance().post(
        '/get-detail-restaurant.php',
        data,
      );
      // console.log('restaurant detail', response);
      if (response.status) {
        setState(response.data);
      } else {
        setState(initialState);
      }
    } catch (error) {
      console.log(error);
      dispatch(isLoading(false));
    }
  };

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
    if (isFocused) {
      dispatch(isLoading(true));
      getRestaurantDetail();
      dispatch(isLoading(false));
    }
  }, [isFocused]);

  return load ? (
    <Loading />
  ) : (
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1, backgroundColor: Colors.white}}
        showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />
        <FlatList
          data={state.Images}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Image
              style={{height: 200, width: 400}}
              source={require('../../../assets/images/baseImage.png')}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <Image
              style={{height: 200, width, resizeMode: 'contain'}}
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
              <Icons name={IconName.order} color={Colors.orange} size={18} />
              <Text>{'12'}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginTop: 30,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', columnGap: 7}}>
            <Icons name={IconName.email} color={Colors.orange} size={18} />
            <Text style={[fonts.sublineBold]}>{state.Email}</Text>
          </View>
          <View style={{flexDirection: 'row', columnGap: 7}}>
            <Icons name={IconName.phone} color={Colors.orange} size={18} />
            <Text style={[fonts.sublineBold]}>{state.Phone}</Text>
          </View>
        </View>

        <Text
          style={[
            fonts.textBold,
            {marginHorizontal: 20, color: Colors.slate, marginTop: 30},
          ]}>
          {`Địa chỉ: ${state.Address}, ${state.Ward}, ${state.District}, ${state.City}`}
        </Text>

        <Text
          style={[
            fonts.sublineBold,
            {marginHorizontal: 20, color: Colors.slate, marginTop: 30},
          ]}>
          {state.Introduction}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            marginHorizontal: 20,
            marginVertical: 20,
            marginTop: 20,
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              height: 50,
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

          <TouchableOpacity
            onPress={() => {
              naviagtion.navigate('Report', {
                id: state.Id,
                title: 'Tố cáo nhà hàng',
              });
            }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.orange,
              elevation: 5,
            }}>
            <Icons2 name={Icon2Name.flag} color={Colors.white} size={25} />
          </TouchableOpacity>
        </View>
        <SectionBar
          name="Món ăn đặc sản cuả nhà hàng"
          onPress={() => {}}
          style={{marginHorizontal: 10, marginTop: 50}}
          showAction={state.FeatureList.length > 5}
        />

        <FlatList
          data={state.FeatureList}
          horizontal
          contentContainerStyle={{flex: 0}}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastFood width={300} height={200} />
            </View>
          }
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
                naviagtion.navigate('US_FoodDetail', {id: item.Id});
              }}
              rate={item.Ratinng}
              rateCount={item.ReviewCount}
              time={converTime(item.TimeMade)}
              key={item.Id}
              image={
                item.Images.length !== 0
                  ? `${host}/uploads/${item.Images[0]}.jpg`
                  : undefined
              }
              style={{
                width: 300,
                marginHorizontal: 20,
                marginTop: 15,
                marginBottom: 30,
              }}
            />
          )}
        />

        <SectionBar
          name="Món ăn khác của nhà hàng"
          onPress={() => {}}
          style={{marginHorizontal: 10, marginTop: 50}}
          showAction={state.OtherList.length > 5}
        />

        <FlatList
          data={state.OtherList}
          contentContainerStyle={{flex: 0}}
          horizontal
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastFood width={300} height={200} />
            </View>
          }
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
                naviagtion.navigate('US_FoodDetail', {id: item.Id});
              }}
              rate={item.Ratinng}
              rateCount={item.ReviewCount}
              time={converTime(item.TimeMade)}
              key={item.Id}
              image={
                item.Images.length !== 0
                  ? `${host}/uploads/${item.Images[0]}.jpg`
                  : undefined
              }
              style={{
                width: 300,
                marginHorizontal: 20,
                marginTop: 15,
                marginBottom: 30,
              }}
            />
          )}
        />
      </ScrollView>
    </View>
  );
};

export default US_Restaurant;
