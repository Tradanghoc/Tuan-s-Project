import {View, Text, FlatList, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import {
  isLoading,
  selectHost,
  selectUserID,
} from '../../../../helpers/state/Global/globalSlice';
import {set} from 'mongoose';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import FoodEmptyFav from '../../../../assets/images/EmptyFoodFav.svg';
import {fonts} from '../../../custom/styles/ComponentStyle';
import SmallCart from '../../../custom/cards/SmallCart';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import Loading from '../../../custom/ui/Loading';
import WaitingModal from '../../../custom/ui/WaitingModal';

type FoodDisplayType = {
  Id: string;
  Name: string;
  TimeMade: string;
  Point: number;
  TotalReview: number;
  Image: string;
  FeatureItem: number;
  Price: number;
  Discount: number;
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

const DishFavoriteScreen = () => {
  const [food, setFood] = useState<FoodDisplayType[]>([]);
  const navigation =
    useNavigation<NavigationProp<ParamList, 'DishFavoriteScreen'>>();
  const [refresh, setRefresh] = useState<boolean>(false);

  const host = useSelector(selectHost);
  const userID = useSelector(selectUserID);

  const dispatched = useDispatch();

  const getFavoriteFoods = async () => {
    if (!userID) return;
    const response = await AxiosInstance().post('/get-all-favorite-foods.php', {
      id: userID,
    });
    // console.log(response.data);
    if (response.status) setFood(response.data);
  };

  useEffect(() => {
    const getFavorite = async () => {
      dispatched(isLoading(true));
      await getFavoriteFoods();
      dispatched(isLoading(false));
    }
    getFavorite();
  }, []);

  const ModalLoad = () => {
    return (
      <Modal animationType="fade" transparent={true} visible={refresh}>
        <WaitingModal />
      </Modal>
    );
  };

  return (
    <FlatList
      data={food}
      numColumns={2}
      style={screenStyles.parent_container}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
      }}
      ListEmptyComponent={
        <View
          style={[
            screenStyles.container,
            {alignContent: 'center', justifyContent: 'center'},
          ]}>
          <View style={{alignItems: 'center'}}>
            <FoodEmptyFav width={300} height={300} />
            <Text style={[fonts.sublineBold]}>
              Xin lỗi, chúng tôi không tìm thấy gì cả
            </Text>
            <ModalLoad />
            <Text
              style={[fonts.sublineBold, {color: Colors.orange, marginTop: 5}]}
              onPress={async () => {
                setRefresh(true);
                await getFavoriteFoods();
                setRefresh(false);
              }}>
              Tìm lại lần nữa ?
            </Text>
          </View>
        </View>
      }
      keyExtractor={item => item.Id}
      renderItem={({item}: {item: FoodDisplayType}) => (
        <SmallCart
          name={item.Name.slice(0, 10) + '...'}
          image={item.Image ? `${host}/uploads/${item.Image}.jpg` : undefined}
          time={converTime(item.TimeMade)}
          rate={item.Point}
          favorite={true}
          rateCount={item.TotalReview}
          onPress={() => {
            dispatched(isLoading(true));
            navigation.navigate('US_FoodDetail', {id: item.Id});
          }}
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 5,
          }}
        />
      )}
    />
  );
};

export default DishFavoriteScreen;
