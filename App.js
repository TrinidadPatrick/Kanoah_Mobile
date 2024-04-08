import 'react-native-gesture-handler';
import { StatusBar as MainStatusbar } from 'expo-status-bar';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity ,Linking } from 'react-native';
import { Entypo} from 'react-native-vector-icons'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './Components/Pages/HomePage/HomePage';
import Login from './Components/Pages/LoginPage/Login';
import Register from './Components/Pages/RegisterPage/Register';
import ForgotPassword from './Components/Pages/LoginPage/ForgotPassword';
import {FontAwesome} from '@expo/vector-icons'
import InputOtp from './Components/Pages/LoginPage/InputOtp';
import NewPassword from './Components/Pages/LoginPage/NewPassword';
import { useEffect, useState, useRef } from 'react';
import registerNNPushToken from 'native-notify';
import axios from 'axios';
import FillInfo from './Components/Pages/RegisterPage/FillInfo';
import VerifyEmailByOtp from './Components/Pages/RegisterPage/VerifyEmailByOtp';
import Explore from './Components/Pages/Explore/Explore';
import TopRatedViewAll from './Components/Pages/HomePage/TopRatedViewAll';
import RecentServicesViewAll from './Components/Pages/HomePage/RecentServicesViewAll';
import Account from './Components/Pages/Account/Account';
import Profile from './Components/Pages/Account/AccountSettings/ProfileSettings/Profile';
import AddressSetup from './Components/Pages/Account/AccountSettings/ProfileSettings/AddressSetup';
import MapFullScreen from './Components/Pages/Account/AccountSettings/ProfileSettings/MapFullScreen';
import ChangePasswordProfile from './Components/Pages/Account/AccountSettings/ProfileSettings/ChangePasswordProfile';
import ViewService from './Components/Pages/ViewService/ViewService';
import ViewAllRatings from './Components/Pages/ViewService/ViewAllRatings';
import ViewAllGallery from './Components/Pages/ViewService/ViewAllGallery';
import BookService from './Components/Pages/BookService/BookService';
import ServiceOptionList from './Components/Pages/BookService/ServiceOptionList';
import AddressModal from './Components/Pages/BookService/AddressModal';
import BookConfirmation from './Components/Pages/BookService/BookConfirmation';

export default function App() {
  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator();
  registerNNPushToken(19825, 'bY9Ipmkm8sFKbmXf7T0zNN');



  // Components for home
  const HomeStackScreen = () => (
    <Tab.Navigator>
          <Tab.Screen name="Home" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
            
          }}

          />
          <Tab.Screen name="Explore" component={Explore}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="list-ul" size={size} color={color} />
            ),
          }}
          />
          <Tab.Screen name="Messages" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="commenting" size={size} color={color} />
            ),
          }}
          />
          <Tab.Screen name="Notifications" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bell" size={size} color={color} />
            ),
          }}
          />
          <Tab.Screen name="Account" component={Account}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
          />
        </Tab.Navigator>

  );




  return (
    <View className="w-full h-screen flex flex-col" style={{ flex: 1, paddingTop: StatusBar.currentHeight, backgroundColor: 'white', overflow: 'auto', }}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomeStackScreen} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
      <Stack.Screen name="ViewAllTopRated" component={TopRatedViewAll} options={{ headerShown: true, headerTitle : "Top Rated Services" }} />
      <Stack.Screen name="RecentServicesViewAll" component={RecentServicesViewAll} options={{ headerShown: true, headerTitle : "Recent Services" }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: true }} />
      <Stack.Screen name="FillInfo" component={FillInfo} options={{ headerShown: true, headerTitle : "Your Information" }} />
      <Stack.Screen name="VerifyEmailByOtp" component={VerifyEmailByOtp} options={{ headerShown: true, headerTitle : "Verify Email" }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true }} />
      <Stack.Screen name="InputOtp" component={InputOtp} options={{ headerShown: true, headerTitle : "Enter Verification Code" }} />
      <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: true, headerTitle : "Enter New Password" }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true, headerTitle : "Edit Profile" }} />
      <Stack.Screen name="AddressSetup" component={AddressSetup} options={{ headerShown: true, headerTitle : "Address" }} />
      <Stack.Screen name="MapFullScreen" component={MapFullScreen} options={{ headerShown: true, headerTitle : "Pin Location" }} />
      <Stack.Screen name="ChangePasswordProfile" component={ChangePasswordProfile} options={{ headerShown: true, headerTitle : "Change Password" }} />
      <Stack.Screen name="ViewService" component={ViewService} options={{ headerShown: true, headerTitle : "", headerTransparent : true, headerTintColor : "white" }} />
      <Stack.Screen name="ViewAllRatings" component={ViewAllRatings} options={{ headerShown: true, headerTitle : "Ratings" }} />
      <Stack.Screen name="ViewAllGallery" component={ViewAllGallery} options={{ headerShown: true, headerTitle : "Service Gallery" }} />

      {/* Booking stack */}
      <Stack.Screen name="BookService" component={BookService} options={{ headerShown: false, headerTitle : "Book Service" }} />
      <Stack.Screen name="ServiceOptionList" component={ServiceOptionList} options={{ headerShown: true, headerTitle : "Service Option" }} />
      <Stack.Screen name="AddressModal" component={AddressModal} options={{ headerShown: true, headerTitle : "Set location" }} />
      <Stack.Screen name="BookConfirmation" component={BookConfirmation} options={{ headerShown: true, headerTitle : "Confirm Booking" }} />

      
    </Stack.Navigator>
      </NavigationContainer>
      <MainStatusbar style="auto" />
    </View>
  );
}

