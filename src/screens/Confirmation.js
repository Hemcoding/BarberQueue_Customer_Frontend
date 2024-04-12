import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import DashLine from '../components/DashLine';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Button, Modal, PaperProvider, Portal} from 'react-native-paper';
import AddedPoint from '../components/AddedPoint';

const {width, height} = Dimensions.get('window');

const Confirmation = ({navigation, route}) => {
  const {queueData, grandTotal} = route.params;

  // console.log('grandTotal: ', grandTotal);

  const [appointment, setAppointment] = useState({});
  const [accessToken, setAccessToken] = useState('');

  // useEffect(() => {
  //   //   setVisible(true);
  //   setTimeout(() => {
  //     setVisible(true);
  //   }, 2000);
  // }, []);

  const getDataFromAsyncStorage = async () => {
    try {
      const accessTokenFromStorage = await AsyncStorage.getItem('accessToken');
      if (accessTokenFromStorage) {
        const parsedAccessToken = JSON.parse(accessTokenFromStorage);
        console.log('access: ', parsedAccessToken);
        setAccessToken(parsedAccessToken);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '❌ Error',
        text2: `${error.response.data.message}` || `${error.message}`,
      });
    }
  };

  useEffect(() => {
    getDataFromAsyncStorage();
  }, []);

  useEffect(() => {
    getAppointment();
    addPoints();
  }, [accessToken]);

  // const queueData = {
  //   __v: 0,
  //   _id: '6602b137f2466998bcd15063',
  //   appointment: '6602b121f2466998bcd15053',
  //   artist: '65e81c3417ab28aa08af02af',
  //   createdAt: '2024-03-26T11:27:51.014Z',
  //   tokenNumber: 'BQ-af267',
  //   updatedAt: '2024-03-26T11:27:51.014Z',
  // };

  const getAppointment = async () => {
    try {
      const res = await axios.post(
        'http://192.168.43.17:8000/api/v1/appointment/get-appointment',
        {id: queueData.appointment},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('appointment: ', res.data.data);
      setAppointment(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addPoints = async () => {
    console.log('this is access:', accessToken);
    try {
      const res = await axios.post(
        'http://192.168.43.17:8000/api/v1/loyalty/add-points',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // setQueueData(res.data.data);
      // return res.data.data;
      // setLoading(false);
    } catch (error) {
      console.log(error.message);
      console.log(error.response.data.message);
    }
  };

  console.log('queueData from detail: ', queueData);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.paymentSuccessful}>
            <LottieView
              style={{width: width, height: 180}}
              source={require('../assets/lottie/right-arrow.json')}
              autoPlay
              loop
            />
            <LottieView
              style={{width: width, height: 180, position: 'absolute', top: 0}}
              source={require('../assets/lottie/congratulation.json')}
              autoPlay
              loop
              duration={3000}
            />
            <Text style={styles.paymentText}>Payment Successful</Text>
            <Text style={styles.paymentText}>
              {'\u20B9'} {grandTotal}
            </Text>
          </View>
          {appointment && (
            <View style={styles.flexBox}>
              <View style={styles.leftBall}></View>
              <View style={styles.ticket}>
                <View style={styles.tokenNumberBox}>
                  <Text>
                    Artist Name:{' '}
                    {appointment?.artist && appointment.artist.length > 0
                      ? appointment.artist[0]?.artistName || ''
                      : ''}
                  </Text>
                  <Text style={styles.tokenNumber}>
                    {queueData ? queueData.tokenNumber : ''}
                  </Text>
                  <View>
                    <Text style={{marginBottom: 8}}>
                      {appointment?.startTime} To {appointment?.endTime}
                    </Text>
                  </View>
                </View>
                <DashLine width={width * 0.8} />
                <View style={styles.flexLine}>
                  <Text style={styles.detailsHeadingText}>Date:</Text>
                  <Text>{appointment.date}</Text>
                </View>
                <View style={styles.flexLine}>
                  <Text style={styles.detailsHeadingText}>Total Amount:</Text>
                  <Text>
                    {'\u20B9'} {appointment.serviceCharges + appointment.tax}
                  </Text>
                </View>
                <View style={styles.flexLine}>
                  <Text style={styles.detailsHeadingText}>Amount Paid:</Text>
                  <Text>
                    {'\u20B9'} {grandTotal}
                  </Text>
                </View>
                <View style={styles.flexLine}>
                  <Text style={styles.detailsHeadingText}>Payment Type:</Text>
                  <Text>{appointment.paymentType}</Text>
                </View>
                <View style={styles.flexLine}>
                  <Text style={styles.detailsHeadingText}>Status:</Text>
                  <Text>{appointment.status}</Text>
                </View>
                {/* <View style={styles.flexLine}> */}
                {/* <Text style={styles.detailsHeadingText}>Services:</Text> */}
                {appointment?.services && appointment?.services.length > 0
                  ? appointment.services.map(item => (
                      <View style={styles.flexLine}>
                        <Text style={styles.detailsHeadingText}>Service:</Text>
                        <Text key={item._id} style={styles.serviceLine}>
                          {item.serviceName}
                        </Text>
                      </View>
                    ))
                  : ''}
                {/* </View> */}
              </View>
              <View style={styles.rightBall}></View>
            </View>
          )}

          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginVertical: 15,
              width: width * 0.9,
            }}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.goToHome}>Go To Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <AddedPoint accessToken={accessToken} />
    </>
  );
};

export default Confirmation;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  paymentSuccessful: {
    display: 'flex',
    width: width * 0.9,
    // height: 200,
    // backgroundColor: '#BAE3BE94',
    backgroundColor: 'white',
    borderRadius: 10,
    // shadowColor: 'black',
    // elevation: 20,
    alignItems: 'center',
    marginVertical: 20,
    borderTopColor: '#A0DBA6',
    borderTopWidth: 3,
    borderBottomColor: '#A0DBA6',
    borderBottomWidth: 3,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftBall: {
    width: 20,
    height: 30,
    backgroundColor: '#F1EEEE',
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    position: 'absolute',
    zIndex: 2,
    left: -5,
    top: 115,
  },
  rightBall: {
    width: 20,
    height: 30,
    backgroundColor: '#F1EEEE',
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    position: 'absolute',
    right: -5,
    top: 115,
  },
  ticket: {
    display: 'flex',
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    // shadowColor: 'black',
    // elevation: 20,
    padding: 20,
    borderTopColor: Colors.primary,
    borderTopWidth: 3,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 3,
  },
  paymentText: {
    color: 'green',
    fontSize: 15,
    marginVertical: 8,
    fontWeight: '600',
  },
  tokenNumberBox: {
    display: 'flex',
    alignItems: 'center',
  },
  tokenNumber: {
    color: Colors.black,
    fontSize: 28,
    fontWeight: '600',
    marginVertical: 5,
  },
  flexLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  detailsHeadingText: {
    fontSize: 15,
    color: 'black',
  },
  goToHome: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 20,
  },
  serviceLine: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});
