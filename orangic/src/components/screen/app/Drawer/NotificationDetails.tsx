import {View, Text, StatusBar, Image} from 'react-native';
import React from 'react';
import {
  DrawerActions,
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';
import {Colors, screenStyles} from '../../../custom/styles/ScreenStyle';
import TitleBar from '../../../custom/topbars/TitleBar';
import {fonts} from '../../../custom/styles/ComponentStyle';

type Prop = {
  route: RouteProp<ParamList, 'NotificationDetails'>;
};

const NotificationDetails = (props: Prop) => {
  const context = props.route.params?.context;
  const navigation = useNavigation<NavigationProp<ParamList, 'HomeDrawer'>>();
  // console.log(context);

  return (
    <View style={screenStyles.parent_container}>
      <StatusBar backgroundColor={Colors.orange} barStyle="dark-content" />
      <TitleBar
        value="Thông báo"
        style={{paddingHorizontal: 20}}
        onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        onRightPress={() => {
          navigation.navigate('Notifications');
        }}
        notify={0}
      />

      <View style={screenStyles.container}>
        <Text style={[fonts.captionBold, {marginVertical: 10}]}>
          {context?.Title}
        </Text>

        <Text style={[fonts.subline, {marginVertical: 10, flex: 1}]}>
          {context?.Content}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../../../assets/images/baseImage.png')}
              style={{width: 50, height: 50, borderRadius: 25}}
            />
            <View style={{marginLeft: 10, width: 100}}>
              <Text
                style={[
                  fonts.textBold,
                  {marginVertical: 10, textAlignVertical: 'center'},
                ]}>
                {context?.AdminName}
              </Text>
              <Text style={[fonts.text]}>
                {context?.CreateAt.slice(0, context?.CreateAt.length - 9)}
              </Text>
            </View>
          </View>

          {context?.CouponCode ? (
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.orange,
                maxWidth: 120,
                height: 50,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={[fonts.captionBold, {color: Colors.white}]}>{'ASDFGH'}</Text>
              </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default NotificationDetails;
