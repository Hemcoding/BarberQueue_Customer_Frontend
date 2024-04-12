import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
import {Formik} from 'formik';
import * as yup from 'yup';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';
import LottieView from 'lottie-react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../context/UserContext';

const {width} = Dimensions.get('window');

const validationSchema = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Mobile number is required'),
});

const EditProfile = ({navigation, route}) => {
  const {user} = route.params;
  const [accessToken, setAccessToken] = useState('');

  const {userData, updateUserData} = useUser();

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

  const onSubmit = async values => {
    try {
      const response = await axios.patch(
        'http://192.168.43.17:8000/api/v1/users/update-account',
        values,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data);
      if (response.data.success) {
        updateUserData(response.data.data);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${response.data.message}`,
        });
        setTimeout(() => {
          navigation.navigate('Profile');
        }, 3000);
      }
      // Handle success scenario
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '❌ Error',
        text2: `${error.response.data.message}`,
      });
      console.error(error.response);
      // Handle error scenario
    }
  };

  return (
    <SafeAreaView>
      <MyHeader
        back
        onPressBack={() => navigation.goBack()}
        title={route.name}
        right="more-vertical"
        optionalBtn="shopping-cart"
        onRightPress={() => console.log('right')}
      />
      <ScrollView>
        <LottieView
          style={{width: width, height: 200}}
          source={require('../assets/lottie/editProfile.json')}
          autoPlay
          loop
        />
        <View style={styles.container}>
          <Formik
            initialValues={{
              firstname: user.firstname,
              email: user.email,
              mobile: user.mobile,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.card}>
                <TextInput
                  mode="outlined"
                  label="First Name"
                  onChangeText={handleChange('firstname')}
                  onBlur={handleBlur('firstname')}
                  value={values.firstname}
                  error={errors.firstname && touched.firstname}
                  style={{marginVertical: 10}}
                  theme={{colors: {primary: '#d3ab9e'}}} // Change input field color
                />
                {errors.firstname && touched.firstname && (
                  <Text style={styles.errorText}>{errors.firstname}</Text>
                )}

                <TextInput
                  mode="outlined"
                  label="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  error={errors.email && touched.email}
                  style={{marginVertical: 10}}
                  theme={{colors: {primary: '#d3ab9e'}}} // Change input field color
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <TextInput
                  mode="outlined"
                  label="Mobile Number"
                  onChangeText={handleChange('mobile')}
                  onBlur={handleBlur('mobile')}
                  value={values.mobile}
                  error={errors.mobile && touched.mobile}
                  style={{marginVertical: 10}}
                  theme={{colors: {primary: '#d3ab9e'}}}
                  keyboardType="phone-pad" // Change input field color
                />
                {errors.mobile && touched.mobile && (
                  <Text style={styles.errorText}>{errors.mobile}</Text>
                )}

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={[
                    styles.button,
                    {backgroundColor: Colors.primaryDark},
                  ]}>
                  {' '}
                  {/* Change button color */}
                  Save Changes
                </Button>
              </View>
            )}
          </Formik>
        </View>
        <Text style={styles.joinedDate}>
          Joined {user.createdAt.slice(0, 10)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    //     justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  button: {
    color: Colors.primaryDark,
    borderRadius: 10,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  joinedDate: {
    marginHorizontal: 20,
    marginVertical: 20,
    color: Colors.lightGray,
  },
});

export default EditProfile;
