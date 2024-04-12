import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {useNavigation} from '@react-navigation/core';
// import {TouchableOpacity} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

const OnBoarding = () => {
  const navigation = useNavigation();
  console.log('navigation', navigation);
  const handleDone = () => {
    navigation.navigate('Signup');
  };

  const doneBotton = ({...props}) => {
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.doneBotton} {...props}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Onboarding
        bottomBarHighlight={false}
        onDone={handleDone}
        onSkip={handleDone}
        containerStyles={{paddingHorizontal: 15}}
        DoneButtonComponent={doneBotton}
        pages={[
          {
            backgroundColor: '#a7f3d0',
            image: (
              <View>
                <Image
                  style={styles.view}
                  source={require('../assets/images/waiting.png')}
                />
              </View>
            ),
            title: 'NO NEED TO DO BOARING QUEUE,SAVE YOUR TIME',
            subtitle:
              'Waiting for your turn comfortably at your space and we will inform you for your turn',
          },
          {
            backgroundColor: '#fef3c7',
            image: (
              <View>
                {/* <LottieView
                source={require('../assets/lotties/Animation - 1710065117720.json')}
                autoPlay
                loop
              /> */}
                <Image
                  style={styles.coins}
                  source={require('../assets/images/coins.png')}
                />
              </View>
            ),
            title: 'LOYALTY PROGRAM',
            subtitle:
              'Earn reward coins and enjoy exclusive benefits with our loyalty program',
          },
          {
            backgroundColor: '#FFFBFF',
            image: (
              <View>
                <Image
                  style={styles.view}
                  source={require('../assets/images/barber.png')}
                />
              </View>
            ),
            title: 'ALL YOU NEED FOR YOUR BARBER NEEDS',
            subtitle:
              'Feel comfortable booking and waiting for your turn with barber',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  view: {
    height: 300,
    width: 400,
  },
  coins: {
    width: 300,
    height: 300,
  },
  doneBotton: {
    fontWeight: '600',
    padding: 20,
    backgroundColor: '#023047',
    borderTopLeftRadius: 25,
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
  buttonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnBoarding;
