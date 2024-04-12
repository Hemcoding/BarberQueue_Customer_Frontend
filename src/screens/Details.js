import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native-animatable';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';
import {Button, Dimensions, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import {Card} from 'react-native-paper';
import BarLine from '../components/BarLine';
import Icon, {Icons} from '../components/Icons';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
// import RNUpiPayment from 'react-native-upi-payment';
import {RAZORPAY_KEY_SECRET, RAZORPAY_KEY_ID} from '@env';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
// import config from '../../config';

const {width} = Dimensions.get('window');

let keyId = 'rzp_test_LOXqTfB19MciCT';
console.log('key: ', keyId);

const Details = ({navigation, route}) => {
  const [accessToken, setAccessToken] = useState('');

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

  const {appointmentData} = route.params;

  // const [queueData, setQueueData] = useState([]);
  const grandTotal = appointmentData.serviceCharges + appointmentData.tax;

  console.log(appointmentData);

  const handlePayment = grandTotal => {
    var options = {
      description: 'Barber service charges',
      image: require('../assets/images/salon.png'),
      currency: 'INR',
      key: keyId,
      amount: grandTotal * 100,
      order_id: '', //Replace this with an order_id created using Orders API.
      prefill: {
        email: 'gaurav.kumar@example.com',
        contact: '9191919191',
        name: 'Gaurav Kumar',
      },
      theme: {color: Colors.primary},
    };

    const addToQueue = async () => {
      try {
        const res = await axios.post(
          'http://192.168.43.17:8000/api/v1/queue/add-to-queue',
          {
            id: appointmentData._id,
            amountPaid: grandTotal,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('queueData: ', res.data.data);
        // setQueueData(res.data.data);
        return res.data.data;
        // setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    RazorpayCheckout.open(options)
      .then(async data => {
        // handle success
        if (data.status_code === 200) {
          try {
            const queueData = await addToQueue();
            console.log('this is queuedata: ', queueData);
            navigation.navigate('Confirmation', {
              queueData: queueData,
              grandTotal: grandTotal,
            });
          } catch (error) {
            console.log(error);
            // handle error if addToQueue() fails
          }
        }
      })
      .catch(error => {
        // handle failure
        navigation.navigate('Retry Page');
      });
  };

  const handleCancelBooking = () => {
    navigation.navigate('Book Appointment');
  };

  return (
    <View style={styles.container}>
      <MyHeader
        back
        onPressBack={() => navigation.goBack()}
        title={route.name}
        right="more-vertical"
        optionalBtn="shopping-cart"
        onRightPress={() => console.log('right')}
      />
      {/* <Text>{appointmentData.endTime}</Text> */}
      <ScrollView>
        <Card style={styles.card}>
          <View style={styles.heading}>
            <Image
              style={styles.calendar}
              source={require('../assets/icons/calendar.png')}
            />
            {/* <Text style={styles.calendar}>🗓️</Text> */}
            <Text style={styles.date}>{appointmentData.date}</Text>
          </View>
          <BarLine width={width * 0.9} />
          <View>
            <Text style={styles.headingText}>Confirm your services : </Text>
            {appointmentData?.services.map(item => (
              <View key={item._id} style={styles.serviceBox}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
                <View style={styles.serviceDetails}>
                  <Text style={{color: 'black', fontWeight: '600'}}>
                    {'\u20B9'} {item.price}
                  </Text>
                  <View style={styles.duration}>
                    {/* <Icon
                      style={styles.clockIcon}
                      type={Icons.Feather}
                      name="clock"
                      color="green"
                    /> */}
                    <Text style={{color: 'black'}}>⏱️</Text>
                    <Text>Approx. {item.duration} min</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <BarLine width={width * 0.9} />
          <View>
            <View style={styles.flexLine}>
              <Text style={styles.leftText}>Service Start Time :</Text>
              <Text>{appointmentData.startTime}</Text>
            </View>
            <View style={styles.flexLine}>
              <Text style={styles.leftText}>Service End Time :</Text>
              <Text>{appointmentData.endTime}</Text>
            </View>
          </View>
          <BarLine width={width * 0.9} />
          <View style={styles.flexLine}>
            <Text style={styles.leftText}>Service Total :</Text>
            <Text>
              {appointmentData.serviceCharges} {'\u20B9'}
            </Text>
          </View>
          <View style={styles.flexLine}>
            <Text style={styles.leftText}>Tax & Charges :</Text>
            <Text>
              {appointmentData.tax} {'\u20B9'}
            </Text>
          </View>
          <View style={[styles.flexLine]}>
            <Text style={styles.grandTotal}>Grand Total :</Text>
            <Text style={styles.grandTotal}>
              {grandTotal} {'\u20B9'}
            </Text>
          </View>
          <BarLine width={width * 0.9} />
          <View style={styles.flexLine}>
            <Text style={styles.leftText}>Appointment Status :</Text>
            <Text
              style={{
                color: Colors.black,
                backgroundColor: 'yellow',
                padding: 5,
                borderRadius: 5,
              }}>
              {appointmentData.status}
            </Text>
          </View>
          <View style={styles.flexLine}>
            <Text style={styles.leftText}>Payment Type :</Text>
            <Text>{appointmentData.paymentType}</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#023047',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
              marginVertical: 10,
              width: width * 0.9,
            }}
            onPress={() =>
              handlePayment(
                appointmentData.paymentType === 'token payment'
                  ? appointmentData.services.length * 20
                  : grandTotal,
              )
            }>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              Pay {'\u20B9'}
              {appointmentData.paymentType === 'token payment'
                ? appointmentData.services.length * 20
                : grandTotal}{' '}
              and Confirm Booking
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // backgroundColor: '#023047',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
              marginVertical: 10,
              width: width * 0.9,
            }}
            onPress={handleCancelBooking}>
            <Text
              style={{
                color: 'red',
                fontWeight: 'bold',
                backgroundColor: '#DE484842',
                padding: 10,
                borderRadius: 5,
                textAlign: 'center',
                width: width * 0.8,
              }}>
              Cancel Booking
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  card: {
    display: 'flex',
    width: width * 0.95,
    backgroundColor: Colors.white,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
    padding: 10,
    margin: 10,
    marginBottom: 80,
    // flexDirection: 'row'
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  calendar: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headingText: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 10,
  },
  serviceBox: {
    display: 'flex',
    width: width * 0.9,
    backgroundColor: '#EEDDD8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  serviceDetails: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
  duration: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  grandTotal: {
    fontSize: 19,
    fontWeight: '600',
    color: 'black',
  },
  flexLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  leftText: {
    color: 'black',
    // fontWeight: '600',
  },
  clockIcon: {
    width: 25,
    height: 25,
  },
  button: {
    borderRadius: 10,
  },
});
