import {View, Text, FlatList, Image, StatusBar, Dimensions, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import TitleBar from '../../../custom/topbars/TitleBar';
import {
  DrawerActions,
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {NotifyDetail, ParamList} from '../../../navigation/RootNavigation';
import AxiosInstance from '../../../../helpers/AxiosInstance';
import {useSelector} from 'react-redux';
import {
  selectHost,
  selectUserID,
} from '../../../../helpers/state/Global/globalSlice';

/** Declare Item */

const {width, height} = Dimensions.get('window');
const Notifications = () => {
  const isFocused = useIsFocused();
  const host = useSelector(selectHost);
  const navigation = useNavigation<NavigationProp<ParamList, 'HomeDrawer'>>();
  const id = useSelector(selectUserID);
  const [data, setData] = React.useState<NotifyDetail[]>([]);

  const getNotification = async () => {
    const response = await AxiosInstance().post('/get-user-notifications.php', {
      id,
    });
    if (response.status) {
      setData(response.data);
    } else {
      setData([]);
      // console.log(response.statusText);
    }
  };

  useEffect(() => {
    if(isFocused) getNotification();
  }, [isFocused]);

  return (
    <View style={screenStyles.parent_container}>
      <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />
      <TitleBar
        value="Thông báo"
        style={{paddingHorizontal: 20}}
        onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        onRightPress={() => {}}
        notify={0}
      />

      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{width, paddingBottom: 20, paddingTop: 15}}
        renderItem={({item}: {item: NotifyDetail}) => (
          <TouchableOpacity
          onPress={() => navigation.navigate('NotificationDetails', {context: item as NotifyDetail})}
            style={{
              padding: 10,
              flexDirection: 'row',
              marginHorizontal: 20,
            }}>
            <Image
              source={
                item.AdminImage
                  ? {uri: `${host}/uploads/${item.AdminImage}.jpg`}
                  : require('../../../../assets/images/baseImage.png')
              }
              style={{width: 50, height: 50, borderRadius: 25}}
            />
            <View style={{marginLeft: 15}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {item.Title}
              </Text>
              <Text style={{fontSize: 14}}>{item.Content.slice(0, 30)}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Notifications;
