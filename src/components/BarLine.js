import React from 'react';
import Colors from '../constants/Colors';
import {View} from 'react-native-animatable';

const BarLine = ({width}) => {
  return (
    <View
      style={{
        height: 2,
        borderWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.gray,
        borderRadius: 5,
        width: width,
      }}></View>
  );
};

export default BarLine;
