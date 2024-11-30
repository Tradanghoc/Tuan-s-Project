import {View, Text, Image, ViewStyle} from 'react-native';
import React from 'react';
import {fonts} from '../styles/ComponentStyle';
import {Colors} from '../styles/ScreenStyle';
import {Swipeable, TouchableOpacity} from 'react-native-gesture-handler';
import CustomRating from '../ui/CustomRating';

type Prop = {
  name: string;
  rank: string;
  createAt: string;
  content: string;
  point: number;
  image?: string;
  style?: ViewStyle | ViewStyle[];
  onDel?: () => void;
};

const ReviewCard = (props: Prop) => {
  const {name, rank, createAt, onDel, content, image, style, point} = props;
  const leftAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props?.onDel && props?.onDel();
        }}
        style={{
          width: 110,
          flex: 1,
          backgroundColor: Colors.ember,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            fonts.titleBold,
            {
              color: Colors.white,
            },
          ]}>
          Tố cáo
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <Swipeable renderRightActions={leftAction}>
      <View
        style={[
          {
            backgroundColor: Colors.white,
          },
          style,
        ]}>
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
              justifyContent: 'space-between',
            }}>
            <Image
              source={
                image
                  ? {uri: image}
                  : require('../../../assets/images/baseImage.png')
              }
              style={{width: 50, height: 50, borderRadius: 25}}
            />

            <View style={{marginLeft: 10}}>
              <Text style={[fonts.textBold, {textAlignVertical: 'center'}]}>
                {name}
              </Text>
              <Text style={[fonts.text]}>{rank}</Text>
            </View>
          </View>

          <View>
            <CustomRating
              onChange={() => {}}
              point={point}
              size={16}
              style={{width: 75, marginVertical: 1}}
              editable={true}
            />
            <Text style={[fonts.text]}>
              {createAt.slice(0, createAt.length - 8)}
            </Text>
          </View>
        </View>

        <Text style={[fonts.subline, {marginVertical: 10, marginLeft: 60}]}>
          {content}
        </Text>
      </View>
    </Swipeable>
  );
};

export default ReviewCard;
