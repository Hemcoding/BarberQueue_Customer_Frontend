import LottieView from 'lottie-react-native';
import * as React from 'react';
import {Dimensions} from 'react-native';
import {View} from 'react-native-animatable';
import {
  Modal,
  Portal,
  Text,
  Button,
  PaperProvider,
  IconButton,
} from 'react-native-paper';
import BarLine from './BarLine';
import axios from 'axios';
import Colors from '../constants/Colors';

const {width, height} = Dimensions.get('window');

const AddedPoint = ({accessToken}) => {
  const [visible, setVisible] = React.useState(false);
  const [userPoints, setUserPoints] = React.useState();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    width: width * 0.8,
    height: height * 0.6,
    borderRadius: 10,
    marginHorizontal: width * 0.1,
  };

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

  React.useEffect(() => {
    getCoins();
    setTimeout(() => {
      setVisible(true);
    }, 2000);
  }, []);

  return (
    //     <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={containerStyle}>
      <View style={{alignItems: 'center'}}>
        <LottieView
          style={{width: 200, height: 200}}
          source={require('../assets/lottie/gift1.json')}
          autoPlay
          loop
        />
        {/* <BarLine width={width * 0.9} /> */}
        <View style={{justifyContent: 'space-between'}}>
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Text
              style={{
                color: '#FED731',
                fontSize: 22,
                fontWeight: 600,
                marginBottom: 10,
              }}>
              10 Point Added
            </Text>
            <Text style={{color: '#2BD4FF', marginBottom: 10}}>
              Your earned Points: {userPoints?.earnedPoints}
            </Text>
            <Text style={{color: '#4BAC5A', marginBottom: 10}}>
              Your balanced Points: {userPoints?.balancePoints}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() => hideModal()}
            style={{
              //   width: width * 0.9,
              marginVertical: 10,
              borderRadius: 8,
              backgroundColor: Colors.primaryDark,
            }}>
            Close
          </Button>
        </View>
      </View>
    </Modal>
    //     </View>
  );
};

export default AddedPoint;
