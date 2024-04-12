// import React, {useState} from 'react';
// import {View, StyleSheet, Dimensions, Text} from 'react-native';
// import {TextInput, Button} from 'react-native-paper';
// import {Formik} from 'formik';
// import * as yup from 'yup';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Colors from '../constants/Colors';
// import {ScrollView} from 'react-native-gesture-handler';
// import LottieView from 'lottie-react-native';

// const {height, width} = Dimensions.get('window');

// const validationSchema = yup.object().shape({
//   email: yup.string().email('Invalid email').required('Email is required'),
//   otp: yup.string().when('generateOtp', {
//     is: true,
//     then: yup.string().required('OTP is required'),
//     otherwise: yup.string(),
//   }),
// });

// const Login = ({navigation}) => {
//   const [loading, setLoading] = useState(false);
//   const [generateOtp, setGenerateOtp] = useState(false);

//   const handleGenerateOTP = async email => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         'http://192.168.43.17:8000/api/v1/users/generate-otp',
//         {email},
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       console.log('OTP generated:', response.data);
//       setGenerateOtp(true);
//     } catch (error) {
//       console.error('Failed to generate OTP:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOTPVerification = async (email, otp) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         'http://192.168.43.17:8000/api/v1/users/otp-verification-login',
//         {email, otp},
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       console.log('OTP verification successful:', response.data);
//       // Store user data in AsyncStorage
//       await AsyncStorage.setItem('userData', JSON.stringify(response.data));
//       // Navigate to the next screen or perform any other action
//     } catch (error) {
//       console.error('OTP verification failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <LottieView
//           style={styles.animation}
//           source={require('../assets/lottie/login.json')}
//           autoPlay
//           loop
//         />
//         <Text style={styles.title}>Login</Text>
//         <Formik
//           initialValues={{
//             email: '',
//             otp: '',
//           }}
//           validationSchema={validationSchema}
//           onSubmit={async values => {
//             try {
//               if (!generateOtp) {
//                 await handleGenerateOTP(values.email);
//               } else {
//                 await handleOTPVerification(values.email, values.otp);
//               }
//             } catch (error) {
//               console.error('Login failed:', error);
//             }
//           }}>
//           {({
//             handleChange,
//             handleBlur,
//             handleSubmit,
//             values,
//             errors,
//             touched,
//             isSubmitting,
//           }) => (
//             <View>
//               <TextInput
//                 label="Email"
//                 mode="outlined"
//                 onChangeText={handleChange('email')}
//                 onBlur={handleBlur('email')}
//                 value={values.email}
//                 error={errors.email && touched.email}
//                 style={styles.input}
//               />
//               {generateOtp && (
//                 <TextInput
//                   label="OTP"
//                   mode="outlined"
//                   onChangeText={handleChange('otp')}
//                   onBlur={handleBlur('otp')}
//                   value={values.otp}
//                   error={errors.otp && touched.otp}
//                   style={styles.input}
//                 />
//               )}
//               {errors.email && touched.email && (
//                 <Text style={styles.errorText}>{errors.email}</Text>
//               )}
//               {errors.otp && touched.otp && (
//                 <Text style={styles.errorText}>{errors.otp}</Text>
//               )}
//               <Button
//                 onPress={handleSubmit}
//                 mode="contained"
//                 loading={loading}
//                 disabled={loading}
//                 style={styles.button}>
//                 {generateOtp ? 'Verify OTP' : 'Generate OTP'}
//               </Button>
//               <Button
//                 onPress={handleSubmit}
//                 mode="contained"
//                 style={{
//                   borderRadius: 8,
//                   backgroundColor: Colors.primaryDark,
//                 }}>
//                 Signup
//               </Button>
//             </View>
//           )}
//         </Formik>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     display: 'flex',
//     //     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   animation: {
//     width: 300,
//     height: 250,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: width * 0.9,
//     marginVertical: 10,
//   },
//   button: {
//     width: width * 0.9,
//     marginVertical: 10,
//     borderRadius: 8,
//     backgroundColor: Colors.primaryDark,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 5,
//   },
// });

// export default Login;
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, BackHandler} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {Formik} from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const {height, width} = Dimensions.get('window');

const emailValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const otpValidationSchema = yup.object().shape({
  otp: yup.string().required('OTP is required'),
});

const Login = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [generateOtp, setGenerateOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Add otpSent state variable
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Perform any action you want before preventing back navigation
        return true; // Return true to prevent default back navigation
      };

      // Add event listener for hardware back press
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Cleanup function to remove event listener when the screen loses focus
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []), // This effect should only run when the component mounts and unmounts
  );

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleGenerateOTP = async values => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.43.17:8000/api/v1/users/generate-otp',
        {email: values.email},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('OTP generated:', response.data);
      setEmail(response.data.data.email);
      setGenerateOtp(true);
      setOtpSent(true); // Update otpSent when OTP is sent successfully
      setResendDisabled(true); // Disable resend OTP button after sending OTP
      setTimer(120); // Reset timer to 2 minutes
      if (response.data.success === true) {
        Toast.show({
          type: 'success',
          text1: '🎉 Success',
          text2: `${response.data.message}`,
        });
      }
    } catch (error) {
      console.error('Failed to generate OTP:', error);
      Toast.show({
        type: 'error',
        text1: '❌ Error',
        text2:
          // <Text style={{color: 'red'}}>
          `${error.response.data.message}` || `${error.message}`,
        /* </Text> */
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async values => {
    try {
      setLoading(true);
      console.log('values and email: ', email, values);
      const response = await axios.post(
        'http://192.168.43.17:8000/api/v1/users/otp-verification-login',
        {email, otp: values.otp},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('OTP verification successful:', response.data);
      if (response.data.success === true) {
        Toast.show({
          type: 'success',
          text1: '🎉 Success',
          text2: `${response.data.message}`,
        });
        navigation.navigate('Home');
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(response.data.data.user),
        );
        await AsyncStorage.setItem(
          'accessToken',
          JSON.stringify(response.data.data.accessToken),
        );
        await AsyncStorage.setItem(
          'refreshToken',
          JSON.stringify(response.data.data.refreshToken),
        );
      }
    } catch (error) {
      console.error('OTP verification failed:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      //       setLoading(true);
      const response = await axios.post(
        'http://192.168.43.17:8000/api/v1/users/generate-otp',
        {email},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('OTP generated:', response.data);
      //       setEmail(response.data.data.email);
      //       setGenerateOtp(true);
      setOtpSent(true); // Update otpSent when OTP is sent successfully
      setResendDisabled(true); // Disable resend OTP button after sending OTP
      setTimer(120); // Reset timer to 2 minutes
      if (response.data.success === true) {
        Toast.show({
          type: 'success',
          text1: '🎉 Success',
          text2: `${response.data.message}`,
        });
      }
    } catch (error) {
      console.error('Failed to generate OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <LottieView
          style={styles.animation}
          source={require('../assets/lottie/login.json')}
          autoPlay
          loop
        />
        <Text style={styles.title}>Login</Text>
        {otpSent ? (
          <Text style={[styles.greenText, {marginBottom: 20}]}>
            OTP sent Successfully on {email}
          </Text>
        ) : (
          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={emailValidationSchema}
            onSubmit={async values => {
              try {
                await handleGenerateOTP(values);
              } catch (error) {
                console.error('Failed to submit:', error);
              }
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View>
                <TextInput
                  label="Email"
                  mode="outlined"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  error={errors.email && touched.email}
                  style={styles.input}
                  theme={{
                    colors: {
                      primary: Colors.primary,
                      text: Colors.primary,
                      placeholder: Colors.primary,
                      background: '#FFFFFF',
                    },
                  }}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <Button
                  onPress={handleSubmit}
                  mode="contained"
                  loading={loading}
                  disabled={loading}
                  style={styles.button}>
                  Generate OTP
                </Button>
              </View>
            )}
          </Formik>
        )}
        {generateOtp && (
          <Formik
            initialValues={{
              otp: '',
            }}
            validationSchema={otpValidationSchema}
            onSubmit={async values => {
              try {
                await handleOTPVerification(values);
              } catch (error) {
                console.error('Failed to submit:', error);
              }
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View>
                {/* <View style={styles.otpContainer}> */}
                <TextInput
                  //   placeholder="OTP"
                  onChangeText={handleChange('otp')}
                  onBlur={handleBlur('otp')}
                  value={values.otp}
                  error={errors.otp && touched.otp}
                  style={styles.otpInput}
                  secureTextEntry
                  keyboardType="phone-pad"
                  label="OTP"
                  mode="outlined"
                  theme={{
                    colors: {
                      primary: Colors.primary,
                      text: Colors.primary,
                      placeholder: Colors.primary,
                      background: '#FFFFFF',
                    },
                  }}
                />
                {/* </View> */}
                {errors.otp && touched.otp && (
                  <Text style={styles.errorText}>{errors.otp}</Text>
                )}
                <Button
                  onPress={handleSubmit}
                  mode="contained"
                  loading={loading}
                  disabled={loading}
                  style={styles.button}>
                  Verify and Login
                </Button>
              </View>
            )}
          </Formik>
        )}
        {otpSent && (
          <View>
            <Text style={styles.resendText}>
              ({Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}
              {timer % 60})
            </Text>
            <Button
              onPress={handleResendOTP}
              mode="contained"
              disabled={resendDisabled}
              style={[
                styles.button,
                {backgroundColor: resendDisabled ? '#ccc' : Colors.primaryDark},
              ]}>
              Resend OTP
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 300,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primaryDark,
  },
  input: {
    width: width * 0.9,
    marginVertical: 10,
  },
  button: {
    width: width * 0.9,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primaryDark,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  otpContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: width * 0.9,
    marginVertical: 10,
    padding: 10,
  },
  otpInput: {
    width: width * 0.9,
    fontSize: 18,
    marginBottom: 20,
  },
  greenText: {
    width: width * 0.9,
    display: 'flex',
    color: 'green',
  },
  resendText: {
    color: 'blue',
    marginVertical: 10,
    fontSize: 17,
    textDecorationLine: 'underline',
  },
});

export default Login;
