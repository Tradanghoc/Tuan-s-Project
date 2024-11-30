import {View, Text, StatusBar, FlatList, Dimensions, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  selectHost,
  selectLoading,
  selectUserID,
} from '../../../../helpers/state/Global/globalSlice';
import Loading from '../../../custom/ui/Loading';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import HomeBar from '../../../custom/topbars/HomeBar';
import {
  DrawerActions,
  NavigationProp,
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import SmallCart from '../../../custom/cards/SmallCart';
import {fonts} from '../../../custom/styles/ComponentStyle';
import BigCard from '../../../custom/cards/BigCard';
import WaitingModal from '../../../custom/ui/WaitingModal';

type Foods = {
  CreateAt: string;
  Description: string;
  Discount: number;
  FeatureItem: number;
  Id: string;
  Image: string;
  IsFav: number;
  Name: string;
  Price: number;
  Rate: number;
  RestaurantID: string;
  Status: string;
  TimeMade: string;
  TotalReview: string;
  UpdateAt: string;
};

type Restaurant = {
  Id: string;
  Image: string;
  Introduction: string;
  Name: string;
  Rate: number;
  TotalReview: number;
  IsFav: number;
};

type Search = {
  Foods: Foods[];
  Restaurants: Restaurant[];
};

const {width, height} = Dimensions.get('window');

const Search = () => {
  const isFocused = useIsFocused();
  const route = useRoute<RouteProp<ParamList, 'Search'>>();
  const [wait, setWait] = useState(false);
  const host = useSelector(selectHost);
  const userID = useSelector(selectUserID);
  const [search, setSearch] = useState(route.params?.search);
  const [searchData, setSearchData] = useState<Search>({
    Foods: [],
    Restaurants: [],
  });
  const navigation = useNavigation<NavigationProp<ParamList, 'HomeDrawer'>>();

  const searching = async () => {
    const body = {
      userID,
      keyword: search,
    };
    console.log(body);
    const response = await AxiosInstance().post('/get-search-data.php', body);
    const data = response.data;

    if (response.status) {
      setSearchData(response.data);
      console.log(data);
    console.log(true);
      
    } else {
      setSearchData({Foods: [], Restaurants: []});
      console.log(data);
    console.log(false);

    }
  };

  const WaitModal = () => {
    return (
      <Modal visible={wait} transparent animationType="fade">
        <WaitingModal />
      </Modal>
    );
  };

  useEffect(() => {
    if (isFocused) {
      setWait(true);
      setSearch(route.params?.search);
      searching();
      setWait(false);
    }
  }, [isFocused]);

  return (
    <View style={[screenStyles.parent_container]}>
      <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />
      <WaitModal/>
      <HomeBar
        notify={0}
        onChange={value => setSearch(value)}
        value={search as string}
        searchContainStyle={{
          marginVertical: 10,
          marginHorizontal: 25,
        }}
        onLeftPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        onRightPress={() => {
          navigation.navigate('Notifications');
        }}
        onSearch={async () => {
          setWait(true);
          await searching();
          setWait(false);
        }}
        style={{
          paddingHorizontal: 20,
          backgroundColor: Colors.orange,
        }}
        textStyle={{color: Colors.black}}
      />

      <Text style={[fonts.captionBold, {margin: 20}]}>Món ăn</Text>

      <FlatList
        data={searchData.Foods}
        keyExtractor={item => item.Id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        renderItem={({item}) => (
          <SmallCart
            name={item.Name}
            price={item.Price}
            onPress={() => navigation.navigate('US_FoodDetail', {id: item.Id})}
            style={{marginRight: 15}}
            favorite={item.IsFav == 1}
            image={item.Image ? `${host}/uploads/${item.Image}.jpg` : undefined}
          />
        )}
      />

      <Text style={[fonts.captionBold, {margin: 20}]}>Nhà hàng</Text>

      <FlatList
        data={searchData.Restaurants}
        keyExtractor={item => item.Id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate={'normal'}
        pagingEnabled
        snapToInterval={width}
        disableIntervalMomentum={true}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        renderItem={({item}) => (
          <BigCard
            name={item.Name}
            rate={+item.Rate}
            onPress={() =>
              navigation.navigate('US_Restaurant', {id: item.Id})
            }
            image={item.Image ? `${host}/uploads/${item.Image}.jpg` : undefined}
            intro={
              item.Introduction.length > 80
                ? item.Introduction.slice(0, 80) + '...'
                : item.Introduction
            }
            rateCount={item.TotalReview}
            favorite={item.IsFav}
            style={{width: width - 40, marginRight: 40}}
          />
        )}
      />
    </View>
  );
};

export default Search;
