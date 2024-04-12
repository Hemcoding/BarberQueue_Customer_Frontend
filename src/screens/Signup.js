import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {Formik} from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import LottieView from 'lottie-react-native';
import {Image} from 'react-native-animatable';
import Colors from '../constants/Colors';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Icon, {Icons} from '../components/Icons';
import Toast from 'react-native-toast-message';

const {height, width} = Dimensions.get('window');

const validationSchema = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Invalid mobile number'),
  // profilePicture: yup
  //   .mixed()
  //   .required('Profile picture is required')
  //   .test('fileType', 'Profile picture must be in JPEG format', value => {
  //     if (!value) return true; // Skip validation if no file is selected
  //     return value && value.type === 'image/jpeg';
  //   }),
});

const SignupPage = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const openPicker = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      if (!result.didCancel) {
        console.log(result);
        setProfilePicture(result); // Store the selected image object in state
      }
    } catch (error) {
      console.error('ImagePicker error:', error);
      // Handle image picking errors (e.g., display error message)
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <LottieView
          style={styles.animation}
          source={require('../assets/lottie/signup.json')}
          autoPlay
          loop
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: '600',
            color: Colors.primary,
            marginBottom: 40,
          }}>
          Welcome to BarberQueue
        </Text>
        <Text
          style={{
            fontSize: 25,
            fontWeight: '600',
            color: Colors.primaryDark,
            fontFamily: 'Bebas Neue',
            marginBottom: 20,
          }}>
          Create Your Account
        </Text>
        <Formik
          initialValues={{
            firstname: '',
            username: '',
            email: '',
            mobile: '',
            // profilePicture: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            try {
              console.log('Submitting form:', values); // Debugging: Log form values
              setLoading(true);

              const formData = new FormData();
              formData.append('firstname', values.firstname);
              formData.append('username', values.username);
              formData.append('email', values.email);
              formData.append('mobile', values.mobile);
              if (profilePicture) {
                formData.append('profilePicture', {
                  uri: profilePicture.path,
                  name: `profile-${Date.now()}.${
                    profilePicture.mime.split('/')[1]
                  }`, // Generate unique name
                  type: profilePicture.mime,
                });
              }

              console.log('formData: ', formData.getParts());

              const response = await axios.post(
                'http://192.168.43.17:8000/api/v1/users/register',
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                },
              );
              console.log('Signup successful:', response.data);
              if (response.data.success === true) {
                Toast.show({
                  type: 'success',
                  text1: '🎉 Success',
                  text2: 'Account Created Successfully',
                });
                // setTimeout(() => {
                navigation.navigate('Login');
                // }, '4000');
              }
              // Toast.show({
              //   type: 'info',
              //   text1: 'warning',
              //   text2: `${response.message}`,
              // }); // Debugging: Log successful response
              // Handle successful signup here, such as navigating to the next screen
              // setLoading(false);
            } catch (error) {
              // console.error('Signup failed:', error.response);
              Toast.show({
                type: 'error',
                text1: '❌ Error',
                text2:
                  // <Text style={{color: 'red'}}>
                  `${error.response.data.message}` || `${error.message}`,
                /* </Text> */
              });
              setLoading(false);
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
            <View style={styles.form}>
              <TextInput
                mode="outlined"
                label="First Name"
                onChangeText={handleChange('firstname')}
                onBlur={handleBlur('firstname')}
                value={values.firstname}
                error={errors.firstname && touched.firstname}
                style={{marginVertical: 8}}
                theme={{
                  colors: {
                    primary: Colors.primary,
                    text: Colors.primary,
                    placeholder: Colors.primary,
                    background: '#FFFFFF',
                  },
                }}
              />
              {errors.firstname && touched.firstname && (
                <Text style={styles.errorText}>{errors.firstname}</Text>
              )}

              <TextInput
                label="Username"
                mode="outlined"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                error={errors.username && touched.username}
                style={{marginVertical: 8}}
                theme={{
                  colors: {
                    primary: Colors.primary,
                    text: Colors.primary,
                    placeholder: Colors.primary,
                    background: '#FFFFFF',
                  },
                }}
              />
              {errors.username && touched.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              <TextInput
                label="Email"
                mode="outlined"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={errors.email && touched.email}
                style={{marginVertical: 8}}
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

              <TextInput
                label="Mobile Number"
                mode="outlined"
                onChangeText={handleChange('mobile')}
                onBlur={handleBlur('mobile')}
                value={values.mobile}
                error={errors.mobile && touched.mobile}
                style={{marginVertical: 8}}
                keyboardType="phone-pad"
                theme={{
                  colors: {
                    primary: Colors.primary,
                    text: Colors.primary,
                    placeholder: Colors.primary,
                    background: '#FFFFFF',
                  },
                }}
              />
              {errors.mobile && touched.mobile && (
                <Text style={styles.errorText}>{errors.mobile}</Text>
              )}

              <View style={styles.imageButton}>
                <TouchableOpacity
                  onBlur={handleBlur('profilePicture')}
                  onPress={openPicker}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: 8,
                    marginVertical: 10,
                  }}>
                  <Icon
                    type={Icons.FontAwesome}
                    name="photo"
                    color={Colors.primaryDark}
                  />
                  <Text
                    style={{
                      color: Colors.primaryDark,
                      fontSize: 16,
                      marginLeft: 10,
                    }}>
                    Select Profile Picture
                  </Text>
                </TouchableOpacity>

                {profilePicture && (
                  <Image
                    source={{uri: profilePicture.path}}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      marginVertical: 20,
                    }}
                  />
                )}
              </View>

              {/* {errors.profilePicture && touched.profilePicture && (
                <Text style={styles.errorText}>{errors.profilePicture}</Text>
              )} */}

              <Button
                onPress={handleSubmit}
                mode="contained"
                style={{
                  borderRadius: 8,
                  backgroundColor: Colors.primaryDark,
                }}>
                Signup
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: height,
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  form: {
    width: '85%',
    height: '100%'
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  imageButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default SignupPage;
