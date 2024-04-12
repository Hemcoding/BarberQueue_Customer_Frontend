import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Image} from 'react-native-animatable';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const Splash = ({navigation}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    const checkUserRegistration = async () => {
      try {
        // Check if user data exists in AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          // User is registered, navigate to the login screen
          setTimeout(() => {
            opacity.value = withTiming(0, {duration: 1000});
            setTimeout(() => {
              navigation.navigate('Home');
            }, 1000);
          }, 5000);
          
        } else {
          // User is not registered, navigate to the onboarding screen
          setTimeout(() => {
            opacity.value = withTiming(0, {duration: 1000});
            setTimeout(() => {
              navigation.navigate('OnBoarding');
            }, 1000);
          }, 5000);
        }
      } catch (error) {
        console.error('Error checking user registration:', error);
      }
    };

    checkUserRegistration();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {flex: 1, justifyContent: 'center', alignItems: 'center'},
        animatedStyle,
      ]}>
      <Image
        style={{width: width * 0.8, height: height * 0.6}}
        source={require('../assets/images/splash.png')}
      />
    </Animated.View>
  );
};

export default Splash;
