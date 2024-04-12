import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Avatar, Button} from 'react-native-paper';
import Colors from '../constants/Colors';
import MyHeader from '../components/MyHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {Icons} from '../components/Icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {useUser} from '../context/UserContext';

const Profile = ({navigation, route}) => {
  const [accessToken, setAccessToken] = useState('');
  // const [user, setUser] = useState({});
  const [refresh, setRefresh] = useState(false);

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

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await axios.get(
  //         'http://192.168.43.17:8000/api/v1/users/current-user',
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         },
  //       );
  //       console.log('response: ', res.data.data);
  //       setUser(res.data.data);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   getUser();
  // }, [accessToken]);

  const handleEditProfile = () => {
    // Implement edit profile functionality
    navigation.navigate('Edit Profile', {user: userData});
  };

  const handleEditPhoto = () => {
    // Implement edit profile photo functionality
    console.log('Edit Profile Photo');
  };

  const handleMyBookingHistory = () => {
    // Implement My Booking History functionality
    console.log('My Booking History');
  };

  const handleAboutUs = () => {
    // Implement About Us functionality
    console.log('About Us');
  };

  const handleBookAppointment = () => {
    // Implement Book Appointment functionality
    navigation.navigate('Book Appointment');
  };

  const logoutUser = async () => {
    try {
      const res = await axios.post(
        'http://192.168.43.17:8000/api/v1/users/logout',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        AsyncStorage.setItem('isLoggedIn', false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '❌ Error',
        text2: `${error.response.data.message}` || `${error.message}`,
      });
    }
  };

  const handleLogout = () => {
    Alert.alert('Confimation', 'Are you sure You want to Logout ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          logoutUser();
          updateUserData({});
          AsyncStorage.setItem('userData', {});

          navigation.navigate('Login');
        },
      },
    ]);
    // updateUserData(null);
    // AsyncStorage.setItem('userData', {});
    // // Implement Logout functionality
    // console.log('Logout');
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
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.photoSection}>
            <Avatar.Image size={150} source={{uri: userData?.profilePicture}} />
            <TouchableOpacity
              style={styles.editCircle}
              onPress={handleEditPhoto}>
              <Icon
                name="account-edit"
                size={25}
                color="white"
                type={Icons.MaterialCommunityIcons}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>{userData?.firstname}</Text>
          <Text style={styles.text}>{userData?.email}</Text>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.optionButton}>
            <View style={styles.optionContent}>
              <Icon
                name="account-edit"
                size={24}
                color="black"
                type={Icons.MaterialCommunityIcons}
                style={styles.circle}
              />
              <View style={styles.flexLine}>
                <Text style={styles.optionText}>Edit Profile</Text>
                <Icon
                  name="arrow-forward-ios"
                  size={24}
                  color="black"
                  type={Icons.MaterialIcons}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleMyBookingHistory}
            style={styles.optionButton}>
            <View style={styles.optionContent}>
              <Icon
                name="history"
                size={24}
                color="black"
                type={Icons.MaterialCommunityIcons}
                style={styles.circle}
              />
              <View style={styles.flexLine}>
                <Text style={styles.optionText}>My Booking History</Text>
                <Icon
                  name="arrow-forward-ios"
                  size={24}
                  color="black"
                  type={Icons.MaterialIcons}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAboutUs} style={styles.optionButton}>
            <View style={styles.optionContent}>
              <Icon
                name="information-outline"
                size={24}
                color="black"
                type={Icons.MaterialCommunityIcons}
                style={styles.circle}
              />
              <View style={styles.flexLine}>
                <Text style={styles.optionText}>About Us</Text>
                <Icon
                  name="arrow-forward-ios"
                  size={24}
                  color="black"
                  type={Icons.MaterialIcons}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBookAppointment}
            style={styles.optionButton}>
            <View style={styles.optionContent}>
              <Icon
                name="calendar-plus"
                size={24}
                color="black"
                type={Icons.MaterialCommunityIcons}
                style={styles.circle}
              />
              <View style={styles.flexLine}>
                <Text style={styles.optionText}>Book Appointment</Text>
                <Icon
                  name="arrow-forward-ios"
                  size={24}
                  color="black"
                  type={Icons.MaterialIcons}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <View style={styles.optionContent}>
              <Icon
                name="logout"
                size={24}
                color="black"
                type={Icons.MaterialCommunityIcons}
                style={styles.circle}
              />
              <View style={styles.flexLine}>
                <Text style={styles.optionText}>Logout</Text>
                <Icon
                  name="arrow-forward-ios"
                  size={24}
                  color="black"
                  type={Icons.MaterialIcons}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.version}>Version 0.1</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    height: '100%',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  editCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    backgroundColor: Colors.primaryDark,
    borderRadius: 50,
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  photoSection: {
    marginBottom: 10,
  },
  profileInfo: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: '600',
  },
  optionsContainer: {
    width: '80%',
    marginBottom: 20,
    // backgroundColor: '#ffffff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    marginLeft: 10,
    color: Colors.primaryDark,
    fontSize: 17,
  },
  optionButton: {
    marginBottom: 10,
    //     backgroundColor: Colors.primary,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
  },
  editPhotoButton: {
    marginTop: 10,
  },
  editPhotoButtonText: {
    color: Colors.primary,
  },
  circle: {
    padding: 10,
    backgroundColor: '#D3EDF9',
    borderRadius: 50,
  },
  flexLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //     backgroundColor: 'red',
    width: '88%',
  },
  version: {
    marginVertical: 30,
  },
});

export default Profile;
