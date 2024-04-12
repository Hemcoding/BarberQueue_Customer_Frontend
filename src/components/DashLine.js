import React from 'react';
import Colors from '../constants/Colors';
import {View} from 'react-native-animatable';

const DashLine = ({width}) => {
  return (
    <View
      style={{
        height: 2,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.black,
        // backgroundColor: Colors.gray,
        borderRadius: 5,
        width: width,
      }}></View>
  );
};

export default DashLine;
