import {View, Text, ViewStyle, TextStyle} from 'react-native';
import React from 'react';
import {Colors} from '../styles/ScreenStyle';
import {fonts} from '../styles/ComponentStyle';

type Prop = {
  title?: string;
  action?: boolean;
  style?: ViewStyle | ViewStyle[];
  onAction?: () => void;
  fontsStyle?: TextStyle | TextStyle[];
  barStyle?: ViewStyle | ViewStyle[];
  barLeft?: ViewStyle | ViewStyle[];
};

const TitleList = (props: Prop) => {
  return (
    <View
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        props?.style,
      ]}>
      <View
        style={[
          {width: 50, height: 2, backgroundColor: Colors.green},
          props?.barStyle,
          props?.barLeft,
        ]}
      />
      <Text
        numberOfLines={1}
        style={[
          fonts.sublineBold,
          {marginHorizontal: 10, flex: 0},
          props?.fontsStyle,
        ]}>
        {props?.title || 'TitleList'}
      </Text>
      <View
        style={[{flex: 1, width: 'auto', height: 2, backgroundColor: Colors.green}, props?.barStyle]}
      />
      {props?.action && (
        <Text style={[fonts.textBold, {marginLeft: 15, color:Colors.green}]} onPress={()=>{
          props?.onAction && props?.onAction();
        }}>Xem thêm</Text>
      )}
    </View>
  );
};

export default TitleList;
