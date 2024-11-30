import 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {store} from './src/helpers/state/store';
import RootNavigation from './src/components/navigation/RootNavigation';

const App = () => {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
