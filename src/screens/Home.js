import React, {useContext, useEffect, useState} from 'react';
// import {Card, List} from 'react-native-paper';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import DrawerNav1 from './drawer/drawer1/DrawerNav1';
import AnimTab2 from '../bottomTab/AnimTab2';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {colors} from './drawer/constant';
import Icon, {Icons} from '../components/Icons';
import axios from 'axios';
import Carousel from 'react-native-reanimated-carousel';
import Colors from '../constants/Colors';
// import Card from '../components/Card';
import MyHeader from '../components/MyHeader';
import Toast from 'react-native-toast-message';
import AnimTabStackNavigation from './AnimTabStackNavigation';
import TabButton from './AnimTabStackNavigation';
import {Card} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../context/UserContext';

const {width} = Dimensions.get('window');

const Home = ({navigation, route}) => {
  const [userPoints, setUserPoints] = useState({});
  const [owner, setOwner] = useState({});
  const [service, setService] = useState({});
  const [offers, setOffers] = useState([]);
  const [staff, setStaff] = useState([]);
  // const [userData, setUserData] = useState(null);
  const [accessToken, setAccessToken] = useState('');

  const {userData, updateUserData} = useUser();

  console.log(staff.specialistIn);

  const getDataFromAsyncStorage = async () => {
    try {
      const userDataFromStorage = await AsyncStorage.getItem('userData');
      const accessTokenFromStorage = await AsyncStorage.getItem('accessToken');
      if (userDataFromStorage && accessTokenFromStorage) {
        const parsedUserData = JSON.parse(userDataFromStorage);
        const parsedAccessToken = JSON.parse(accessTokenFromStorage);
        console.log(
          'userData: ',
          parsedUserData,
          'access: ',
          parsedAccessToken,
        );
        // setUserData(parsedUserData);
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
    const getUser = async () => {
      try {
        const res = await axios.get(
          'http://192.168.43.17:8000/api/v1/users/current-user',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('response: ', res.data.data);
        updateUserData(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
    const getCoins = async () => {
      try {
        const res = await axios.get(
          'http://192.168.43.17:8000/api/v1/loyalty/get-points',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('response: ', res.data);
        setUserPoints(res.data.data);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
    };
    const getowner = async () => {
      try {
        const res = await axios.get(
          'http://192.168.43.17:8000/api/v1/users/ownerDetails',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('response: ', res.data.data);
        setOwner(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    const getoffers = async () => {
      try {
        const res = await axios.get(
          'http://192.168.43.17:8000/api/v1/offers/get-offers',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('response: ', res.data.data);
        setOffers(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    const getService = async () => {
      try {
        const res = await axios.get(
          'http://192.168.43.17:8000/api/v1/services/get-service',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('response: ', res.data.data);
        setService(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    const getStaff = async () => {
      try {
        const res = await axios.get(
          'http://192.168.43.17:8000/api/v1/staffs/get-staff',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('response: ', res.data.data);
        setStaff(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getStaff();

    getoffers();
    getService();
    getCoins();
    getowner();
  }, [accessToken]);

  // const images = [
  //   'https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg',
  //   'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630',
  // ];

  // const handleSubmit = () => {
  //   Toast.show({
  //     type: 'success',
  //     text1: 'Hello',
  //     text2: 'This is some something 👋'
  //   });
  //   // Toast.warn('Hello Hemanshu', {
  //   //   duration: 5000,
  //   //   position: 'top',
  //   //   width: 350
  //   // });
  // };

  const handleOffers = (url, index) => {
    if (url === 'Book Appointment') {
      // if (index === 0) {
      //   navigation.navigate(url,)
      // }
      navigation.navigate(url, {serviceObj: []});
    }
    Linking.openURL(url);
  };

  const handleServiceClick = service => {
    navigation.navigate('Book Appointment', {serviceObj: [service]});
  };

  return (
    <>
      {/* <Text>Hemanshu</Text> */}
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.light} />
      <View style={styles.header}>
        <View style={styles.headerBox1}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              style={styles.img}
              source={{
                uri: userData?.profilePicture,
              }}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Hello, {userData?.firstname}</Text>
          </View>
        </View>
        <View style={styles.headerBox1}>
          <Image
            style={styles.notification}
            source={require('../assets/icons/bell.png')}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.mainCardBox}>
          <View style={styles.cardBox1}>
            <View style={styles.earnedPointCard}>
              <View style={styles.bg}>
                <View style={styles.circle}>
                  <Icon
                    type={Icons.FontAwesome5}
                    name="coins"
                    color="#51C8C3"
                  />
                </View>
              </View>
              <View style={styles.textBox}>
                <Text style={{color: Colors.black}}>Earned Coins</Text>
                <Text style={{fontWeight: '600', color: '#51C8C3'}}>
                  {userPoints ? userPoints.earnedPoints : 'N/A'}
                </Text>
              </View>
            </View>
            <View style={styles.redeemedPointCard}>
              <View>
                <View style={[styles.circle, {backgroundColor: '#F8EBDC'}]}>
                  <Icon
                    type={Icons.MaterialIcons}
                    name="redeem"
                    color="#ED9E05"
                  />
                </View>
              </View>
              <View style={styles.textBox}>
                <Text style={{color: Colors.black}}>Redeem Coins</Text>
                <Text style={{fontWeight: '600', color: '#ED9E05'}}>
                  {userPoints ? userPoints.redeemedPoints : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.cardBox2}>
            <View style={styles.balancedPointCard}>
              <View style={[styles.circle, {backgroundColor: '#F8DDDC'}]}>
                <Icon
                  type={Icons.MaterialCommunityIcons}
                  name="gold"
                  color="#F66E7C"
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // backgroundColor: 'red',
                  width: '80%',
                }}>
                <Text style={[styles.text, {color: Colors.black}]}>
                  Balance Coins
                </Text>
                <Text style={{fontWeight: '600', color: '#F66E7C'}}>
                  {userPoints ? userPoints.balancePoints : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Carousel
            mode="parallax"
            loop
            width={width}
            height={width / 2.2}
            // autoPlay={true}
            data={offers}
            scrollAnimationDuration={1000}
            onSnapToItem={index => console.log('current index:', index)}
            renderItem={({index, item}) => (
              <TouchableOpacity
                onPress={() => handleOffers(item.linkURL, index)}>
                <Image
                  style={{
                    width: width,
                    height: width / 2.3,
                    borderRadius: 15,
                    resizeMode: 'stretch',
                  }}
                  key={index}
                  source={{uri: item.offerImage}}
                />
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.serviceContainer}>
          <FlatList
            horizontal
            style={{paddingHorizontal: 10}}
            showsHorizontalScrollIndicator={false}
            data={service}
            renderItem={({item}) => (
              // <View style={styles.serviceContainer}>
              <TouchableOpacity onPress={() => handleServiceClick(item)}>
                <View style={styles.flatlistItem}>
                  <Text style={styles.serviceName}>{item.serviceName}</Text>
                </View>
              </TouchableOpacity>
              // </View>
            )}
            keyExtractor={item => item._id}
          />
        </View>
        <View style={{flex: 1, padding: 10}}>
          <View style={styles.card}>
            <Text style={styles.artistHeading}>About Artist</Text>
            <View style={styles.artistBox}>
              <Image
                style={styles.artistImage}
                source={{
                  uri: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png',
                }}
              />
              {/* <Text>{owner.profilePicture}</Text> */}
              <Text style={styles.artistName}>Rajesh Bhai</Text>
              <Text>Owner</Text>
              <View style={styles.staffBox}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 15,
                    fontWeight: '600',
                    marginBottom: 10,
                  }}>
                  Staff :
                </Text>
                <FlatList
                  data={staff}
                  renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                      <Image
                        source={{uri: item.staffImage}}
                        style={styles.image}
                      />
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: 10,
                        }}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>
                          Specialist In:{' '}
                          {staff &&
                            item.specialistIn.map(items => (
                              <Text>{items} </Text>
                            ))}
                        </Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={item => item.id}
                  verical
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              {/* <Text
                style={{
                  textAlign: 'justify',
                  color: 'black',
                  paddingBottom: 10,
                }}>
                {owner.description}
              </Text> */}
            </View>
          </View>
        </View>
        <View style={styles.extraView}></View>
        {/* <AnimTab2 /> */}
      </ScrollView>
      <AnimTabStackNavigation />
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: Colors.light,
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    elevation: 20,
    shadowColor: 'black',
  },
  headerBox1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontWeight: '600',
    fontSize: 20,
    color: Colors.primaryDark,
    // fontFamily: 'Bitter'
  },
  // mainContainer: {
  //   display: 'flex',
  //   // justifyContent: 'center'
  // },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  notification: {
    width: 22,
    height: 22,
  },
  mainCardBox: {
    display: 'flex',
    justifyContent: 'center',
    margin: 10,
    gap: 10,
  },
  cardBox1: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    flexDirection: 'row',
    width: width * 0.95,
  },
  cardBox2: {
    display: 'flex',
    // flexDirection: 'row',
  },
  earnedPointCard: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderLeftColor: '#51C8C3',
    borderLeftWidth: 5,
    borderRadius: 10,
    elevation: 20,
    shadowColor: 'black',
    paddingVertical: 17,
    paddingHorizontal: 10,
    width: '47%',
  },
  redeemedPointCard: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderLeftColor: '#ED9E05',
    borderLeftWidth: 5,
    borderRadius: 10,
    elevation: 20,
    shadowColor: 'black',
    paddingVertical: 17,
    paddingHorizontal: 8,
    width: '47%',
  },
  balancedPointCard: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderLeftColor: '#F66E7C',
    borderLeftWidth: 5,
    borderRadius: 10,
    elevation: 20,
    shadowColor: 'black',
    padding: 10,
    width: '100%',
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#d5f3f2',
    borderRadius: 50,
    marginRight: 5,
  },
  textBox: {
    display: 'flex',
    // backgroundColor: 'red',
    width: '70%',
  },
  text: {
    fontSize: 15,
  },
  card: {
    display: 'flex',
    width: width * 0.95,
    backgroundColor: 'white',
    borderRadius: 18,
    shadowColor: 'black',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.2,
    // shadowRadius: 10,
    // elevation: 20,
  },
  artistHeading: {
    fontSize: 18,
    fontWeight: '600',
    padding: 20,
    color: 'black',
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 35,
    padding: 5,
  },
  artistBox: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  artistName: {
    fontWeight: '600',
    color: 'black',
    paddingVertical: 5,
  },
  extraView: {
    width: width,
    height: 80,
  },
  serviceContainer: {
    paddingVertical: 10,
  },
  flatlistItem: {
    backgroundColor: '#023047',
    borderRadius: 8,
    marginRight: 10,
  },
  serviceName: {
    padding: 15,
    fontWeight: '600',
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    // backgroundColor: '#C69E914F',
    borderRadius: 8,
    padding: 5,
    paddingHorizontal: 10,
    // elevation: 20,
    // shadowColor: Colors.black,
    // shadowRadius: 0,
    // shadowOffset: {width: 0, height: 0},
    // marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    // marginBottom: 5,
  },
  name: {
    // fontSize: 12,
    color: Colors.black,
  },
  staffBox: {
    width: '100%',
  },
});
