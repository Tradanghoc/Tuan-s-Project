import {
  View,
  Text,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../../custom/styles/ScreenStyle';
import {Image} from 'react-native';
import {fonts} from '../../../custom/styles/ComponentStyle';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {
  DrawerActions,
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  selectHost,
  selectUserID,
} from '../../../../helpers/state/Global/globalSlice';
import Icons, {IconName} from '../../../../assets/icons/Icons';
import {ParamList} from '../../../navigation/RootNavigation';

const {width, height} = Dimensions.get('window');

type Infor = {
  Id: string;
  Name: string;
  Rank: number;
  Image: string;
};

const initialState: Infor = {
  Id: '',
  Name: '',
  Rank: 0,
  Image: '',
};
const Rank = () => {
  const isFocused = useIsFocused();
  const host = useSelector(selectHost);
  const [list, setList] = useState<Infor[]>([initialState]);
  const [numberOne, setNumberOne] = useState<Infor>(initialState);
  const userID = useSelector(selectUserID);
  const [userIndex, setUserIndex] = useState({index: 0, image: ''});
  const navigation = useNavigation<NavigationProp<ParamList, 'HomeDrawer'>>();

  const getRank = async () => {
    const response = await AxiosInstance().get('/get-rank-user.php');
    const data: Infor[] = response.data;
    if (response.status) {
      setUserIndex({
        index: data.findIndex(item => item.Id === userID),
        image: data.find(item => item.Id === userID)?.Image || '',
      });
      console.log('user index', userIndex)
      setNumberOne(data.shift() as Infor);
      setList(data.slice(0,19));
    }
  };

  useEffect(() => {
    if (isFocused) getRank();
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.orange} barStyle="light-content" />
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          backgroundColor: Colors.white,
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1,
        }}>
        <Icons name={IconName.menu} size={16} color={Colors.black} />
      </TouchableOpacity>
      <View
        style={{
          height: height * 0.3,
          backgroundColor: Colors.orange,
          elevation: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{uri: `${host}/uploads/${userIndex.image}.jpg`}}
          style={{
            width: width * 0.3,
            height: width * 0.3,
            borderRadius: (width * 0.3) / 2,
            borderColor: Colors.white,
            borderWidth: 5,
          }}
        />
        <Text
          style={[
            fonts.captionBold,
            {color: Colors.white, marginTop: 10, alignSelf: 'center'},
          ]}>
          {'No. ' + (userIndex.index + 1)}
        </Text>
      </View>

      <Text
        style={[
          fonts.captionBold,
          {color: Colors.black, paddingVertical: 20, textAlign: 'center'},
        ]}>
        {'Danh sách 20 người dùng xuất sắc nhất'}
      </Text>

      <View
        style={{
          height: 75,
          elevation: 5,
          marginHorizontal: 10,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderRadius: 10,
          borderRightColor: Colors.ember,
          borderLeftColor: Colors.ember,
          position: 'relative',
          backgroundColor: Colors.orange,
        }}>
        <View
          style={{
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 0,
            borderRightWidth: 20,
            borderBottomWidth: 15,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{rotate: '180deg'}],
            borderBottomColor: Colors.ember,
            position: 'absolute',
            top: 74,
            left: 2,
          }}
        />
        <Text style={[fonts.captionBold, {color: Colors.white}]}>
          {'No. 1'}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: 'flex-start',
          }}>
          <Image
            source={{uri: `${host}/uploads/${numberOne.Image}.jpg`}}
            style={{width: 45, height: 45, borderRadius: 25}}
          />
          <View style={{marginLeft: 10}}>
            <Text style={[fonts.captionBold, {color: Colors.white}]}>
              {numberOne.Name}
            </Text>
            <Text style={[fonts.caption, {color: Colors.white, marginTop: 5}]}>
              {'Điểm: ' + numberOne.Rank.toString()}
            </Text>
          </View>
        </View>
        <Image
          source={require('../../../../assets/icons/trophy.png')}
          style={{height: 45, width: 45}}
        />
        <View
          style={{
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 20,
            borderRightWidth: 0,
            borderBottomWidth: 15,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{rotate: '180deg'}],
            borderBottomColor: Colors.ember,
            position: 'absolute',
            top: 74,
            right: 2,
          }}
        />
      </View>

      <View style={{backgroundColor: 'red'}} />
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 5,
              marginHorizontal: 30,
            }}
          />
        )}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 5,
                height: 60,
                paddingHorizontal: 20,
                backgroundColor: Colors.white,
                marginHorizontal: 30,
                elevation: 5,
              }}>
              <Text style={[fonts.captionBold, {color: Colors.black}]}>
                {index + 2}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={{uri: `${host}/uploads/${item.Image}.jpg`}}
                  style={{width: 45, height: 45, borderRadius: 25}}
                />
                <Text
                  style={[
                    fonts.captionBold,
                    {color: Colors.black, textAlign: 'left'},
                  ]}>
                  {item.Name}
                </Text>
                <Text
                  style={[fonts.caption, {color: Colors.black, marginTop: 5}]}>
                  {item.Rank.toString()}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Rank;
