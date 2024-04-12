// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import MyHeader from '../components/MyHeader';

// const Appointments = ({navigation, route}) => {
//   return (
//     <SafeAreaView>
//       <MyHeader
//         back
//         onPressBack={() => navigation.goBack()}
//         title={route.name}
//         right="more-vertical"
//         optionalBtn="shopping-cart"
//         onRightPress={() => console.log('right')}
//       />

//     </SafeAreaView>
//   );
// };

// export default Appointments;

// const styles = StyleSheet.create({});

import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {UpcomingAppointments, AppointmentHistory} from './tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';
import Colors from '../constants/Colors';

const Tab = createMaterialTopTabNavigator();

const AppointmentsTabNavigator = ({navigation, route}) => {
  return (
    <>
      <MyHeader
        back
        onPressBack={() => navigation.goBack()}
        title={route.name}
        right="more-vertical"
        optionalBtn="shopping-cart"
        onRightPress={() => console.log('right')}
      />
      <Tab.Navigator
        tabBarOptions={{
          indicatorStyle: {backgroundColor: Colors.primary, height: 3},
          activeTintColor: Colors.primary,
          labelStyle: {fontWeight: 'bold'},
        }}>
        <Tab.Screen name="Upcoming" component={UpcomingAppointments} />
        <Tab.Screen name="History" component={AppointmentHistory} />
      </Tab.Navigator>
    </>
  );
};

export default AppointmentsTabNavigator;
