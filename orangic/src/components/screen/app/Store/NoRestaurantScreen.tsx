import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {screenStyles} from '../../../custom/styles/ScreenStyle';
import Lost from '../../../../assets/images/Lost.svg';
import {fonts} from '../../../custom/styles/ComponentStyle';
import Fluid_btn from '../../../custom/buttons/Fluid_btn';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ParamList} from '../../../navigation/RootNavigation';

const NoRestaurantScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamList, 'Store'>>();
  const size = Dimensions.get('window').width;
  return (
    <View
      style={[
        screenStyles.parent_container,
        {alignItems: 'center', justifyContent: 'center', marginTop: -50, paddingHorizontal: 20},
      ]}>
      <Lost width={size} height={size} />
      <Text style={[fonts.sublineBold, {marginVertical: 20}]}>
        Nhà hàng của bạn ở đâu thế ?
      </Text>
      <Fluid_btn
        title="Hãy tạo một cái cho bạn nào!"
        style={{
          marginTop: 20,
        }}
        onPress={() => {
          navigation.navigate('CreateRestaurant');
        }}
      />
    </View>
  );
};

export default NoRestaurantScreen;
