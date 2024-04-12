import React from 'react';
import LottieView from 'lottie-react-native';
import {Text, View} from 'react-native-animatable';
import Colors from '../constants/Colors';

const Loading = () => {
  return (
    <View
      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <LottieView
        style={{width: 60, height: 60}}
        source={require('../assets/lottie/scissor.json')}
        autoPlay
        loop
      />
      <Text style={{color: Colors.primary}}>Loading...</Text>
    </View>
  );
};

export default Loading;
