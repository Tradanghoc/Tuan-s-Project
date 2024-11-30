import {View, Text, TouchableOpacity, StatusBar, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import {selectRestaurantID} from '../../../../helpers/state/AppTab/storeSlice';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import {fonts} from '../../../custom/styles/ComponentStyle';
import {NavigationProp, useIsFocused, useNavigation} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import SmallCart from '../../../custom/cards/SmallCart';
import RestaurantSmallCart from '../../../custom/cards/RestaurantSmallCart';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import { selectHost } from '../../../../helpers/state/Global/globalSlice';


type AllFood = {
  Id: string;
  Name: string;
  TimeMade: string;
  Image: string;
  TotalReview: number;
  Point: number;
}

const convertTime = (time: string) => {
  const [hour,minute,second] = time.split(':');
  if(hour === '00') return `${minute} phút`;
  else return `${hour}h ${minute}`;
}

const AllFood = () => {
  const resID = useSelector(selectRestaurantID);
  const naviagtion = useNavigation<NavigationProp<ParamList, 'AllFood'>>();
  const host = useSelector(selectHost);
  const  isFocused = useIsFocused();
  const [data,setData] = useState<AllFood[]>([]);

  const getFoodList = async() => {
    const response = await AxiosInstance().post('get-all-restaurant-foods.php', {id: resID});
    if(response.status){
      setData(response.data);
    }else {
      console.log('get food list error', response.statusText);
    }
  }

  useEffect(() => {
    if(isFocused)
    getFoodList();
  }
  , [isFocused]);

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

        <Text style={[fonts.captionBold]}>Tất cả món ăn</Text>

        <View style={{width: 45}} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item: AllFood, index) => item.Id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 15}}
        contentContainerStyle={{paddingHorizontal: 10}}
        renderItem={({item}) => (
          <RestaurantSmallCart
            name={item.Name}
            time={convertTime(item.TimeMade)}
            image={`${host}/uploads/${item.Image}.jpg`}
            rate={item.Point}
            rateCount={item.TotalReview}
            onPress={()=>{
              naviagtion.navigate('SS_FoodDetail', {id: item.Id});
            }}
          />
        )}
      />
    </View>
  );
};

export default AllFood;
