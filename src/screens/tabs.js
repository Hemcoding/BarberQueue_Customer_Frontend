import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';
import {Card, Paragraph} from 'react-native-paper';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const {width} = Dimensions.get('window');

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
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

  useEffect(() => {
    // Fetch upcoming appointments from API
    const getUpcomingAppointments = async () => {
      try {
        const res = await axios.get(
          'http://192.168.43.17:8000/api/v1/appointment/get-upcoming-appointment',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('response: ', res.data.data);
        setAppointments(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUpcomingAppointments();
  }, [accessToken]);

  const renderItem = ({item}) => (
    <Card
      style={{
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: 'white',
        width: width * 0.9,
      }}>
      <Card.Content>
        <Paragraph style={styles.field}>Date</Paragraph>
        <Paragraph style={styles.value}>{item.date}</Paragraph>

        <Paragraph style={styles.field}>Start Time</Paragraph>
        <Paragraph style={styles.value}>{item.startTime}</Paragraph>

        <Paragraph style={styles.field}>End Time</Paragraph>
        <Paragraph style={styles.value}>{item.endTime}</Paragraph>

        <Paragraph style={styles.field}>Status</Paragraph>
        <Paragraph style={styles.value}>{item.status}</Paragraph>

        <Paragraph style={styles.field}>Payment Type</Paragraph>
        <Paragraph style={styles.value}>{item.paymentType}</Paragraph>

        <Paragraph style={styles.field}>Total Payment</Paragraph>
        <Paragraph style={styles.value}>
          {item.serviceCharges + item.tax}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View
      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {appointments ? (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      ) : (
        <LottieView
          style={{width: 280, height: 280, marginVertical: 50}}
          source={require('../assets/lottie/noData.json')}
          autoPlay
          loop
        />
      )}
    </View>
  );
};

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
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

  useEffect(() => {
    // Fetch upcoming appointments from API
    const getHistoryAppointments = async () => {
      try {
        const res = await axios.get(
          'http://192.168.43.17:8000/api/v1/appointment/get-appointment-history',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('response: ', res.data.data);
        setAppointments(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getHistoryAppointments();
  }, [accessToken]);

  const renderItem = ({item}) => (
    <Card
      style={{
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: 'white',
        width: width * 0.9,
      }}>
      <Card.Content>
        <Paragraph>Date: {item.date}</Paragraph>
        <Paragraph>Start Time: {item.startTime}</Paragraph>
        <Paragraph>End Time: {item.endTime}</Paragraph>
        <Paragraph>Status: {item.status}</Paragraph>
        <Paragraph>Payment Type: {item.paymentType}</Paragraph>
        <Paragraph>Total Payment: {item.serviceCharges + item.tax}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View
      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {appointments === null ? (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      ) : (
        <LottieView
          style={{width: 200, height: 200, marginVertical: 50}}
          source={require('../assets/lottie/noData.json')}
          autoPlay
          loop
        />
      )}
    </View>
  );
};

export {UpcomingAppointments, AppointmentHistory};

const styles = StyleSheet.create({
  field: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // You can change color as needed
  },
  value: {
    marginBottom: 10,
    color: '#666', // You can change color as needed
  },
});
