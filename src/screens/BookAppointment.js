import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, StyleSheet} from 'react-native';
import {Image, Text, View} from 'react-native-animatable';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';
import {Agenda} from 'react-native-calendars';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import Icon, {Icons} from '../components/Icons';
import axios from 'axios';
import Loading from '../components/Loading';
import {Formik} from 'formik';
import * as Yup from 'yup';
// import { useNavigation } from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  services: Yup.array()
    .of(
      Yup.object().shape({
        serviceName: Yup.string().required('Service name is required'),
        duration: Yup.number().required('Duration is required'),
        price: Yup.number().required('Price is required'),
      }),
    )
    .min(1, 'At least one service must be selected'),
  paymentType: Yup.string().required('Payment type is required'),
  artistId: Yup.string().required('Please select any one queue'),
});

const {width} = Dimensions.get('window');

const BookAppointment = ({navigation, route}) => {
  const today = new Date();
  console.log('today: ', today);
  const datePart = today.toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const {serviceObj} = route.params;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(datePart);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedQueueOfArtist, setSelectedQueueOfArtist] = useState();
  const [paymentType, setPaymentType] = useState(null);
  const [artist, setArtist] = useState([]);
  const [queue, setQueue] = useState({});
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState();
  const [artistData, setArtistData] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  console.log(selectedDate);

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

  const getService = async () => {
    console.log('serviceObj:', serviceObj);
    setSelectedServices(serviceObj);
    setLoading(true);
    try {
      const resService = await axios.get(
        'http://192.168.43.17:8000/api/v1/services/get-service',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(resService.data.data);
      setServices(resService.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getArtistAndQueue = async () => {
    // setLoading(true);
    try {
      const resArtist = await axios.get(
        'http://192.168.43.17:8000/api/v1/artist/get-artist',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('artistData: ', resArtist.data.data);
      const artistIds = resArtist.data.data.map(item => item._id);
      console.log('artistIds: ', artistIds);
      setArtist(artistIds);
      setArtistData(resArtist.data.data);

      const resQueue = await axios.post(
        'http://192.168.43.17:8000/api/v1/queue/get-queue',
        {date: selectedDate, artistIds},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('queueData: ', resQueue.data.data);
      setQueue(resQueue.data.data);
      // setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getService();
    getArtistAndQueue();
  }, [accessToken]);

  useEffect(() => {
    getArtistAndQueue();
  }, [selectedDate]);

  const toggleServiceSelection = service => {
    const index = selectedServices.findIndex(s => s._id === service._id);
    if (index === -1) {
      // If service is not already selected, add it to the array
      setSelectedServices([...selectedServices, service]);
    } else {
      // If service is already selected, remove it from the array
      setSelectedServices(selectedServices.filter(s => s._id !== service._id));
    }
  };

  const handleDayPress = day => {
    console.log('Selected date:', day.dateString);
    setSelectedDate(day.dateString);
  };

  const handleSubmit = async () => {
    console.log(
      'date: ',
      selectedDate,
      'services: ',
      selectedServices,
      'paymentType: ',
      paymentType,
      'artistId: ',
      selectedQueueOfArtist,
    );
    try {
      await validationSchema.validate({
        date: selectedDate,
        services: selectedServices,
        paymentType: paymentType,
        artistId: selectedQueueOfArtist,
      });

      // if(selectedDate === datePart && )

      const response = await axios.post(
        'http://192.168.43.17:8000/api/v1/appointment/book-appointment',
        {
          date: selectedDate,
          services: selectedServices,
          paymentType: paymentType,
          artistId: selectedQueueOfArtist,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Appointment booked successfully:', response.data.success);
      if (response.data.success) {
        navigation.navigate('Details', {appointmentData: response.data.data});
      } else {
        Toast.show({
          type: 'info',
          text1: 'Warning',
          text2: `${response.message}`,
        });
      }
    } catch (error) {
      console.log('error: ', error);
      if (error.name == 'AxiosError') {
        Toast.show({
          type: 'info',
          text1: 'Warning',
          text2: `Sorry, the selected appointment time exceeds the shop's closing time.However, we'd be happy to schedule your appointment for tomorrow`,
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'Warning',
          text2: `${error.message}`,
        });
      }
    }
  };

  // const getStatusColor = status => {
  //   switch (status) {
  //     case 'Pending':
  //       return '#FF6347'; // Red
  //     case 'InProgress':
  //       return '#FFD700'; // Gold
  //     case 'Completed':
  //       return '#32CD32'; // Green
  //     default:
  //       return '#000000'; // Black
  //   }
  // };

  const removeSelectedService = serviceId => {
    setSelectedServices(selectedServices.filter(s => s._id !== serviceId));
  };

  const handlePaymentTypeSelect = type => {
    setPaymentType(type);
    // You can perform any additional actions here based on the selected payment type
  };

  const handleQueueSelect = id => {
    setSelectedQueueOfArtist(id);
  };

  const renderEmptyData = () => {
    return (
      <ScrollView>
        <Text style={[styles.title, {padding: 10}]}>Select Queue:</Text>
        {loading ? (
          <Loading />
        ) : (
          <View style={styles.queueContainer}>
            {Object.entries(queue).map(([artistId, appointments]) => (
              <TouchableOpacity
                key={artistId}
                onPress={() => handleQueueSelect(artistId)}>
                <View key={artistId} style={styles.queueBox}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {appointments.map(appointment => (
                      <View
                        key={appointment.tokenNumber}
                        style={styles.appointmentCard}>
                        <Text style={styles.tokenNumber}>
                          {appointment.tokenNumber}
                        </Text>
                        <Text style={styles.time}>
                          {appointment.startingTime}
                        </Text>
                        <Text style={styles.time}>to</Text>
                        <Text style={styles.time}>
                          {appointment.endingTime}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                  <View
                    style={[
                      styles.seatArea,
                      selectedQueueOfArtist === artistId &&
                        styles.selectSeatArea,
                    ]}>
                    <Image
                      style={{width: 50, height: 50}}
                      source={require('../assets/images/barberChair.png')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* <Text>'Date:' {selectedDate}</Text> */}
        <View style={styles.serviceContainer}>
          <Text style={styles.title}>Select Services:</Text>
          {/* {services.map(service => ( */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {services ? (
              services.map(service => (
                <TouchableOpacity
                  key={service._id}
                  style={[
                    styles.serviceCard,
                    selectedServices.some(s => s._id === service._id) &&
                      styles.selectedServiceCard,
                  ]}
                  onPress={() => toggleServiceSelection(service)}>
                  <Text
                    style={[
                      styles.serviceName,
                      selectedServices.some(s => s._id === service._id) &&
                        styles.whiteText,
                    ]}>
                    {service.serviceName}
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      selectedServices.some(s => s._id === service._id) &&
                        styles.whiteText,
                    ]}>
                    {service.duration} min
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      selectedServices.some(s => s._id === service._id) &&
                        styles.whiteText,
                    ]}>
                    {service.price} {'\u20B9'}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Loading />
            )}
            {/* <Text style={styles.title}>Selected Services:</Text>
            {selectedServices.map(service => (
              <View key={service.id} style={styles.selectedService}>
                <Text>{service.name}</Text>
              </View>
            ))} */}
          </ScrollView>

          <Text style={styles.title}>Selected Services:</Text>
          {selectedServices.map(service => (
            <View key={service._id} style={styles.selectedService}>
              <Text>{service.serviceName}</Text>
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => removeSelectedService(service._id)}>
                <Icon
                  style={[styles.removeIconText, {color: '#FF5A5A'}]}
                  type={Icons.FontAwesome}
                  name="remove"
                  // color="#FF5A5A"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.paymentContainer}>
          <Text style={styles.title}>Select Payment Type:</Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentType === 'full payment' && styles.selectedPaymentOption,
            ]}
            onPress={() => handlePaymentTypeSelect('full payment')}>
            <Text
              style={
                paymentType === 'full payment' ? styles.selectedText : null
              }>
              Full Payment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentType === 'token payment' && styles.selectedPaymentOption,
            ]}
            onPress={() => handlePaymentTypeSelect('token payment')}>
            <Text
              style={
                paymentType === 'token payment' ? styles.selectedText : null
              }>
              Token Payment
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{display: 'flex', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#023047',
              padding: 15,
              borderRadius: 5,
              alignItems: 'center',
              marginVertical: 10,
              width: width * 0.9,
            }}
            onPress={handleSubmit}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>
              Book Appointment
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.extraView}></View> */}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader
        back
        onPressBack={() => navigation.goBack()}
        title={route.name}
        right="more-vertical"
        optionalBtn="shopping-cart"
        onRightPress={() => console.log('right')}
      />
      {/* <ScrollView> */}
      {/* <View style={styles.header}> */}
      <Agenda
        renderEmptyData={renderEmptyData}
        onDayPress={handleDayPress}
        minDate={today.toISOString().split('T')[0]} // Set minDate to today's date
        maxDate={tomorrow.toISOString().split('T')[0]}
        theme={{
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: Colors.primary,
          agendaKnobColor: Colors.primary,
        }}
      />
      {/* <View style={styles.extraView}></View> */}
      {/* </ScrollView> */}
      {/* {selectedDate && <Text>Selected Date: {selectedDate}</Text>} */}
      {/* </View> */}
    </SafeAreaView>
  );
};

export default BookAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: 'flex',
  },
  queueContainer: {
    display: 'flex',
    margin: 10,
  },
  queueBox: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    margin: 5,
  },
  seatArea: {
    width: 50,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  selectSeatArea: {
    backgroundColor: Colors.primary,
  },
  appointmentCard: {
    display: 'flex',
    alignItems: 'center',
    borderLeftColor: 'green',
    borderLeftWidth: 4,
    borderRadius: 5,
    padding: 5,
    margin: 5,
    backgroundColor: '#C6EBC6',
  },
  tokenNumber: {
    fontWeight: '600',
    fontSize: 15,
  },
  time: {
    fontSize: 10,
  },
  serviceContainer: {
    display: 'flex',
    padding: 20,
  },
  // title: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  // },
  serviceCard: {
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  selectedServiceCard: {
    backgroundColor: Colors.primary, // Change color for selected services
  },
  whiteText: {
    color: Colors.white, // Change text color to white
  },
  serviceName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  extraView: {
    width: width,
    height: 120,
  },
  selectedService: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  removeIcon: {
    // backgroundColor: 'red',
    color: '#FF5A5A',
    // borderRadius: 10,
    width: 20,
    height: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  removeIconText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paymentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#d3ab9e',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  selectedPaymentOption: {
    backgroundColor: '#d3ab9e',
  },
  selectedText: {
    color: 'white', // Change text color for selected payment type
  },
  noAppointment: {
    paddingVertical: 20,
  },
});
