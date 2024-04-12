import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon, {Icons} from '../components/Icons';
import Colors from '../constants/Colors';
import {Card} from 'react-native-paper';

const {width} = Dimensions.get('window');

const TabArr = [
  {
    label: 'Home',
    route: 'HomeScreen',
    icon: 'home',
    type: Icons.FontAwesome5,
    size: 28,
  },
  {
    label: 'Book Now',
    route: 'Book Appointment',
    icon: 'calendar-plus',
    type: Icons.FontAwesome5,
    size: 28,
  },
  {
    label: 'History',
    route: 'Appointments',
    icon: 'history',
    type: Icons.FontAwesome5,
    size: 28,
  },
  {
    label: 'Account',
    route: 'Profile',
    icon: 'account',
    type: Icons.MaterialCommunityIcons,
    size: 28,
  },
];

const TabButton = ({item, isSelected}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(item.route, {serviceObj: []});
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.button}>
        <Icon
          type={item.type}
          color={isSelected ? '#fdcfb8' : '#FFFFFF'} // Change color based on selection
          name={item.icon}
          size={item.size}
        />
        {isSelected ? (
          <Text style={[styles.text, {color: '#cdcdcd'}]}>{item.label}</Text>
        ) : (
          <Text style={[styles.text, {color: '#FFFFFF'}]}>{item.label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const AnimTabStackNavigation = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <View style={styles.box}>
      <Card>
        <Card.Content style={styles.container}>
          {TabArr.map((item, index) => (
            <TabButton
              key={index}
              item={item}
              isSelected={selectedTab === index} // Pass whether the tab is selected or not
            />
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    width: width * 0.94,
    height: 70,
    backgroundColor: Colors.primaryDark,
    borderRadius: 18,
    margin: 12,
    zIndex: 2,
    position: 'absolute',
    bottom: 0,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default AnimTabStackNavigation;
