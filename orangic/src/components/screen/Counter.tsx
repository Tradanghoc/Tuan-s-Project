import {View, Text, Button} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../helpers/state/store';
import {decrement, increment} from '../../helpers/state/Test/counterSlice';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <View>
      <Text>{count}</Text>
      <Button onPress={() => dispatch(increment())} title="Increment" />
      <Button onPress={() => dispatch(decrement())} title="Decrement" />
    </View>
  );
};

export default Counter;
