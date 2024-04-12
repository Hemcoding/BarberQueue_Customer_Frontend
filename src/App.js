/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import AnimTab2 from './bottomTab/AnimTab2';
import Home from './screens/Home';
import Colors from './constants/Colors';
import ContactList from './screens/ContactList';
import ListScreen from './screens/ListScreen';
import {
  Provider,
  MD2DarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import Screen from './screens/Screen';
import ProductsList from './screens/shop/ProductsList';
import DetailsScreen from './screens/shop/DetailsScreen';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import Fab from './screens/fab/Fab';
import DrawerNav1 from './screens/drawer/drawer1/DrawerNav1';
import HeaderAnim1 from './screens/animHeaders/HeaderAnim1';
import OnBoarding from './screens/OnBoarding';
import Splash from './screens/Splash';
import CustomDrawer1 from './screens/drawer/drawer1/CustomDrawer1';
import Main from './screens/MainHome';
import MainHome from './screens/MainHome';
import Details from './screens/Details';
import BookAppointment from './screens/BookAppointment';
import Toast from 'react-native-toast-message';
import Confirmation from './screens/Confirmation';
import TabNavigator from './screens/AnimTabStackNavigation';
import Profile from './screens/Profile';
import EditProfile from './screens/EditProfile';
import AppointmentsTabNavigator from './screens/AppointmentsTabNavigator';
import Signup from './screens/Signup';
import Login from './screens/Login';
import { UserProvider } from './context/UserContext';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

  return (
    <Provider theme={isDarkMode ? MD2DarkTheme : PaperDefaultTheme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.white}
      />
      <UserProvider>
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
          <RootStack />
        </NavigationContainer>
      </UserProvider>
      <Toast />
    </Provider>
  );
};

const options = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  headerShown: false,
};

const Stack = createSharedElementStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OnBoarding"
        component={OnBoarding}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainHome"
        component={MainHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Book Appointment" component={BookAppointment} />
      <Stack.Screen name="Confirmation" component={Confirmation} />
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="Products" component={ProductsList} />
      <Stack.Screen name="Appointments" component={AppointmentsTabNavigator} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen name="DrawerNav1" component={DrawerNav1} />

      {/* <Stack.Screen
        name="HeaderAnim1"
        component={HeaderAnim1}
        options={{
          gestureEnabled: false,
        }}
      /> */}
    </Stack.Navigator>
  );
};

export default App;
