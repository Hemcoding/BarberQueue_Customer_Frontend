import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native-animatable';

const Card = ({color, width}) => {
  console.log(color, width);
  return (
    <View
      style={{
        display: 'flex',
        width: width,
        backgroundColor: color,
        borderRadius: 10,
        elevation: 20,
        shadowColor: 'black',
      }}></View>
  );
};

export default Card;

// const styles = StyleSheet.create({
//   card: {
//     display: 'flex',
//     width: width,
//     backgroundColor: color,
//     borderRadius: 10,
//     elevation: 20,
//     shadowColor: 'black',
//   },
// });
